window.__ModuleLoader__.load({ id: "dsh-theme-wanderer", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");

		/* ===== 原神流浪者主题美化 · 共享状态 ===== */
		const wtStore = {
			prefs: { video: true, stars: true, frame: true, ribbons: true, composer: true },
			prefsListeners: new Set(),
			videoEl: null,
		}
		function wtSetPref(key, value) {
			wtStore.prefs[key] = !!value
			if (key === 'video') wtApplyVideoPref()
			if (key === 'composer') document.body.classList.toggle('wt-composer-glass', !!wtStore.prefs.composer)
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
		const THEME_VERSION = '3.20.0'

		function apply(ctx) {
			/* inject 保证 slots/theme 已就绪(软依赖会在服务未就绪时拿不到而整主题跳过) */
			const themeSvc = ctx.theme || ctx.get('theme')
			const slotsSvc = ctx.slots || ctx.get('slots')
			if (!slotsSvc || typeof slotsSvc.inject !== 'function') {
				console.warn('[dsh-theme-wanderer] slots 服务不可用,跳过主题界面(不阻塞启动)')
				return
			}
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
/* 关键: 应用自带 body{isolation:isolate},body 因此成为层叠上下文,
   放在 body 上的 background-image 会盖住所有负 z-index 图层(动态壁纸)。
   所以这里只留纯色底,海报交给 body::before(z:-3),视频交给 .wt-bgmedia(z:-2)。 */
body {
  background-color: #0a1424;
  background-image: none;
  font-family: "PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", -apple-system, "Segoe UI", sans-serif;
}

/* ===== 动态壁纸(视频) + 静态海报降级 ===== */
body::before {
  content: "";
  position: fixed; inset: 0; z-index: -3; pointer-events: none;
  background: url("/wanderer-theme/wallpaper") center top / cover no-repeat;
}
/* 壁纸层: 不使用任何负 z-index(某些 WebKit 合成下负 z 固定层不刷新)。
   壁纸层 z-index:0 放在 body 下,应用根节点仅用 CSS 抬到 z-index:1 盖在它上面。
   注意: 只改 #root 的 CSS,绝不向 #root 插入节点(会破坏 React 挂载)。 */
#root { position: relative; z-index: 1; }
.wt-bgmedia { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; background: transparent; }
.wt-bgposter { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; opacity: 1; }
/* 视频即壁纸本体: 强制独立合成层,避免 Retina 下出现半尺寸副本 */
.wt-bgvideo { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; opacity: 1 !important; transform: translateZ(0); backface-visibility: hidden; }
.wt-bgscrim { position: absolute; inset: 0; background: radial-gradient(120% 100% at 50% 45%, rgba(8, 14, 26, 0) 55%, rgba(8, 14, 26, 0.22) 100%); }
body:not([data-ds-dark-theme]) .wt-bgscrim { background: radial-gradient(120% 100% at 50% 45%, rgba(245, 249, 255, 0) 55%, rgba(240, 246, 252, 0.14) 100%); }
body.wt-video-off .wt-bgvideo { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .wt-bgvideo { display: none; } }


/* ===== 视频未播放提示(自动隐藏) ===== */
.wt-video-hint {
  position: fixed; left: 50%; bottom: 92px; transform: translateX(-50%);
  z-index: 6; pointer-events: auto; cursor: pointer;
  padding: 6px 14px; border-radius: 999px; font-size: 12px; letter-spacing: 0.08em;
  color: #f6ecd8; background: rgba(16, 28, 48, 0.55);
  border: 1px solid rgba(232, 200, 122, 0.55);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px rgba(8,14,26,0.35);
  animation: wt-hint-breathe 2.4s ease-in-out infinite;
}
@keyframes wt-hint-breathe { 0%,100% { opacity: .75 } 50% { opacity: 1 } }

/* ===== 输入框卡片玻璃(安全实现,不用 backdrop-filter) =====
   为什么不用 backdrop-filter: 在欢迎页(插画 + hero 布局)那套结构下,
   WebKit 会把带 backdrop-filter 的 28px 圆角卡片整块合成失败 → 卡片与按钮全部不绘制。
   所以这里只用"半透明底 + 镜面高光 + 冷/暖色散边 + 外侧投影"表达玻璃质感,
   不触发任何合成/层叠行为;任何时候都不会影响输入框的显示与点击。 */
body.wt-composer-glass [class*="_composerStack"] [class*="_card"],
body.wt-composer-glass [class*="_composerHero"] [class*="_card"],
body.wt-composer-glass [class*="_welcome"] [class*="_card"]:has(textarea) {
  background-color: rgba(255, 255, 255, 0.34) !important;
  background-image: linear-gradient(160deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 42%, rgba(255, 255, 255, 0.08) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    inset 0 0 0 1px rgba(255, 255, 255, 0.34),
    inset 0 0 0 1.5px rgba(150, 205, 255, 0.26),
    inset 0 0 0 2.5px rgba(255, 190, 120, 0.12),
    0 14px 40px rgba(8, 16, 30, 0.20) !important;
}
body.wt-composer-glass[data-ds-dark-theme] [class*="_composerStack"] [class*="_card"],
body.wt-composer-glass[data-ds-dark-theme] [class*="_composerHero"] [class*="_card"],
body.wt-composer-glass[data-ds-dark-theme] [class*="_welcome"] [class*="_card"]:has(textarea) {
  background-color: rgba(16, 26, 44, 0.34) !important;
  background-image: linear-gradient(160deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0) 46%, rgba(255, 255, 255, 0.05) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    inset 0 0 0 1.5px rgba(120, 190, 255, 0.24),
    inset 0 0 0 2.5px rgba(232, 200, 122, 0.12),
    0 14px 40px rgba(0, 0, 0, 0.38) !important;
}

/* ===== 液态玻璃: 侧栏标准档,主对话列轻量档(更透、更清晰) ===== */
[class*="sidebarCol"], [class*="rightbarCol"], [class*="bottomRow"] {
  position: relative;
  -webkit-backdrop-filter: blur(14px) saturate(185%) brightness(1.05);
  backdrop-filter: blur(14px) saturate(185%) brightness(1.05);
  overflow: hidden;
}
/* 主对话列: 只保留极轻的玻璃——几乎透明,文字清晰优先 */
[class*="centerCol"] {
  position: relative;
  -webkit-backdrop-filter: blur(2px) saturate(135%) brightness(1.01);
  backdrop-filter: blur(2px) saturate(135%) brightness(1.01);
  overflow: hidden;
}

body:not([data-ds-dark-theme]) [class*="sidebarCol"],
body:not([data-ds-dark-theme]) [class*="rightbarCol"],
body:not([data-ds-dark-theme]) [class*="bottomRow"] {
  background: rgba(255, 255, 255, 0.10) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28),
    inset 0 -1px 0 rgba(255, 255, 255, 0.22),
    inset 0 0 0 1.5px rgba(150, 205, 255, 0.22),
    inset 0 0 0 2.5px rgba(255, 190, 120, 0.10),
    inset 0 0 28px rgba(255, 255, 255, 0.10),
    0 10px 40px rgba(8, 16, 30, 0.16);
}
body[data-ds-dark-theme] [class*="sidebarCol"],
body[data-ds-dark-theme] [class*="rightbarCol"],
body[data-ds-dark-theme] [class*="bottomRow"] {
  background: rgba(10, 18, 32, 0.14) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 0 0 1px rgba(255, 255, 255, 0.10),
    inset 0 0 0 1.5px rgba(120, 190, 255, 0.18),
    inset 0 0 0 2.5px rgba(232, 200, 122, 0.10),
    inset 0 0 30px rgba(120, 180, 255, 0.06),
    0 10px 40px rgba(0, 0, 0, 0.35);
}
/* 主对话列: 极淡底色 + 仅一条细边,几乎不遮挡壁纸 */
body:not([data-ds-dark-theme]) [class*="centerCol"] {
  background: rgba(255, 255, 255, 0.025) !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}
body[data-ds-dark-theme] [class*="centerCol"] {
  background: rgba(8, 14, 26, 0.05) !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
html[data-platform=darwin] [class*="sidebarCol"],
html[data-platform=darwin] [class*="centerCol"],
html[data-platform=darwin] [class*="rightbarCol"],
html[data-platform=darwin] [class*="bottomRow"] {
  background-image: none !important;
}
/* 玻璃面上的流光: 侧栏保留,主对话列只留极淡顶部光晕(避免影响阅读) */
[class*="sidebarCol"]::after,
[class*="rightbarCol"]::after,
[class*="bottomRow"]::after {
  content: "";
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background:
    radial-gradient(120% 55% at 10% -6%, rgba(255,255,255,0.30), rgba(255,255,255,0) 62%),
    linear-gradient(112deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) 46%, rgba(255,255,255,0) 58%),
    linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%);
  background-size: 100% 100%, 260% 100%, 100% 100%;
  background-position: 0 0, -120% 0, 0 0;
  animation: wt-glass-flow 11s ease-in-out infinite;
  opacity: 0.9;
}
[class*="centerCol"]::after {
  content: "";
  position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: radial-gradient(120% 40% at 50% -8%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%);
  opacity: 0.8;
}
body[data-ds-dark-theme] [class*="sidebarCol"]::after,
body[data-ds-dark-theme] [class*="rightbarCol"]::after,
body[data-ds-dark-theme] [class*="bottomRow"]::after {
  background:
    radial-gradient(120% 55% at 10% -6%, rgba(160,210,255,0.18), rgba(255,255,255,0) 62%),
    linear-gradient(112deg, rgba(255,255,255,0) 34%, rgba(200,230,255,0.10) 46%, rgba(255,255,255,0) 58%),
    linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%);
  background-size: 100% 100%, 260% 100%, 100% 100%;
  background-position: 0 0, -120% 0, 0 0;
  animation: wt-glass-flow 13s ease-in-out infinite;
  opacity: 0.85;
}
body[data-ds-dark-theme] [class*="centerCol"]::after {
  background: radial-gradient(120% 40% at 50% -8%, rgba(160,210,255,0.08), rgba(255,255,255,0) 60%);
  opacity: 0.7;
}
@keyframes wt-glass-flow {
  0%   { background-position: 0 0, -120% 0, 0 0; }
  55%  { background-position: 0 0, 120% 0, 0 0; }
  100% { background-position: 0 0, -120% 0, 0 0; }
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
  .wt-stars-1, .wt-stars-2, .wt-spiral { animation: none; }
}
`

			/* 挂载: 主题令牌 + 样式 + 动态壁纸视频 */
			ctx.effect(function () {
				const disposers = []
				try {
				disposers.push((themeSvc && themeSvc.overrideTokens ? themeSvc.overrideTokens('dsh-theme-wanderer', TOKENS) : function () {}))

				const styleEl = document.createElement('style')
				styleEl.setAttribute('data-plugin', 'dsh-theme-wanderer')
				styleEl.setAttribute('data-plugin-css', 'dsh-theme-wanderer')
				styleEl.textContent = CSS
				document.head.appendChild(styleEl)
				disposers.push(function () { try { styleEl.remove() } catch (err) {} })

				{
					const wrap = document.createElement('div')
					wrap.className = 'wt-bgmedia'
					const video = document.createElement('video')
					video.className = 'wt-bgvideo'
					;['muted', 'playsinline', 'webkit-playsinline', 'autoplay', 'loop', 'disableremoteplayback'].forEach(function (attr) {
						video.setAttribute(attr, '')
					})
					video.setAttribute('aria-hidden', 'true')
					/* 禁止画中画(PiP)/原生控件: Safari 可能把壁纸视频弹成左上角浮动小窗,
					   看起来就像"第二个壁纸" */
					try {
						video.disablePictureInPicture = true
						video.setAttribute('disablepictureinpicture', '')
						video.setAttribute('controlslist', 'nodownload noplaybackrate nopictureinpicture')
						video.controls = false
					} catch (err) {}
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
					const poster = document.createElement('img')
					poster.className = 'wt-bgposter'
					poster.alt = ''
					poster.src = '/wanderer-theme/wallpaper'
					wrap.appendChild(poster)
					wrap.appendChild(video)
					wrap.appendChild(scrim)
					/* 去重: 先清掉历史壁纸层,以及任何引用本主题壁纸资源的游离媒体元素 */
					try {
						const stale = document.querySelectorAll('.wt-bgmedia')
						for (const el of stale) { try { el.remove() } catch (err) {} }
						const strays = document.querySelectorAll('video, img, canvas, iframe')
						for (const el of strays) {
							let ref = ''
							try {
								ref = String(el.currentSrc || el.src || '')
								if (!ref && el.style && el.style.backgroundImage) ref = el.style.backgroundImage
							} catch (err) {}
							if (ref.indexOf('/wanderer-theme/') >= 0) { try { el.remove() } catch (err) {} }
						}
					} catch (err) {}
					/* 只挂在 body 下(绝不触碰 #root),插到最前以保证绘制顺序 */
					document.body.insertBefore(wrap, document.body.firstChild)
					/* video 直接作为壁纸本体;translateZ(0) 强制独立合成层,
					   避免 Retina 缩放下出现"半尺寸重复投射"的副本。 */
					video.style.opacity = '1'
					video.style.transform = 'translateZ(0)'
					video.style.webkitTransform = 'translateZ(0)'
					video.style.backfaceVisibility = 'hidden'
					const sizeWallpaper = function () {
						try {
							const w = window.innerWidth || 1440
							const h = window.innerHeight || 900
							wrap.style.width = w + 'px'
							wrap.style.height = h + 'px'
							wrap.style.left = '0px'
							wrap.style.top = '0px'
							video.style.width = w + 'px'
							video.style.height = h + 'px'
						} catch (err) {}
					}
					sizeWallpaper()
					window.addEventListener('resize', sizeWallpaper)
					document.addEventListener('visibilitychange', sizeWallpaper)
					disposers.push(function () {
						window.removeEventListener('resize', sizeWallpaper)
						document.removeEventListener('visibilitychange', sizeWallpaper)
					})
					wtStore.videoEl = video

					function tryPlay() {
						try {
							const p = video.play()
							if (p && p.catch) p.catch(function (err) {
								console.warn('[dsh-theme-wanderer] 视频自动播放被阻止:', (err && err.name) || 'unknown')
							})
						} catch (err) {}
					}
					;['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'stalled'].forEach(function (ev) {
						video.addEventListener(ev, function () { if (video.paused) tryPlay() })
					})
					video.addEventListener('error', function () { console.error('[dsh-theme-wanderer] 视频元素错误:', video.error && video.error.code) })
					if (document.pictureInPictureElement === video && document.exitPictureInPicture) {
						try { document.exitPictureInPicture() } catch (err) {}
					}
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

					try { video.load() } catch (err) {}

					/* 未播放时显示可点击提示(自动隐藏) */
					const hint = document.createElement('button')
					hint.type = 'button'
					hint.className = 'wt-video-hint'
					hint.textContent = '▶ 点击播放动态壁纸'
					hint.style.display = 'none'
					document.body.appendChild(hint)
					hint.addEventListener('click', function () { tryPlay() })
					function syncHint() {
						const needs = video.paused || video.readyState < 2
						hint.style.display = needs ? 'block' : 'none'
					}
					const hintTimer = window.setInterval(syncHint, 1200)
					disposers.push(function () { window.clearInterval(hintTimer); try { hint.remove() } catch (err) {} })

					tryPlay()
					window.setTimeout(syncHint, 3000)
					window.setTimeout(syncHint, 9000)
					disposers.push(function () {
						try { video.pause() } catch (err) {}
						try { video.removeAttribute('src') } catch (err) {}
						try { wrap.remove() } catch (err) {}
						wtStore.videoEl = null
					})
				}

				document.body.classList.toggle('wt-composer-glass', !!wtStore.prefs.composer)
				wtApplyVideoPref()

				} catch (err) {
					console.error('[dsh-theme-wanderer] 壁纸挂载失败(不影响界面启动):', err)
				}
				return function () { for (const d of disposers) { try { d() } catch (err) {} } }
			})

			slotsSvc.inject('shell.overlay', function () {
				return slotsSvc.register(
					{ name: 'shell.overlay', id: 'wanderer-theme-layer', order: -100 },
					function () { return React.createElement(WandererLayer) },
				)
			})

			slotsSvc.inject('settings.section', function () {
				return slotsSvc.register(
					{ name: 'settings.section', id: 'wanderer-theme', order: 25, label: '原神流浪者主题美化' },
					function () { return React.createElement(SettingsPanel) },
				)
			})

			console.log('[dsh-theme-wanderer] v' + THEME_VERSION + ' 已挂载: 液态玻璃 + 动态壁纸')
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

			/* ===== 自检与诊断(精简版) ===== */
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
						fetch('/wanderer-theme/health').then(function (r) { return r.json() }).catch(function () { return { ok: false } }),
						fetch('/wanderer-theme/wallpaper-video', { method: 'HEAD' }).then(function (r) { return r.status }).catch(function () { return 0 }),
						fetch('/wanderer-theme/wallpaper', { method: 'HEAD' }).then(function (r) { return r.status }).catch(function () { return 0 }),
					]).then(function (parts) {
						const v = wtStore.videoEl
						setResult({
							version: THEME_VERSION,
							mode: document.body.hasAttribute('data-ds-dark-theme') ? '深色' : '浅色',
							health: !!(parts[0] && parts[0].ok),
							video: parts[1] === 200,
							poster: parts[2] === 200,
							playing: !!(v && !v.paused && v.readyState >= 2 && !v.error),
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
							diagRow('主题版本', true, result.version + ' · ' + result.mode),
							diagRow('壁纸服务', result.health && result.video, result.health && result.video ? '视频与海报均可访问' : '服务异常'),
							diagRow('动态播放', result.playing, result.playing ? '正在播放' : '未播放'),
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
					['frame', '卷轴边框', '全屏鎏金卷轴边框与八瓣金莲角饰'],
					['ribbons', '绸带滚边', '左右紫色绳穗与青绸装饰线'],
					['composer', '输入框玻璃', '输入框使用侧栏同款玻璃；若输入框异常可关闭此项恢复原样'],
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
