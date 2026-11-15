# 原神流浪者主题美化 · dsh-theme-wanderer

> 为 DeepSeek Harness Web UI 打造的常驻主题：**内嵌动态壁纸视频**、液态玻璃、鎏金描边与手绘装饰。
> 安装即用 —— 视频与海报随插件分发，**不依赖任何本机路径**。

![浅色](docs/screenshot.png)

## ✨ 效果

- **动态壁纸**：视频壁纸（1080p H.264，插件内自带），首帧海报做静态降级
- **液态玻璃**：侧栏 / 右栏 / 底栏 / 次级面板半透明玻璃 + 镜面高光 + 冷/暖色散边 + 流光
- **主对话列轻档**：`blur(2px)` 近乎透明，壁纸清晰、正文可读
- **输入框玻璃**（可开关）：半透明底 + 镜面高光（不使用 `backdrop-filter`，规避 WebKit 合成缺陷）
- **装饰层**：星空星尘、卷轴边框（四角八瓣金莲）、左右紫绳穗青绸滚边、绸带分割线
- **浅 / 深色**：两套令牌自动适配

## 📦 安装

### 方式一：插件市场

在 Harness 的插件页搜索「原神流浪者主题美化」安装后重启。

### 方式二：本地包

```bash
cd ~/.dsh/profiles/web          # 桌面端改成 profiles/desktop
npm install /path/to/dsh-theme-wanderer-3.20.0.tgz
```

然后把包名加进该 profile `package.json` 的 `dsh.profile.bundles`：

```json
"dsh": { "profile": { "bundles": ["...", "dsh-theme-wanderer"] } }
```

重启 `dsh web`（桌面端重启 App）后生效。

## 🖼️ 关于壁纸素材（重要）

| 文件 | 大小 | 说明 |
|---|---|---|
| `media/wallpaper.mp4` | 29.4 MB | 1080p H.264 faststart，随 npm 包分发 |
| `media/poster.jpg` | 392 KB | 视频首帧海报，随包分发 |

- Host 半部默认读取**包内**路径（`fileURLToPath(new URL('../media/wallpaper.mp4', import.meta.url))`），因此任何人安装后看到的壁纸与本机完全一致。
- 需要换视频时，可在 `cordis.patch.yml` 的该行加 `config.videoPath: /绝对路径/your.mp4`。

## ⚙️ 设置项

设置 → 原神流浪者主题美化：

| 开关 | 作用 |
|---|---|
| 动态壁纸 | 关掉后用静态海报 |
| 星空星尘 | 壁纸上的闪烁星尘 |
| 卷轴边框 | 全屏鎏金边框 + 四角金莲 |
| 绸带滚边 | 左右绳穗与青绸装饰线 |
| 输入框玻璃 | 输入框半透明玻璃；异常时可关闭恢复产品原样 |

面板内还有 **自检与诊断**：主题版本 / 壁纸服务 / 动态播放。

## 🩺 排查清单

| 现象 | 原因与处理 |
|---|---|
| 壁纸不动 | 浏览器自动播放被拦 → 页面底部出现「▶ 点击播放动态壁纸」点一下；或查看设置页「动态播放」 |
| 壁纸是静态图 | 视频仍在缓冲/被策略拦截，先看自检；海报本身是视频首帧，静态时看起来像静态壁纸 |
| 页面没变化 | 旧页面缓存：关闭窗口重新打开，或 `Cmd+Shift+R` |
| 输入框异常 | 关掉「输入框玻璃」开关即可回到产品原样 |

## 🔧 技术要点

- Host：`/wanderer-theme/wallpaper-video`（支持 Range/206）、`/wanderer-theme/wallpaper`、`/wanderer-theme/health`
- Client：`theme.overrideTokens` + 一个 `<style>` + body 级壁纸层（`z-index:0`，应用根节点 `z-index:1`）
- 壁纸层：`video` 直接作本体并 `translateZ(0)`；海报 `<img>` 兜底；窗口 resize 重算像素尺寸
- 不使用 `backdrop-filter` 于输入框卡片（WebKit 在 28px 圆角卡片上会整块合成失败）

## ⚖️ 版权与来源

- **动态壁纸视频**为购买授权的素材，**版权归原作者所有**，随本插件分发**仅供本主题动态壁纸使用**。
- 本插件**免费分享**，请勿用于商业售卖。
- 《原神》角色形象与美术素材版权归 **miHoYo / HoYoverse** 所有；本主题为**非官方粉丝作品**。

## 📄 许可

代码 MIT。素材版权见上。
