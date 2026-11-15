/**
 * 原神流浪者主题美化 · dsh-theme-wanderer — Host half (v3.0.0)
 *
 * 职责:
 *   1. /wanderer-theme/* 提供壁纸(静态海报)、动态壁纸视频、角色素材图片。
 *   2. 视频路由支持 HTTP Range(206),供浏览器循环播放与拖动。
 *   3. /wanderer-theme/health 提供 JSON 健康检查(自检面板与排查使用)。
 *   4. 启动预热自检: 打印每个素材/视频的可用性与字节数。
 *
 * 配置(通过 cordis.patch.yml 该行的 config 覆盖,均可省略):
 *   videoPath  — 动态壁纸视频文件绝对路径
 *   assetsDir  — 角色素材目录绝对路径
 *
 * 排查: 终端中 [dsh-theme-wanderer] 前缀的日志即为本插件输出。
 */
export const name = 'dsh-theme-wanderer'

export const VERSION = '3.0.0'

const DEFAULT_VIDEO = '/Users/yuzhengdong/Downloads/16-10(4K).mp4'
const DEFAULT_ASSETS_DIR = '/Users/yuzhengdong/Downloads/流浪者素材'

export function apply(ctx, config) {
  const fs = ctx.get('fs')
  const webServer = ctx.get('webServer')
  if (!fs || !webServer) {
    console.error('[dsh-theme-wanderer] fs 或 webServer 服务不可用;请确认 cordis.patch.yml 中该行声明了 inject: [fs, webServer]')
    return
  }

  const cfg = config && typeof config === 'object' ? config : {}
  const videoPath = typeof cfg.videoPath === 'string' && cfg.videoPath ? cfg.videoPath : DEFAULT_VIDEO
  const assetsDir = typeof cfg.assetsDir === 'string' && cfg.assetsDir ? cfg.assetsDir : DEFAULT_ASSETS_DIR

  /** 图片素材: key → 文件名(角色立绘簇已移除,仅保留个人中心画廊所需) */
  const images = {
    wallpaper: '流浪者5.jpeg',
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
  const MAX_BYTES = 128 * 1024 * 1024

  async function loadImage(key) {
    const file = images[key]
    if (!file) return false
    if (cache[key]) return true
    if (!pending[key]) {
      pending[key] = (async function () {
        try {
          const target = await fs.resolve(assetsDir + '/' + file)
          cache[key] = await fs.readBytes(target, undefined, MAX_BYTES)
          delete lastErrors[key]
          return true
        } catch (err) {
          lastErrors[key] = String((err && err.message) || err)
          console.error('[dsh-theme-wanderer] 素材读取失败:', file, lastErrors[key])
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
          const target = await fs.resolve(videoPath)
          const bytes = await fs.readBytes(target, undefined, MAX_BYTES)
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

  /** 解析 Range 头,返回 [start, end] 或 null(整文件)。 */
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
    const baseHeaders = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    }
    if (range) {
      const start = range[0]
      const end = range[1]
      const slice = videoBytes.subarray(start, end + 1)
      res.writeHead(206, {
        'Content-Type': baseHeaders['Content-Type'],
        'Accept-Ranges': 'bytes',
        'Cache-Control': baseHeaders['Cache-Control'],
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Content-Length': String(slice.length),
      })
      res.end(slice)
      return
    }
    res.writeHead(200, {
      'Content-Type': baseHeaders['Content-Type'],
      'Accept-Ranges': 'bytes',
      'Cache-Control': baseHeaders['Cache-Control'],
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

      if (asset === 'health') {
        const assets = {}
        for (const key of Object.keys(images)) {
          assets[key] = {
            file: images[key],
            bytes: cache[key] ? cache[key].length : null,
            ok: !!cache[key],
            error: lastErrors[key] || null,
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify({
          ok: true,
          name: name,
          version: VERSION,
          assetsDir: assetsDir,
          video: { path: videoPath, bytes: videoSize || null, ok: !!videoBytes, error: videoError },
          assets: assets,
        }))
        return
      }

      if (asset === 'wallpaper-video') {
        const ok = await loadVideo()
        if (!ok) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('wanderer-theme: video not found — set config.videoPath')
          return
        }
        console.log('[dsh-theme-wanderer] GET /wanderer-theme/wallpaper-video', (req.headers && req.headers.range) || '')
        try {
          sendVideo(req, res)
        } catch (err) {
          console.error('[dsh-theme-wanderer] 视频响应失败:', err)
          try { res.writeHead(500); res.end('video error') } catch (e) {}
        }
        return
      }

      console.log('[dsh-theme-wanderer] GET /wanderer-theme/' + asset)
      try {
        const ok = await loadImage(asset)
        if (!ok) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('wanderer-theme: asset not found')
          return
        }
        const bytes = cache[asset]
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600',
          'Content-Length': String(bytes.length),
        })
        res.end(bytes)
      } catch (err) {
        console.error('[dsh-theme-wanderer] 路由错误:', err)
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('wanderer-theme: internal error')
      }
    },
  })

  ctx.effect(function () { return disposeRoute })

  console.log('[dsh-theme-wanderer] v' + VERSION + ' 已挂载: /wanderer-theme/* (视频 Range 支持 · health 自检)')
  console.log('[dsh-theme-wanderer] 动态壁纸视频:', videoPath)
  console.log('[dsh-theme-wanderer] 角色素材目录:', assetsDir)

  ;(async function warmup() {
    const lines = []
    for (const key of Object.keys(images)) {
      const ok = await loadImage(key)
      lines.push('  ' + (ok ? 'OK   ' : 'FAIL ') + key.padEnd(10) + ' ' + images[key] + (ok ? ' (' + cache[key].length + ' B)' : ''))
    }
    const vok = await loadVideo()
    lines.push('  ' + (vok ? 'OK   ' : 'FAIL ') + 'video      ' + videoPath + (vok ? ' (' + videoSize + ' B)' : ''))
    console.log('[dsh-theme-wanderer] 启动自检:\n' + lines.join('\n'))
  })().catch(function (err) {
    console.error('[dsh-theme-wanderer] 启动自检异常:', err)
  })
}
