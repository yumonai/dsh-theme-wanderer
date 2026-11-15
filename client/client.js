window.__ModuleLoader__.load({ id: "dsh-theme-wanderer", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");

		/* ===== 原神流浪者主题美化 · 共享状态 ===== */
		const wtStore = {
			prefs: { video: true, stars: true, wind: true, frame: true, ribbons: true, dock: true, refract: false },
			prefsListeners: new Set(),
			videoEl: null,
			mediaWrap: null,
		}
		function wtSetPref(key, value) {
			wtStore.prefs[key] = !!value
			if (key === 'video') wtApplyVideoPref()
			if (key === 'refract') document.body.classList.toggle('wt-refract-on', !!wtStore.prefs.refract)
			wtStore.prefsListeners.forEach(function (fn) { fn() })
		}
		function wtTogglePref(key) { wtSetPref(key, !wtStore.prefs[key]) }
		function wtUsePrefs() {
			const [snapshot, setSnapshot] = React.useState(Object.assign({}, wtStore.prefs))
			React.useEffect(function () {
				const fn = function () { setSnapshot(Object.assign({}, wtStore.prefs)) }
				wtStore.prefsListeners.add(fn)
				return function () { wtStore.prefsListeners.delete(fn) }
			}, [])
			return snapshot
		}
		function wtApplyVideoPref() {
			const on = !!wtStore.prefs.video
			document.body.classList.toggle('wt-video-off', !on)
			const v = wtStore.videoEl
			if (!v) return
			if (on) { try { v.play().catch(function () {}) } catch (e) {} } else { try { v.pause() } catch (e) {} }
		}

		const name = "dsh-theme-wanderer"
		const inject = ["slots", "theme"]
		const THEME_VERSION = '3.2.0'

		function apply(ctx) {
			const TOKENS = {
				'--dsw-alias-bg-base': { light: 'rgba(250, 252, 255, 0.03)', dark: 'rgba(6, 10, 20, 0.05)' },
				'--dsw-alias-bg-layer-1': { light: 'rgba(255, 255, 255, 0.42)', dark: 'rgba(16, 27, 46, 0.36)' },
				'--dsw-alias-bg-layer-2': { light: 'rgba(248, 251, 255, 0.34)', dark: 'rgba(22, 36, 58, 0.30)' },
				'--dsw-alias-bg-overlay': { light: 'rgba(244, 248, 253, 0.88)', dark: 'rgba(14, 24, 42, 0.88)' },
				'--dsw-alias-border-l1': { light: 'rgba(255, 255, 255, 0.50)', dark: 'rgba(255, 255, 255, 0.08)' },
				'--dsw-alias-border-l2': { light: 'rgba(168, 138, 82, 0.50)', dark: 'rgba(212, 175, 106, 0.36)' },
				'--dsw-alias-brand-primary': { light: '#2f93c4', dark: '#6fc3e8' },
				'--dsw-alias-label-primary': { light: '#16283c', dark: '#f4efe4' },
				'--dsw-alias-label-secondary': { light: '#3c5468', dark: '#a9bdd2' },
				'--dsw-alias-state-error-primary': { light: '#c94f4f', dark: '#e27373' },
				'--dsw-alias-state-success-primary': { light: '#1e9c80', dark: '#4ecbb2' },
				'--dsw-alias-state-warn-primary': { light: '#b8862f', dark: '#e0b862' },
				'--dsw-specific-sidebar-fill': { light: 'rgba(255, 255, 255, 0.12)', dark: 'rgba(8, 16, 30, 0.16)' },
			}

			const CSS = `
/* ===== 原神流浪者主题美化 v3.1: 透明玻璃 · 动态壁纸 ===== */
html { background-color: #0a1424; }
body {
  background-color: #0a1424;
  background-image: url("/wanderer-theme/wallpaper");
  background-size: cover;
  background-position: center top;
  font-family: "PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", -apple-system, "Segoe UI", sans-serif;
}

/* ===== 动态壁纸(视频) + 静态海报降级 ===== */
body::before {
  content: "";
  position: fixed; inset: 0; z-index: -3; pointer-events: none;
  background: url("/wanderer-theme/wallpaper") center top / cover no-repeat;
}
.wt-bgmedia { position: fixed; inset: 0; z-index: -2; pointer-events: none; overflow: hidden; background: transparent; }
.wt-bgvideo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 1; }
.wt-bgscrim { position: absolute; inset: 0; background: radial-gradient(120% 100% at 50% 45%, rgba(8, 14, 26, 0) 55%, rgba(8, 14, 26, 0.22) 100%); }
body:not([data-ds-dark-theme]) .wt-bgscrim { background: radial-gradient(120% 100% at 50% 45%, rgba(245, 249, 255, 0) 55%, rgba(240, 246, 252, 0.14) 100%); }
body.wt-video-off .wt-bgmedia { display: none; }
@media (prefers-reduced-motion: reduce) { .wt-bgvideo { display: none; } }

/* ===== 主界面: 完全透明(壁纸清晰可见) + 液态玻璃边缘光影 ===== */
[class*="centerCol"] {
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
[class*="sidebarCol"], [class*="rightbarCol"], [class*="bottomRow"] {
  position: relative;
  backdrop-filter: blur(1.5px) saturate(130%);
  -webkit-backdrop-filter: blur(1.5px) saturate(130%);
  overflow: hidden;
}
body:not([data-ds-dark-theme]) [class*="sidebarCol"],
body:not([data-ds-dark-theme]) [class*="rightbarCol"],
body:not([data-ds-dark-theme]) [class*="bottomRow"] {
  background: rgba(255, 255, 255, 0.05) !important;
  box-shadow:
    inset 0 0 2px 1px rgba(255, 255, 255, 0.40),
    inset 0 0 10px 4px rgba(255, 255, 255, 0.14),
    inset 0 4px 16px rgba(20, 40, 70, 0.05),
    inset 0 8px 24px rgba(20, 40, 70, 0.05),
    inset 1px 0 0 rgba(255, 255, 255, 0.45);
}
body[data-ds-dark-theme] [class*="sidebarCol"],
body[data-ds-dark-theme] [class*="rightbarCol"],
body[data-ds-dark-theme] [class*="bottomRow"] {
  background: rgba(4, 8, 16, 0.07) !important;
  box-shadow:
    inset 0 0 2px 1px rgba(255, 255, 255, 0.16),
    inset 0 0 10px 4px rgba(255, 255, 255, 0.06),
    inset 0 4px 16px rgba(0, 0, 0, 0.06),
    inset 1px 0 0 rgba(255, 255, 255, 0.10);
}
html[data-platform=darwin] [class*="sidebarCol"],
html[data-platform=darwin] [class*="centerCol"],
html[data-platform=darwin] [class*="rightbarCol"],
html[data-platform=darwin] [class*="bottomRow"] {
  background-image: none !important;
}
/* 玻璃边缘: 斜向镜面反光 + 顶部光带(伪元素叠加) */
[class*="sidebarCol"]::after,
[class*="rightbarCol"]::after,
[class*="bottomRow"]::after {
  content: "";
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background:
    linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 16%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%),
    radial-gradient(90% 26% at 50% -4%, rgba(255,255,255,0.28), rgba(255,255,255,0) 70%);
  opacity: 0.8;
}
body[data-ds-dark-theme] [class*="sidebarCol"]::after,
body[data-ds-dark-theme] [class*="rightbarCol"]::after,
body[data-ds-dark-theme] [class*="bottomRow"]::after {
  background:
    linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 16%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%),
    radial-gradient(90% 26% at 50% -4%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%);
  opacity: 0.7;
}

/* ===== 光学折射(实验): SVG 位移滤镜,支持时产生真实边缘折射 ===== */
body.wt-refract-on [class*="sidebarCol"],
body.wt-refract-on [class*="rightbarCol"],
body.wt-refract-on [class*="bottomRow"] {
  backdrop-filter: url(#wt-liquid-glass) blur(0.4px) saturate(140%);
  -webkit-backdrop-filter: url(#wt-liquid-glass) blur(0.4px) saturate(140%);
}

/* 青绸滚动条 */
* { scrollbar-color: #5aa9c6 rgba(18, 30, 52, 0.22); scrollbar-width: thin; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: rgba(18, 30, 52, 0.16); border-radius: 8px; }
*::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8fd4ef, #3fa9c9 55%, #9b7bd4);
  border-radius: 8px;
  border: 1px solid rgba(232, 200, 122, 0.4);
}
*::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #eecf8a, #c9a35c); }

/* 鎏金光晕交互反馈 */
:where(button, [role="button"], a) { transition: box-shadow 0.3s ease, filter 0.3s ease; }
:where(button, [role="button"], a):hover { box-shadow: 0 0 12px rgba(232, 200, 122, 0.35), 0 0 3px rgba(232, 200, 122, 0.28); }
:where(button, a, input, textarea, [role="button"]):focus-visible { outline: 1.5px solid rgba(232, 200, 122, 0.85); outline-offset: 2px; }
::selection { background: rgba(111, 195, 232, 0.35); color: #fff7e6; }

/* ===== 主题图层 ===== */
.wt-layer.wt-layer { position: fixed; inset: 0; pointer-events: none; }

.wt-stars { position: fixed; inset: 0; pointer-events: none; background-repeat: repeat; }
.wt-stars-1 {
  background-image:
    radial-gradient(1.6px 1.6px at 20% 30%, rgba(255, 255, 255, 0.8), transparent 55%),
    radial-gradient(1.2px 1.2px at 68% 18%, rgba(143, 212, 239, 0.9), transparent 55%),
    radial-gradient(1.8px 1.8px at 45% 74%, rgba(232, 200, 122, 0.8), transparent 55%),
    radial-gradient(1.3px 1.3px at 88% 62%, rgba(155, 123, 212, 0.9), transparent 55%),
    radial-gradient(1.5px 1.5px at 8% 82%, rgba(255, 255, 255, 0.7), transparent 55%);
  background-size: 550px 550px, 430px 430px, 640px 640px, 520px 520px, 380px 380px;
  animation: wt-twinkle 7s ease-in-out infinite;
}
.wt-stars-2 {
  background-image:
    radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.55), transparent 55%),
    radial-gradient(1.4px 1.4px at 30% 60%, rgba(111, 195, 232, 0.6), transparent 55%);
  background-size: 300px 300px, 460px 460px;
  animation: wt-twinkle 9s ease-in-out infinite reverse;
}
@keyframes wt-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.45; } }

.wt-grain {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E");
}

.wt-wind { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; }

/* ===== 卷轴边框 ===== */
.wt-frame {
  position: fixed; inset: 10px; pointer-events: none; border-radius: 18px;
  border: 1px solid rgba(232, 200, 122, 0.22);
  box-shadow: inset 0 0 0 1px rgba(111, 195, 232, 0.06);
}

/* ===== 绳穗青绸滚边 ===== */
.wt-edge { position: fixed; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; opacity: 0.44; }
.wt-edge-l { left: 13px; }
.wt-edge-r { right: 13px; }
.wt-edge-line { width: 2px; border-radius: 2px; background: linear-gradient(180deg, #8fd4ef, #e8c87a 50%, #9b7bd4); }
.wt-edge-l .wt-edge-line { height: 22vh; }
.wt-edge-r .wt-edge-line { height: 13vh; }
.wt-edge-tassel { width: 10px; height: 26px; background: linear-gradient(180deg, rgba(155, 123, 212, 0.9), rgba(111, 195, 232, 0.9)); clip-path: polygon(50% 0, 100% 30%, 62% 48%, 100% 62%, 50% 100%, 0 62%, 38% 48%, 0 30%); }

/* 标题鎏金描边 */
.wt-title { font-weight: 700; color: #5b4a1f; letter-spacing: 0.12em; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 14px rgba(232, 200, 122, 0.35); }
body[data-ds-dark-theme] .wt-title { color: #f8efdb; text-shadow: 0 0 2px rgba(212, 175, 106, 0.9), 0 0 18px rgba(232, 200, 122, 0.5); }
.wt-title-sub { font-size: 10px; color: rgba(90, 110, 130, 0.85); letter-spacing: 0.34em; }
body[data-ds-dark-theme] .wt-title-sub { color: rgba(233, 214, 178, 0.7); }

/* 绸带分割线 */
.wt-divider { position: relative; height: 2px; margin: 14px 8px; background: linear-gradient(90deg, transparent, #8fd4ef 12%, #e8c87a 50%, #9b7bd4 88%, transparent); }
.wt-divider::before, .wt-divider::after { content: ""; position: absolute; top: 50%; width: 8px; height: 8px; transform: translateY(-50%) rotate(45deg); background: rgba(232, 200, 122, 0.95); }
.wt-divider::before { left: -2px; }
.wt-divider::after { right: -2px; }

/* ===== 风语题签 ===== */
.wt-dock { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 2px 0 3px; opacity: 0.7; pointer-events: none; color: #3a4a5e; font-size: 12px; letter-spacing: 0.3em; }
body[data-ds-dark-theme] .wt-dock { color: rgba(244, 239, 228, 0.85); }
.wt-dock .wt-spiral { animation: wt-spin 9s linear infinite; }
@keyframes wt-spin { to { transform: rotate(360deg); } }

/* ===== 设置页 ===== */
.wt-settings { display: flex; flex-direction: column; gap: 2px; }
.wt-settings-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.wt-set-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 4px; border-bottom: 1px solid rgba(212, 175, 106, 0.16); }
.wt-set-label { font-size: 13px; color: #16283c; letter-spacing: 0.06em; }
body[data-ds-dark-theme] .wt-set-label { color: #f4efe4; }
.wt-set-desc { font-size: 11px; color: rgba(70, 90, 112, 0.8); margin-top: 2px; }
body[data-ds-dark-theme] .wt-set-desc { color: rgba(169, 189, 210, 0.7); }
.wt-switch { width: 44px; height: 24px; border-radius: 999px; background: rgba(120, 140, 165, 0.35); border: 1px solid rgba(212, 175, 106, 0.35); position: relative; cursor: pointer; flex: none; }
.wt-switch-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: rgba(255, 255, 255, 0.92); transition: left 0.25s ease; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35); }
.wt-switch-on { background: linear-gradient(90deg, rgba(63, 169, 201, 0.9), rgba(111, 195, 232, 0.9)); }
.wt-switch-on .wt-switch-knob { left: 23px; background: #ffffff; }

/* ===== 自检与诊断 ===== */
.wt-diag { display: flex; flex-direction: column; gap: 6px; }
.wt-diag-head { display: flex; align-items: center; justify-content: space-between; }
.wt-diag-btn { padding: 4px 10px; font-size: 11px; border-radius: 999px; border: 1px solid rgba(212, 175, 106, 0.5); background: rgba(255, 255, 255, 0.28); color: #2c3e52; cursor: pointer; letter-spacing: 0.1em; }
body[data-ds-dark-theme] .wt-diag-btn { background: rgba(20, 36, 60, 0.4); color: rgba(244, 239, 228, 0.85); }
.wt-diag-row { display: flex; align-items: baseline; gap: 8px; font-size: 12px; line-height: 1.6; }
.wt-diag-mark { flex: none; width: 14px; text-align: center; }
.wt-diag-ok { color: #1e9c80; }
.wt-diag-bad { color: #c94f4f; }
.wt-diag-label { flex: none; width: 96px; color: rgba(90, 78, 50, 0.9); letter-spacing: 0.08em; }
body[data-ds-dark-theme] .wt-diag-label { color: rgba(233, 214, 178, 0.85); }
.wt-diag-detail { color: rgba(70, 90, 112, 0.85); word-break: break-all; }
body[data-ds-dark-theme] .wt-diag-detail { color: rgba(169, 189, 210, 0.75); }
.wt-diag-foot { font-size: 10px; color: rgba(70, 90, 112, 0.6); margin-top: 4px; }
body[data-ds-dark-theme] .wt-diag-foot { color: rgba(169, 189, 210, 0.55); }

/* ===== 版权与来源 ===== */
.wt-copy { display: flex; flex-direction: column; gap: 5px; }
.wt-copy-title { font-size: 12px; font-weight: 600; color: #5b4a1f; letter-spacing: 0.14em; }
body[data-ds-dark-theme] .wt-copy-title { color: #f6ecd8; }
.wt-copy-text { font-size: 11px; line-height: 1.75; color: rgba(70, 90, 112, 0.85); }
body[data-ds-dark-theme] .wt-copy-text { color: rgba(169, 189, 210, 0.75); }

@media (prefers-reduced-motion: reduce) {
  .wt-stars-1, .wt-stars-2, .wt-spiral, .wt-dock .wt-spiral { animation: none; }
  .wt-wind { display: none; }
}
`

			/* 挂载: 主题令牌 + 样式 + 动态壁纸视频 */
			ctx.effect(function () {
				const disposers = []
				disposers.push(ctx.theme.overrideTokens('dsh-theme-wanderer', TOKENS))

				const styleEl = document.createElement('style')
				styleEl.setAttribute('data-plugin', 'dsh-theme-wanderer')
				styleEl.setAttribute('data-plugin-css', 'dsh-theme-wanderer')
				styleEl.textContent = CSS
				document.head.appendChild(styleEl)
				disposers.push(function () { try { styleEl.remove() } catch (err) {} })

				{
					/* 光学折射滤镜(SVG 位移): 供 backdrop-filter: url() 使用; 不支持的环境自动忽略 */
				const svgNS = 'http://www.w3.org/2000/svg'
				const svg = document.createElementNS(svgNS, 'svg')
				svg.setAttribute('width', '0')
				svg.setAttribute('height', '0')
				svg.setAttribute('aria-hidden', 'true')
				svg.style.position = 'absolute'
				svg.style.width = '0'
				svg.style.height = '0'
				svg.style.overflow = 'hidden'
				svg.innerHTML = '<defs><filter id="wt-liquid-glass" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">'
					+ '<feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="1" seed="11" result="noise"/>'
					+ '<feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="disp"/>'
					+ '<feGaussianBlur in="disp" stdDeviation="0.4"/>'
					+ '</filter></defs>'
				document.body.appendChild(svg)
				disposers.push(function () { try { svg.remove() } catch (err) {} })
				document.body.classList.toggle('wt-refract-on', !!wtStore.prefs.refract)

				const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
					const wrap = document.createElement('div')
					wrap.className = 'wt-bgmedia'
					const video = document.createElement('video')
					video.className = 'wt-bgvideo'
					;['muted', 'playsinline', 'webkit-playsinline', 'autoplay', 'loop', 'disableremoteplayback'].forEach(function (attr) {
						video.setAttribute(attr, '')
					})
					video.setAttribute('aria-hidden', 'true')
					video.muted = true
					video.defaultMuted = true
					video.volume = 0
					video.loop = true
					video.autoplay = true
					video.preload = 'auto'
					video.poster = '/wanderer-theme/wallpaper'
					video.src = '/wanderer-theme/wallpaper-video'
					const source = document.createElement('source')
					source.src = '/wanderer-theme/wallpaper-video'
					source.type = 'video/mp4'
					video.appendChild(source)
					const scrim = document.createElement('div')
					scrim.className = 'wt-bgscrim'
					wrap.appendChild(video)
					wrap.appendChild(scrim)
					document.body.appendChild(wrap)
					wtStore.videoEl = video
					wtStore.mediaWrap = wrap

					/* 把浏览器内的真实播放状态回传到 Host 终端,便于远端诊断 */
					let reports = 0
					function report(tag) {
						if (reports > 8) return
						reports++
						try {
							const st = 'evt=' + tag
								+ ' err=' + (video.error ? video.error.code : 0)
								+ ' rs=' + video.readyState
								+ ' ns=' + video.networkState
								+ ' paused=' + video.paused
								+ ' t=' + (Math.round(video.currentTime * 10) / 10)
								+ ' reducedMotion=' + reduceMotion
							fetch('/wanderer-theme/clientlog?video ' + encodeURIComponent(st), { cache: 'no-store' }).catch(function () {})
						} catch (err) {}
					}
					function tryPlay() {
						try {
							const p = video.play()
							if (p && p.catch) p.catch(function (err) {
								console.warn('[dsh-theme-wanderer] 视频自动播放被阻止:', (err && err.name) || 'unknown')
							})
						} catch (err) {}
					}
					;['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'stalled'].forEach(function (ev) {
						video.addEventListener(ev, function () { if (ev === 'playing') report('playing'); if (video.paused) tryPlay() })
					})
					video.addEventListener('error', function () { report('error'); console.error('[dsh-theme-wanderer] 视频元素错误:', video.error && video.error.code) })
					const unlock = function () {
						tryPlay()
						document.removeEventListener('pointerdown', unlock)
						document.removeEventListener('keydown', unlock)
						document.removeEventListener('wheel', unlock)
					}
					document.addEventListener('pointerdown', unlock)
					document.addEventListener('keydown', unlock)
					document.addEventListener('wheel', unlock, { passive: true })
					disposers.push(function () {
						document.removeEventListener('pointerdown', unlock)
						document.removeEventListener('keydown', unlock)
						document.removeEventListener('wheel', unlock)
					})
					// 反复重试(自动播放策略/缓冲),最多约 20 秒
					let tries = 0
					const retry = window.setInterval(function () {
						tries++
						if (!video.paused && video.readyState >= 3) { window.clearInterval(retry); return }
						try { video.play().catch(function () {}) } catch (err) {}
						if (tries > 40) window.clearInterval(retry)
					}, 500)
					disposers.push(function () { window.clearInterval(retry) })

					tryPlay()
					window.setTimeout(function () { report('t+3s') }, 3000)
					window.setTimeout(function () { report('t+9s') }, 9000)
					disposers.push(function () {
						try { video.pause() } catch (err) {}
						try { video.removeAttribute('src') } catch (err) {}
						try { wrap.remove() } catch (err) {}
						wtStore.videoEl = null
						wtStore.mediaWrap = null
					})
				}

				wtApplyVideoPref()
				return function () { for (const d of disposers) { try { d() } catch (err) {} } }
			})

			ctx.slots.inject('shell.overlay', function () {
				return ctx.slots.register(
					{ name: 'shell.overlay', id: 'wanderer-theme-layer', order: -100 },
					function () { return React.createElement(WandererLayer) },
				)
			})

			ctx.slots.inject('settings.section', function () {
				return ctx.slots.register(
					{ name: 'settings.section', id: 'wanderer-theme', order: 25, label: '原神流浪者主题美化' },
					function () { return React.createElement(SettingsPanel) },
				)
			})

			ctx.slots.inject('conversation.composer.dock', function () {
				return ctx.slots.register(
					{ name: 'conversation.composer.dock', id: 'wanderer-dock', order: 10, label: '风语签' },
					function () { return React.createElement(DockFlourish) },
				)
			})

			console.log('[dsh-theme-wanderer] v' + THEME_VERSION + ' 已挂载: 透明玻璃 + 动态壁纸视频')
			;(function bootCheck() {
				try {
					fetch('/wanderer-theme/wallpaper-video', { method: 'HEAD' }).then(function (r) {
						console.log('[dsh-theme-wanderer] 动态壁纸自检 HTTP', r.status, r.headers.get('content-type') || '', r.headers.get('content-length') || '')
					}).catch(function (e) {
						console.error('[dsh-theme-wanderer] 动态壁纸自检失败:', e)
					})
				} catch (err) {}
			})()

			/* ===== 基础形状 ===== */
			function starPoints(x, y, r, rot) {
				const pts = []
				for (let i = 0; i < 8; i++) {
					const ang = rot + (i * Math.PI) / 4
					const rad = i % 2 === 0 ? r : r * 0.3
					pts.push((x + Math.cos(ang) * rad).toFixed(1) + ',' + (y + Math.sin(ang) * rad).toFixed(1))
				}
				return pts.join(' ')
			}
			function StarShape(props) {
				return React.createElement('polygon', {
					points: starPoints(props.x, props.y, props.r, props.rot || 0),
					fill: props.fill || 'rgba(103,195,232,0.9)',
					stroke: props.stroke || 'rgba(230,240,255,0.9)',
					strokeWidth: props.strokeWidth || 0.8,
				})
			}
			function VisionStar(props) {
				const size = props.size || 24
				return React.createElement('svg', { width: size, height: size, viewBox: '0 0 64 64', 'aria-hidden': true },
					React.createElement('circle', { cx: 32, cy: 32, r: 29, fill: 'none', stroke: 'rgba(232,200,122,0.9)', strokeWidth: 2.5 }),
					React.createElement('circle', { cx: 32, cy: 32, r: 22, fill: 'none', stroke: 'rgba(111,195,232,0.4)', strokeWidth: 1 }),
					React.createElement(StarShape, { x: 32, y: 32, r: 24, fill: 'rgba(103,195,232,0.85)' }),
					React.createElement(StarShape, { x: 32, y: 32, r: 15, rot: Math.PI / 4, fill: 'rgba(230,240,255,0.9)' }),
				)
			}
			function Spiral(props) {
				const size = props.size || 24
				const d = 'M24 24 m0.9 0 a0.9 0.9 0 0 1 0.9 0.9 a1.8 1.8 0 0 1 -1.8 1.8 a2.7 2.7 0 0 1 -2.7 -2.7 a3.6 3.6 0 0 1 3.6 -3.6 a4.5 4.5 0 0 1 4.5 4.5 a5.4 5.4 0 0 1 -5.4 5.4 a6.3 6.3 0 0 1 -6.3 -6.3 a7.2 7.2 0 0 1 7.2 -7.2 a8.1 8.1 0 0 1 8.1 8.1 a9 9 0 0 1 -9 9 a9.9 9.9 0 0 1 -9.9 -9.9 a10.8 10.8 0 0 1 10.8 -10.8 a11.7 11.7 0 0 1 11.7 11.7 a12.6 12.6 0 0 1 -12.6 12.6 a13.5 13.5 0 0 1 -13.5 -13.5 a14.4 14.4 0 0 1 14.4 -14.4 a15.3 15.3 0 0 1 15.3 15.3 a16.2 16.2 0 0 1 -16.2 16.2 a17.1 17.1 0 0 1 -17.1 -17.1 a18 18 0 0 1 18 -18 a18.9 18.9 0 0 1 18.9 18.9 a19.8 19.8 0 0 1 -19.8 19.8'
				return React.createElement('svg', { className: 'wt-spiral', width: size, height: size, viewBox: '0 0 48 48', 'aria-hidden': true },
					React.createElement('path', { d: d, fill: 'none', stroke: 'rgba(111,195,232,0.9)', strokeWidth: 1.6, strokeLinecap: 'round' }),
				)
			}
			function Lotus(props) {
				const size = props.size || 30
				const petals = []
				for (let i = 0; i < 8; i++) {
					const ang = (i * Math.PI) / 4
					petals.push(React.createElement('path', {
						key: 'p' + i,
						d: 'M0 0 Q6 -8 0 -16 Q-6 -8 0 0 Z',
						transform: 'rotate(' + ((ang * 180) / Math.PI) + ')',
						fill: 'none',
						stroke: 'rgba(232,200,122,0.85)',
						strokeWidth: 1.1,
					}))
				}
				return React.createElement('svg', { width: size, height: size, viewBox: '-20 -20 40 40', 'aria-hidden': true },
					React.createElement('g', null, petals),
					React.createElement('circle', { r: 3.2, fill: 'rgba(232,200,122,0.9)' }),
				)
			}
			function Ribbon() {
				return React.createElement('div', { className: 'wt-divider', 'aria-hidden': true })
			}

			/* ===== 风元素粒子画布 ===== */
			function drawStar(c2d, x, y, r, rot, color) {
				c2d.beginPath()
				for (let i = 0; i < 8; i++) {
					const ang = rot + (i * Math.PI) / 4
					const rad = i % 2 === 0 ? r : r * 0.3
					const px = x + Math.cos(ang) * rad
					const py = y + Math.sin(ang) * rad
					if (i === 0) { c2d.moveTo(px, py) } else { c2d.lineTo(px, py) }
				}
				c2d.closePath()
				c2d.fillStyle = color
				c2d.fill()
			}
			function WindCanvas() {
				let canvasEl = null
				React.useEffect(function () {
					const canvas = canvasEl
					if (!canvas) return undefined
					const c2d = canvas.getContext('2d')
					if (!c2d) return undefined
					const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
					if (reduceMotion) return undefined

					const COLORS = ['103, 195, 232', '232, 200, 122', '155, 123, 212', '214, 236, 248']
					const parts = []
					let w = 0
					let h = 0
					let dpr = 1

					function seed(p, fromRight) {
						const cw = canvas.clientWidth || 800
						const ch = canvas.clientHeight || 600
						p.kind = Math.random() < 0.2 ? 'star' : 'mote'
						p.x = fromRight ? cw + 20 + Math.random() * 160 : Math.random() * cw
						p.y = Math.random() * ch
						p.anchor = p.y
						p.r = 0.6 + Math.random() * 1.7
						p.vx = 0.3 + Math.random() * 1.1
						p.amp = 10 + Math.random() * 30
						p.freq = 0.004 + Math.random() * 0.008
						p.phase = Math.random() * Math.PI * 2
						p.spin = Math.random() * Math.PI * 2
						p.spinV = (Math.random() - 0.5) * 0.05
						p.color = COLORS[(Math.random() * COLORS.length) | 0]
					}
					for (let i = 0; i < 60; i++) { const p = {}; seed(p, false); parts.push(p) }
					for (let i = 0; i < 6; i++) {
						const p = {}
						seed(p, false)
						p.kind = 'spiral'
						p.orbit = 8 + Math.random() * 14
						p.theta = Math.random() * Math.PI * 2
						p.orbitV = 0.012 + Math.random() * 0.02
						p.ax = p.x
						p.ay = p.y
						parts.push(p)
					}
					for (let i = 0; i < 4; i++) {
						const p = {}
						seed(p, false)
						p.kind = 'gust'
						p.len = 60 + Math.random() * 110
						p.vx = 1.6 + Math.random() * 1.6
						parts.push(p)
					}

					function tick() {
						const cw = canvas.clientWidth || 800
						const ch = canvas.clientHeight || 600
						if (cw !== w || ch !== h) {
							w = cw
							h = ch
							dpr = (window.devicePixelRatio) || 1
							canvas.width = Math.max(1, Math.round(cw * dpr))
							canvas.height = Math.max(1, Math.round(ch * dpr))
						}
						c2d.setTransform(dpr, 0, 0, dpr, 0, 0)
						c2d.clearRect(0, 0, w, h)
						for (let i = 0; i < parts.length; i++) {
							const p = parts[i]
							if (p.kind === 'gust') {
								p.x -= p.vx
								if (p.x + p.len < -10) { seed(p, true); p.kind = 'gust' }
								const g = c2d.createLinearGradient(p.x - p.len, p.y, p.x, p.y)
								g.addColorStop(0, 'rgba(' + p.color + ',0)')
								g.addColorStop(0.5, 'rgba(' + p.color + ',0.16)')
								g.addColorStop(1, 'rgba(' + p.color + ',0)')
								c2d.strokeStyle = g
								c2d.lineWidth = 1.4
								c2d.beginPath()
								c2d.moveTo(p.x - p.len, p.y)
								c2d.lineTo(p.x, p.y)
								c2d.stroke()
								continue
							}
							if (p.kind === 'spiral') {
								p.theta += p.orbitV
								p.ax -= p.vx * 0.6
								if (p.ax < -40) { seed(p, true); p.kind = 'spiral'; p.ax = p.x; p.ay = p.y }
								const sx = p.ax + Math.cos(p.theta) * p.orbit
								const sy = p.ay + Math.sin(p.theta) * p.orbit * 0.7
								const a = 'rgba(' + p.color + ','
								c2d.fillStyle = a + '0.12)'
								c2d.beginPath()
								c2d.arc(sx, sy, p.r * 2.6, 0, Math.PI * 2)
								c2d.fill()
								c2d.fillStyle = a + '0.8)'
								c2d.beginPath()
								c2d.arc(sx, sy, p.r * 0.9, 0, Math.PI * 2)
								c2d.fill()
								continue
							}
							p.phase += p.freq * 2.2
							p.spin += p.spinV
							p.x -= p.vx
							const y = p.anchor + Math.sin(p.phase) * p.amp
							if (p.x < -24) { seed(p, true) }
							const a = 'rgba(' + p.color + ','
							c2d.fillStyle = a + '0.14)'
							c2d.beginPath()
							c2d.arc(p.x, y, p.r * 3.4, 0, Math.PI * 2)
							c2d.fill()
							if (p.kind === 'star') {
								drawStar(c2d, p.x, y, p.r * 2.6, p.spin, a + '0.9)')
								drawStar(c2d, p.x, y, p.r * 1.05, p.spin + Math.PI / 4, a + '0.75)')
							} else {
								c2d.fillStyle = a + '0.85)'
								c2d.beginPath()
								c2d.arc(p.x, y, p.r, 0, Math.PI * 2)
								c2d.fill()
							}
						}
					}

					let raf = 0
					function loop() {
						tick()
						raf = window.requestAnimationFrame(loop)
					}
					raf = window.requestAnimationFrame(loop)
					return function () { window.cancelAnimationFrame(raf) }
				}, [])
				return React.createElement('canvas', { ref: function (el) { canvasEl = el }, className: 'wt-wind', 'aria-hidden': true })
			}

			/* ===== 卷轴边框 ===== */
			function FrameBorder() {
				return React.createElement('div', { className: 'wt-frame', 'aria-hidden': true },
					React.createElement('div', { style: { position: 'absolute', top: -10, left: -10 } }, React.createElement(Lotus, { size: 30 })),
					React.createElement('div', { style: { position: 'absolute', top: -10, right: -10 } }, React.createElement(Lotus, { size: 30 })),
					React.createElement('div', { style: { position: 'absolute', bottom: -10, left: -10 } }, React.createElement(Lotus, { size: 30 })),
					React.createElement('div', { style: { position: 'absolute', bottom: -10, right: -10 } }, React.createElement(Lotus, { size: 30 })),
				)
			}

			/* ===== 绳穗青绸滚边 ===== */
			function RibbonEdges() {
				return React.createElement('div', { className: 'wt-edges', 'aria-hidden': true },
					React.createElement('div', { className: 'wt-edge wt-edge-l' },
						React.createElement('span', { className: 'wt-edge-tassel' }),
						React.createElement('span', { className: 'wt-edge-line' }),
						React.createElement('span', { className: 'wt-edge-tassel' }),
					),
					React.createElement('div', { className: 'wt-edge wt-edge-r' },
						React.createElement('span', { className: 'wt-edge-tassel' }),
						React.createElement('span', { className: 'wt-edge-line' }),
						React.createElement('span', { className: 'wt-edge-tassel' }),
					),
				)
			}

			/* ===== 风语题签 ===== */
			function DockFlourish() {
				const prefs = wtUsePrefs()
				if (!prefs.dock) return null
				return React.createElement('div', { className: 'wt-dock', 'aria-hidden': true },
					React.createElement(Spiral, { size: 12 }),
					React.createElement('span', null, '风随旅人 · 语落如羽'),
					React.createElement(Spiral, { size: 12 }),
				)
			}

			/* ===== 设置页 ===== */
			function Toggle(props) {
				return React.createElement('div', { className: 'wt-set-row' },
					React.createElement('div', null,
						React.createElement('div', { className: 'wt-set-label' }, props.label),
						React.createElement('div', { className: 'wt-set-desc' }, props.desc),
					),
					React.createElement('div', {
						className: 'wt-switch' + (props.on ? ' wt-switch-on' : ''),
						role: 'switch',
						'aria-checked': props.on ? 'true' : 'false',
						tabIndex: 0,
						onClick: props.onToggle,
						onKeyDown: function (e) {
							if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); props.onToggle() }
						},
					},
						React.createElement('span', { className: 'wt-switch-knob' }),
					),
				)
			}

			/* ===== 自检与诊断 ===== */
			function diagRow(label, ok, detail) {
				return React.createElement('div', { className: 'wt-diag-row' },
					React.createElement('span', { className: 'wt-diag-mark' + (ok ? ' wt-diag-ok' : ' wt-diag-bad') }, ok ? '✓' : '✗'),
					React.createElement('span', { className: 'wt-diag-label' }, label),
					React.createElement('span', { className: 'wt-diag-detail' }, detail || ''),
				)
			}
			function ThemeDiag() {
				const [result, setResult] = React.useState(null)
				const [running, setRunning] = React.useState(false)
				function run() {
					if (running) return
					setRunning(true)
					Promise.all([
						fetch('/wanderer-theme/health').then(function (r) { return r.json() }).catch(function (e) { return { ok: false, error: String((e && e.message) || e) } }),
						fetch('/wanderer-theme/wallpaper-video', { method: 'HEAD' }).then(function (r) { return { status: r.status, type: r.headers.get('content-type') || '' } }).catch(function (e) { return { status: 0, error: String((e && e.message) || e) } }),
						fetch('/wanderer-theme/wallpaper', { method: 'HEAD' }).then(function (r) { return { status: r.status } }).catch(function () { return { status: 0 } }),
					]).then(function (parts) {
						const health = parts[0]
						const video = parts[1]
						const poster = parts[2]
						let tokenApplied = false
						let glass = false
						try {
							const v = window.getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim()
							tokenApplied = v.length > 0 && v.indexOf('rgba') >= 0
							const col = document.querySelector('[class*="sidebarCol"], [class*="centerCol"]')
							if (col) {
								const cs = window.getComputedStyle(col)
								const bf = cs.backdropFilter || cs.webkitBackdropFilter || ''
								glass = bf.indexOf('blur') >= 0
							}
						} catch (err) {}
						const v = wtStore.videoEl
						const vstate = v
							? (v.error ? '错误 ' + v.error.code : (v.readyState >= 3 ? '播放中' : (v.readyState >= 2 ? '已载入' : '加载中')) + (v.paused ? ' · 暂停' : '') + ' · t=' + (Math.round(v.currentTime * 10) / 10) + 's')
							: '未创建(可能开启了减弱动态效果)'
						setResult({
							version: THEME_VERSION,
							mode: document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light',
							platform: document.documentElement.getAttribute('data-platform') || 'unknown',
							healthOk: !!(health && health.ok),
							healthDetail: health && health.ok
								? ('视频 ' + (health.video && health.video.ok ? (health.video.bytes + ' B') : '不可用'))
								: ('health 失败: ' + ((health && health.error) || '未知')),
							videoOk: video.status === 200 && video.type.indexOf('video') >= 0,
							videoDetail: (video.status === 200 ? (video.status + ' ' + video.type) : ('HTTP ' + (video.status || 0))) + ' · 元素: ' + vstate,
							posterOk: poster.status === 200,
							posterDetail: 'HTTP ' + poster.status,
							tokenApplied: tokenApplied,
							glass: glass,
							time: new Date().toLocaleTimeString(),
						})
						setRunning(false)
					})
				}
				React.useEffect(function () { run() }, [])
				return React.createElement('div', { className: 'wt-diag' },
					React.createElement('div', { className: 'wt-diag-head' },
						React.createElement('span', { className: 'wt-title' }, '自检与诊断'),
						React.createElement('button', { type: 'button', className: 'wt-diag-btn', onClick: run }, running ? '检查中…' : '重新自检'),
					),
					result
						? React.createElement('div', null,
							diagRow('主题版本', true, result.version + ' · ' + (result.mode === 'dark' ? '深色' : '浅色') + ' · ' + result.platform),
							diagRow('视频服务', result.healthOk, result.healthDetail),
							diagRow('视频元素', result.videoOk, result.videoDetail),
							diagRow('静态海报', result.posterOk, result.posterDetail),
							diagRow('主题令牌', result.tokenApplied, result.tokenApplied ? 'base 为玻璃半透明' : '未检测到'),
							diagRow('透明玻璃', result.glass, result.glass ? '主列 backdrop-filter 已应用' : '未检测到 backdrop-filter'),
							React.createElement('div', { className: 'wt-diag-foot' }, '自检时间 ' + result.time + ' · 视频元素显示「暂停」时点击任意处即可恢复播放'),
						)
						: React.createElement('div', { className: 'wt-diag-foot' }, '自检运行中…'),
				)
			}

			/* ===== 版权与来源 ===== */
			function CopyrightBlock() {
				return React.createElement('div', { className: 'wt-copy' },
					React.createElement('div', { className: 'wt-copy-title' }, '版权与来源'),
					React.createElement('div', { className: 'wt-copy-text' }, '动态壁纸视频为购买授权的素材，版权归原作者所有。'),
					React.createElement('div', { className: 'wt-copy-text' }, '本插件免费分享，请勿用于商业售卖。'),
				)
			}

			function SettingsPanel() {
				const prefs = wtUsePrefs()
				const ITEMS = [
					['video', '动态壁纸', '视频壁纸(关闭后使用静态海报)'],
					['stars', '星空星尘', '壁纸上的闪烁星尘'],
					['wind', '风元素粒子', '流动的风之微尘 · 四芒星 · 螺旋 · 风痕'],
					['refract', '光学折射(实验)', 'SVG 位移滤镜模拟玻璃边缘折射；不支持的浏览器自动忽略'],
					['frame', '卷轴边框', '全屏鎏金卷轴边框与八瓣金莲角饰'],
					['ribbons', '绸带滚边', '左右紫色绳穗与青绸装饰线'],
					['dock', '风语题签', '输入框下方的风语装饰'],
				]
				const rows = ITEMS.map(function (item) {
					return React.createElement(Toggle, {
						key: item[0],
						label: item[1],
						desc: item[2],
						on: !!prefs[item[0]],
						onToggle: function () { wtTogglePref(item[0]) },
					})
				})
				return React.createElement('div', { className: 'wt-settings' },
					React.createElement('div', { className: 'wt-settings-head' },
						React.createElement(VisionStar, { size: 24 }),
						React.createElement('div', null,
							React.createElement('div', { className: 'wt-title' }, '原神流浪者主题美化'),
							React.createElement('div', { className: 'wt-title-sub' }, 'WANDERER THEME · v' + THEME_VERSION),
						),
						React.createElement(Spiral, { size: 20 }),
					),
					React.createElement(Ribbon),
					rows,
					React.createElement(Ribbon),
					React.createElement(ThemeDiag),
					React.createElement(Ribbon),
					React.createElement(CopyrightBlock),
				)
			}

			/* ===== 全局图层 ===== */
			function WandererLayer() {
				const prefs = wtUsePrefs()
				return React.createElement('div', { className: 'wt-layer' },
					React.createElement('div', { className: 'wt-grain', 'aria-hidden': true }),
					prefs.stars ? React.createElement('div', { className: 'wt-stars wt-stars-1', 'aria-hidden': true }) : null,
					prefs.stars ? React.createElement('div', { className: 'wt-stars wt-stars-2', 'aria-hidden': true }) : null,
					prefs.wind ? React.createElement(WindCanvas) : null,
					prefs.frame ? React.createElement(FrameBorder) : null,
					prefs.ribbons ? React.createElement(RibbonEdges) : null,
				)
			}
		}

		exports.name = name;
		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	}
});
