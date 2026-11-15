/**
 * 原神流浪者主题美化 · dsh-theme-wanderer — Host half (v3.1.0)
 *
 * 职责:
 *   1. /wanderer-theme/* 提供动态壁纸视频、静态海报、个人中心素材。
 *   2. 视频路由支持 HTTP Range(206),供浏览器循环播放与拖动。
 *   3. /wanderer-theme/health 提供 JSON 健康检查(自检面板与排查使用)。
 *   4. 启动预热自检: 打印视频/海报/素材的可用性与字节数。
 *
 * 媒体默认从插件包内的 media/ 读取(随插件分发):
 *   media/wallpaper.mp4 — 动态壁纸视频
 *   media/poster.jpg    — 视频首帧海报(静态降级)
 * 角色素材默认从 assetsDir 读取(可选,缺失不影响壁纸)。
 *
 * 配置(cordis.patch.yml 该行的 config,均可省略):
 *   videoPath  — 覆盖动态壁纸视频路径
 *   assetsDir  — 覆盖角色素材目录
 */
import { fileURLToPath } from 'node:url'

export const name = 'dsh-theme-wanderer'

export const VERSION = '3.8.0'

const BUNDLED_VIDEO = fileURLToPath(new URL('../media/wallpaper.mp4', import.meta.url))
const BUNDLED_POSTER = fileURLToPath(new URL('../media/poster.jpg', import.meta.url))
const DEFAULT_ASSETS_DIR = '/Users/yuzhengdong/Downloads/流浪者素材'

export function apply(ctx, config) {
  const fs = ctx.get('fs')
  const webServer = ctx.get('webServer')
  if (!fs || !webServer) {
    console.error('[dsh-theme-wanderer] fs 或 webServer 服务不可用;请确认 cordis.patch.yml 中该行声明了 inject: [fs, webServer]')
    return
  }

  const cfg = config && typeof config === 'object' ? config : {}
  const videoPath = typeof cfg.videoPath === 'string' && cfg.videoPath ? cfg.videoPath : BUNDLED_VIDEO
  const assetsDir = typeof cfg.assetsDir === 'string' && cfg.assetsDir ? cfg.assetsDir : DEFAULT_ASSETS_DIR

  /** 角色素材(可选,缺失时不影响壁纸) */
  const images = {
    portrait: '流浪者2.jpeg',
    art3: '流浪者3.jpeg',
    art6: '流浪者6.jpeg',
    art7: '流浪者7.jpeg',
    art8: '流浪者8.jpeg',
  }

  const cache = {}
  const pending = {}
  const lastErrors = {}
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

  async function loadImage(key) {
    const file = images[key]
    if (!file) return false
    if (cache[key]) return true
    if (!pending[key]) {
      pending[key] = (async function () {
        try {
          cache[key] = await readPath(assetsDir + '/' + file)
          delete lastErrors[key]
          return true
        } catch (err) {
          lastErrors[key] = String((err && err.message) || err)
          return false
        }
      })()
    }
    const ok = await pending[key]
    delete pending[key]
    return ok
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
    const range = parseRange(req.headers && req.headers.range, total)
    const headers = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
    }
    if (range) {
      const slice = videoBytes.subarray(range[0], range[1] + 1)
      res.writeHead(206, {
        'Content-Type': headers['Content-Type'],
        'Accept-Ranges': headers['Accept-Ranges'],
        'Cache-Control': 'no-store',
        'Content-Range': 'bytes ' + range[0] + '-' + range[1] + '/' + total,
        'Content-Length': String(slice.length),
      })
      res.end(slice)
      return
    }
    res.writeHead(200, {
      'Content-Type': headers['Content-Type'],
      'Accept-Ranges': headers['Accept-Ranges'],
      'Cache-Control': 'no-store',
      'Content-Length': String(total),
    })
    res.end(videoBytes)
  }

  const disposeRoute = webServer.register({
    kind: 'prefix',
    path: '/wanderer-theme',
    handler: async function (req, res) {
      const pathname = String((req && req.url) || '').split('?')[0]
      const asset = pathname.replace(/^\/wanderer-theme\//, '')

      if (asset === 'clientlog') {
        try {
          const q = pathname.indexOf('?')
          const raw = String((req && req.url) || '')
          const msg = raw.replace(/^\/wanderer-theme\/clientlog\??/, '')
          console.log('[dsh-theme-wanderer][client] ' + decodeURIComponent(msg.slice(0, 3000)))
        } catch (e) {}
        res.writeHead(204, { 'Cache-Control': 'no-store' })
        res.end()
        return
      }

      if (asset === 'health') {
        const gallery = {}
        for (const key of Object.keys(images)) {
          gallery[key] = { ok: !!cache[key], bytes: cache[key] ? cache[key].length : null, error: lastErrors[key] || null }
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify({
          ok: true,
          name: name,
          version: VERSION,
          assetsDir: assetsDir,
          video: { path: videoPath, bytes: videoSize || null, ok: !!videoBytes, error: videoError },
          poster: { ok: !!posterBytes, error: posterError },
          assets: gallery,
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

      try {
        const ok = await loadImage(asset)
        if (!ok) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('wanderer-theme: asset not found')
          return
        }
        const bytes = cache[asset]
        res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store', 'Content-Length': String(bytes.length) })
        res.end(bytes)
      } catch (err) {
        console.error('[dsh-theme-wanderer] 路由错误:', err)
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('wanderer-theme: internal error')
      }
    },
  })

  ctx.effect(function () { return disposeRoute })

  console.log('[dsh-theme-wanderer] v' + VERSION + ' 已挂载: /wanderer-theme/* (视频 Range · health 自检)')
  console.log('[dsh-theme-wanderer] 动态壁纸视频:', videoPath)

  ;(async function warmup() {
    const vok = await loadVideo()
    const pok = await loadPoster()
    const parts = []
    for (const key of Object.keys(images)) parts.push(((await loadImage(key)) ? 'OK ' : '-  ') + key)
    console.log('[dsh-theme-wanderer] 启动自检: video ' + (vok ? 'OK (' + videoSize + ' B)' : 'FAIL') + ' · poster ' + (pok ? 'OK (' + posterBytes.length + ' B)' : 'FAIL') + ' · 素材 ' + parts.join(' '))
  })().catch(function (err) {
    console.error('[dsh-theme-wanderer] 启动自检异常:', err)
  })
}
