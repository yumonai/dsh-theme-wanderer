window.__ModuleLoader__.load({ id: "dsh-theme-wanderer", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let React = require("react");

		// ===== 流浪者 · 久世浮倾 —— 共享状态 =====
		const wtStore = {
			open: false,
			listeners: new Set(),
			prefs: { stars: true, wind: true, pendant: true, hero: true, frame: true, ribbons: true, dock: true },
			prefsListeners: new Set(),
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
		function wtSetPref(key, value) {
			wtStore.prefs[key] = !!value
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

		function apply(ctx) {
			const THEME_VERSION = '2.0.0'
			const TOKENS = {
				'--dsw-alias-bg-base': {
					light: 'url("/wanderer-theme/wallpaper") center top / cover no-repeat rgba(240, 246, 252, 0.16)',
					dark: 'linear-gradient(rgba(10, 16, 30, 0.34), rgba(10, 16, 30, 0.42)), url("/wanderer-theme/wallpaper") center top / cover no-repeat rgba(10, 18, 34, 0.10)',
				},
				'--dsw-alias-bg-layer-1': { light: 'rgba(248, 251, 253, 0.55)', dark: 'rgba(17, 30, 52, 0.40)' },
				'--dsw-alias-bg-layer-2': { light: 'rgba(240, 246, 252, 0.46)', dark: 'rgba(22, 38, 62, 0.34)' },
				'--dsw-alias-bg-overlay': { light: 'rgba(234, 242, 249, 0.97)', dark: 'rgba(15, 27, 47, 0.96)' },
				'--dsw-alias-border-l1': { light: 'rgba(63, 140, 180, 0.30)', dark: 'rgba(125, 190, 225, 0.16)' },
				'--dsw-alias-border-l2': { light: 'rgba(168, 138, 82, 0.60)', dark: 'rgba(212, 175, 106, 0.40)' },
				'--dsw-alias-brand-primary': { light: '#2f93c4', dark: '#6fc3e8' },
				'--dsw-alias-label-primary': { light: '#16283c', dark: '#f4efe4' },
				'--dsw-alias-label-secondary': { light: '#3c5468', dark: '#a9bdd2' },
				'--dsw-alias-state-error-primary': { light: '#c94f4f', dark: '#e27373' },
				'--dsw-alias-state-success-primary': { light: '#1e9c80', dark: '#4ecbb2' },
				'--dsw-alias-state-warn-primary': { light: '#b8862f', dark: '#e0b862' },
				'--dsw-specific-sidebar-fill': { light: 'rgba(240, 246, 252, 0.32)', dark: 'rgba(10, 20, 36, 0.28)' },
			}

			const CSS = `
/* ===== 流浪者 · 久世浮倾:全透明界面 · 壁纸直出 ===== */
html { background-color: #0a1424; }
body {
  background-color: #0a1424;
  background-image: url("/wanderer-theme/wallpaper");
  background-size: cover;
  background-position: center top;
  font-family: "PingFang SC", "Hiragino Sans GB", "Source Han Sans SC", "Noto Sans CJK SC", "Microsoft YaHei", -apple-system, "Segoe UI", sans-serif;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background-color: #0a1424;
  background-image:
    radial-gradient(130% 105% at 50% 42%, rgba(255, 248, 236, 0.05) 50%, rgba(10, 16, 30, 0.30) 100%),
    url("/wanderer-theme/wallpaper");
  background-size: cover;
  background-position: center top;
}
body[data-ds-dark-theme]::before {
  background-image:
    linear-gradient(rgba(10, 16, 30, 0.34), rgba(10, 16, 30, 0.42)),
    radial-gradient(130% 105% at 50% 42%, rgba(10, 16, 30, 0.05) 50%, rgba(10, 16, 30, 0.38) 100%),
    url("/wanderer-theme/wallpaper");
}

* { scrollbar-color: #4f9fc0 rgba(18, 30, 52, 0.45); scrollbar-width: thin; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: rgba(18, 30, 52, 0.35); border-radius: 8px; }
*::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8fd4ef, #3fa9c9 55%, #9b7bd4);
  border-radius: 8px;
  border: 1px solid rgba(232, 200, 122, 0.4);
  box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.25);
}
*::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #eecf8a, #c9a35c); }

:where(button, [role="button"], a) { transition: box-shadow 0.3s ease, filter 0.3s ease; }
:where(button, [role="button"], a):hover { box-shadow: 0 0 12px rgba(232, 200, 122, 0.35), 0 0 3px rgba(232, 200, 122, 0.28); }
:where(button, a, input, textarea, [role="button"]):focus-visible { outline: 1.5px solid rgba(232, 200, 122, 0.85); outline-offset: 2px; }
::selection { background: rgba(111, 195, 232, 0.35); color: #fff7e6; }

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
    radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.7), transparent 55%),
    radial-gradient(1.4px 1.4px at 30% 60%, rgba(111, 195, 232, 0.75), transparent 55%);
  background-size: 300px 300px, 460px 460px;
  animation: wt-twinkle 9s ease-in-out infinite reverse;
}
@keyframes wt-twinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.6; } }

.wt-grain {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.12;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)' opacity='0.5'/%3E%3C/svg%3E");
}

.wt-wind { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; }

.wt-frame {
  position: fixed; inset: 10px; pointer-events: none; border-radius: 16px;
  border: 1px solid rgba(232, 200, 122, 0.24);
  box-shadow: inset 0 0 0 1px rgba(111, 195, 232, 0.07), inset 0 0 44px rgba(8, 14, 26, 0.24);
}

.wt-edge { position: fixed; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; opacity: 0.5; }
.wt-edge-l { left: 13px; }
.wt-edge-r { right: 13px; }
.wt-edge-line { width: 2px; border-radius: 2px; background: linear-gradient(180deg, #8fd4ef, #e8c87a 50%, #9b7bd4); box-shadow: 0 0 8px rgba(143, 212, 239, 0.5); }
.wt-edge-l .wt-edge-line { height: 22vh; }
.wt-edge-r .wt-edge-line { height: 13vh; }
.wt-edge-tassel { width: 10px; height: 26px; background: linear-gradient(180deg, rgba(155, 123, 212, 0.9), rgba(111, 195, 232, 0.9)); clip-path: polygon(50% 0, 100% 30%, 62% 48%, 100% 62%, 50% 100%, 0 62%, 38% 48%, 0 30%); }

.wt-hero-wrap { pointer-events: none; }
.wt-hero {
  position: fixed; top: 46%; right: 4%; transform: translateY(-50%); height: 54vh; max-width: 46vw; object-fit: contain; opacity: 0.92;
  -webkit-mask-image: radial-gradient(ellipse 68% 66% at 50% 46%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.5) 64%, transparent 82%);
  mask-image: radial-gradient(ellipse 68% 66% at 50% 46%, rgba(0,0,0,0.96) 34%, rgba(0,0,0,0.5) 64%, transparent 82%);
  animation: wt-rise 1.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes wt-rise { from { opacity: 0; transform: translateY(-42%) scale(0.94); filter: blur(8px); } to { opacity: 0.92; transform: translateY(-50%) scale(1); filter: blur(0); } }
.wt-hero-plate { position: fixed; right: 36%; top: 30%; text-align: right; pointer-events: none; animation: wt-fade 1.6s ease both; }
@keyframes wt-fade { from { opacity: 0; } to { opacity: 1; } }
.wt-hero-name {
  font-size: 46px; font-weight: 700; color: #f8efdb; letter-spacing: 0.18em;
  text-shadow: 0 0 2px rgba(212, 175, 106, 0.95), 0 0 22px rgba(232, 200, 122, 0.55), 0 2px 0 rgba(212, 175, 106, 0.7), 0 0 40px rgba(111, 195, 232, 0.35);
}
.wt-hero-sub { margin-top: 8px; font-size: 11px; letter-spacing: 0.42em; color: rgba(233, 214, 178, 0.85); }
.wt-hero-quote { margin-top: 16px; font-size: 12px; font-style: italic; color: rgba(233, 214, 178, 0.8); letter-spacing: 0.1em; }
.wt-hero-hint { margin-top: 10px; font-size: 10px; color: rgba(169, 189, 210, 0.8); letter-spacing: 0.2em; }
.wt-hero-glowstar { position: fixed; right: 30%; top: 38%; opacity: 0.16; pointer-events: none; animation: wt-spin 44s linear infinite; }
.wt-mini { position: fixed; width: 128px; pointer-events: none; animation: wt-mini-bob 7s ease-in-out infinite; }
.wt-mini-1 { right: 5.5%; top: 6%; transform: rotate(5deg); }
.wt-mini-2 { right: 24%; bottom: 7%; transform: rotate(-6deg); animation-delay: -3.2s; }
.wt-mini img { width: 100%; height: 128px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(212, 175, 106, 0.6); box-shadow: 0 10px 24px rgba(4, 10, 24, 0.5), inset 0 0 10px rgba(232, 200, 122, 0.15); background: rgba(13, 26, 48, 0.6); }
.wt-mini-cap { margin-top: 6px; text-align: center; }
.wt-mini-name { font-size: 12px; color: #f6ecd8; letter-spacing: 0.3em; text-shadow: 0 0 6px rgba(232, 200, 122, 0.6); }
.wt-mini-note { font-size: 10px; color: rgba(169, 189, 210, 0.75); letter-spacing: 0.1em; }
@keyframes wt-mini-bob { 0%, 100% { margin-top: 0; } 50% { margin-top: -10px; } }
@media (max-width: 1160px) { .wt-hero-plate, .wt-mini { display: none; } .wt-hero { opacity: 0.5; } }

.wt-med { position: fixed; right: 3%; top: 30%; width: 132px; pointer-events: none; opacity: 0.62; animation: wt-mini-bob 8s ease-in-out infinite; }
.wt-med img { width: 132px; height: 132px; object-fit: cover; border-radius: 50%; border: 1.5px solid rgba(232, 200, 122, 0.7); box-shadow: 0 0 0 4px rgba(232, 200, 122, 0.15), 0 0 22px rgba(232, 200, 122, 0.35), 0 10px 24px rgba(4, 10, 24, 0.5); background: rgba(13, 26, 48, 0.6); }
.wt-med-cap { margin-top: 6px; text-align: center; }
.wt-med-name { font-size: 12px; color: #f6ecd8; letter-spacing: 0.3em; text-shadow: 0 0 6px rgba(232, 200, 122, 0.6); }
.wt-med-note { font-size: 10px; color: rgba(169, 189, 210, 0.75); letter-spacing: 0.2em; }

.wt-pendant-anchor { position: fixed; right: 22px; bottom: 14px; pointer-events: auto; width: 52px; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
.wt-pendant-cord { width: 2px; height: 26px; margin-bottom: 2px; background: linear-gradient(180deg, rgba(155, 123, 212, 0.9), rgba(111, 195, 232, 0.9)); box-shadow: 0 0 6px rgba(155, 123, 212, 0.5); }
.wt-pendant { width: 46px; height: 46px; filter: drop-shadow(0 0 5px rgba(232, 200, 122, 0.45)); transition: filter 0.4s ease; animation: wt-bob 5.5s ease-in-out infinite; }
.wt-pendant-on { filter: drop-shadow(0 0 9px rgba(103, 195, 232, 0.9)) drop-shadow(0 0 3px rgba(103, 195, 232, 0.7)); }
@keyframes wt-bob { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(4px) rotate(2deg); } }
.wt-tip {
  position: absolute; right: 0; bottom: 84px; width: 216px; padding: 10px 14px; opacity: 0; transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease; pointer-events: none;
}
.wt-pendant-anchor:hover .wt-tip { opacity: 1; transform: translateY(0); }
.wt-tip-title { font-size: 13px; font-weight: 700; color: #f6ecd8; letter-spacing: 0.2em; text-shadow: 0 0 2px rgba(212, 175, 106, 0.9), 0 0 12px rgba(232, 200, 122, 0.4); }
.wt-tip-status { margin-top: 4px; font-size: 12px; color: rgba(143, 212, 239, 0.95); }
.wt-tip-meta { margin-top: 3px; font-size: 11px; color: rgba(169, 189, 210, 0.75); }
.wt-tip-hint { margin-top: 5px; font-size: 10px; color: rgba(232, 200, 122, 0.85); letter-spacing: 0.1em; }
.wt-tip-dots { display: flex; gap: 4px; margin-top: 7px; }
.wt-tip-dot { width: 7px; height: 7px; transform: rotate(45deg); border-radius: 1px; background: rgba(143, 212, 239, 0.25); }
.wt-tip-dot-on { background: #e8c87a; box-shadow: 0 0 6px rgba(232, 200, 122, 0.8); }

.wt-card {
  position: relative;
  background: linear-gradient(160deg, rgba(24, 42, 70, 0.93), rgba(13, 26, 48, 0.95));
  border: 1px solid rgba(212, 175, 106, 0.5);
  outline: 1px solid rgba(111, 195, 232, 0.16);
  outline-offset: 3px;
  border-radius: 14px;
  box-shadow:
    0 0 0 1px rgba(232, 200, 122, 0.12),
    0 18px 44px rgba(4, 10, 24, 0.55),
    inset 0 0 26px rgba(111, 195, 232, 0.06),
    inset 0 0 6px rgba(232, 200, 122, 0.1);
  backdrop-filter: blur(14px) saturate(1.1);
}
.wt-corner { position: absolute; opacity: 0.9; pointer-events: none; }
.wt-corner-tl { top: -10px; left: -10px; transform: rotate(10deg); }
.wt-corner-tr { top: -10px; right: -10px; transform: rotate(100deg); }
.wt-corner-bl { bottom: -10px; left: -10px; transform: rotate(-80deg); }
.wt-corner-br { bottom: -10px; right: -10px; transform: rotate(-170deg); }

.wt-title { font-weight: 700; color: #f8efdb; letter-spacing: 0.12em; text-shadow: 0 0 2px rgba(212, 175, 106, 0.9), 0 0 18px rgba(232, 200, 122, 0.5), 0 1px 0 rgba(212, 175, 106, 0.8); }
.wt-title-sub { font-size: 10px; color: rgba(233, 214, 178, 0.7); letter-spacing: 0.34em; }

.wt-divider { position: relative; height: 2px; margin: 14px 8px; background: linear-gradient(90deg, transparent, #8fd4ef 12%, #e8c87a 50%, #9b7bd4 88%, transparent); }
.wt-divider::before, .wt-divider::after { content: ""; position: absolute; top: 50%; width: 8px; height: 8px; transform: translateY(-50%) rotate(45deg); background: rgba(232, 200, 122, 0.95); box-shadow: 0 0 8px rgba(232, 200, 122, 0.8); }
.wt-divider::before { left: -2px; }
.wt-divider::after { right: -2px; }

.wt-trigger {
  display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid rgba(212, 175, 106, 0.45); background: rgba(20, 36, 60, 0.35); color: rgba(244, 239, 228, 0.9); font-size: 12px;
  letter-spacing: 0.12em; transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}
.wt-trigger:hover { border-color: rgba(232, 200, 122, 0.8); background: rgba(20, 36, 60, 0.6); color: #f6ecd8; box-shadow: 0 0 12px rgba(232, 200, 122, 0.4); }
.wt-trigger .wt-spiral { width: 0; opacity: 0; transition: width 0.25s ease, opacity 0.25s ease; }
.wt-trigger:hover .wt-spiral { width: 16px; opacity: 1; animation: wt-spin 1.2s linear infinite; }

@keyframes wt-spin { to { transform: rotate(360deg); } }

.wt-panel-backdrop { position: fixed; inset: 0; pointer-events: auto; background: rgba(6, 12, 24, 0.5); backdrop-filter: blur(3px); animation: wt-fade 0.3s ease both; }
.wt-panel {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(640px, 92vw); max-height: 88vh; overflow: auto;
  pointer-events: auto; padding: 20px 22px; animation: wt-ribbon-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes wt-ribbon-in { from { opacity: 0; transform: translate(-50%, -46%) scale(0.93); filter: blur(6px); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); } }
.wt-close { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(212, 175, 106, 0.5); background: rgba(13, 26, 48, 0.6); color: rgba(244, 239, 228, 0.85); cursor: pointer; font-size: 14px; line-height: 1; }
.wt-close:hover { background: rgba(24, 42, 70, 0.9); box-shadow: 0 0 12px rgba(232, 200, 122, 0.4); }
.wt-panel-head { display: flex; align-items: center; gap: 12px; }
.wt-panel-head .wt-spiral { animation: wt-spin 14s linear infinite; }
.wt-panel-body { display: grid; grid-template-columns: 196px 1fr; gap: 16px; align-items: start; }
@media (max-width: 520px) { .wt-panel-body { grid-template-columns: 1fr; } }
.wt-portrait-box { position: relative; }
.wt-portrait { position: relative; width: 100%; height: 264px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(232, 200, 122, 0.6); box-shadow: inset 0 0 14px rgba(232, 200, 122, 0.16), 0 8px 20px rgba(4, 10, 24, 0.45); }
.wt-info { display: flex; flex-direction: column; gap: 9px; }
.wt-info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.wt-info-label { width: 62px; flex: none; color: rgba(169, 189, 210, 0.8); letter-spacing: 0.1em; }
.wt-info-value { color: #f4efe4; }
.wt-quote { margin-top: 4px; font-style: italic; font-size: 12px; line-height: 1.7; color: rgba(233, 214, 178, 0.85); border-left: 2px solid rgba(232, 200, 122, 0.55); padding-left: 10px; }

.wt-names-head { display: flex; align-items: baseline; gap: 10px; }
.wt-names { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
@media (max-width: 560px) { .wt-names { grid-template-columns: repeat(2, 1fr); } }
.wt-name-card { position: relative; }
.wt-name-img { position: relative; height: 110px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(212, 175, 106, 0.5); }
.wt-name-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.wt-name-cap { margin-top: 6px; font-size: 13px; color: #f6ecd8; text-align: center; letter-spacing: 0.2em; text-shadow: 0 0 6px rgba(232, 200, 122, 0.5); }
.wt-name-note { font-size: 10px; color: rgba(169, 189, 210, 0.7); text-align: center; letter-spacing: 0.08em; }

.wt-const { margin-top: 6px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.wt-const-label { display: flex; align-items: baseline; gap: 10px; }
.wt-const-svg { width: 100%; max-width: 300px; }
.wt-const-name { min-height: 20px; font-size: 12px; color: rgba(232, 200, 122, 0.95); letter-spacing: 0.08em; }
.wt-const-progress { display: flex; gap: 18px; font-size: 11px; color: rgba(169, 189, 210, 0.75); }

.wt-foot { margin-top: 12px; text-align: center; font-size: 11px; color: rgba(169, 189, 210, 0.65); letter-spacing: 0.1em; }

.wt-dock { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 2px 0 3px; opacity: 0.8; pointer-events: none; color: rgba(244, 239, 228, 0.85); font-size: 12px; letter-spacing: 0.3em; }
.wt-dock .wt-spiral { animation: wt-spin 9s linear infinite; }

.wt-settings { display: flex; flex-direction: column; gap: 2px; }
.wt-settings-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.wt-set-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 4px; border-bottom: 1px solid rgba(212, 175, 106, 0.14); }
.wt-set-label { font-size: 13px; color: #f4efe4; letter-spacing: 0.06em; }
.wt-set-desc { font-size: 11px; color: rgba(169, 189, 210, 0.7); margin-top: 2px; }
.wt-switch { width: 42px; height: 22px; border-radius: 999px; background: rgba(120, 140, 165, 0.35); border: 1px solid rgba(212, 175, 106, 0.35); position: relative; cursor: pointer; transition: background 0.25s ease, box-shadow 0.25s ease; flex: none; }
.wt-switch-knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: rgba(244, 239, 228, 0.9); transition: left 0.25s ease, background 0.25s ease; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4); }
.wt-switch-on { background: linear-gradient(90deg, rgba(63, 169, 201, 0.85), rgba(111, 195, 232, 0.85)); box-shadow: 0 0 10px rgba(111, 195, 232, 0.5); }
.wt-switch-on .wt-switch-knob { left: 22px; background: #f6ecd8; }

/* ===== 自检与诊断面板 ===== */
.wt-diag { display: flex; flex-direction: column; gap: 6px; }
.wt-diag-head { display: flex; align-items: center; justify-content: space-between; }
.wt-diag-btn { padding: 4px 10px; font-size: 11px; border-radius: 999px; border: 1px solid rgba(212, 175, 106, 0.5); background: rgba(20, 36, 60, 0.4); color: rgba(244, 239, 228, 0.85); cursor: pointer; letter-spacing: 0.1em; }
.wt-diag-btn:hover { background: rgba(24, 42, 70, 0.8); box-shadow: 0 0 10px rgba(232, 200, 122, 0.35); }
.wt-diag-row { display: flex; align-items: baseline; gap: 8px; font-size: 12px; line-height: 1.6; }
.wt-diag-mark { flex: none; width: 14px; text-align: center; }
.wt-diag-ok { color: #4ecbb2; text-shadow: 0 0 8px rgba(78, 203, 178, 0.6); }
.wt-diag-bad { color: #e27373; text-shadow: 0 0 8px rgba(226, 115, 115, 0.6); }
.wt-diag-label { flex: none; width: 86px; color: rgba(233, 214, 178, 0.85); letter-spacing: 0.08em; }
.wt-diag-detail { color: rgba(169, 189, 210, 0.75); word-break: break-all; }
.wt-diag-foot { font-size: 10px; color: rgba(169, 189, 210, 0.55); margin-top: 4px; letter-spacing: 0.06em; }

@media (prefers-reduced-motion: reduce) {
  .wt-stars-1, .wt-stars-2, .wt-pendant, .wt-mini, .wt-med, .wt-hero-glowstar, .wt-spiral, .wt-panel-head .wt-spiral, .wt-dock .wt-spiral { animation: none; }
  .wt-wind { display: none; }
  .wt-hero, .wt-hero-plate, .wt-panel { animation: none; }
}
`

			ctx.effect(function () {
				const disposeTokens = ctx.theme.overrideTokens('dsh-theme-wanderer', TOKENS)
				const styleEl = document.createElement('style')
				styleEl.setAttribute('data-plugin', 'dsh-theme-wanderer')
				styleEl.setAttribute('data-plugin-css', 'dsh-theme-wanderer')
				styleEl.textContent = CSS
				document.head.appendChild(styleEl)
				return function () {
					try { styleEl.remove() } catch (err) {}
					try { disposeTokens() } catch (err) {}
				}
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
					{ name: 'settings.section', id: 'wanderer-theme', order: 25, label: '久世浮倾主题' },
					function () { return React.createElement(SettingsPanel) },
				)
			})

			ctx.slots.inject('conversation.composer.dock', function () {
				return ctx.slots.register(
					{ name: 'conversation.composer.dock', id: 'wanderer-dock', order: 10, label: '风语签' },
					function () { return React.createElement(DockFlourish) },
				)
			})

			/* ===== 启动自检(浏览器控制台可见) ===== */
			console.log('[dsh-theme-wanderer] v' + THEME_VERSION + ' 已挂载: 壁纸直出 + 风元素粒子 + 个人中心')
			try {
				fetch('/wanderer-theme/wallpaper', { method: 'HEAD' }).then(function (r) {
					console.log('[dsh-theme-wanderer] 壁纸自检 HTTP', r.status, r.headers.get('content-type'))
				}).catch(function (e) {
					console.error('[dsh-theme-wanderer] 壁纸自检失败:', e)
				})
			} catch (err) {
				console.error('[dsh-theme-wanderer] 壁纸自检异常:', err)
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

			/* ===== 欢迎页立绘簇 ===== */
			function MiniCard(props) {
				return React.createElement('div', { className: 'wt-mini ' + props.className },
					React.createElement('img', { src: props.src, alt: '' }),
					React.createElement('div', { className: 'wt-mini-cap' },
						React.createElement('div', { className: 'wt-mini-name' }, props.caption),
						React.createElement('div', { className: 'wt-mini-note' }, props.note),
					),
				)
			}
			function WelcomeCluster() {
				return React.createElement('div', { className: 'wt-hero-wrap', 'aria-hidden': true },
					React.createElement('div', { className: 'wt-hero-glowstar' }, React.createElement(VisionStar, { size: 150 })),
					React.createElement('div', { className: 'wt-hero-plate' },
						React.createElement('div', { className: 'wt-hero-name' }, '久世浮倾'),
						React.createElement('div', { className: 'wt-hero-sub' }, 'WANDERER · THE BALLADEER'),
						React.createElement('div', { className: 'wt-hero-quote' }, '「我们终将重逢,但不是这里,不是现在。」'),
						React.createElement('div', { className: 'wt-hero-hint' }, '点击右下挂坠 · 开启个人中心'),
					),
					React.createElement('img', { className: 'wt-hero', src: '/wanderer-theme/hero', alt: '' }),
					React.createElement(MiniCard, { className: 'wt-mini-1', src: '/wanderer-theme/art3', caption: '国崩', note: '雷电将军所造' }),
					React.createElement(MiniCard, { className: 'wt-mini-2', src: '/wanderer-theme/art6', caption: '散兵', note: '愚人众第六席' }),
				)
			}

			/* ===== 会话模式 · 立绘圆章 ===== */
			function SessionMedallion() {
				return React.createElement('div', { className: 'wt-med', 'aria-hidden': true },
					React.createElement('img', { src: '/wanderer-theme/portrait', alt: '' }),
					React.createElement('div', { className: 'wt-med-cap' },
						React.createElement('div', { className: 'wt-med-name' }, '流浪者'),
						React.createElement('div', { className: 'wt-med-note' }, '久世浮倾'),
					),
				)
			}

			/* ===== 命之座名称(个人中心内使用) ===== */
			const CONST_NAMES = ['初番·茂风流羽行', '二番·箙岛月白波', '三番·久世舞夕颜', '四番·花月歌浮舟', '五番·今昔渡来殿', '末番·暮空遮雨']

			/* ===== 水晶球挂坠 ===== */
			function PendantSvg() {
				return React.createElement('svg', { width: 46, height: 46, viewBox: '0 0 48 48', 'aria-hidden': true },
					React.createElement('defs', null,
						React.createElement('radialGradient', { id: 'wt-ball', cx: '38%', cy: '32%', r: '80%' },
							React.createElement('stop', { offset: '0%', stopColor: 'rgba(214,236,248,0.95)' }),
							React.createElement('stop', { offset: '45%', stopColor: 'rgba(111,195,232,0.8)' }),
							React.createElement('stop', { offset: '100%', stopColor: 'rgba(24,60,92,0.9)' }),
						),
					),
					React.createElement('circle', { cx: 24, cy: 7, r: 4.5, fill: 'none', stroke: 'rgba(232,200,122,0.9)', strokeWidth: 1.6 }),
					React.createElement('circle', { cx: 24, cy: 13.5, r: 2.6, fill: 'rgba(232,200,122,0.95)' }),
					React.createElement('circle', { cx: 24, cy: 28, r: 15.5, fill: 'rgba(16,30,52,0.55)', stroke: 'rgba(232,200,122,0.95)', strokeWidth: 2.2 }),
					React.createElement('circle', { cx: 24, cy: 28, r: 12.2, fill: 'url(#wt-ball)' }),
					React.createElement('ellipse', { cx: 19.5, cy: 22.5, rx: 4, ry: 2.4, fill: 'rgba(255,255,255,0.65)', transform: 'rotate(-28 19.5 22.5)' }),
					React.createElement(StarShape, { x: 24, y: 29, r: 7.5, fill: 'rgba(155,123,212,0.9)', stroke: 'rgba(235,225,255,0.9)' }),
				)
			}
			function Pendant(props) {
				const active = props.active
				const sessionCount = props.sessionCount
				const lit = Math.min(6, sessionCount)
				const dots = []
				for (let i = 0; i < 6; i++) {
					dots.push(React.createElement('span', { key: 'd' + i, className: 'wt-tip-dot' + (i < lit ? ' wt-tip-dot-on' : '') }))
				}
				return React.createElement('div', { className: 'wt-pendant-anchor', title: '个人中心 · 浪客座', onClick: function () { wtSetPanel(true) } },
					React.createElement('div', { className: 'wt-tip wt-card' },
						React.createElement('div', { className: 'wt-tip-title' }, '风之眷顾'),
						React.createElement('div', { className: 'wt-tip-status' }, active ? '风息流转 · 会话进行中' : '风起之时 · 静候旅人'),
						React.createElement('div', { className: 'wt-tip-meta' }, '已启程 ' + sessionCount + ' 次 · 命座 ' + lit + '/6'),
						React.createElement('div', { className: 'wt-tip-dots' }, dots),
						React.createElement('div', { className: 'wt-tip-hint' }, '点击开启个人中心'),
					),
					React.createElement('div', { className: 'wt-pendant-cord', 'aria-hidden': true }),
					React.createElement('div', { className: 'wt-pendant' + (active ? ' wt-pendant-on' : ''), role: 'status', 'aria-label': active ? '会话进行中' : '空闲' },
						React.createElement(PendantSvg),
					),
				)
			}

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
						stroke: on ? 'rgba(232,200,122,0.9)' : 'rgba(143,212,239,0.22)',
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
						React.createElement('circle', { cx: p[0], cy: p[1], r: 13, fill: 'rgba(13,26,48,0.55)' }),
						React.createElement(StarShape, { x: p[0], y: p[1], r: on ? 9 : 7, fill: on ? 'rgba(232,200,122,0.95)' : 'rgba(143,212,239,0.3)', stroke: on ? 'rgba(255,240,200,0.9)' : 'rgba(143,212,239,0.45)', glow: on }),
						React.createElement('text', { x: p[0], y: p[1] + 30, textAnchor: 'middle', fontSize: 9, fill: 'rgba(244,239,228,0.66)' }, ROMANS[i]),
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
						React.createElement('div', { className: 'wt-foot' }, '流浪者 · 久世浮倾 界面主题 ｜ 命之座「浪客座」视觉包装 ｜ 常驻主题插件 · dsh-theme-wanderer'),
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
						fetch('/wanderer-theme/health').then(function (r) { return r.json() }).catch(function (e) { return { ok: false, error: String(e && e.message || e) } }),
						fetch('/wanderer-theme/wallpaper', { method: 'HEAD' }).then(function (r) { return { status: r.status, type: r.headers.get('content-type') || '' } }).catch(function (e) { return { status: 0, error: String(e && e.message || e) } }),
					]).then(function (parts) {
						const health = parts[0]
						const wp = parts[1]
						let tokenApplied = false
						try {
							const v = window.getComputedStyle(document.body).getPropertyValue('--dsw-alias-bg-base').trim()
							tokenApplied = v.indexOf('wanderer-theme') >= 0
						} catch (err) {}
						setResult({
							version: THEME_VERSION,
							mode: document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light',
							healthOk: !!(health && health.ok),
							healthDetail: health && health.ok ? ('素材 ' + Object.keys(health.assets || {}).length + ' 项 · ' + (health.baseDir || '')) : ('health 失败: ' + (health && health.error || '未知')),
							wallpaperOk: wp.status === 200 && wp.type.indexOf('jpeg') >= 0,
							wallpaperDetail: wp.status === 200 ? (wp.status + ' ' + wp.type) : ('HTTP ' + (wp.status || 0) + ' ' + (wp.error || '')),
							tokenApplied: tokenApplied,
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
							diagRow('主题版本', true, THEME_VERSION),
							diagRow('主题色模式', true, result.mode === 'dark' ? '暗色(暮色滤镜)' : '亮色(轻纱)'),
							diagRow('素材服务', result.healthOk, result.healthDetail),
							diagRow('壁纸图片', result.wallpaperOk, result.wallpaperDetail),
							diagRow('主题令牌已注入', result.tokenApplied, result.tokenApplied ? '--dsw-alias-bg-base 含壁纸' : '未检测到主题令牌——可能是主题服务未应用'),
							React.createElement('div', { className: 'wt-diag-foot' }, '自检时间 ' + result.time + ' · 若任一项为 ✗,请查看终端 dsh-theme-wanderer 日志或 README 排查章节'),
						)
						: React.createElement('div', { className: 'wt-diag-foot' }, '自检运行中…'),
				)
			}
			function SettingsPanel() {
				const prefs = wtUsePrefs()
				const ITEMS = [
					['stars', '星空壁纸与星尘', '星夜壁纸背景与双层闪烁星尘'],
					['wind', '风元素粒子', '流动的风之微尘 · 四芒星 · 螺旋 · 风痕'],
					['pendant', '水晶球挂坠', '右下角状态指示器(点击进入个人中心)'],
					['hero', '角色立绘', '欢迎页立绘簇 / 会话中右侧立绘圆章'],
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
							React.createElement('div', { className: 'wt-title' }, '久世浮倾主题'),
							React.createElement('div', { className: 'wt-title-sub' }, 'WANDERER THEME · v' + THEME_VERSION),
						),
						React.createElement(Spiral, { size: 20 }),
					),
					React.createElement(Ribbon),
					rows,
					React.createElement(Ribbon),
					React.createElement(ThemeDiag),
					React.createElement(Ribbon),
					React.createElement('div', { className: 'wt-foot' }, '设置仅保存在内存中 · 页面刷新后恢复默认'),
				)
			}

			/* ===== 全局图层 ===== */
			function WandererLayer(props) {
				const useSessions = props.useSessions
				const currentId = useSessions(function (s) { return s.current })
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
					prefs.hero && currentId === undefined ? React.createElement(WelcomeCluster) : null,
					prefs.hero && currentId !== undefined ? React.createElement(SessionMedallion) : null,
					prefs.pendant ? React.createElement(Pendant, { active: currentId !== undefined, sessionCount: sessionCount }) : null,
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
