# 更新日志

## 0.1.4 — 未发布

- **毛玻璃虚化开关组（调色盘新分区）**：新增总开关 `frostMaster`、分项子开关 `frostPlugin`（插件独立窗）/ `frostNative`（原生面板），以及独立强度滑块 `frostBlur`（0–30px，0 等同关闭）。四项均走 `/api/dsh-qingxiao/settings` 持久化，「全部恢复默认」一并复原，旧 settings.json 缺这几个键时自动回退默认值（true/true/true/14）。关闭的分项对应 CSS 整条不匹配——`backdrop-filter` 声明压根不存在，浏览器不再为其保留 GPU 合成层；总开关同时收编旧版「面板磨砂玻璃」。新键须在 `lib/index.js` 的 sanitize 白名单登记（`frostBlur` 限 0–30），该项改动要重启 DSH 才生效，未重启期间由 localStorage 镜像兜住，刷新不丢设置。
- **原生面板虚化**：左侧会话栏 `[class*='sidebarCol']`（含旧 `[data-pane='sidebar']`）与右侧详情栏 `[class*='detailsCol']`，外加 better-sidebar 注入的文件面板与底部面板 `[data-dsh-panel-host] > [data-dsh-panel]`（图二不在原生两列内，早期调研误以为同挂 detailsCol，实为挂在 fixed 满视口壳里的 `absolute` 面板；两条虚化目标并列写为独立 complex selector，避免 `:is()` 把两列那条的特异度从 (0,4,2) 抬到 (0,5,2)，满视口壳本体保持零虚化）各垫一层 `::after` 虚化，隐约透出壁纸而正文墨色不糊。虚化只挂伪元素、容器自身绝不吃 `backdrop-filter`，并给 static 的详情栏补 `position:relative`（relative 不产生 fixed 包含块）——设置弹窗照旧展开为宽版，不重演 v0.1.2 塌缩竖排；中央对话列 `_centerCol` 与 `frame` 明确不碰。
- **图一（usage-stats 类插件窗）质感升级**：打标时实测窗口自身底色，完全不透明的（`section.usg_panel` 的 `rgb(97,102,107)`）追加 `.qx-frost-solid`，由明/暗双选择器（沿用 0.1.3 令牌防翻盘经验；两条**各 (0,5,1)**——亮色那条用 `:not()` 参数补回一个属性选择器，与暗色那条打平）把窗底换成 `rgba(var(--qx-panel-rgb), var(--qx-frost-panel-alpha))` 半透明皮肤底，并摘掉直接子层的底色，让原本被盖死的虚化层透出来；深层按钮/表格保留自身底色，字不糊。新令牌 `--qx-frost-panel-alpha`：亮色 0.72、暗色 0.62。
- **dsh-market 独立窗口插件适配**：打标范围从「body 直接子节点」扩到 ① body 级零尺寸挂载壳下探一层（better-sidebar 的 `[data-dsh-panel-host]` 之例，即图二文件面板）与 ② frame 的浮层容器 `overlayLayer` / `[data-slot='shell.overlay']`（agent-teams、aemeath 等走 `slots.inject('shell.overlay')` 的插件窗）；观察器一律仍只 `childList`（不碰 subtree/attributes，流式渲染零开销），浮层宿主首次发现后就地挂观察（实测：往 `shell.overlay` 里插一个 z-index 只有 5 的窗，无点击、500ms 内即被打标虚化），另加点击后 60ms 去抖补扫，兜住「预挂载 `display:none`、点开只改 style」这类无 DOM 新增的窗。DSH 原生弹窗不误伤：`role=dialog|alertdialog|alert|menu|listbox|tooltip`、`aria-modal`、`data-slot^="shell."`、内含侧栏/对话主区的应用主框、铺满视口的遮罩一律跳过，overlayLayer 内只认「自身画了底色」的节点。
- **dispose 补清**：三个新 body 属性、`--qx-frost-blur` 内联变量、点击监听、去抖计时器与浮层容器观察目标全部撤回，`.qx-frost` / `.qx-frost-solid` 标记摘净。
- **对话区淡灰字提浓**：覆盖 DSH `--dsw-alias-label-secondary/tertiary` 令牌（浅色 #61666b/#81858c → #39454f/#5a6672，暗色微提至 #dde1e5/#c4cad1），工具行标题、时间戳、卡片描述、底部统计行在画卷底上不再灰成一片；明暗双选择器 (0,2,1) 防主题包翻盘。
- **文字清晰度增强（纯字体，不动玻璃底色）**：明/暗各自给琉璃表面（插件窗 `.qx-frost`、侧栏/详情栏、文件与底部面板）的全部文字加 1/3/6px 三层底色光晕（浅色白晕、暗色墨晕），挂在既有「文字对比度增强」开关下（默认开，调色盘可关）；旧增强只挑 `p/li/td`，面板文字几乎全是 span/div 所以没管到，新规则挂容器随继承全覆盖。同时皮肤自身 `--qx-text-soft` 透明度 0.72→0.9/0.92、`--qx-text-faint` 0.5→0.7（浅）/0.48→0.68（暗），修掉「字体颜色淡」。
- **插件窗毛玻璃**（B站@角落里暗伤 建议，本版并入上述开关组）：其他插件的小窗口（body 级 fixed、z-index≥10 的浮层）弹出时自动打标 `.qx-frost`，用 `::before` 伪元素承载 `backdrop-filter` 给背景加虚化——半透明插件窗不再透出壁纸糊住文字。虚化放伪元素而非窗口本体，避免把窗口内 fixed 弹窗的包含块困进窗口（v0.1.2 弹窗塌缩同款陷阱）；应用主框由尺寸/角色守卫 + 600ms 迟到复查双重排除。

## 0.1.3 — 2026-09-01

- **适配 dsh 0.1.2-alpha.1（本次发布主项）**：主题包把背景令牌改定义在 `body` / `body[data-ds-dark-theme]` 且样式表注入在皮肤之后，同特异度后来者胜，暗色形态的侧栏与对话框周围因此变回不透明黑。皮肤令牌覆盖拆为明/暗双选择器（特异度 0,2,1），无论注入先后都稳压主题；新增 `--dsw-alias-bg-layer-2/3` 玻璃化（新版对话框/菜单/浮层改读这两档）。亮/暗两形态均以无头 Edge + CDP 实测恢复。
- `dsh.client.version` 兼容范围扩至 `0.1.0-rc.6 - 0.1.2-alpha.1`。
- 正文字号缩放修复：`font` 简写不接受 `calc()`，旧令牌覆盖整条被浏览器丢弃导致滑块无反应；改为运行时生成 px 字面量令牌表，并在面板加「实测正文」自校验读数。
- 对话区宽度一并覆盖 `--dsh-chat-content-width`（新版正文列/输入卡读该令牌，只写 max-width 会被 DSH 卡住）。
- 移除本地预览沙盒（`preview/mockup.html`、`preview/dev-server.mjs`）及 README「本地预览 / 开发」章节。
- 设置面板页脚版本号 `SKIN_VERSION` 与 `package.json` 保持同步。

## 0.1.2 — 2026-08-29

- 修复 `peerDependencies` 预发布版本范围：`^0.1.0-rc.6` 实际匹配不到兼容上限 `0.1.1-rc.x`，改为显式范围 `>=0.1.0-rc.6 <0.1.1-0 || >=0.1.1-rc.1 <0.2.0-0`，消除安装时可能的 `ERESOLVE`
- 新增 `screenshots.json`，声明 dsh-market 详情页展示的截图及顺序
- `cordis.patch.yml` 注释中文化；新增本更新日志

## 0.1.1 — 2026-08-29

- 修复审批/确认框触发插件重挂时粒子层泄漏叠加的问题（「流光越弹越多、数量设 0 仍有流光」）
- 皮肤入场与销毁改为全量清扫 + 幂等 dispose，重挂不再叠加

## 0.1.0 — 2026-08-29

- 首个完整版本：背景画卷、调色盘面板、剑气流光、迎宾页
