# 原神流浪者「久世浮倾」主题 · dsh-theme-wanderer

DeepSeek Harness 的**永久主题插件**（常驻 profile，重启后依然生效），以《原神》角色「流浪者」（久世浮倾 / 国崩 / 倾奇者 / 散兵）为核心的幻想风界面主题。

> 主题名：原神流浪者「久世浮倾」主题 · Wanderer Theme

## ✨ 效果

- **壁纸直出**：壁纸直接烘焙进应用 base 主题令牌（`--dsw-alias-bg-base`），应用面板自身绘制壁纸，不依赖背景图层，连启动画面都带壁纸；亮/暗双模式自动适配
- **配色**：白 + 天蓝 + 湖蓝顺色，鎏金点缀，淡紫呼应角色紫瞳
- **风元素粒子**：Canvas 流动微尘 + 四芒星（神之眼星型）+ 螺旋轨道粒子 + 风痕流线
- **羊皮卷质感**：毛玻璃卡片、做旧金边、八瓣金莲角饰、绸带分割线、青绸滚动条
- **角色元素**：水晶球挂坠状态指示器（点击进入个人中心）、会话中立绘圆章、欢迎页立绘簇与鎏金题字
- **个人中心 · 浪客座**：角色档案、四重名号画廊（国崩 / 倾奇者 / 散兵 / 流浪者）、命之座六星图（按会话次数点亮）
- **设置页**：7 个装饰开关 + **自检与诊断面板**（一键排查）
- **自检机制**：启动素材预热自检、`/wanderer-theme/health` JSON 健康端点、浏览器控制台 `[dsh-theme-wanderer]` 日志

## 📁 结构

```
lib/index.js       Host 半部: /wanderer-theme/* 素材路由 + health 端点 + 预热自检
client/client.js   Client 半部: 主题令牌、CSS、粒子画布、挂坠、个人中心、设置页、自检面板
package.json       dsh.client 声明(web 平台)与导出
```

## 📦 安装（3 步）

```bash
# 1. 克隆到本机主题目录
git clone https://github.com/<your-name>/dsh-theme-wanderer.git ~/.dsh/themes/dsh-theme-wanderer

# 2. 在 web profile 中以 link: 协议安装(符号链接,改源码即时生效)
cd ~/.dsh/profiles/web
pnpm add "dsh-theme-wanderer@link:../../themes/dsh-theme-wanderer"
```

3. 编辑 `~/.dsh/profiles/web/cordis.patch.yml`，在最外层数组中加入：

```yaml
- insert:
    - id: wanderer-theme
      name: dsh-theme-wanderer
      inject:
        - fs
        - webServer
```

4. 重启 `dsh web`（并彻底退出重开 Web 界面）。

> ⚠️ 不要用 `file:` 协议安装本包：pnpm 会把 `file:` 依赖**拷贝**进 store，
> 之后修改源码不会生效（本主题开发期踩过的坑之一）。务必使用 `link:`。

## 🖼️ 壁纸与素材

素材图片位于 `lib/index.js` 顶部的 `baseDir`（默认 `/Users/yuzhengdong/Downloads/流浪者素材`）。
换壁纸/换图只需改 `files` 映射表，然后重启。若素材目录移动或删除，主题界面仍可用，仅图片缺失（启动日志会打印 FAIL 明细）。

## 🔧 诊断与排查手册

主题内置三层诊断，按顺序使用：

**① 终端启动日志**（所有 `[dsh-theme-wanderer]` 前缀行）
- `素材预热自检`：11 个素材逐个 OK/FAIL + 字节数 —— FAIL 即素材路径问题
- `fs 或 webServer 服务不可用`：cordis.patch.yml 中该行缺 `inject: [fs, webServer]`
- `GET /wanderer-theme/<name>`：每次素材请求的访问日志

**② 健康端点**
```bash
curl http://127.0.0.1:3080/wanderer-theme/health
# → {"ok":true,"version":"2.0.0","baseDir":"...","assets":{...}}
```

**③ 界面自检面板**：设置 → 久世浮倾主题 → 「自检与诊断」，一键检查素材服务 / 壁纸图片 / 主题令牌注入状态；浏览器控制台同步输出 `[dsh-theme-wanderer]` 自检日志。

### 踩坑速查表（本主题开发全程实录）

| 症状 | 原因 | 解决 |
| --- | --- | --- |
| 重启后主题/壁纸消失 | 页面缓存：Web App 重连不重载 HTML，旧 manifest 没有主题模块 | 彻底退出 Web App 再打开，或浏览器 Cmd+Shift+R |
| 启动报 `ERR_MODULE_NOT_FOUND: Cannot find package '@deepseek-ai/...'` | 全局 `dsh` 用 pnpm 安装：pnpm store 隔离布局让加载器向上查不到行包（npm/npx 平铺布局正常） | 全局用 npm 装：`npm install -g @deepseek-ai/dsh --prefix ~/.npm-global` 并链入 PATH；或把 `@deepseek-ai/dsh-base`、`@deepseek-ai/dsh-web-app` 按 `0.1.0-rc.6` 精确版本装进 profile |
| 素材路由返回 index.html（SPA 兜底页）而非图片 | 主题行在 `webServer` 服务就绪前执行（`fs or webServer service unavailable`） | 行内声明 `inject: [fs, webServer]` |
| 改了主题源码但不生效 | `file:` 依赖被 pnpm 拷贝进 store，改源码不会同步 | 用 `link:` 协议重装 |
| 壁纸看不见但界面有装饰 | 旧版主题把壁纸放在 body 背景层，被不透明面板盖住 | v2.0 已把壁纸烘焙进 `--dsw-alias-bg-base`，面板自身绘制壁纸 |
| 控制台/自检面板 ✗ | 见面板逐项结果 | 对照上方 ①② 日志定位 |

## 📝 开发

```bash
# 改完源码后:
node --check lib/index.js && node --check client/client.js   # 语法
# 用自由端口试启动,观察预热自检与路由:
dsh web --port 0
curl http://127.0.0.1:<port>/wanderer-theme/health
```

## 📄 许可

MIT。角色素材版权归米哈游（miHoYo / HoYoverse），仅供个人本地界面美化使用。
