# dsh-plugin-aurora-bg（桌面端移植版 + 可调节）

把 web 端的 Aurora 背景 UI 移植到 dsh desktop 0.2.1，并按
[dsh-skin-master](https://github.com/Lzhimie/dsh-skin-master) 的做法补上了**可自行调节 + 持久化**。

## 一、移植改了什么（相对 `@deepseek-ai/dsh-client-ui-aurora@0.1.1-rc.2`）

| # | 原实现 | 现在 | 原因 |
|---|---|---|---|
| 1 | 模块 id `@deepseek-ai/dsh-client-ui-aurora` | `dsh-plugin-aurora-bg` | 变成 profile 插件 |
| 2 | `inject` 含 `settingsScope` | 去掉 | 0.2.1 客户端已无此服务（全 asar 0 命中） |
| 3 | 配置存在 settings 服务 | 走 Host 的 `/aurora-bg` 路由，落盘 JSON | 与 skin-master 一致；不依赖任何版本相关服务 |
| 4 | 背景图存成 4.2 MB data URL 内联在 bundle | 上传成资产文件，配置只存同源路径 | client.js 从 4.2 MB 降到 68 KB |
| 5 | 各表面透明度与 web 一致 | **保持 web 原值不变**（见下表），改用背景模糊来消除割裂感 | 观感与 web 端对齐 |

视觉逻辑（`--dsw-alias-*` 毛玻璃令牌、背景层 CSS、主色提取）未改。

## 二、Host 半（`lib/index.js`）

`inject: ['webServer']`，注册一条 prefix 路由：

| 路由 | 作用 |
|---|---|
| `GET  /aurora-bg/settings` | 读取 `{ mode, url }` |
| `POST /aurora-bg/settings` | 写入（只保留 mode/url 两个字段） |
| `POST /aurora-bg/asset?name=x` | 上传背景图，返回同源 URL |
| `GET  /aurora-bg/asset/<name>` | 回传图片，支持 `Range`（大图/视频流式读取） |

存储位置（在 harness home 下，与 profile 解耦，换 profile 也还在）：

```
<DSH_HOME>\dsh-plugin-aurora-bg\settings.json
<DSH_HOME>\dsh-plugin-aurora-bg\assets\<你的图片>
```

## 三、透明度与模糊

透明度（`lib/client.js` 里的 `const baseA = image ? … : …` 一组）**与 web 端 0.1.1-rc.2 完全一致**，14 个常量逐项核对无差异：

| 令牌 | 表面 | 照片模式 alpha | 无图模式 alpha |
|---|---|---|---|
| `baseA` | 主内容列 | **0.18** | 0.62 |
| `layerA` | 卡片/面板 | **0.40** | 0.90 |
| `layer2A` | 次级面板 | 0.34 | 0.86 |
| `sideA` | 侧栏/外框 | **0.10** | 0.30 |
| `inputA_L/D` | 输入框 | 0.40 / 0.34 | 0.68 / 0.58 |
| `btnA_L/D` | 按钮 | 0.42 / 0.36 | 0.52 / 0.46 |
| `selA_L/D` | 选择项 | 0.42 / 0.36 | 0.52 / 0.46 |
| `sendA_L/D` | 发送键 | 0.62 / 0.56 | 0.72 / 0.66 |

**磨砂面不是背景层造成的** —— 0.2.1 的玻璃面板/菜单用
`--dsw-menu-backdrop-filter: blur(40px) saturate(150%)` 把背后内容糊成磨砂。
本插件已把它覆盖为 `none`，所以面板后面的背景图是清晰的。

**背景模糊**（默认关闭）：如仍想要柔化，只作用于 `[data-slot="root"]::before` 这一层背景，
不影响界面元素；同时 `transform: scale()` 放大一点点，抵消模糊在四边产生的透明羽化。
恢复 0.2.1 原来的磨砂观感：把 `--dsw-menu-backdrop-filter` 那两行删掉即可。

```jsonc
// .dsh\dsh-plugin-aurora-bg\settings.json
{ "mode": "custom", "url": "/aurora-bg/asset/<你的图片>", "blur": 16 }
```

| `blur` | 效果 |
|---|---|
| `0` | 不模糊（与 web 完全一致） |
| `16` | 当前默认，柔和但认得出画面 |
| `30` | 明显磨砂，接近纯色氛围 |
| 上限 | 60（Host 端会夹取） |

改完 `settings.json` 后**刷新页面**即可，不必重启。


### 逐个框调节透明度（v1.1 起）

`settings.json` 里除了总开关 `panelAlpha`，还可以用 `alpha` **单独指定每个框**。
给了哪个就覆盖哪个，没给的仍按 `panelAlpha` 派生。

```jsonc
{
  "mode": "custom",
  "url": "/aurora-bg/asset/bg-default.jpg",
  "blur": 0,
  "panelAlpha": 18,                 // 总开关：未在 alpha 里出现的表面按它派生
  "alpha": {
    "base":     18,                 // 主内容列（聊天区）  --dsw-alias-bg-base
    "layer":    40,                 // 卡片 / 面板        --dsw-alias-bg-layer-1
    "layer2":   34,                 // 次级面板           --dsw-alias-bg-layer-2
    "sidebar":  11,                 // 侧栏 + 外框（同时决定标题栏那条）
    "input":    40,                 // 输入框             --dsw-specific-input-major
    "button":   42,                 // 按钮               --dsw-alias-button-elevated-fill
    "selector": 42                  // 选中的列表项       --dsw-specific-selector
  }
}
```

| 键 | 对应表面 | 调大 | 调小 |
|---|---|---|---|
| `base` | 主内容列 | 文字更清楚，照片更淡 | 照片更透 |
| `layer` | 卡片/面板 | 卡片更实 | 卡片几乎透明 |
| `layer2` | 次级面板 | 同上 | 同上 |
| `sidebar` | 侧栏 + 外框 + 标题栏 | 侧栏更实 | 侧栏全透 |
| `input` | 输入框 | 输入区更实、更好读 | 更透 |
| `button` | 按钮 | 按钮更实 | 更透 |
| `selector` | 选中的会话/列表项 | 更实 | 更透 |

取值范围 **0~95**，数值即「不透明度百分比」，`0` = 全透明、`95` = 几乎不透明。

> **热更新**：改完保存即可，客户端每 4 秒重读一次配置，**不需要刷新页面**。
> 用界面上的「🎨 背景」改背景图时，`alpha` 会被原样保留，不会被冲掉。


### 可视化面板（v1.2 起）

不需要改 JSON —— 侧栏底部「🎛 **外观**」按钮点开后是 8 个滑块：

| 滑块 | 控制 |
|---|---|
| 主内容列 | 聊天区底色 |
| 卡片 / 面板 | 卡片、面板 |
| 次级面板 | 次级面板 |
| 侧栏 / 外框 | 侧栏、外框（标题栏那条一起变） |
| 输入框 | 底部输入区 |
| 按钮 | 各类按钮 |
| 选中项 | 选中的会话 / 列表项 |
| 背景模糊 | 0~30px |

- **拖动即时生效**（当场写 CSS 变量，不用确认、不用刷新）
- **自动保存**：停手 400ms 后 POST 到 Host 落盘，重启后保持
- 「重置为默认」清掉 `alpha` 覆盖，回到按 `panelAlpha` 派生

面板与 `settings.json` 是同一份数据：手动改文件后，面板数值会在 4 秒内同步；反过来，拖滑块也会改写 `settings.json` 的 `alpha` 块。

## 四、Windows 自绘标题栏（最小化/最大化/关闭）

那条标题栏**不是网页元素**，是 Electron 的 `titleBarOverlay`。桌面端 preload 里的取值链是：

```
探针 span  background-color: var(--dsw-specific-sidebar-fill)
  → canvas 量色（nativeColor）
  → ipcRenderer.send('dsh-desktop:windows-appearance', lang, color, symbolColor)
  → 主进程 mainWindow.setTitleBarOverlay({ color, symbolColor })
```

所以标题栏底色 = `--dsw-specific-sidebar-fill`。本插件在 `:root` 上用 `!important` 覆盖该令牌
（深色 `rgba(9,13,24,α)`、浅色 `rgba(239,243,252,α)`，α = panelAlpha × 0.6），
标题栏因此与面板同色同透明度。preload 挂了 MutationObserver，令牌一变就自动重发，无需重启。

按钮图标的颜色走 `--dsw-alias-label-primary`（symbolColor），本插件**未改动**。

## 五、怎么调

**界面**：左侧栏底部的「🎨 背景」按钮 → 选图 / 填 URL / 选预设 / 重置。
改动会 400 ms 去抖后 `POST /aurora-bg/settings`，**刷新与重启都会记住**。

**直接改文件**（等价，最直接）：

```jsonc
// settings.json
{
  "mode": "custom",                                    // custom | aurora | none | 预设名
  "url": "/aurora-bg/asset/<你的图片>"             // 同源路径，或任意 https 图片地址，或 data: URL
}
```

换图两种方式：
1. 把图片丢进 `assets\` 目录，然后把 `url` 改成 `/aurora-bg/asset/<文件名>`；
2. 直接把 `url` 写成一个 `https://…` 图片地址。

**调观感**：

| 想要的效果 | 改法 |
|---|---|
| 照片更透 | `baseA` 0.30 → 0.20，`sideA` 0.16 → 0.10 |
| 照片更实 | `baseA` → 0.45 |
| 内容区更好读 | `layerA` 0.84 已经够实；不够就加 `blur` |
| 完全不要模糊 | `settings.json` 里 `"blur": 0` |

## 六、已知限制

- 原包「设置 → 外观」整页注册在 `settings.section` 插槽，0.2.1 已改用 `plugins.item`，
  所以那一页可能不出现；侧栏的「🎨 背景」按钮（`sidebar.footer.action`）在 0.2.1 实测存在。
- 大图经浏览器 canvas 再编码（JPEG q88、长边限制）后才上传，原图不会被保留。

## 安装（dsh desktop）

桌面端 profile 由 Electron 应用独占管理，`dsh plugin --profile desktop add …` 会被官方拒绝
（`profile "desktop" is managed exclusively by the Electron application`）。请任选：

**A. 应用内安装（推荐）**：设置 → 插件 → 添加本地插件，选择本仓库目录。

**B. 手工登记**：
1. 把仓库放到 `%USERPROFILE%\.dsh\profiles\desktop\plugins\<包名>\`
2. 在该 profile 的 `package.json` 里加 `link:` 依赖，并把包名加入 `dsh.profile.bundles`
3. 用桌面版自带 pnpm 装依赖，然后重启 dsh desktop

## 开发

本仓库是纯源码包，无构建步骤：`main` / `exports` 直接指向 `lib/`，
`dsh.bundle.patch` 指向 `cordis.patch.yml`。
