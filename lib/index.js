/**
 * 原神流浪者主题美化 · dsh-theme-wanderer — Host half
 *
 * 职责:
 *   1. /wanderer-theme/wallpaper-video — 动态壁纸视频(支持 HTTP Range/206,可循环与拖动)
 *   2. /wanderer-theme/wallpaper       — 视频首帧海报(静态降级)
 *   3. /wanderer-theme/health          — JSON 健康检查
 *   4. 启动自检: 打印视频/海报可用性与字节数
 *
 * 媒体完全随插件分发,默认从插件包内读取,不依赖任何本机路径:
 *   media/wallpaper.mp4 — 动态壁纸视频(1080p H.264 faststart)
 *   media/poster.jpg    — 视频首帧海报
 *
 * 可选覆盖(cordis.patch.yml 该行的 config):
 *   videoPath — 换成自己的视频文件(绝对路径)
 */
import { fileURLToPath } from 'node:url'

export const name = 'dsh-theme-wanderer'

export const VERSION = '3.20.0'

const BUNDLED_VIDEO = fileURLToPath(new URL('../media/wallpaper.mp4', import.meta.url))
const BUNDLED_POSTER = fileURLToPath(new URL('../media/poster.jpg', import.meta.url))

export function apply(ctx, config) {
  const fs = ctx.get('fs')
  const webServer = ctx.get('webServer')
  if (!fs || !webServer) {
    console.error('[dsh-theme-wanderer] fs 或 webServer 服务不可用;请确认 cordis.patch.yml 中该行声明了 inject: [fs, webServer]')
    return
  }

  const cfg = config && typeof config === 'object' ? config : {}
  const videoPath = typeof cfg.videoPath === 'string' && cfg.videoPath ? cfg.videoPath : BUNDLED_VIDEO
  let videoBytes = null
  let videoSize = 0
  let videoError = null
  let videoPending = null
  let posterBytes = null
  let posterError = null
  let posterPending = null
  const MAX_BYTES = 128 * 1024 * 1024

  async function readPath(path) {
    const target = await fs.resolve(path)
    return fs.readBytes(target, undefined, MAX_BYTES)
  }

  async function loadVideo() {
    if (videoBytes) return true
    if (!videoPending) {
      videoPending = (async function () {
        try {
          const bytes = await readPath(videoPath)
          videoBytes = bytes
          videoSize = bytes.length
          videoError = null
          return true
        } catch (err) {
          videoError = String((err && err.message) || err)
          console.error('[dsh-theme-wanderer] 动态壁纸视频读取失败:', videoPath, videoError)
          return false
        }
      })()
    }
    const ok = await videoPending
    videoPending = null
    return ok
  }

  async function loadPoster() {
    if (posterBytes) return true
    if (!posterPending) {
      posterPending = (async function () {
        try {
          posterBytes = await readPath(BUNDLED_POSTER)
          posterError = null
          return true
        } catch (err) {
          posterError = String((err && err.message) || err)
          return false
        }
      })()
    }
    const ok = await posterPending
    posterPending = null
    return ok
  }

  function parseRange(header, total) {
    if (typeof header !== 'string') return null
    const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
    if (!m) return null
    let start = m[1] === '' ? null : parseInt(m[1], 10)
    let end = m[2] === '' ? null : parseInt(m[2], 10)
    if (start === null && end === null) return null
    if (start === null) {
      start = Math.max(0, total - end)
      end = total - 1
    } else if (end === null || end >= total) {
      end = total - 1
    }
    if (start > end || start >= total) return null
    return [start, end]
  }

  function sendVideo(req, res) {
    const total = videoSize
    const isHead = String((req && req.method) || '').toUpperCase() === 'HEAD'
    const range = parseRange(req.headers && req.headers.range, total)
    if (range) {
      const slice = videoBytes.subarray(range[0], range[1] + 1)
      res.writeHead(206, {
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
        'Content-Range': 'bytes ' + range[0] + '-' + range[1] + '/' + total,
        'Content-Length': String(slice.length),
      })
      res.end(isHead ? undefined : slice)
      return
    }
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
      'Content-Length': String(total),
    })
    res.end(isHead ? undefined : videoBytes)
  }

  const disposeRoute = webServer.register({
    kind: 'prefix',
    path: '/wanderer-theme',
    handler: async function (req, res) {
      const pathname = String((req && req.url) || '').split('?')[0]
      const asset = pathname.replace(/^\/wanderer-theme\//, '')

      if (asset === 'health') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify({
          ok: true,
          name: name,
          version: VERSION,
          video: { bytes: videoSize || null, ok: !!videoBytes, error: videoError },
          poster: { ok: !!posterBytes, error: posterError },
        }))
        return
      }

      if (asset === 'wallpaper-video') {
        const ok = await loadVideo()
        if (!ok) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('wanderer-theme: video not found')
          return
        }
        try { sendVideo(req, res) } catch (err) {
          console.error('[dsh-theme-wanderer] 视频响应失败:', err)
          try { res.writeHead(500); res.end('video error') } catch (e) {}
        }
        return
      }

      if (asset === 'wallpaper') {
        const ok = await loadPoster()
        if (!ok) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('wanderer-theme: poster not found')
          return
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store', 'Content-Length': String(posterBytes.length) })
        res.end(posterBytes)
        return
      }

      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('wanderer-theme: not found')
    },
  })

  ctx.effect(function () { return disposeRoute })

  console.log('[dsh-theme-wanderer] v' + VERSION + ' 已挂载: /wanderer-theme/* (视频 Range · health 自检)')
  console.log('[dsh-theme-wanderer] 动态壁纸视频:', videoPath)

  ;(async function warmup() {
    const vok = await loadVideo()
    const pok = await loadPoster()
    console.log('[dsh-theme-wanderer] 启动自检: video ' + (vok ? 'OK (' + videoSize + ' B)' : 'FAIL') + ' · poster ' + (pok ? 'OK (' + posterBytes.length + ' B)' : 'FAIL'))
  })().catch(function (err) {
    console.error('[dsh-theme-wanderer] 启动自检异常:', err)
  })
}
