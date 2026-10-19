# dsh-plugin-aurora-bg

给 dsh desktop（0.2.1）用的 Aurora 背景 UI：毛玻璃表面 + 自定义背景图 + 主色联动，
带**可视化面板**，可用滑块逐个调节每个面板的透明度。

移植自 `@deepseek-ai/dsh-client-ui-aurora@0.1.1-rc.2` —— 0.2.1 运行时里没有这个包，npm 上也未发布。

## 安装

桌面端 profile 由 Electron 应用独占管理（`dsh plugin --profile desktop …` 会被官方拒绝），二选一：

1. 应用内「设置 → 插件 → 添加本地插件」，选本目录；
2. 手工：目录放进 `%USERPROFILE%\.dsh\profiles\desktop\plugins\`，在该 profile 的
   `package.json` 加 `link:` 依赖、包名加入 `dsh.profile.bundles`，再用自带 pnpm 装依赖。

装完重启 dsh desktop。

## 调节

侧栏底部「🎛 外观」→ 8 个滑块：主内容列 / 卡片 / 次级面板 / 侧栏 / 输入框 / 按钮 / 选中项 / 背景模糊。
拖动即时生效并自动保存，「重置为默认」清掉覆盖。

也可以直接改 `<DSH_HOME>\dsh-plugin-aurora-bg\settings.json`，保存后 4 秒内生效：

```jsonc
{
  "mode": "custom",                     // custom | aurora | none | 预设名
  "url": "/aurora-bg/asset/<图片>",      // 同源路径、https 图片地址，或 data: URL
  "blur": 0,                            // 背景模糊 0~30 px
  "panelAlpha": 18,                     // 总开关：alpha 里没写的表面按它派生
  "alpha": { "base": 18, "layer": 40, "layer2": 34,
             "sidebar": 11, "input": 40, "button": 42, "selector": 42 }
}
```

`alpha` 取值 0~95，只写关心的几项即可。背景图放在
`<DSH_HOME>\dsh-plugin-aurora-bg\assets\`，**不进版本库**（`.gitignore` 已排除）。

## 令牌映射

| 键 | 令牌 | 表面 |
|---|---|---|
| `base` | `--dsw-alias-bg-base` | 主内容列 |
| `layer` / `layer2` | `--dsw-alias-bg-layer-1` / `-2` | 卡片 / 次级面板 |
| `sidebar` | `--dsw-specific-sidebar-fill` | 侧栏、外框、标题栏 |
| `input` | `--dsw-specific-input-major` | 输入框 |
| `button` | `--dsw-alias-button-elevated-fill` | 按钮 |
| `selector` | `--dsw-specific-selector` | 选中项 |

## 实现要点

相对原包只改了三处：

1. 模块 id 改为本包名；
2. `inject` 去掉 `settingsScope`（0.2.1 客户端已无此服务），改为 Host 的 `/aurora-bg` HTTP 路由落盘；
3. 背景图从 4.2 MB 内联 data URL 改为资产文件，bundle 降到 ~80 KB。

**Windows 标题栏**（最小化/最大化/关闭那条）不是网页元素，而是 Electron 的 `titleBarOverlay`：
桌面端 preload 用探针读 `--dsw-specific-sidebar-fill`，再经 `dsh-desktop:windows-appearance` 交给主进程
`setTitleBarOverlay()`。所以本包把该令牌在 `:root` 上设为全透明、只在应用根元素上给淡色底，
按钮区因此与顶栏同透。

## 已知限制

- 原包「设置 → 外观」整页注册在 `settings.section` 插槽，0.2.1 已改用 `plugins.item`，那一页可能不出现；侧栏按钮正常。
- 背景图经浏览器 canvas 再编码（JPEG q88、长边 ≤5120）后上传，不保留原图。
- 首次从 Host 读到配置前不写 `alpha` 字段，避免冷启动把已调好的值清空。

MIT License
