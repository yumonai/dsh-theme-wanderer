/**
 * dsh-theme-wanderer — Host half.
 *
 * 职责:
 *   1. 通过 /wanderer-theme/* 提供流浪者素材图片(壁纸/立绘等),供客户端同源引用。
 *   2. 通过 /wanderer-theme/health 提供 JSON 健康检查(自检与排查用)。
 *   3. 启动时对全部素材做一次预热自检,并把结果打印到终端日志。
 *
 * 排查提示: 启动日志中 [dsh-theme-wanderer] 开头的行即为本插件输出;
 * 若素材全部 FAIL,通常意味着 baseDir 路径不存在或不可读。
 */
export const name = 'dsh-theme-wanderer'

export const VERSION = '2.0.0'

export function apply(ctx) {
  const fs = ctx.get('fs')
  const webServer = ctx.get('webServer')
  if (!fs || !webServer) {
    console.error('[dsh-theme-wanderer] fs 或 webServer 服务不可用;请确认 cordis.patch.yml 中该行声明了 inject: [fs, webServer]')
    return
  }

  const baseDir = '/Users/yuzhengdong/Downloads/流浪者素材'
  const files = {
    wallpaper: '流浪者5.jpeg',
    hero: '流浪者4.jpeg',
    portrait: '流浪者2.jpeg',
    art1: '流浪者1.jpg',
    art2: '流浪者2.jpeg',
    art3: '流浪者3.jpeg',
    art4: '流浪者4.jpeg',
    art5: '流浪者5.jpeg',
    art6: '流浪者6.jpeg',
    art7: '流浪者7.jpeg',
    art8: '流浪者8.jpeg',
  }
  const cache = {}
  const pending = {}
  const lastErrors = {}
  const MAX_BYTES = 64 * 1024 * 1024

  async function loadAsset(assetName) {
    const file = files[assetName]
    if (!file) return false
    if (cache[assetName]) return true
    if (!pending[assetName]) {
      pending[assetName] = (async function () {
        try {
          const target = await fs.resolve(baseDir + '/' + file)
          cache[assetName] = await fs.readBytes(target, undefined, MAX_BYTES)
          delete lastErrors[assetName]
          return true
        } catch (err) {
          lastErrors[assetName] = String((err && err.message) || err)
          console.error('[dsh-theme-wanderer] 素材读取失败:', file, lastErrors[assetName])
          return false
        }
      })()
    }
    const ok = await pending[assetName]
    delete pending[assetName]
    return ok
  }

  const disposeRoute = webServer.register({
    kind: 'prefix',
    path: '/wanderer-theme',
    handler: async function (req, res) {
      const pathname = String((req && req.url) || '').split('?')[0]
      const assetName = pathname.replace(/^\/wanderer-theme\//, '')

      // 健康检查端点: JSON 汇总素材缓存状态,供客户端"自检与诊断"面板与外部排查使用。
      if (assetName === 'health') {
        const assets = {}
        for (const key of Object.keys(files)) {
          assets[key] = {
            file: files[key],
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
          baseDir: baseDir,
          assets: assets,
        }))
        return
      }

      console.log('[dsh-theme-wanderer] GET /wanderer-theme/' + assetName)
      try {
        const ok = await loadAsset(assetName)
        if (!ok) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('wanderer-theme: asset not found')
          return
        }
        const bytes = cache[assetName]
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
  console.log('[dsh-theme-wanderer] v' + VERSION + ' 素材路由已注册: /wanderer-theme/* (health 自检: /wanderer-theme/health)')

  // 启动预热自检: 预读全部素材并把结果打印到终端,便于快速定位素材路径问题。
  ;(async function warmup() {
    const report = []
    for (const key of Object.keys(files)) {
      const ok = await loadAsset(key)
      report.push((ok ? 'OK   ' : 'FAIL ') + key.padEnd(10) + ' ' + files[key] + (ok ? ' (' + cache[key].length + ' B)' : ''))
    }
    console.log('[dsh-theme-wanderer] 素材预热自检(' + baseDir + '):\n' + report.map(function (l) { return '  ' + l }).join('\n'))
  })().catch(function (err) {
    console.error('[dsh-theme-wanderer] 预热自检异常:', err)
  })
}
