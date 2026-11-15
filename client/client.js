window.__ModuleLoader__.load({ id: "dsh-theme-wanderer", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");

		/* ===== 原神流浪者主题美化 · 共享状态 ===== */
		const wtStore = {
			open: false,
			listeners: new Set(),
			prefs: { video: true, stars: true, wind: true, frame: true, ribbons: true, dock: true },
			prefsListeners: new Set(),
			videoEl: null,
			mediaWrap: null,
		}
		function wtSetPanel(next) {
			if (wtStore.open === next) return
			wtStore.open = next
			wtStore.listeners.forEach(function (fn) { fn(next) })
		}
		function wtUsePanel() {
			const [open, setOpen] = React.useState(wtStore.open)
			React.useEffect(function () {
				const fn = function (v) { setOpen(v) }
				wtStore.listeners.add(fn)
				return function () { wtStore.listeners.delete(fn) }
			}, [])
			return [open, wtSetPanel]
		}
		function wtApplyVideoPref() {
			const on = !!wtStore.prefs.video
			document.body.classList.toggle('wt-video-off', !on)
			const v = wtStore.videoEl
			if (!v) return
			if (on) { try { v.play().catch(function () {}) } catch (e) {} } else { try { v.pause() } catch (e) {} }
		}
		function wtSetPref(key, value) {
			wtStore.prefs[key] = !!value
			if (key === 'video') wtApplyVideoPref()
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

		const name = "dsh-theme-wanderer"
		const inject = ["slots", "theme"]
		const THEME_VERSION = '3.0.0'

		function apply(ctx) {
			const TOKENS = {
				'--dsw-alias-bg-base': { light: 'rgba(246, 250, 255, 0.34)', dark: 'rgba(9, 16, 30, 0.32)' },
				'--dsw-alias-bg-layer-1': { light: 'rgba(250, 252, 255, 0.55)', dark: 'rgba(18, 30, 50, 0.42)' },
				'--dsw-alias-bg-layer-2': { light: 'rgba(240, 246, 252, 0.46)', dark: 'rgba(24, 40, 64, 0.36)' },
				'--dsw-alias-bg-overlay': { light: 'rgba(240, 246, 252, 0.93)', dark: 'rgba(14, 24, 42, 0.93)' },
				'--dsw-alias-border-l1': { light: 'rgba(255, 255, 255, 0.55)', dark: 'rgba(255, 255, 255, 0.10)' },
				'--dsw-alias-border-l2': { light: 'rgba(168, 138, 82, 0.55)', dark: 'rgba(212, 175, 106, 0.40)' },
				'--dsw-alias-brand-primary': { light: '#2f93c4', dark: '#6fc3e8' },
				'--dsw-alias-label-primary': { light: '#16283c', dark: '#f4efe4' },
				'--dsw-alias-label-secondary': { light: '#3c5468', dark: '#a9bdd2' },
				'--dsw-alias-state-error-primary': { light: '#c94f4f', dark: '#e27373' },
				'--dsw-alias-state-success-primary': { light: '#1e9c80', dark: '#4ecbb2' },
				'--dsw-alias-state-warn-primary': { light: '#b8862f', dark: '#e0b862' },
				'--dsw-specific-sidebar-fill': { light: 'rgba(255, 255, 255, 0.30)', dark: 'rgba(10, 20, 36, 0.30)' },
			}

			const CSS = `
/* ===== 原神流浪者主题美化 v3: 动态壁纸 + iOS 27 液态玻璃 ===== */
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
.wt-bgmedia { position: fixed; inset: 0; z-index: -2; pointer-events: none; overflow: hidden; background: #0a1424; transition: opacity 0.8s ease; }
.wt-bgvideo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.wt-bgscrim { position: absolute; inset: 0; background: linear-gradient(rgba(10, 16, 30, 0.40), rgba(10, 16, 30, 0.52)); }
body:not([data-ds-dark-theme]) .wt-bgscrim { background: linear-gradient(rgba(245, 249, 255, 0.18), rgba(240, 246, 252, 0.26)); }
body.wt-video-off .wt-bgmedia { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .wt-bgvideo { display: none; } }

/* ===== iOS 27 液态玻璃: 应用主列 ===== */
[class*="sidebarCol"], [class*="rightbarCol"], [class*="bottomRow"] {
  backdrop-filter: blur(30px) saturate(190%) brightness(1.03);
  -webkit-backdrop-filter: blur(30px) saturate(190%) brightness(1.03);
}
[class*="centerCol"] {
  backdrop-filter: blur(22px) saturate(170%);
  -webkit-backdrop-filter: blur(22px) saturate(170%);
}
body:not([data-ds-dark-theme]) [class*="sidebarCol"],
body:not([data-ds-dark-theme]) [class*="rightbarCol"],
body:not([data-ds-dark-theme]) [class*="bottomRow"] {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72), inset 0 -1px 0 rgba(15, 30, 60, 0.05), 0 10px 34px rgba(31, 42, 68, 0.10);
}
body[data-ds-dark-theme] [class*="sidebarCol"],
body[data-ds-dark-theme] [class*="rightbarCol"],
body[data-ds-dark-theme] [class*="bottomRow"] {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.35), 0 10px 34px rgba(0, 0, 0, 0.40);
}
body:not([data-ds-dark-theme]) [class*="centerCol"] { box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.5); }
body[data-ds-dark-theme] [class*="centerCol"] { box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.08); }

/* 青绸滚动条 */
* { scrollbar-color: #5aa9c6 rgba(18, 30, 52, 0.28); scrollbar-width: thin; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: rgba(18, 30, 52, 0.22); border-radius: 8px; }
*::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8fd4ef, #3fa9c9 55%, #9b7bd4);
  border-radius: 8px;
  border: 1px solid rgba(232, 200, 122, 0.4);
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.25);
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
    radial-gradient(1.6px 1.6px at 20% 30%, rgba(255, 255, 255, 0.85), transparent 55%),
    radial-gradient(1.2px 1.2px at 68% 18%, rgba(143, 212, 239, 0.95), transparent 55%),
    radial-gradient(1.8px 1.8px at 45% 74%, rgba(232, 200, 122, 0.85), transparent 55%),
    radial-gradient(1.3px 1.3px at 88% 62%, rgba(155, 123, 212, 0.95), transparent 55%),
    radial-gradient(1.5px 1.5px at 8% 82%, rgba(255, 255, 255, 0.75), transparent 55%);
  background-size: 550px 550px, 430px 430px, 640px 640px, 520px 520px, 380px 380px;
  animation: wt-twinkle 7s ease-in-out infinite;
}
.wt-stars-2 {
  background-image:
    radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.6), transparent 55%),
    radial-gradient(1.4px 1.4px at 30% 60%, rgba(111, 195, 232, 0.65), transparent 55%);
  background-size: 300px 300px, 460px 460px;
  animation: wt-twinkle 9s ease-in-out infinite reverse;
}
@keyframes wt-twinkle { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.5; } }

.wt-grain {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.10;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E");
}

.wt-wind { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; }

/* ===== 卷轴边框 ===== */
.wt-frame {
  position: fixed; inset: 10px; pointer-events: none; border-radius: 18px;
  border: 1px solid rgba(232, 200, 122, 0.22);
  box-shadow: inset 0 0 0 1px rgba(111, 195, 232, 0.06), inset 0 0 44px rgba(8, 14, 26, 0.18);
}

/* ===== 绳穗青绸滚边 ===== */
.wt-edge { position: fixed; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; opacity: 0.46; }
.wt-edge-l { left: 13px; }
.wt-edge-r { right: 13px; }
.wt-edge-line { width: 2px; border-radius: 2px; background: linear-gradient(180deg, #8fd4ef, #e8c87a 50%, #9b7bd4); box-shadow: 0 0 8px rgba(143, 212, 239, 0.5); }
.wt-edge-l .wt-edge-line { height: 22vh; }
.wt-edge-r .wt-edge-line { height: 13vh; }
.wt-edge-tassel { width: 10px; height: 26px; background: linear-gradient(180deg, rgba(155, 123, 212, 0.9), rgba(111, 195, 232, 0.9)); clip-path: polygon(50% 0, 100% 30%, 62% 48%, 100% 62%, 50% 100%, 0 62%, 38% 48%, 0 30%); }

/* ===== 液态玻璃卡片 ===== */
.wt-card {
  position: relative;
  background: rgba(248, 251, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.65);
  outline: 1px solid rgba(212, 175, 106, 0.35);
  outline-offset: 3px;
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(232, 200, 122, 0.10),
    0 22px 50px rgba(15, 30, 60, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.85),
    inset 0 -1px 0 rgba(15, 30, 60, 0.05),
    inset 0 0 30px rgba(111, 195, 232, 0.05);
  backdrop-filter: blur(40px) saturate(200%) brightness(1.04);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.04);
}
body[data-ds-dark-theme] .wt-card {
  background: rgba(16, 28, 48, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 0 0 1px rgba(232, 200, 122, 0.14),
    0 22px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    inset 0 -1px 0 rgba(0, 0, 0, 0.35),
    inset 0 0 30px rgba(111, 195, 232, 0.06);
}
.wt-corner { position: absolute; opacity: 0.85; pointer-events: none; }
.wt-corner-tl { top: -10px; left: -10px; transform: rotate(10deg); }
.wt-corner-tr { top: -10px; right: -10px; transform: rotate(100deg); }
.wt-corner-bl { bottom: -10px; left: -10px; transform: rotate(-80deg); }
.wt-corner-br { bottom: -10px; right: -10px; transform: rotate(-170deg); }

/* 标题鎏金描边 */
.wt-title { font-weight: 700; color: #5b4a1f; letter-spacing: 0.12em; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 14px rgba(232, 200, 122, 0.35); }
body[data-ds-dark-theme] .wt-title { color: #f8efdb; text-shadow: 0 0 2px rgba(212, 175, 106, 0.9), 0 0 18px rgba(232, 200, 122, 0.5); }
.wt-title-sub { font-size: 10px; color: rgba(90, 110, 130, 0.85); letter-spacing: 0.34em; }
body[data-ds-dark-theme] .wt-title-sub { color: rgba(233, 214, 178, 0.7); }

/* 绸带分割线 */
.wt-divider { position: relative; height: 2px; margin: 14px 8px; background: linear-gradient(90deg, transparent, #8fd4ef 12%, #e8c87a 50%, #9b7bd4 88%, transparent); }
.wt-divider::before, .wt-divider::after { content: ""; position: absolute; top: 50%; width: 8px; height: 8px; transform: translateY(-50%) rotate(45deg); background: rgba(232, 200, 122, 0.95); box-shadow: 0 0 8px rgba(232, 200, 122, 0.8); }
.wt-divider::before { left: -2px; }
.wt-divider::after { right: -2px; }

/* 侧栏 · 个人中心入口 */
.wt-trigger {
  display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid rgba(212, 175, 106, 0.42); background: rgba(255, 255, 255, 0.22); color: #2c3e52; font-size: 12px;
  letter-spacing: 0.12em; transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(18px) saturate(170%);
  -webkit-backdrop-filter: blur(18px) saturate(170%);
}
body[data-ds-dark-theme] .wt-trigger { background: rgba(20, 36, 60, 0.35); color: rgba(244, 239, 228, 0.92); }
.wt-trigger:hover { border-color: rgba(232, 200, 122, 0.85); box-shadow: 0 0 14px rgba(232, 200, 122, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.55); }
.wt-trigger .wt-spiral { width: 0; opacity: 0; transition: width 0.25s ease, opacity 0.25s ease; }
.wt-trigger:hover .wt-spiral { width: 16px; opacity: 1; animation: wt-spin 1.2s linear infinite; }

@keyframes wt-spin { to { transform: rotate(360deg); } }

/* ===== 个人中心 · 浪客座 ===== */
.wt-panel-backdrop { position: fixed; inset: 0; pointer-events: auto; background: rgba(8, 14, 26, 0.38); backdrop-filter: blur(6px); animation: wt-fade 0.3s ease both; }
.wt-panel {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(660px, 92vw); max-height: 88vh; overflow: auto;
  pointer-events: auto; padding: 22px 24px; animation: wt-glass-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes wt-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes wt-glass-in { from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); filter: blur(8px); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); } }
.wt-close { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(212, 175, 106, 0.5); background: rgba(255, 255, 255, 0.35); color: #2c3e52; cursor: pointer; font-size: 14px; line-height: 1; }
body[data-ds-dark-theme] .wt-close { background: rgba(13, 26, 48, 0.6); color: rgba(244, 239, 228, 0.85); }
.wt-close:hover { box-shadow: 0 0 12px rgba(232, 200, 122, 0.45); }
.wt-panel-head { display: flex; align-items: center; gap: 12px; }
.wt-panel-head .wt-spiral { animation: wt-spin 14s linear infinite; }
.wt-panel-body { display: grid; grid-template-columns: 196px 1fr; gap: 16px; align-items: start; }
@media (max-width: 520px) { .wt-panel-body { grid-template-columns: 1fr; } }
.wt-portrait-box { position: relative; }
.wt-portrait { position: relative; width: 100%; height: 264px; object-fit: cover; border-radius: 14px; border: 1px solid rgba(232, 200, 122, 0.6); box-shadow: inset 0 0 14px rgba(232, 200, 122, 0.16), 0 8px 20px rgba(4, 10, 24, 0.25); }
.wt-info { display: flex; flex-direction: column; gap: 9px; }
.wt-info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.wt-info-label { width: 62px; flex: none; color: rgba(70, 90, 112, 0.85); letter-spacing: 0.1em; }
body[data-ds-dark-theme] .wt-info-label { color: rgba(169, 189, 210, 0.8); }
.wt-info-value { color: #16283c; }
body[data-ds-dark-theme] .wt-info-value { color: #f4efe4; }
.wt-quote { margin-top: 4px; font-style: italic; font-size: 12px; line-height: 1.7; color: rgba(90, 78, 50, 0.9); border-left: 2px solid rgba(232, 200, 122, 0.65); padding-left: 10px; }
body[data-ds-dark-theme] .wt-quote { color: rgba(233, 214, 178, 0.85); }

/* 四重名号 */
.wt-names-head { display: flex; align-items: baseline; gap: 10px; }
.wt-names { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
@media (max-width: 560px) { .wt-names { grid-template-columns: repeat(2, 1fr); } }
.wt-name-card { position: relative; }
.wt-name-img { position: relative; height: 110px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(212, 175, 106, 0.5); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5); }
.wt-name-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.wt-name-cap { margin-top: 6px; font-size: 13px; color: #5b4a1f; text-align: center; letter-spacing: 0.2em; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6); }
body[data-ds-dark-theme] .wt-name-cap { color: #f6ecd8; text-shadow: 0 0 6px rgba(232, 200, 122, 0.5); }
.wt-name-note { font-size: 10px; color: rgba(70, 90, 112, 0.8); text-align: center; letter-spacing: 0.08em; }
body[data-ds-dark-theme] .wt-name-note { color: rgba(169, 189, 210, 0.7); }

/* 命之座 */
.wt-const { margin-top: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.wt-const-label { display: flex; align-items: baseline; gap: 10px; }
.wt-const-svg { width: 100%; max-width: 300px; }
.wt-const-name { min-height: 20px; font-size: 12px; color: rgba(140, 108, 40, 0.95); letter-spacing: 0.08em; }
body[data-ds-dark-theme] .wt-const-name { color: rgba(232, 200, 122, 0.95); }
.wt-const-progress { display: flex; gap: 18px; font-size: 11px; color: rgba(70, 90, 112, 0.8); }
body[data-ds-dark-theme] .wt-const-progress { color: rgba(169, 189, 210, 0.75); }

.wt-foot { margin-top: 12px; text-align: center; font-size: 11px; color: rgba(70, 90, 112, 0.7); letter-spacing: 0.1em; }
body[data-ds-dark-theme] .wt-foot { color: rgba(169, 189, 210, 0.65); }

/* ===== 风语题签 ===== */
.wt-dock { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 2px 0 3px; opacity: 0.75; pointer-events: none; color: #3a4a5e; font-size: 12px; letter-spacing: 0.3em; }
body[data-ds-dark-theme] .wt-dock { color: rgba(244, 239, 228, 0.85); }
.wt-dock .wt-spiral { animation: wt-spin 9s linear infinite; }

/* ===== 设置页 ===== */
.wt-settings { display: flex; flex-direction: column; gap: 2px; }
.wt-settings-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.wt-set-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 4px; border-bottom: 1px solid rgba(212, 175, 106, 0.16); }
.wt-set-label { font-size: 13px; color: #16283c; letter-spacing: 0.06em; }
body[data-ds-dark-theme] .wt-set-label { color: #f4efe4; }
.wt-set-desc { font-size: 11px; color: rgba(70, 90, 112, 0.8); margin-top: 2px; }
body[data-ds-dark-theme] .wt-set-desc { color: rgba(169, 189, 210, 0.7); }
.wt-switch { width: 44px; height: 24px; border-radius: 999px; background: rgba(120, 140, 165, 0.35); border: 1px solid rgba(212, 175, 106, 0.35); position: relative; cursor: pointer; transition: background 0.25s ease, box-shadow 0.25s ease; flex: none; }
.wt-switch-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: rgba(255, 255, 255, 0.92); transition: left 0.25s ease, background 0.25s ease; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35); }
.wt-switch-on { background: linear-gradient(90deg, rgba(63, 169, 201, 0.9), rgba(111, 195, 232, 0.9)); box-shadow: 0 0 12px rgba(111, 195, 232, 0.5); }
.wt-switch-on .wt-switch-knob { left: 23px; background: #ffffff; }

/* ===== 自检与诊断 ===== */
.wt-diag { display: flex; flex-direction: column; gap: 6px; }
.wt-diag-head { display: flex; align-items: center; justify-content: space-between; }
.wt-diag-btn { padding: 4px 10px; font-size: 11px; border-radius: 999px; border: 1px solid rgba(212, 175, 106, 0.5); background: rgba(255, 255, 255, 0.28); color: #2c3e52; cursor: pointer; letter-spacing: 0.1em; }
body[data-ds-dark-theme] .wt-diag-btn { background: rgba(20, 36, 60, 0.4); color: rgba(244, 239, 228, 0.85); }
.wt-diag-btn:hover { box-shadow: 0 0 10px rgba(232, 200, 122, 0.4); }
.wt-diag-row { display: flex; align-items: baseline; gap: 8px; font-size: 12px; line-height: 1.6; }
.wt-diag-mark { flex: none; width: 14px; text-align: center; }
.wt-diag-ok { color: #1e9c80; text-shadow: 0 0 8px rgba(30, 156, 128, 0.4); }
.wt-diag-bad { color: #c94f4f; text-shadow: 0 0 8px rgba(201, 79, 79, 0.4); }
.wt-diag-label { flex: none; width: 96px; color: rgba(90, 78, 50, 0.9); letter-spacing: 0.08em; }
body[data-ds-dark-theme] .wt-diag-label { color: rgba(233, 214, 178, 0.85); }
.wt-diag-detail { color: rgba(70, 90, 112, 0.85); word-break: break-all; }
body[data-ds-dark-theme] .wt-diag-detail { color: rgba(169, 189, 210, 0.75); }
.wt-diag-foot { font-size: 10px; color: rgba(70, 90, 112, 0.6); margin-top: 4px; letter-spacing: 0.06em; }
body[data-ds-dark-theme] .wt-diag-foot { color: rgba(169, 189, 210, 0.55); }

/* ===== 版权与来源 ===== */
.wt-copy { display: flex; flex-direction: column; gap: 5px; }
.wt-copy-title { font-size: 12px; font-weight: 600; color: #5b4a1f; letter-spacing: 0.14em; }
body[data-ds-dark-theme] .wt-copy-title { color: #f6ecd8; }
.wt-copy-text { font-size: 11px; line-height: 1.75; color: rgba(70, 90, 112, 0.85); }
body[data-ds-dark-theme] .wt-copy-text { color: rgba(169, 189, 210, 0.75); }

@media (prefers-reduced-motion: reduce) {
  .wt-stars-1, .wt-stars-2, .wt-spiral, .wt-panel-head .wt-spiral, .wt-dock .wt-spiral { animation: none; }
  .wt-wind { display: none; }
  .wt-panel { animation: none; }
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

				const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
				if (!reduceMotion) {
					const wrap = document.createElement('div')
					wrap.className = 'wt-bgmedia'
					const video = document.createElement('video')
					video.className = 'wt-bgvideo'
					video.setAttribute('muted', '')
					video.setAttribute('playsinline', '')
					video.setAttribute('aria-hidden', 'true')
					video.muted = true
					video.loop = true
					video.autoplay = true
					video.preload = 'auto'
					video.poster = '/wanderer-theme/wallpaper'
					video.src = '/wanderer-theme/wallpaper-video'
					const scrim = document.createElement('div')
					scrim.className = 'wt-bgscrim'
					wrap.appendChild(video)
					wrap.appendChild(scrim)
					document.body.appendChild(wrap)
					wtStore.videoEl = video
					wtStore.mediaWrap = wrap
					try { video.play().catch(function () {}) } catch (err) {}
					disposers.push(function () {
						try { video.pause() } catch (err) {}
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
					function (props) {
						return React.createElement(WandererLayer, { useSessions: props.useSessions })
					},
				)
			})

			ctx.slots.inject('sidebar.footer.action', function () {
				return ctx.slots.register(
					{ name: 'sidebar.footer.action', id: 'wanderer-profile', order: 20, label: '浪客座' },
					function () { return React.createElement(ProfileTrigger) },
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

			/* 启动自检(浏览器控制台) */
			console.log('[dsh-theme-wanderer] v' + THEME_VERSION + ' 已挂载: 动态壁纸视频 + iOS 27 液态玻璃')
			try {
				fetch('/wanderer-theme/wallpaper-video', { method: 'HEAD' }).then(function (r) {
					console.log('[dsh-theme-wanderer] 动态壁纸自检 HTTP', r.status, r.headers.get('content-type') || '', r.headers.get('content-length') || '')
				}).catch(function (e) {
					console.error('[dsh-theme-wanderer] 动态壁纸自检失败:', e)
				})
			} catch (err) {
				console.error('[dsh-theme-wanderer] 自检异常:', err)
			}

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
					style: props.glow ? { filter: 'drop-shadow(0 0 4px rgba(232,200,122,0.8))' } : undefined,
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
					React.createElement('div', { className: 'wt-corner wt-corner-tl' }, React.createElement(Lotus, { size: 30 })),
					React.createElement('div', { className: 'wt-corner wt-corner-tr' }, React.createElement(Lotus, { size: 30 })),
					React.createElement('div', { className: 'wt-corner wt-corner-bl' }, React.createElement(Lotus, { size: 30 })),
					React.createElement('div', { className: 'wt-corner wt-corner-br' }, React.createElement(Lotus, { size: 30 })),
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

			/* ===== 命之座名称 ===== */
			const CONST_NAMES = ['初番·茂风流羽行', '二番·箙岛月白波', '三番·久世舞夕颜', '四番·花月歌浮舟', '五番·今昔渡来殿', '末番·暮空遮雨']

			/* ===== 命之座(个人中心内) ===== */
			function Constellation(props) {
				const lit = props.lit
				const sessionCount = props.sessionCount
				const [hover, setHover] = React.useState(-1)
				const NODES = [[26, 96], [64, 46], [112, 20], [160, 46], [198, 96], [156, 124]]
				const ROMANS = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ']
				const lines = []
				for (let i = 0; i < NODES.length - 1; i++) {
					const a = NODES[i]
					const b = NODES[i + 1]
					const on = lit >= i + 2
					lines.push(React.createElement('line', {
						key: 'l' + i,
						x1: a[0], y1: a[1], x2: b[0], y2: b[1],
						stroke: on ? 'rgba(232,200,122,0.9)' : 'rgba(143,212,239,0.3)',
						strokeWidth: on ? 1.6 : 1,
						strokeDasharray: on ? undefined : '3 3',
					}))
				}
				const stars = NODES.map(function (p, i) {
					const on = lit >= i + 1
					return React.createElement('g', {
						key: 's' + i,
						onMouseEnter: function () { setHover(i) },
						onMouseLeave: function () { setHover(-1) },
						style: { cursor: 'default' },
					},
						React.createElement('circle', { cx: p[0], cy: p[1], r: 13, fill: 'rgba(255,255,255,0.28)' }),
						React.createElement(StarShape, { x: p[0], y: p[1], r: on ? 9 : 7, fill: on ? 'rgba(232,200,122,0.95)' : 'rgba(143,212,239,0.4)', stroke: on ? 'rgba(255,240,200,0.9)' : 'rgba(143,212,239,0.5)', glow: on }),
						React.createElement('text', { x: p[0], y: p[1] + 30, textAnchor: 'middle', fontSize: 9, fill: 'rgba(70,90,112,0.8)' }, ROMANS[i]),
						React.createElement('title', null, CONST_NAMES[i]),
					)
				})
				return React.createElement('div', { className: 'wt-const' },
					React.createElement('div', { className: 'wt-const-label' },
						React.createElement('span', { className: 'wt-title' }, '命之座 · 浪客座'),
						React.createElement('span', { className: 'wt-title-sub' }, 'PEREGRINUS'),
					),
					React.createElement('svg', { viewBox: '0 0 224 160', className: 'wt-const-svg' }, lines.concat(stars)),
					React.createElement('div', { className: 'wt-const-name' }, hover >= 0 ? CONST_NAMES[hover] : '风之记忆 · 已点亮 ' + lit + ' 座'),
					React.createElement('div', { className: 'wt-const-progress' },
						React.createElement('span', null, '风之旅程 · ' + sessionCount + ' 次对话'),
						React.createElement('span', null, '命座点亮 ' + lit + ' / 6'),
					),
				)
			}

			/* ===== 个人中心 ===== */
			function InfoRow(props) {
				return React.createElement('div', { className: 'wt-info-row' },
					React.createElement('span', { className: 'wt-info-label' }, props.label),
					props.icon ? props.icon : null,
					React.createElement('span', { className: 'wt-info-value' }, props.value),
				)
			}
			function NameCard(props) {
				return React.createElement('div', { className: 'wt-name-card' },
					React.createElement('div', { className: 'wt-name-img' },
						React.createElement('img', { src: props.src, alt: '' }),
						React.createElement('div', { className: 'wt-corner wt-corner-tl' }, React.createElement(Lotus, { size: 16 })),
						React.createElement('div', { className: 'wt-corner wt-corner-br' }, React.createElement(Lotus, { size: 16 })),
					),
					React.createElement('div', { className: 'wt-name-cap' }, props.name),
					React.createElement('div', { className: 'wt-name-note' }, props.note),
				)
			}
			function ProfilePanel(props) {
				const sessionCount = props.sessionCount
				React.useEffect(function () {
					function onKey(e) { if (e.key === 'Escape') props.onClose() }
					window.addEventListener('keydown', onKey)
					return function () { window.removeEventListener('keydown', onKey) }
				}, [])
				return React.createElement('div', { className: 'wt-panel-wrap' },
					React.createElement('div', { className: 'wt-panel-backdrop', onClick: props.onClose }),
					React.createElement('div', { className: 'wt-panel wt-card', role: 'dialog', 'aria-label': '流浪者个人中心 · 浪客座' },
						React.createElement('button', { type: 'button', className: 'wt-close', onClick: props.onClose, 'aria-label': '关闭' }, '✕'),
						React.createElement('div', { className: 'wt-panel-head' },
							React.createElement(VisionStar, { size: 26 }),
							React.createElement('div', null,
								React.createElement('div', { className: 'wt-title' }, '久世浮倾 · 流浪者'),
								React.createElement('div', { className: 'wt-title-sub' }, 'WANDERER · PEREGRINUS'),
							),
							React.createElement(Spiral, { size: 22 }),
						),
						React.createElement(Ribbon),
						React.createElement('div', { className: 'wt-panel-body' },
							React.createElement('div', { className: 'wt-portrait-box' },
								React.createElement('img', { className: 'wt-portrait', src: '/wanderer-theme/portrait', alt: '流浪者立绘' }),
								React.createElement('div', { className: 'wt-corner wt-corner-tl' }, React.createElement(Lotus, { size: 26 })),
								React.createElement('div', { className: 'wt-corner wt-corner-tr' }, React.createElement(Lotus, { size: 26 })),
								React.createElement('div', { className: 'wt-corner wt-corner-bl' }, React.createElement(Lotus, { size: 26 })),
								React.createElement('div', { className: 'wt-corner wt-corner-br' }, React.createElement(Lotus, { size: 26 })),
							),
							React.createElement('div', { className: 'wt-info' },
								React.createElement(InfoRow, { label: '称号', value: '久世浮倾' }),
								React.createElement(InfoRow, { label: '神之眼', value: '风', icon: React.createElement(VisionStar, { size: 15 }) }),
								React.createElement(InfoRow, { label: '命之座', value: '浪客座' }),
								React.createElement(InfoRow, { label: '武器', value: '法器' }),
								React.createElement(InfoRow, { label: '诞生之地', value: '稻妻 · 借景之馆' }),
								React.createElement(InfoRow, { label: '所属', value: '无' }),
								React.createElement('div', { className: 'wt-quote' }, '「我们终将重逢,但不是这里,不是现在。」'),
							),
						),
						React.createElement(Ribbon),
						React.createElement('div', { className: 'wt-names-head' },
							React.createElement('span', { className: 'wt-title' }, '四重名号'),
							React.createElement('span', { className: 'wt-title-sub' }, 'KUNIKUZUSHI · KABUKIMONO · SCARAMOUCHE · WANDERER'),
						),
						React.createElement('div', { className: 'wt-names' },
							React.createElement(NameCard, { src: '/wanderer-theme/art3', name: '国崩', note: '雷电将军所造之躯' }),
							React.createElement(NameCard, { src: '/wanderer-theme/art7', name: '倾奇者', note: '踏鞴砂上的浪人' }),
							React.createElement(NameCard, { src: '/wanderer-theme/art6', name: '散兵', note: '愚人众第六席' }),
							React.createElement(NameCard, { src: '/wanderer-theme/art8', name: '流浪者', note: '风中的自由之翼' }),
						),
						React.createElement(Ribbon),
						React.createElement(Constellation, { lit: Math.min(6, sessionCount), sessionCount: sessionCount }),
						React.createElement('div', { className: 'wt-foot' }, '原神流浪者主题美化 ｜ 命之座「浪客座」视觉包装 ｜ 常驻主题插件 · dsh-theme-wanderer'),
					),
				)
			}

			/* ===== 侧栏入口 ===== */
			function ProfileTrigger() {
				const [open] = wtUsePanel()
				return React.createElement('div', {
					className: 'wt-trigger',
					role: 'button',
					tabIndex: 0,
					title: '个人中心 · 浪客座',
					'aria-label': '打开流浪者个人中心',
					onClick: function () { wtSetPanel(!open) },
					onKeyDown: function (e) {
						if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wtSetPanel(!open) }
					},
				},
					React.createElement(VisionStar, { size: 17 }),
					React.createElement('span', null, '浪客座'),
					React.createElement(Spiral, { size: 16 }),
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
					]).then(function (parts) {
						const health = parts[0]
						const video = parts[1]
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
						setResult({
							version: THEME_VERSION,
							mode: document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light',
							platform: document.documentElement.getAttribute('data-platform') || 'unknown',
							healthOk: !!(health && health.ok),
							healthDetail: health && health.ok
								? ('素材 ' + Object.keys(health.assets || {}).length + ' 项 · 视频 ' + (health.video && health.video.ok ? (health.video.bytes + ' B') : '不可用'))
								: ('health 失败: ' + ((health && health.error) || '未知')),
							videoOk: video.status === 200 && video.type.indexOf('video') >= 0,
							videoDetail: video.status === 200 ? (video.status + ' ' + video.type) : ('HTTP ' + (video.status || 0) + ' ' + (video.error || '')),
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
							diagRow('素材与视频服务', result.healthOk, result.healthDetail),
							diagRow('动态壁纸视频', result.videoOk, result.videoDetail),
							diagRow('主题令牌已注入', result.tokenApplied, result.tokenApplied ? '--dsw-alias-bg-base 为玻璃半透明' : '未检测到主题令牌'),
							diagRow('液态玻璃已生效', result.glass, result.glass ? '主列 backdrop-filter 已应用' : '未检测到 backdrop-filter'),
							React.createElement('div', { className: 'wt-diag-foot' }, '自检时间 ' + result.time + ' · 若任一项为 ✗,请查看终端 [dsh-theme-wanderer] 日志或 README 排查章节'),
						)
						: React.createElement('div', { className: 'wt-diag-foot' }, '自检运行中…'),
				)
			}

			/* ===== 版权与来源 ===== */
			function CopyrightBlock() {
				return React.createElement('div', { className: 'wt-copy' },
					React.createElement('div', { className: 'wt-copy-title' }, '版权与来源'),
					React.createElement('div', { className: 'wt-copy-text' }, '动态壁纸视频《16-10(4K)》由主题使用者本人于 Bilibili 小店向画师购买授权，版权归原作者所有。'),
					React.createElement('div', { className: 'wt-copy-text' }, '本插件不包含该视频与任何《原神》角色素材，仅在本机读取本地文件用于个人界面美化，不随插件分发。'),
					React.createElement('div', { className: 'wt-copy-text' }, '《原神》角色形象与美术素材版权归 miHoYo / HoYoverse 所有；本主题为非官方粉丝作品。'),
				)
			}

			function SettingsPanel() {
				const prefs = wtUsePrefs()
				const ITEMS = [
					['video', '动态壁纸', '视频壁纸(暂停后使用静态海报)'],
					['stars', '星空星尘', '壁纸上的双层闪烁星尘'],
					['wind', '风元素粒子', '流动的风之微尘 · 四芒星 · 螺旋 · 风痕'],
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
					React.createElement(Ribbon),
					React.createElement('div', { className: 'wt-foot' }, '设置仅保存在内存中 · 页面刷新后恢复默认'),
				)
			}

			/* ===== 全局图层 ===== */
			function WandererLayer(props) {
				const useSessions = props.useSessions
				const sessionCount = useSessions(function (s) { return s.ids ? s.ids.length : 0 })
				const prefs = wtUsePrefs()
				const [panelOpen] = wtUsePanel()
				return React.createElement('div', { className: 'wt-layer' },
					React.createElement('div', { className: 'wt-grain', 'aria-hidden': true }),
					prefs.stars ? React.createElement('div', { className: 'wt-stars wt-stars-1', 'aria-hidden': true }) : null,
					prefs.stars ? React.createElement('div', { className: 'wt-stars wt-stars-2', 'aria-hidden': true }) : null,
					prefs.wind ? React.createElement(WindCanvas) : null,
					prefs.frame ? React.createElement(FrameBorder) : null,
					prefs.ribbons ? React.createElement(RibbonEdges) : null,
					panelOpen ? React.createElement(ProfilePanel, { onClose: function () { wtSetPanel(false) }, sessionCount: sessionCount }) : null,
				)
			}
		}

		exports.name = name;
		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	}
});
