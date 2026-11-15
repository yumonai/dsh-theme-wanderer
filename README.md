<div align="center">

# 原神流浪者主题美化

**为 DeepSeek Harness Web UI 打造的常驻主题 · 内嵌动态壁纸视频 · 液态玻璃**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.2.x-4b8bbe)](https://github.com/deepseek-ai)
[![Version](https://img.shields.io/badge/version-3.20.0-c9a35c)](https://github.com/yumonai/dsh-theme-wanderer/releases)

<img src="https://raw.githubusercontent.com/yumonai/dsh-theme-wanderer/main/docs/screenshot.png" width="880" alt="浅色外观" />

<sub>深色外观 ↓</sub>

<img src="https://raw.githubusercontent.com/yumonai/dsh-theme-wanderer/main/docs/screenshot-dark.png" width="880" alt="深色外观" />

</div>

---

## 这是什么

一个装完即常驻的 Harness Web UI 主题插件：动态视频壁纸 + iOS 液态玻璃面板 + 手绘装饰层。

- Host 半部提供 `/wanderer-theme/*` 媒体路由（视频支持 `Range/206`，可循环、可拖动）
- Client 半部覆盖主题令牌、注入样式与装饰图层，并在设置页加入主题面板与自检
- **动态壁纸视频与海报随 npm 包分发**，不依赖任何本机路径 —— 任何人安装后效果一致

## ✨ 特色

| | |
|---|---|
| 🎬 **动态壁纸** | 1080p H.264 视频壁纸（插件内自带 29.4MB），首帧海报做静态降级 |
| 🧊 **液态玻璃** | 侧栏 / 右栏 / 底栏 / 次级面板：半透明底 + 镜面高光 + 冷/暖色散边 + 12s 流光 |
| 🪟 **主对话列轻档** | `blur(2px)` 近乎透明，壁纸清晰、正文可读 |
| ⌨️ **输入框玻璃** | 半透明玻璃输入框（**不使用 backdrop-filter**，规避 WebKit 合成缺陷），可开关 |
| 🌌 **装饰层** | 星空星尘、卷轴边框（四角八瓣金莲）、左右紫绳穗青绸滚边、绸带分割线 |
| 🌗 **浅 / 深色** | 两套令牌自动适配，跟随 Harness 外观 |
| 🩺 **自检面板** | 主题版本 / 壁纸服务 / 动态播放，一键复检 |

## 📦 安装

### 插件市场（推荐）

Harness 的 **插件** 页搜索 **「原神流浪者主题美化」** 或 `dsh-theme-wanderer` → 安装 → 重启。

### 网页端（CLI）

```bash
cd ~/.dsh/profiles/web
npm install /path/to/dsh-theme-wanderer-3.20.0.tgz
```

把包名加入该 profile 的 `package.json`：

```json
"dsh": { "profile": { "bundles": ["...", "dsh-theme-wanderer"] } }
```

重启 `dsh web`。

### 桌面端（DeepSeek Harness.app）

```bash
dsh plugin --profile desktop add /path/to/dsh-theme-wanderer-3.20.0.tgz
```

同样把 `"dsh-theme-wanderer"` 加入 `~/.dsh/profiles/desktop/package.json` 的 `dsh.profile.bundles`，然后**完全退出并重开 App**。

> 桌面端与网页端同为 `0.2.1-rc.5`、同一套 `dsh-web-app` UI，客户端插件契约（`__ModuleLoader__`）与主题令牌体系一致，已在 WKWebView 同引擎（Safari）下验证通过。

## 🖼️ 壁纸素材（完全内嵌）

```
media/wallpaper.mp4   29.4 MB   1080p H.264 faststart，循环播放
media/poster.jpg       392 KB   视频首帧海报（静态降级）
```

Host 默认读取包内路径：

```js
const BUNDLED_VIDEO  = fileURLToPath(new URL('../media/wallpaper.mp4', import.meta.url))
const BUNDLED_POSTER = fileURLToPath(new URL('../media/poster.jpg',   import.meta.url))
```

想换壁纸：在 `cordis.patch.yml` 的 `wanderer-theme` 行加

```yaml
config:
  videoPath: /绝对路径/your-video.mp4
```

## ⚙️ 设置

设置 → **原神流浪者主题美化**：

| 开关 | 作用 |
|---|---|
| 动态壁纸 | 关闭后使用静态海报（省电） |
| 星空星尘 | 壁纸上的闪烁星尘 |
| 卷轴边框 | 全屏鎏金卷轴边框 + 四角金莲 |
| 绸带滚边 | 左右绳穗与青绸装饰线 |
| 输入框玻璃 | 输入框半透明玻璃；异常时可关闭恢复产品原样 |

面板底部为 **自检与诊断**：主题版本 · 壁纸服务 · 动态播放。

## 🩺 排查

| 现象 | 处理 |
|---|---|
| 壁纸静止 | 浏览器自动播放被拦 → 点页面底部「▶ 点击播放动态壁纸」；再看设置页「动态播放」 |
| 壁纸是静态图 | 海报本身就是视频首帧，先确认视频路由：`/wanderer-theme/health` |
| 页面没变化 | 旧页面缓存 → 关闭窗口重开或 `Cmd+Shift+R` |
| 输入框显示异常 | 关闭「输入框玻璃」 |
| 服务端 404 | 包内 `media/` 缺失 → 用 Release 里的 tgz 安装 |

## 🔧 结构

```
lib/index.js        Host：/wanderer-theme/{wallpaper-video,wallpaper,health}，Range 206
client/client.js    Client：令牌覆盖 + 样式 + body 级壁纸层 + 设置面板
media/              内嵌视频与海报
cordis.patch.yml    bundle patch：插入 wanderer-theme 行（inject: [fs, webServer]）
```

关键实现取舍：

- 壁纸层挂在 `body` 下、`z-index:0`，应用根节点仅用 CSS 抬到 `z-index:1` —— 不触碰 React 挂载容器
- 视频直接作壁纸本体 + `translateZ(0)` 独立合成层，规避 Retina 下半尺寸重复投射
- 输入框玻璃不使用 `backdrop-filter`：WebKit 在 28px 圆角卡片上会整块合成失败（实测）
- 媒体路由 `Cache-Control: no-store`，避免换素材后浏览器继续用旧图

## ⚖️ 版权

- **动态壁纸视频**为购买授权的素材，**版权归原作者所有**，随本插件分发**仅用于本主题的动态壁纸**。
- 本插件**免费分享**，请勿用于商业售卖。
- 《原神》角色形象与美术素材版权归 **miHoYo / HoYoverse**；本主题为**非官方粉丝作品**。

## 📄 许可

代码 [MIT](LICENSE)；素材版权见上。
