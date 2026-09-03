window.__ModuleLoader__.load({
	id: "@taosee258/dsh-client-ui-skin-qingxiao",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ═══════════════════════════════════════════════════════════════
		//  清宵 · 弦凝清霄 —— client-side skin
		//  Palette: 冰蓝 ice-blue / 青碧 jade-cyan / 月白 moon-white /
		//           玄夜 night-indigo / 鎏金 gold trim
		// ═══════════════════════════════════════════════════════════════

		var SKIN_OWNER = "qingxiao";
		// 与 package.json 的 version 保持一致（面板页脚会展示）。
		var SKIN_VERSION = "0.1.4";
		var SKIN_TITLE = "清宵 · DeepSeek Harness";
		var SKIN_SYSTEM_CHROME_COLOR_LIGHT = "#EEF7FB";
		var SKIN_SYSTEM_CHROME_COLOR_DARK = "#0B1E2E";
		var SETTINGS_URL = "/api/dsh-qingxiao/settings";
		var DEFAULT_BG_URL = "/api/dsh-qingxiao/default-background";
		var LOCAL_SETTINGS_KEY = "dsh-client-ui-skin-qingxiao.settings";
		var SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])";
		var BACKDROP_PROPERTIES = [
			"background-image",
			"background-position",
			"background-size",
			"background-attachment",
			"background-repeat"
		];

		// ── 正文字号缩放：DSH markdown 字体令牌表 ──
		// 每一项对应 DSH 皮肤层里的一条令牌，格式是 font 简写：
		//   [基名, 基准字号px, 基准行高px, 字重("" = 不写), 字族, 是否斜体]
		// 基准值取自 @deepseek-ai/dsh-client-ui-theme 的令牌定义，改这里就等于
		// 改「100% 时长什么样」；滑块只做等比缩放。
		var QX_FONT_TOKENS = [
			["base", 16, 28, "", "text", false],
			["base-strong", 16, 28, "600", "text", false],
			["base-italic", 16, 28, "", "text", true],
			["base-strong-italic", 16, 28, "600", "text", true],
			["h1", 24, 34, "700", "text", false],
			["h2", 22, 32, "700", "text", false],
			["h3", 20, 30, "700", "text", false],
			["h4", 16, 28, "600", "text", false],
			["small", 14, 24, "", "text", false],
			["small-strong", 14, 24, "600", "text", false],
			["small-italic", 14, 24, "", "text", true],
			["small-strong-italic", 14, 24, "600", "text", true],
			["table", 15, 25, "", "text", false],
			["table-head", 15, 25, "500", "text", false],
			["code", 14, 22, "", "code", false],
			["code-block", 13, 22, "", "code", false],
			["code-block-small", 12, 18, "", "code", false]
		];
		var QX_FONT_SCOPE = "body[data-dsh-qingxiao] :is([data-slot='conversation'], [data-conversation-scroll])";

		function qxPx(value) {
			return Math.round(value * 100) / 100;
		}

		// 生成字号缩放表：全部写成具体 px 字面量（不用 calc、不用 var 参与简写），
		// 这样 DSH 的 font:var(--dsw-font-markdown-*) 才能正常解析。
		// 同时补一组 font-size/line-height 长属性兜底：万一 DSH 改了令牌名，
		// 正文仍然会跟着缩放，且 px 字面量在嵌套 markdown 里不会二次放大。
		function buildFontScaleCss(scale) {
			var decls = [];
			var out = {};
			QX_FONT_TOKENS.forEach(function(spec) {
				var name = spec[0];
				var size = qxPx(spec[1] * scale);
				var lh = qxPx(spec[2] * scale);
				var weight = spec[3];
				var family = spec[4] === "code" ? "var(--ds-font-family-code)" : "var(--dsw-font-family)";
				out[name] = [size, lh];
				decls.push("--dsw-font-markdown-" + name + ": " + (spec[5] ? "italic " : "") + (weight ? weight + " " : "") + size + "px/" + lh + "px " + family + ";");
				decls.push("--dsw-font-markdown-" + name + "-font-size: " + size + "px;");
				decls.push("--dsw-font-markdown-" + name + "-line-height: " + lh + "px;");
			});
			var css = QX_FONT_SCOPE + "{--qx-font-scale:" + qxPx(scale) + ";\n" + decls.join("\n") + "\n}";
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown']{font-size:" + out.base[0] + "px;line-height:" + out.base[1] + "px;}";
			["h1", "h2", "h3"].forEach(function(h) {
				css += "\n" + QX_FONT_SCOPE + " [class*='_markdown'] " + h + "{font-size:" + out[h][0] + "px;line-height:" + out[h][1] + "px;}";
			});
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown'] :is(h4,h5,h6){font-size:" + out["base-strong"][0] + "px;line-height:" + out["base-strong"][1] + "px;}";
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown'] :is(th,td){font-size:" + out.table[0] + "px;line-height:" + out.table[1] + "px;}";
			return css;
		}

		// 实测对话正文当前的像素字号：给面板做自校验用。
		function measureConversationFont() {
			var el = document.querySelector("[data-conversation-scroll] [class*='_markdown']")
				|| document.querySelector("[data-slot='conversation'] [class*='_markdown']");
			if (!el || typeof getComputedStyle !== "function") return null;
			var size = parseFloat(getComputedStyle(el).fontSize);
			return isFinite(size) ? Math.round(size * 100) / 100 : null;
		}

		// ═══════════════════════════════════════════════════════════════
		//  PALETTE STATE
		// ═══════════════════════════════════════════════════════════════

		var PALETTE_DEFAULTS = {
			textContrastBoost: true,
			panelBlur: false,
			goldTrim: false,
			particles: true,
			lightCharms: false,
			darkCharms: false,
			scrimOpacity: 55,
			panelOpacity: 45,
			contentWidth: 880,
			particleCount: 60,
			particleSpeed: 100,
			fontScale: 100,
			frostMaster: true,
			frostPlugin: true,
			frostNative: true,
			frostBlur: 14,
			lightBackground: null,
			darkBackground: null
		};

		// ═══════════════════════════════════════════════════════════════
		//  THEME STYLESHEET
		// ═══════════════════════════════════════════════════════════════

		var THEME_CSS = `
/* ── 清宵调色板根变量 ─────────────────────────────── */
body[data-dsh-qingxiao] {
	--qx-ice: #8FC7EA;
	--qx-cyan: #56C8C0;
	--qx-cyan-bright: #7FE0D6;
	--qx-jade: #2E9E98;
	--qx-gold: #D9B66A;
	--qx-gold-bright: #E8CD8F;
	--qx-moon: #F4F9FC;
	--qx-night: #0B1E2E;
	--qx-cyan-rgb: 86, 200, 192;
	--qx-gold-rgb: 217, 182, 106;
	--qx-panel-alpha: 0.78;
	--qx-content-width: 780px;
	--qx-font-scale: 1;
	--qx-particle-speed: 1;
	/* 毛玻璃虚化强度（0–30px）：调色盘滑块把真值写在 body 内联样式上，这里是兜底 */
	--qx-frost-blur: 14px;
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) {
	--qx-text: #16303F;
	--qx-text-soft: rgba(22, 48, 63, 0.72);
	--qx-text-faint: rgba(22, 48, 63, 0.5);
	--qx-panel-rgb: 248, 252, 254;
	/* 插件窗玻璃底不透明度（明/暗双选择器 0,2,1，0.1.3 防翻盘写法）：
	   亮色画卷偏亮，底要更实才不糊字 */
	--qx-frost-panel-alpha: 0.72;
	--qx-panel-border: rgba(86, 168, 200, 0.38);
	--qx-panel-border-strong: rgba(46, 158, 152, 0.55);
	--qx-sink: rgba(22, 48, 63, 0.06);
	--qx-accent-strong: #1F7E86;
}
body[data-dsh-qingxiao][data-ds-dark-theme] {
	--qx-text: #D9EDF5;
	--qx-text-soft: rgba(217, 237, 245, 0.72);
	--qx-text-faint: rgba(217, 237, 245, 0.48);
	--qx-panel-rgb: 10, 26, 40;
	/* 暗色下窗底可以更透，壁纸透得出来；正文垫着虚化层照样清晰 */
	--qx-frost-panel-alpha: 0.62;
	--qx-panel-border: rgba(127, 224, 214, 0.22);
	--qx-panel-border-strong: rgba(127, 224, 214, 0.45);
	--qx-sink: rgba(217, 237, 245, 0.07);
	--qx-accent-strong: #7FE0D6;
}

/* ── 玻璃化覆盖：把 DSH 各层不透明背景改为半透明玻璃，让背景画卷透出来 ──
   真实 DSH 的 frame、会话区(_root)、详情区等都用 var(--dsw-alias-bg-base) 等
   不透明 token 作为背景，会把 body 上的画卷完全盖住。这里按主题面板色重写成
   半透明玻璃，画卷经三列与面板透出。 */
/* 0.1.2-alpha.1 起主题包把令牌定义挪到 body / body[data-ds-dark-theme]
   （特异度 0,1,1），且主题样式表注入在皮肤 <style> 之后——旧的
   body[data-dsh-qingxiao] 单选择器在暗色模式与主题同特异度、后来者胜，
   被整个翻盘：侧栏底色变回不透明 #1b1b1c、对话框周围变黑。这里拆成
   明暗两条选择器（特异度 0,2,1），无论样式表先后都稳压主题的
   (0,1,1)/(0,0,1)。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]),
body[data-dsh-qingxiao][data-ds-dark-theme] {
	/* 可读性平衡：面板调到足够实，正文落在可读的底色上；画卷仍从边缘与
	   半透明处透出，不至于盖过文字。 */
	--dsw-alias-bg-base: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.55));
	--dsw-alias-bg-layer-1: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.70));
	/* 0.1.2-alpha.1 的对话框/菜单/浮层改用 layer-2、layer-3 作底，一并玻璃化，
	   否则弹窗与对话框周围仍会残留不透明黑块。 */
	--dsw-alias-bg-layer-2: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.85));
	--dsw-alias-bg-layer-3: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.92));
	--dsw-specific-sidebar-fill: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.78));
	/* 主按钮：DSH 默认 --dsw-alias-button-primary-fill 是 #0f1115（近黑），
	   会让“允许一次/确认”等对话框主按钮变成黑底。这里改用清宵青碧，
	   与皮肤配色统一，也避免黑底突兀。文本仍走皮肤深色，够清晰。 */
	--dsw-alias-button-primary-fill: #2E9E98;
	--dsw-alias-button-primary-hover: #26837E;
}
body[data-dsh-qingxiao] [id=root] {
	background: transparent;
}
/* 兜底：应用外壳 frame 强制透明，让画卷透出。
   注意：绝不能用 [class$='_root'] 这类宽泛选择器——dsh-better-sidebar 的
   侧边栏根类名以 _root 结尾，鼠标悬停时插件会摘掉其 quietBars 修饰类，
   使根类名恰好以 _root 结尾而命中此规则，导致侧边栏在悬停时被强制变透明
   （背景画卷透更多、颜色变绿变透）。只保留 frame 即可。 */
body[data-dsh-qingxiao] [id=root] [class*='frame'] {
	background: transparent !important;
}

/* ── 文字对比增强： stronger ink, soft halo keeps glyphs crisp over art ── */
body[data-dsh-qingxiao][data-qx-contrast='on']:not([data-ds-dark-theme]) {
	--qx-text: #0C2230;
	--qx-text-soft: rgba(12, 34, 48, 0.85);
	--qx-text-faint: rgba(12, 34, 48, 0.62);
}
body[data-dsh-qingxiao][data-qx-contrast='on'][data-ds-dark-theme] {
	--qx-text: #EAF6FB;
	--qx-text-soft: rgba(234, 246, 251, 0.85);
	--qx-text-faint: rgba(234, 246, 251, 0.6);
}
body[data-dsh-qingxiao][data-qx-contrast='on'] [id=root] :is(p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote) {
	text-shadow: 0 1px 2px rgba(var(--qx-panel-rgb), 0.55);
}

/* ── 根画布： inherit themed ink everywhere ── */
body[data-dsh-qingxiao] {
	color-scheme: light;
}
body[data-dsh-qingxiao][data-ds-dark-theme] {
	color-scheme: dark;
}
body[data-dsh-qingxiao] [id=root] {
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [id=root] :is(h1, h2, h3, h4, h5, h6, p, li) {
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [id=root] ::selection {
	background: rgba(var(--qx-cyan-rgb), 0.35);
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [id=root] a {
	color: var(--qx-accent-strong);
	text-decoration-color: rgba(var(--qx-cyan-rgb), 0.55);
	text-underline-offset: 3px;
}
body[data-dsh-qingxiao] [id=root] a:hover {
	color: var(--qx-cyan-bright);
}

/* ── 玻璃列布局： sidebar / chat column / details turn translucent so
      the art shows through while text stays on solid-enough ground ── */
body[data-dsh-qingxiao] [id=root] > * {
	background: transparent;
}
body[data-dsh-qingxiao] [data-pane='sidebar'],
body[data-dsh-qingxiao] [class*='sidebarCol'] {
	background: rgba(var(--qx-panel-rgb), var(--qx-panel-alpha)) !important;
	border-right: 1px solid var(--qx-panel-border) !important;
}
/* 面板磨砂玻璃（panelBlur）：绝对不能把 backdrop-filter 直接放在容器上——
   那会让容器成为 position:fixed 后代（设置对话框等 portal）的“包含块”，
   把弹窗困在侧边栏里塌缩成竖排。安全做法：把 backdrop-filter 放到各容器
   的 ::after 伪元素上，且用 z-index:-1 垫在半透明面板之下、正文之上；
   ::after 不包含任何 portal，所以不困浮层，正文也保持清晰，只有底下的
   画卷被磨砂。 */
body[data-dsh-qingxiao][data-qx-blur='on']:not([data-qx-frost='off']) :is([data-pane='sidebar'], [class*='sidebarCol'], [class*='_centerCol'], [class*='detailsCol']) {
	position: relative;
}
body[data-dsh-qingxiao][data-qx-blur='on']:not([data-qx-frost='off']) :is([data-pane='sidebar'], [class*='sidebarCol'], [class*='_centerCol'], [class*='detailsCol'])::after {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	backdrop-filter: blur(5px) saturate(1.1);
	-webkit-backdrop-filter: blur(5px) saturate(1.1);
}
body[data-dsh-qingxiao] [class*='_centerCol'],
body[data-dsh-qingxiao] [class*='detailsCol'] {
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.72));
}
body[data-dsh-qingxiao] [class*='_centerCol'] > * {
	max-width: var(--qx-content-width);
	/* 说明：设置等弹窗“逐字竖排/挤在左边”的真正元凶是上方容器的
	   backdrop-filter（它把弹窗 portal 困在侧边栏里），而不是本条的
	   margin:auto。保留 max-width 限宽即可。 */
}
/* ── 对话区宽度 + 正文字号缩放：接到真正的对话内容上 ──
   旧选择器只作用于 centerCol 的直接子元素，没命中更深的对话内容，所以
   拖这两个滑块没反应。对话内容在 [data-slot='conversation'] > *（滚动的
   wSkVaW_root），正文用 [data-conversation-scroll] 定位。 */
body[data-dsh-qingxiao] [data-slot='conversation'] > * {
	/* DSH 的对话列宽走 --dsh-chat-content-width（正文列、输入卡、表格溢出都读它），
	   只在容器上写 max-width 到 748px 就被 DSH 自己的令牌卡住，所以这里一并覆盖。 */
	--dsh-chat-content-width: var(--qx-content-width);
	max-width: var(--qx-content-width);
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	/* 居中显示。之前浮层跑到中间是 zoom 改了 position:fixed 坐标所致，
	   此处已去掉 zoom，浮层会正确锚定在标注旁。 */
	background: transparent !important;
}
/* 正文字号缩放：不能对对话正文用 zoom（会错位 position:fixed 浮层），
   思路仍是覆盖 DSH 的 markdown 字号令牌，只作用于对话区。
   但绝不能在 font 简写的字号/行高位置上写 calc()——DSH 消费这些令牌的方式是
   font:var(--dsw-font-markdown-base)，而 font 简写解析器不接受 calc()，
   代入后整条声明按 invalid-at-computed-value-time 丢弃，滑块于是毫无反应。
   具体 px 字面量由 buildFontScaleCss() 在运行时算好，写进
   <style data-skin-chrome="font-scale">（见 lib/client.js 末尾的 apply）。 */
body[data-dsh-qingxiao] [class*='_composerSeat'] {
	font-size: calc(1rem * var(--qx-font-scale));
}

/* ── 侧边栏 ── */
body[data-dsh-qingxiao] [data-pane='sidebar'] *,
body[data-dsh-qingxiao] [class*='sidebarCol'] * {
	border-color: transparent;
}
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) button {
	background: transparent !important;
	border: 1px solid transparent !important;
	border-radius: 10px;
}
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) button:hover {
	background: rgba(var(--qx-cyan-rgb), 0.14) !important;
	border-color: rgba(var(--qx-cyan-rgb), 0.35) !important;
}
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) [aria-selected='true'],
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) [aria-current='true'],
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) .active,
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) [class*='active'] {
	background: rgba(var(--qx-cyan-rgb), 0.16) !important;
	box-shadow: inset 3px 0 0 0 var(--qx-cyan);
	color: var(--qx-accent-strong) !important;
}
body[data-dsh-qingxiao][data-qx-gold='on'] :is([data-pane='sidebar'], [class*='sidebarCol']) [aria-selected='true'],
body[data-dsh-qingxiao][data-qx-gold='on'] :is([data-pane='sidebar'], [class*='sidebarCol']) [aria-current='true'] {
	box-shadow: inset 3px 0 0 0 var(--qx-gold);
}
/* sidebar 云纹底饰（可开关的 charms）
   注意：只画在 sidebarCol::before 上会被 bsh 侧边栏子面板（hHd-Xa_root）
   的不透明背景盖住，所以同时在子面板自身底部画一层，才真正看得见。 */
body[data-dsh-qingxiao][data-qx-charms='on'] :is([data-pane='sidebar'], [class*='sidebarCol'])::before {
	content: "";
	position: absolute;
	inset: auto 0 0 0;
	height: 120px;
	pointer-events: none;
	background:
		radial-gradient(120% 90% at 50% 128%, rgba(var(--qx-cyan-rgb), 0.18), transparent 62%),
		radial-gradient(60% 40% at 18% 118%, rgba(var(--qx-gold-rgb), 0.16), transparent 70%);
}
body[data-dsh-qingxiao][data-qx-charms='on'] [data-dsh-sidebar-root] {
	position: relative;
}
body[data-dsh-qingxiao][data-qx-charms='on'] [data-dsh-sidebar-root]::after {
	content: "";
	position: absolute;
	inset: auto 0 0 0;
	height: 96px;
	pointer-events: none;
	z-index: 0;
	background:
		radial-gradient(120% 90% at 50% 128%, rgba(var(--qx-cyan-rgb), 0.16), transparent 62%),
		radial-gradient(60% 40% at 18% 118%, rgba(var(--qx-gold-rgb), 0.14), transparent 70%);
}
body[data-dsh-qingxiao] :is([data-pane='sidebar'], [class*='sidebarCol']) {
	position: relative;
}

/* ── 按键： ice-jade glass keys with a gold kiss on hover ── */
body[data-dsh-qingxiao] [id=root] button {
	color: var(--qx-text);
	border-radius: 10px;
	transition: background-color 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
body[data-dsh-qingxiao] [id=root] button:hover {
	background: rgba(var(--qx-cyan-rgb), 0.15);
	box-shadow: 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.4), 0 0 12px rgba(var(--qx-cyan-rgb), 0.22);
	color: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [id=root] button:active {
	transform: translateY(1px);
}
body[data-dsh-qingxiao] [id=root] button:focus-visible {
	outline: none;
	box-shadow: 0 0 0 2px rgba(var(--qx-gold-rgb), 0.65);
}
body[data-dsh-qingxiao] [id=root] button:disabled {
	opacity: 0.38;
	box-shadow: none;
}
body[data-dsh-qingxiao][data-qx-gold='on'] [id=root] button[class*='primary'],
body[data-dsh-qingxiao][data-qx-gold='on'] [id=root] button[type='submit'] {
	background: linear-gradient(135deg, rgba(var(--qx-cyan-rgb), 0.28), rgba(var(--qx-gold-rgb), 0.26));
	box-shadow: inset 0 0 0 1px rgba(var(--qx-gold-rgb), 0.5);
}

/* ── 输入控件 ── */
body[data-dsh-qingxiao] [id=root] :is(input, textarea, select) {
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.8)) !important;
	color: var(--qx-text) !important;
	border: 1px solid var(--qx-panel-border) !important;
	border-radius: 10px;
	caret-color: var(--qx-cyan);
	transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
body[data-dsh-qingxiao] [id=root] :is(input, textarea, select)::placeholder {
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [id=root] :is(input, textarea, select):focus {
	outline: none !important;
	border-color: rgba(var(--qx-cyan-rgb), 0.65) !important;
	box-shadow: 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.4), 0 0 14px rgba(var(--qx-cyan-rgb), 0.18);
}
body[data-dsh-qingxiao] [id=root] [class*='_composerSeat'] {
	border: 1px solid var(--qx-panel-border);
	border-radius: 14px;
	box-shadow: 0 4px 22px rgba(11, 30, 46, 0.12);
}
body[data-dsh-qingxiao] [id=root] [class*='_composerSeat']:focus-within {
	border-color: rgba(var(--qx-gold-rgb), 0.55);
	box-shadow: 0 0 0 1px rgba(var(--qx-gold-rgb), 0.35), 0 0 18px rgba(var(--qx-cyan-rgb), 0.2);
}

/* ── 代码块： always on deep-night glass so highlighting stays readable ── */
body[data-dsh-qingxiao] [id=root] pre {
	background: rgba(10, 26, 40, 0.92) !important;
	border: 1px solid rgba(127, 224, 214, 0.2);
	border-radius: 12px;
	color: #D9EDF5;
}
body[data-dsh-qingxiao] [id=root] pre,
body[data-dsh-qingxiao] [id=root] pre * {
	color: #D9EDF5;
	text-shadow: none;
}
body[data-dsh-qingxiao] [id=root] :not(pre) > code {
	background: rgba(var(--qx-cyan-rgb), 0.14);
	border: 1px solid rgba(var(--qx-cyan-rgb), 0.25);
	border-radius: 6px;
	color: var(--qx-accent-strong);
	padding: 1px 5px;
}

/* ── 表格与分隔线 ── */
body[data-dsh-qingxiao] [id=root] :is(th, td) {
	border-color: var(--qx-panel-border) !important;
}
body[data-dsh-qingxiao] [id=root] th {
	background: rgba(var(--qx-cyan-rgb), 0.1);
}
body[data-dsh-qingxiao] [id=root] hr {
	border: none;
	border-top: 1px solid var(--qx-panel-border);
	background: linear-gradient(90deg, transparent, rgba(var(--qx-cyan-rgb), 0.45), transparent);
	height: 1px;
}
body[data-dsh-qingxiao] [id=root] :is(blockquote) {
	border-left: 3px solid var(--qx-gold);
	background: rgba(var(--qx-cyan-rgb), 0.08);
	color: var(--qx-text-soft);
}

/* ── 滚动条 ── */
body[data-dsh-qingxiao] ::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}
body[data-dsh-qingxiao] ::-webkit-scrollbar-track {
	background: transparent;
}
body[data-dsh-qingxiao] ::-webkit-scrollbar-thumb {
	background: rgba(var(--qx-cyan-rgb), 0.35);
	border-radius: 8px;
}
body[data-dsh-qingxiao] ::-webkit-scrollbar-thumb:hover {
	background: rgba(var(--qx-cyan-rgb), 0.6);
}

/* ── 顶栏鎏金细线（可开关 trim） ── */
body[data-dsh-qingxiao][data-qx-gold='on'] [data-skin-chrome='top-trim'] {
	display: block;
}
[data-skin-chrome='top-trim'] {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 2px;
	z-index: 2147483000;
	pointer-events: none;
	background: linear-gradient(90deg, transparent 4%, rgba(var(--qx-cyan-rgb), 0.65) 30%, rgba(var(--qx-gold-rgb), 0.85) 50%, rgba(var(--qx-cyan-rgb), 0.65) 70%, transparent 96%);
	opacity: 0.8;
}

/* ── 剑气流光粒子 ── */
body[data-dsh-qingxiao] [data-skin-chrome='particle-field'] {
	position: fixed;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='particle-field'] span {
	position: absolute;
	bottom: -48px;
	border-radius: 999px;
	background: linear-gradient(to top, rgba(var(--qx-cyan-rgb), 0), var(--qx-cyan-bright));
	box-shadow: 0 0 8px 1px rgba(var(--qx-cyan-rgb), 0.6);
	opacity: 0;
	animation: qx-rise calc(22s * var(--qx-particle-speed)) linear infinite;
}
body[data-dsh-qingxiao][data-ds-dark-theme] [data-skin-chrome='particle-field'] span {
	background: linear-gradient(to top, rgba(var(--qx-cyan-rgb), 0), var(--qx-cyan-bright));
	box-shadow: 0 0 8px 1px rgba(var(--qx-cyan-rgb), 0.65);
}
body[data-dsh-qingxiao] [data-skin-chrome='particle-field'] span:nth-child(4n+1) {
	background: linear-gradient(to top, rgba(var(--qx-gold-rgb), 0), var(--qx-gold-bright));
	box-shadow: 0 0 6px 1px rgba(var(--qx-gold-rgb), 0.45);
}
@keyframes qx-rise {
	0% {
		transform: translate3d(0, 0, 0);
		opacity: 0;
	}
	8% {
		opacity: 0.85;
	}
	85% {
		opacity: 0.4;
	}
	100% {
		transform: translate3d(var(--qx-sway, 40px), -110vh, 0);
		opacity: 0;
	}
}
@media (prefers-reduced-motion: reduce) {
	body[data-dsh-qingxiao] [data-skin-chrome='particle-field'] {
		display: none;
	}
}

/* ── 亮暗形态切换时的剑光扫幕 ── */
body[data-dsh-qingxiao] [data-skin-chrome='form-veil'] {
	position: fixed;
	inset: -10%;
	z-index: 2147483100;
	pointer-events: none;
	background: linear-gradient(115deg, transparent 30%, rgba(127, 224, 214, 0.28) 46%, rgba(232, 205, 143, 0.2) 52%, transparent 68%);
	animation: qx-veil 0.9s ease forwards;
}
@keyframes qx-veil {
	from {
		transform: translateX(-70%);
		opacity: 1;
	}
	to {
		transform: translateX(70%);
		opacity: 0;
	}
}

/* ── 设置面板（调色盘） ── */
body[data-dsh-qingxiao] [data-skin-chrome='palette-toggle'] {
	position: fixed;
	z-index: 2147483200;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	border: 1px solid rgba(var(--qx-gold-rgb), 0.55);
	background: rgba(var(--qx-panel-rgb), 0.88);
	color: var(--qx-accent-strong);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: grab;
	touch-action: none;
	user-select: none;
	-webkit-user-select: none;
	box-shadow: 0 2px 14px rgba(11, 30, 46, 0.25);
	transition: box-shadow 0.18s ease;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-toggle']:active {
	cursor: grabbing;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-toggle']:hover {
	box-shadow: 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.5), 0 0 16px rgba(var(--qx-cyan-rgb), 0.35);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] {
	position: fixed;
	z-index: 2147483200;
	width: 304px;
	max-height: calc(100vh - 130px);
	display: flex;
	flex-direction: column;
	border-radius: 14px;
	border: 1px solid var(--qx-panel-border-strong);
	background: rgba(var(--qx-panel-rgb), 0.94);
	color: var(--qx-text);
	box-shadow: 0 10px 34px rgba(11, 30, 46, 0.3);
	overflow: hidden;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'][data-qx-collapsed='true'] {
	display: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-header {
	padding: 10px 14px;
	cursor: pointer;
	user-select: none;
	border-bottom: 1px solid var(--qx-panel-border);
	background: linear-gradient(135deg, rgba(var(--qx-cyan-rgb), 0.16), rgba(var(--qx-gold-rgb), 0.14));
	font-family: "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif;
	font-size: 15px;
	letter-spacing: 1px;
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-body {
	padding: 8px 14px 12px;
	overflow-y: auto;
	/* 让正文区占满可用高度并可滚动：否则内容一多，页脚会叠到滑块上，
	   导致流光数量/速度等滑块拖不动。 */
	flex: 1 1 auto;
	min-height: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer {
	flex: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-section {
	margin: 10px 0 2px;
	font-size: 11px;
	letter-spacing: 2px;
	color: var(--qx-text-faint);
	border-bottom: 1px dashed var(--qx-panel-border);
	padding-bottom: 3px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 6px 0;
	font-size: 13px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-row label {
	cursor: pointer;
	color: var(--qx-text-soft);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle {
	width: 40px;
	height: 20px;
	border-radius: 999px;
	border: 1px solid var(--qx-panel-border-strong);
	background: var(--qx-sink);
	position: relative;
	cursor: pointer;
	padding: 0;
	flex-shrink: 0;
	transition: background 0.18s ease;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle::after {
	content: "";
	position: absolute;
	top: 2px;
	left: 2px;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background: var(--qx-text-faint);
	transition: left 0.18s ease, background 0.18s ease;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle[data-on='true'] {
	background: rgba(var(--qx-cyan-rgb), 0.35);
	border-color: rgba(var(--qx-cyan-rgb), 0.7);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle[data-on='true']::after {
	left: 22px;
	background: var(--qx-cyan-bright);
	box-shadow: 0 0 6px rgba(var(--qx-cyan-rgb), 0.8);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-slider-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	gap: 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-slider-wrap input[type='range'] {
	flex: 1;
	accent-color: var(--qx-cyan);
	height: auto;
	border: none !important;
	background: transparent !important;
	box-shadow: none !important;
	padding: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-val {
	width: 44px;
	text-align: right;
	font-size: 11px;
	color: var(--qx-text-faint);
	flex-shrink: 0;
	font-variant-numeric: tabular-nums;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn {
	border: 1px solid var(--qx-panel-border-strong);
	background: rgba(var(--qx-cyan-rgb), 0.12);
	color: var(--qx-text);
	border-radius: 8px;
	padding: 4px 10px;
	font-size: 12px;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn:hover {
	background: rgba(var(--qx-cyan-rgb), 0.24);
	box-shadow: 0 0 8px rgba(var(--qx-cyan-rgb), 0.3);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-danger {
	border-color: rgba(var(--qx-gold-rgb), 0.6);
	background: rgba(var(--qx-gold-rgb), 0.14);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-danger:hover {
	background: rgba(var(--qx-gold-rgb), 0.28);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-note {
	font-size: 11px;
	color: var(--qx-text-faint);
	line-height: 1.5;
	padding: 2px 0 4px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-status {
	font-size: 11px;
	color: var(--qx-accent-strong);
	min-height: 15px;
	padding: 2px 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer {
	padding: 6px 14px 10px;
	font-size: 10px;
	color: var(--qx-text-faint);
	border-top: 1px dashed var(--qx-panel-border);
	letter-spacing: 1px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] input[type='file'] {
	display: none;
}

/* ── 新会话 · 清宵迎宾页 ── */
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] {
	position: fixed;
	left: calc(50vw + var(--qx-sidebar-width, 280px) / 2);
	transform: translateX(-50%);
	top: 12vh;
	z-index: 26;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	text-align: center;
	pointer-events: none;
	font-family: "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif;
	opacity: 0;
	transition: opacity 0.5s ease;
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'][data-on='true'] {
	opacity: 1;
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-icon {
	margin-bottom: 4px;
	filter: drop-shadow(0 4px 14px rgba(86, 168, 200, 0.5));
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-name {
	font-size: 46px;
	font-weight: 700;
	letter-spacing: 14px;
	line-height: 1.1;
	text-indent: 14px;
	background: linear-gradient(180deg, #A9D9F2 0%, #56C8C0 55%, #2E9E98 100%);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	text-shadow: 0 8px 36px rgba(86, 168, 200, 0.35);
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-title {
	font-size: 15px;
	letter-spacing: 5px;
	color: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-trim {
	height: 2px;
	width: 180px;
	margin: 4px 0;
	background: linear-gradient(90deg, transparent, rgba(var(--qx-gold-rgb), 0.8), transparent);
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-quote {
	font-size: 17px;
	letter-spacing: 3px;
	font-style: italic;
	color: var(--qx-text-soft);
	text-shadow: 0 2px 12px rgba(var(--qx-panel-rgb), 0.6);
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-tags {
	display: flex;
	gap: 10px;
	margin-top: 4px;
}
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] .qx-hero-tag {
	font-size: 11px;
	letter-spacing: 2px;
	padding: 3px 12px;
	border-radius: 999px;
	border: 1px solid rgba(var(--qx-cyan-rgb), 0.4);
	color: var(--qx-accent-strong);
	background: rgba(var(--qx-panel-rgb), 0.5);
}

/* ── 毛玻璃虚化 v0.1.4（总开关 + 分项子开关 + 强度滑块）──
   三个 body 属性由 applyFrostState() 写，缺一个都不生效：
     data-qx-frost='on|off'         总开关（强度拖到 0 记为 off）
     data-qx-frost-plugin='on|off'  分项：独立插件窗（usage-stats / overlayLayer 内插件窗）
     data-qx-frost-native='on|off'  分项：原生面板（左会话栏 + 右详情栏，文件面板在其内）
   强度走 --qx-frost-blur（0–30px，滑块实时改写）。
   关闭 = 整条规则不匹配，backdrop-filter 声明压根不存在，浏览器不会为它开
   GPU 合成层——性能要求是"彻底移除"，不是藏起来。
   虚化一律挂伪元素：backdrop-filter 挂在容器本体会把该容器变成其
   position:fixed 后代（设置弹窗 portal）的包含块，v0.1.2 弹窗塌缩成竖排
   就是这么来的。伪元素没有后代，零副作用。 */

/* 1) 独立插件窗：窗后背景虚化。.qx-frost 由 frostTag() 打标；fixed/absolute + z
      必然自成层叠上下文，z-index:-1 落在窗底之上、内容之下。 */
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-plugin='on'] .qx-frost::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	border-radius: inherit;
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.15);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.15);
}
/* 2) 质感升级（图一）：usage-stats 这类窗的底色是完全不透明的 rgb(97,102,107)，
      上面那层虚化被它整个盖死，只剩一块死灰。frostTag() 实测到"自身底色不透明"
      才补 .qx-frost-solid，这里把窗底换成半透明皮肤底，虚化层才透得出来。
      明/暗各一条（0,2,1 双选择器，沿用 0.1.3 令牌防翻盘经验）：皮肤 <style> 可能
      注入在主题表之前，同特异度会被后来者翻盘，这里再叠属性选择器到 (0,5,1)。 */
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-plugin='on']:not([data-ds-dark-theme]) .qx-frost-solid {
	background: rgba(var(--qx-panel-rgb), var(--qx-frost-panel-alpha)) !important;
	border: 1px solid var(--qx-panel-border) !important;
	box-shadow: 0 16px 42px rgba(11, 30, 46, 0.26) !important;
}
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-plugin='on'][data-ds-dark-theme] .qx-frost-solid {
	background: rgba(var(--qx-panel-rgb), var(--qx-frost-panel-alpha)) !important;
	border: 1px solid var(--qx-panel-border) !important;
	box-shadow: 0 16px 42px rgba(4, 12, 20, 0.5) !important;
}
/* 直接子层去底：usage-stats 的 header 自带同一块不透明灰，会盖住新窗底。
   只摘直接子元素的 background-color，深层按钮/表格/卡片保留自身底色，
   否则整窗糊成一片反而看不清。特异度 (0,5,1) 稳压插件自带的 (0,1,0)。 */
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-plugin='on'] .qx-frost-solid > * {
	background-color: transparent;
}
/* 3) 原生面板虚化：左侧会话栏 + 右侧详情栏（文件面板与会话详情同在该列内，
      一条规则两处都覆盖）。报告实测：CSS Modules 前缀是构建哈希，只能用
      [class*='后缀'] 子串匹配；_centerCol（对话正文列）与 _frame 绝不要碰。
      detailsCol 自身是 static，补 position:relative 让伪元素锚定在本列——
      relative 不产生 fixed 包含块，弹窗照样铺得开（v0.1.2 塌缩教训）。
      与旧「面板磨砂玻璃」共用 ::after：本条特异度更高，两项同开时由虚化强度
      接管，不会叠成两层。侧栏底色本身是 rgba(panel-rgb, panel-alpha) 半透明，
      虚化层垫在其下 → 隐约透出壁纸，正文墨色不糊。 */
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] :is([data-pane='sidebar'], [class*='sidebarCol'], [class*='detailsCol']) {
	position: relative;
}
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] :is([data-pane='sidebar'], [class*='sidebarCol'], [class*='detailsCol'])::after {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
}
`;

		// ═══════════════════════════════════════════════════════════════
		//  FAVICON — 玉青剑钰 (jade sword stud inside an ice ring)
		// ═══════════════════════════════════════════════════════════════

		var svgB64 = function(markup) {
			return "data:image/svg+xml;base64," + btoa(markup);
		};
		var QX_ICON = svgB64(
			'<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
			'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
			'<stop offset="0%" stop-color="#8FC7EA"/><stop offset="55%" stop-color="#56C8C0"/>' +
			'<stop offset="100%" stop-color="#2E9E98"/></linearGradient></defs>' +
			'<circle cx="16" cy="16" r="13.5" fill="none" stroke="url(#g)" stroke-width="2"/>' +
			'<path d="M16 5 L18 14 L27 16 L18 18 L16 27 L14 18 L5 16 L14 14 Z" fill="url(#g)"/>' +
			'<circle cx="16" cy="16" r="2.4" fill="#F4F9FC"/>' +
			'<circle cx="24.5" cy="7.5" r="1.6" fill="#D9B66A"/>' +
			'</svg>'
		);

		// ═══════════════════════════════════════════════════════════════
		//  HELPERS
		// ═══════════════════════════════════════════════════════════════

		function clamp(value, min, max) {
			return Math.min(max, Math.max(min, value));
		}

		function isDarkMode(body) {
			return body.hasAttribute("data-ds-dark-theme");
		}

		// ═══════════════════════════════════════════════════════════════
		//  APPLY
		// ═══════════════════════════════════════════════════════════════

		function apply(ctx) {
			var body = document.body;
			// ── 重入清扫 ──
			// 运行时会因审批面板等交互重挂载插件，而旧实例的 dispose 未必完整跑完
			// （历史上 dispose 中途抛错把粒子层整个泄漏在页面里）。先移除文档中上一份
			// 实例留下的全部皮肤节点，保证任何时刻只有一份皮肤 DOM。
			document.querySelectorAll("[data-skin-owner='" + SKIN_OWNER + "']").forEach(function(el) {
				el.remove();
			});
			// 上一份实例若没被运行时正常 dispose（定时器/观察器还活着），手动触发它的清理。
			var priorDispose = window.__QX_DISPOSE_PRIOR__;
			window.__QX_DISPOSE_PRIOR__ = null;
			if (typeof priorDispose === "function") { try { priorDispose(); } catch (_) {} }
			var originalTitle = document.title;
			var themeColorMeta = null;
			var previousThemeColor = void 0;
			var paletteSettings = {};
			for (var key in PALETTE_DEFAULTS) paletteSettings[key] = PALETTE_DEFAULTS[key];
			var paletteDirty = false;
			var paletteSaveTimer = null;
			var palettePanel = null;
			var particleField = null;
			var particleKey = "";
			// 本实例是否已被销毁：dispose 后迟到的异步回调（设置 GET 响应等）
			// 一律不再回写 DOM，否则僵尸面板/粒子层会被重新挂出来。
			var disposed = false;

			// --- Inject theme stylesheet ---
			var styleTag = document.createElement("style");
			styleTag.dataset.skinChrome = "theme";
			styleTag.dataset.skinOwner = SKIN_OWNER;
			styleTag.textContent = THEME_CSS;
			document.head.append(styleTag);

			// --- 正文字号缩放表（JS 生成，px 字面量）---
			// 单独一张 style，而不塞进 THEME_CSS：滑块每动一次只重写这一条规则。
			var fontSheet = document.createElement("style");
			fontSheet.dataset.skinChrome = "font-scale";
			fontSheet.dataset.skinOwner = SKIN_OWNER;
			document.head.append(fontSheet);
			var appliedFontScale = null;
			function syncFontScaleSheet() {
				var scale = clamp(paletteSettings.fontScale, 85, 125) / 100;
				if (scale === appliedFontScale) return;
				appliedFontScale = scale;
				fontSheet.textContent = buildFontScaleCss(scale);
			}
			function syncFontReadout() {
				if (!fontReadoutEl) return;
				var px = measureConversationFont();
				fontReadoutEl.textContent = px === null
					? "当前对话区没有正文，打开一条回复后再拖滑块即可看到变化"
					: ("实测正文 " + px + "px（100% 时 16px）");
			}

			// --- Activate skin body attribute ---
			body.dataset.dshQingxiao = "";

			// --- System chrome color sync (follows light/dark form) ---
			var syncSystemChrome = function() {
				var meta = document.head.querySelector("meta[name='theme-color']");
				if (meta === null) return;
				if (meta !== themeColorMeta) {
					themeColorMeta = meta;
					previousThemeColor = meta.content;
				}
				var wanted = isDarkMode(body) ? SKIN_SYSTEM_CHROME_COLOR_DARK : SKIN_SYSTEM_CHROME_COLOR_LIGHT;
				if (meta.content !== wanted) meta.content = wanted;
			};
			var themeColorObserver = new MutationObserver(syncSystemChrome);
			themeColorObserver.observe(document.head, { attributes: true, attributeFilter: ["content"], childList: true, subtree: true });
			syncSystemChrome();

			// --- Favicon + title ---
			var iconLink = document.createElement("link");
			iconLink.rel = "icon";
			iconLink.href = QX_ICON;
			document.head.append(iconLink);
			if (document.title === originalTitle) document.title = SKIN_TITLE;

			// --- Save previous body backdrop styles for clean disposal ---
			var previous = new Map();
			BACKDROP_PROPERTIES.forEach(function(prop) {
				previous.set(prop, body.style.getPropertyValue(prop));
			});

			// ── 背景画卷： scrim + art. The scrim gradient is what keeps
			//    ink text readable no matter which artwork is mounted. ──
			// FIX: 原公式在 textContrastBoost 下强度高达 0.71，亮色遮罩 alpha 约
			// 0.70，把明亮画卷几乎洗白。这里整体调低：画卷能明显透出，仍留一层
			// 浅遮罩 + 玻璃面板 + 文字对比增强来保证可读性。
			var syncBackdrop = function() {
				var dark = isDarkMode(body);
				var custom = dark ? paletteSettings.darkBackground : paletteSettings.lightBackground;
				var url = custom || DEFAULT_BG_URL;
				var strength = clamp(paletteSettings.scrimOpacity, 20, 95) / 100;
				if (paletteSettings.textContrastBoost) strength = clamp(strength * 0.5 + 0.01, 0, 0.45);
				var scrim;
				if (dark) {
					scrim = "linear-gradient(rgba(7,19,31," + (0.05 + 0.22 * strength) + ") 0%,rgba(9,24,38," + (0.045 + 0.19 * strength) + ") 45%,rgba(11,30,46," + (0.06 + 0.2 * strength) + ") 100%)";
				} else {
					scrim = "linear-gradient(rgba(240,248,252," + (0.035 + 0.14 * strength) + ") 0%,rgba(232,244,250," + (0.03 + 0.12 * strength) + ") 45%,rgba(244,249,252," + (0.045 + 0.13 * strength) + ") 100%)";
				}
				var glows = "radial-gradient(52% 42% at 12% 8%,rgba(86,200,192,0.16),transparent 70%)," +
					"radial-gradient(46% 40% at 88% 90%,rgba(217,182,106,0.12),transparent 72%)";
				body.style.setProperty("background-image", scrim + "," + glows + ",url(\"" + url + "\")");
				body.style.setProperty("background-position", "center top");
				body.style.setProperty("background-size", "cover");
				body.style.setProperty("background-attachment", "fixed");
				body.style.setProperty("background-repeat", "no-repeat");
			};

			// ── 剑气流光 field ──
			var buildParticles = function() {
				var count = Math.round(clamp(paletteSettings.particleCount, 0, 60));
				var key = (paletteSettings.particles ? "on" : "off") + "|" + count + "|" + paletteSettings.particleSpeed;
				if (key === particleKey && particleField) return;
				particleKey = key;
				if (particleField) particleField.remove();
				particleField = null;
				// 无论之前属于哪一份实例，把文档里所有粒子层一次性清掉：旧版泄漏的层
				// 不受本面板控制，会造成「数量设 0 仍有流光」的假象。
				document.querySelectorAll("[data-skin-chrome='particle-field']").forEach(function(el) {
					el.remove();
				});
				if (count === 0) return;
				if (!paletteSettings.particles) return;
				if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
				particleField = document.createElement("div");
				particleField.dataset.skinChrome = "particle-field";
				particleField.dataset.skinOwner = SKIN_OWNER;
				particleField.setAttribute("aria-hidden", "true");
				for (var i = 0; i < count; i++) {
					var span = document.createElement("span");
					span.style.left = (Math.random() * 100) + "%";
					span.style.width = (2 + Math.random() * 3) + "px";
					span.style.height = (18 + Math.random() * 30) + "px";
					span.style.setProperty("--qx-sway", ((Math.random() - 0.5) * 120) + "px");
					span.style.setProperty("--qx-particle-speed", String((0.6 + Math.random() * 0.8) * (100 / clamp(paletteSettings.particleSpeed, 20, 200))));
					span.style.animationDelay = "-" + (Math.random() * 30) + "s";
					particleField.appendChild(span);
				}
				body.append(particleField);
			};


			// ── 亮暗形态切换： soft sword-light veil ──
			var veilTimer = null;
			var playFormVeil = function() {
				var existing = body.querySelector("[data-skin-chrome='form-veil'][data-skin-owner='" + SKIN_OWNER + "']");
				if (existing) existing.remove();
				var veil = document.createElement("div");
				veil.dataset.skinChrome = "form-veil";
				veil.dataset.skinOwner = SKIN_OWNER;
				veil.setAttribute("aria-hidden", "true");
				body.append(veil);
				if (veilTimer) clearTimeout(veilTimer);
				veilTimer = setTimeout(function() {
					if (veil.isConnected) veil.remove();
				}, 1000);
			};

			// ── Light/dark form observer ──
			var darkObserver = new MutationObserver(function() {
				syncBackdrop();
				syncSystemChrome();
				playFormVeil();
			});
			darkObserver.observe(body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });

			// ═════════════════════════════════════════════════════════════
			//  设置面板 (调色盘)
			// ═════════════════════════════════════════════════════════════

			var statusLine = null;
			var statusTimer = null;
			var fontReadoutEl = null;
			function showStatus(text) {
				if (!statusLine) return;
				statusLine.textContent = text;
				if (statusTimer) clearTimeout(statusTimer);
				statusTimer = setTimeout(function() { statusLine.textContent = ""; }, 3200);
			}

			function mergePaletteSettings(saved) {
				if (!saved || typeof saved !== "object") return;
				for (var key in PALETTE_DEFAULTS) {
					if (Object.prototype.hasOwnProperty.call(saved, key)) paletteSettings[key] = saved[key];
				}
			}

			function palettePayload() {
				var settings = {};
				for (var key in PALETTE_DEFAULTS) settings[key] = paletteSettings[key];
				return settings;
			}

			function writePaletteSettings() {
				paletteSaveTimer = null;
				if (!paletteDirty || typeof fetch === "undefined") return;
				paletteDirty = false;
				fetch(SETTINGS_URL, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ settings: palettePayload() })
				}).then(function(response) {
					if (!response.ok) throw new Error("HTTP " + response.status);
					showStatus("✓ 已保存");
				}).catch(function(error) {
					paletteDirty = true;
					try {
						localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(palettePayload()));
						showStatus("✓ 已保存（本地）");
						paletteDirty = false;
					} catch (_) {
						console.warn("[qingxiao] palette settings save failed:", error.message || error);
					}
				});
			}

			function savePaletteSettings() {
				paletteDirty = true;
				try {
					localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(palettePayload()));
				} catch (_) {}
				if (paletteSaveTimer !== null) clearTimeout(paletteSaveTimer);
				paletteSaveTimer = setTimeout(writePaletteSettings, 350);
			}

			function loadPaletteSettings() {
				if (typeof fetch === "undefined") return;
				fetch(SETTINGS_URL)
					.then(function(response) { return response.ok ? response.json() : null; })
					.then(function(data) {
						var saved = data && data.ok && data.settings ? data.settings : null;
						// 本地镜像先垫一层：服务端 sanitizeSettings 有键白名单，未升级的
						// 运行中进程会把新键（frostMaster/frostPlugin/frostNative/frostBlur）
						// 裁掉，只靠服务端会「拖了刷新就回默认」。服务端仍排在后面合并，
						// 它有值时以服务端为准（跨浏览器/跨设备一致）。
						var mirror = null;
						try { mirror = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || "null"); } catch (_) {}
						if (mirror && typeof mirror === "object") mergePaletteSettings(mirror);
						if (saved) mergePaletteSettings(saved);
						if (saved || mirror) {
							applyPaletteSettings();
							rebuildPanel();
						}
					})
					.catch(function(error) {
						console.warn("[qingxiao] palette settings load failed, falling back to localStorage:", error.message || error);
						try {
							var legacy = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || "{}");
							if (legacy && Object.keys(legacy).length) {
								mergePaletteSettings(legacy);
								applyPaletteSettings();
								rebuildPanel();
							}
						} catch (_) {}
					});
			}

			function applyPaletteSettings() {
				if (disposed) return;
				// toggles → body attributes
				if (paletteSettings.textContrastBoost) body.setAttribute("data-qx-contrast", "on");
				else body.removeAttribute("data-qx-contrast");
				if (paletteSettings.panelBlur) body.setAttribute("data-qx-blur", "on");
				else body.removeAttribute("data-qx-blur");
				// numbers → css variables
				body.style.setProperty("--qx-panel-alpha", String(clamp(paletteSettings.panelOpacity, 30, 100) / 100));
				body.style.setProperty("--qx-content-width", clamp(paletteSettings.contentWidth, 500, 1000) + "px");
				body.style.setProperty("--qx-font-scale", String(clamp(paletteSettings.fontScale, 85, 125) / 100));
				syncFontScaleSheet();
				syncBackdrop();
				buildParticles();
				// 毛玻璃虚化：总开关 / 两个分项子开关 / 强度（详见 applyFrostState）
				applyFrostState();
				// 令牌写完后实测一次，面板上的「实测正文」才是落地后的真值。
				syncFontReadout();
			}

			function resetPaletteSettings() {
				for (var key in PALETTE_DEFAULTS) paletteSettings[key] = PALETTE_DEFAULTS[key];
				applyPaletteSettings();
				savePaletteSettings();
				rebuildPanel();
				showStatus("✓ 已恢复默认");
			}

			function readFileAsBackground(file, modeKey) {
				if (!file) return;
				if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) {
					showStatus("✗ 仅支持 PNG / JPG / WebP / GIF");
					return;
				}
				if (file.size > 7 * 1024 * 1024) {
					showStatus("✗ 图片不能超过 7MB");
					return;
				}
				var reader = new FileReader();
				reader.onload = function() {
					paletteSettings[modeKey] = String(reader.result);
					applyPaletteSettings();
					savePaletteSettings();
					rebuildPanel();
					showStatus("✓ 背景已更换");
				};
				reader.onerror = function() { showStatus("✗ 读取图片失败"); };
				reader.readAsDataURL(file);
			}

			function clearCustomBackground(modeKey) {
				paletteSettings[modeKey] = null;
				applyPaletteSettings();
				savePaletteSettings();
				rebuildPanel();
				showStatus("✓ 已恢复默认背景（清宵画卷）");
			}

			function makeToggle(label, key, onChange) {
				var row = document.createElement("div");
				row.className = "pp-row";
				var lab = document.createElement("label");
				lab.textContent = label;
				var btn = document.createElement("button");
				btn.className = "pp-toggle";
				btn.type = "button";
				btn.dataset.on = paletteSettings[key] ? "true" : "false";
				var toggle = function() {
					paletteSettings[key] = !paletteSettings[key];
					btn.dataset.on = paletteSettings[key] ? "true" : "false";
					applyPaletteSettings();
					savePaletteSettings();
					if (onChange) onChange();
				};
				btn.addEventListener("click", toggle);
				lab.addEventListener("click", toggle);
				row.append(lab, btn);
				return row;
			}

			function makeSlider(label, key, min, max, step, format) {
				var row = document.createElement("div");
				row.className = "pp-row";
				var lab = document.createElement("label");
				lab.textContent = label;
				var wrap = document.createElement("div");
				wrap.className = "pp-slider-wrap";
				var input = document.createElement("input");
				input.type = "range";
				input.min = String(min);
				input.max = String(max);
				input.step = String(step);
				input.value = String(paletteSettings[key]);
				var val = document.createElement("span");
				val.className = "pp-val";
				val.textContent = format(paletteSettings[key]);
				input.addEventListener("input", function() {
					paletteSettings[key] = Number(input.value);
					val.textContent = format(Number(input.value));
					applyPaletteSettings();
					savePaletteSettings();
				});
				wrap.append(input, val);
				row.append(lab, wrap);
				return row;
			}

			function makeBgRow(title, modeKey) {
				var fragment = document.createDocumentFragment();
				var note = document.createElement("div");
				note.className = "pp-note";
				note.textContent = title + "：" + (paletteSettings[modeKey] ? "已使用自定义画卷" : "默认 · 清宵画卷");
				var row = document.createElement("div");
				row.className = "pp-row";
				var uploadBtn = document.createElement("button");
				uploadBtn.className = "pp-btn";
				uploadBtn.type = "button";
				uploadBtn.textContent = "更换画卷";
				var fileInput = document.createElement("input");
				fileInput.type = "file";
				fileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
				uploadBtn.addEventListener("click", function() { fileInput.click(); });
				fileInput.addEventListener("change", function() {
					readFileAsBackground(fileInput.files && fileInput.files[0], modeKey);
					fileInput.value = "";
				});
				row.append(uploadBtn);
				if (paletteSettings[modeKey]) {
					var clearBtn = document.createElement("button");
					clearBtn.className = "pp-btn pp-danger";
					clearBtn.type = "button";
					clearBtn.textContent = "复原默认";
					clearBtn.addEventListener("click", function() { clearCustomBackground(modeKey); });
					row.append(clearBtn);
				}
				fragment.append(note, row, fileInput);
				return fragment;
			}

			function buildPanelInto(panel) {
				var header = document.createElement("div");
				header.className = "pp-header";
				header.textContent = "§ 清宵 · 弦凝清霄";
				header.addEventListener("click", function() {
					panel.dataset.qxCollapsed = panel.dataset.qxCollapsed === "true" ? "false" : "true";
				});

				var bodyEl = document.createElement("div");
				bodyEl.className = "pp-body";

				var secBg = document.createElement("div");
				secBg.className = "pp-section";
				secBg.textContent = "背 景 画 卷";
				bodyEl.append(secBg);
				bodyEl.append(makeBgRow("亮色形态", "lightBackground"));
				bodyEl.append(makeBgRow("暗色形态", "darkBackground"));

				var secRead = document.createElement("div");
				secRead.className = "pp-section";
				secRead.textContent = "阅 读 清 晰 度";
				bodyEl.append(secRead);
				bodyEl.append(makeToggle("文字对比增强", "textContrastBoost"));
				bodyEl.append(makeSlider("背景遮罩浓度", "scrimOpacity", 20, 95, 5, function(v) { return v + "%"; }));
				bodyEl.append(makeSlider("面板不透明度", "panelOpacity", 30, 100, 5, function(v) { return v + "%"; }));
				bodyEl.append(makeSlider("正文字号缩放", "fontScale", 85, 125, 5, function(v) { return v + "%"; }));
				// 自校验：直接读对话正文的实测像素字号，滑块有没有真落地一眼可见。
				fontReadoutEl = document.createElement("div");
				fontReadoutEl.className = "pp-note";
				bodyEl.append(fontReadoutEl);

				var secUi = document.createElement("div");
				secUi.className = "pp-section";
				secUi.textContent = "界 面 琉 离";
				bodyEl.append(secUi);
				bodyEl.append(makeSlider("对话区宽度", "contentWidth", 500, 1000, 20, function(v) { return v + "px"; }));
				bodyEl.append(makeToggle("面板磨砂玻璃", "panelBlur"));

				// 毛玻璃虚化：总开关 + 两个分项子开关 + 独立强度（0–30px，0=关闭等效）。
				// 关掉的分项对应 CSS 整条不匹配，backdrop-filter 彻底不存在（省 GPU 合成层）。
				var secFrost = document.createElement("div");
				secFrost.className = "pp-section";
				secFrost.textContent = "毛 玻 璃 虚 化";
				bodyEl.append(secFrost);
				bodyEl.append(makeToggle("毛玻璃虚化（总开关）", "frostMaster"));
				bodyEl.append(makeToggle("　插件独立窗", "frostPlugin"));
				bodyEl.append(makeToggle("　原生面板（侧栏/详情栏）", "frostNative"));
				bodyEl.append(makeSlider("虚化强度", "frostBlur", 0, 30, 1, function(v) { return v === 0 ? "关闭" : v + "px"; }));
				var frostNote = document.createElement("div");
				frostNote.className = "pp-note";
				frostNote.textContent = "强度 0 等同于关闭；总开关关闭时所有虚化层（含旧版面板磨砂）一并移除。";
				bodyEl.append(frostNote);

				var secFx = document.createElement("div");
				secFx.className = "pp-section";
				secFx.textContent = "剑 气 流 光";
				bodyEl.append(secFx);
				bodyEl.append(makeToggle("启用流光", "particles"));
				bodyEl.append(makeSlider("流光数量", "particleCount", 0, 60, 2, function(v) { return String(v); }));
				bodyEl.append(makeSlider("流光速度", "particleSpeed", 20, 200, 10, function(v) { return v + "%"; }));

				var resetRow = document.createElement("div");
				resetRow.className = "pp-row";
				var resetBtn = document.createElement("button");
				resetBtn.className = "pp-btn pp-danger";
				resetBtn.type = "button";
				resetBtn.textContent = "全部恢复默认";
				resetBtn.style.margin = "6px auto";
				resetBtn.addEventListener("click", resetPaletteSettings);
				resetRow.append(resetBtn);
				bodyEl.append(resetRow);

				statusLine = document.createElement("div");
				statusLine.className = "pp-status";
				bodyEl.append(statusLine);

				var footer = document.createElement("div");
				footer.className = "pp-footer";
				footer.textContent = "清宵皮肤 v" + SKIN_VERSION + " · 弦凝千古寂，剑起满天清";
				var resetBtn = document.createElement("button");
				resetBtn.className = "pp-btn";
				resetBtn.type = "button";
				resetBtn.style.marginLeft = "10px";
				resetBtn.textContent = "回到右上角";
				resetBtn.title = "把右上角的清宵按钮复位到窗口右上角";
				resetBtn.addEventListener("click", function() {
					if (typeof resetTogglePos === "function") resetTogglePos();
				});
				footer.append(resetBtn);

				panel.append(header, bodyEl, footer);
			}

			var palettePanelEl = null;
			function rebuildPanel() {
				if (disposed) return;
				var collapsed = palettePanelEl ? palettePanelEl.dataset.qxCollapsed : "true";
				if (palettePanelEl) palettePanelEl.remove();
				palettePanelEl = document.createElement("div");
				palettePanelEl.dataset.skinChrome = "palette-panel";
				palettePanelEl.dataset.skinOwner = SKIN_OWNER;
				palettePanelEl.dataset.qxCollapsed = collapsed || "true";
				buildPanelInto(palettePanelEl);
				body.append(palettePanelEl);
				syncFontReadout();
				if (palettePanelEl.dataset.qxCollapsed === "false") positionPanel();
			}

			var TOGGLE_POS_KEY = "dsh-qingxiao-toggle-pos";
			var toggleBtn = document.createElement("button");
			toggleBtn.type = "button";
			toggleBtn.dataset.skinChrome = "palette-toggle";
			toggleBtn.dataset.skinOwner = SKIN_OWNER;
			toggleBtn.title = "清宵 · 皮肤设置（可拖动）";
			toggleBtn.setAttribute("aria-label", "清宵皮肤设置");
			// 清宵标志：玉青剑钰（冰环 + 剑芒星 + 鎏金点缀），与 favicon 同族，呼应剑仙主题。
			toggleBtn.innerHTML = '<svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="qxbtn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8FC7EA"/><stop offset="55%" stop-color="#56C8C0"/><stop offset="100%" stop-color="#2E9E98"/></linearGradient></defs><circle cx="16" cy="16" r="12.5" fill="none" stroke="url(#qxbtn)" stroke-width="2.2"/><path d="M16 5.5 L18 13.5 L26 16 L18 18.5 L16 26.5 L14 18.5 L6 16 L14 13.5 Z" fill="url(#qxbtn)"/><circle cx="16" cy="16" r="2.4" fill="#F4F9FC"/><circle cx="24" cy="8" r="1.7" fill="#D9B66A"/></svg>';

			// —— 圆形按钮自由拖动 ——（拖到哪里就在哪里，位置持久保存）
			var qxDrag = { on: false, sx: 0, sy: 0, left: 0, top: 0, moved: false };
			var TOGGLE_DRAGGED_KEY = "dsh-qingxiao-toggle-dragged";
			var qxDragged = false;
			try { qxDragged = localStorage.getItem(TOGGLE_DRAGGED_KEY) === "1"; } catch (_) {}
			function applyTogglePos() {
				if (!qxDragged) {
					// 默认锚定右上角：用 right 定位，窗口无论缩放/全屏切换都贴在右上角
					toggleBtn.style.left = "auto";
					toggleBtn.style.right = "14px";
					toggleBtn.style.top = "56px";
					return;
				}
				// 拖动后：按视口百分比定位，缩放时按比例重算，稳定不漂移
				var saved = null;
				try { saved = JSON.parse(localStorage.getItem(TOGGLE_POS_KEY) || "null"); } catch (_) {}
				var xp = saved && typeof saved.xp === "number" ? saved.xp : (window.innerWidth - 58) / window.innerWidth;
				var yp = saved && typeof saved.yp === "number" ? saved.yp : 56 / window.innerHeight;
				var left = Math.max(4, Math.min(xp * window.innerWidth, window.innerWidth - 44 - 4));
				var top = Math.max(4, Math.min(yp * window.innerHeight, window.innerHeight - 44 - 4));
				toggleBtn.style.right = "auto";
				toggleBtn.style.left = left + "px";
				toggleBtn.style.top = top + "px";
			}
			function clampToggle() {
				// 重新按百分比计算位置（稳定），并让展开的面板跟随
				applyTogglePos();
				if (palettePanelEl && palettePanelEl.dataset.qxCollapsed === "false") positionPanel();
			}
			function saveTogglePos() {
				qxDragged = true;
				try { localStorage.setItem(TOGGLE_DRAGGED_KEY, "1"); } catch (_) {}
				var r = toggleBtn.getBoundingClientRect();
				try { localStorage.setItem(TOGGLE_POS_KEY, JSON.stringify({ xp: r.left / window.innerWidth, yp: r.top / window.innerHeight })); } catch (_) {}
			}
			function resetTogglePos() {
				qxDragged = false;
				try { localStorage.removeItem(TOGGLE_DRAGGED_KEY); } catch (_) {}
				try { localStorage.removeItem(TOGGLE_POS_KEY); } catch (_) {}
				applyTogglePos();
				if (palettePanelEl && palettePanelEl.dataset.qxCollapsed === "false") positionPanel();
			}
			function positionPanel() {
				if (!palettePanelEl) return;
				var br = toggleBtn.getBoundingClientRect();
				var pw = 304;
				var ph = palettePanelEl.offsetHeight || 300;
				var left = br.right - pw;
				var top = br.bottom + 8;
				left = Math.min(Math.max(8, left), Math.max(8, window.innerWidth - pw - 8));
				top = Math.min(Math.max(8, top), Math.max(8, window.innerHeight - ph - 8));
				palettePanelEl.style.left = left + "px";
				palettePanelEl.style.top = top + "px";
			}
			toggleBtn.addEventListener("pointerdown", function(e) {
				qxDrag.on = true; qxDrag.moved = false;
				qxDrag.sx = e.clientX; qxDrag.sy = e.clientY;
				var r = toggleBtn.getBoundingClientRect();
				qxDrag.left = r.left; qxDrag.top = r.top;
				try { toggleBtn.setPointerCapture(e.pointerId); } catch (_) {}
				e.preventDefault();
			});
			toggleBtn.addEventListener("pointermove", function(e) {
				if (!qxDrag.on) return;
				var dx = e.clientX - qxDrag.sx, dy = e.clientY - qxDrag.sy;
				if (Math.abs(dx) > 2 || Math.abs(dy) > 2) qxDrag.moved = true;
				if (qxDrag.moved) toggleBtn.style.right = "auto";
				var nx = Math.max(0, Math.min(qxDrag.left + dx, window.innerWidth - 44));
				var ny = Math.max(0, Math.min(qxDrag.top + dy, window.innerHeight - 44));
				toggleBtn.style.left = nx + "px";
				toggleBtn.style.top = ny + "px";
			});
			function endDrag(e) {
				if (!qxDrag.on) return;
				qxDrag.on = false;
				try { toggleBtn.releasePointerCapture(e.pointerId); } catch (_) {}
				if (qxDrag.moved) { saveTogglePos(); if (palettePanelEl) positionPanel(); }
			}
			toggleBtn.addEventListener("pointerup", endDrag);
			toggleBtn.addEventListener("pointercancel", endDrag);
			applyTogglePos();
			toggleBtn.addEventListener("click", function() {
				if (qxDrag.moved) { qxDrag.moved = false; return; }
				if (!palettePanelEl) rebuildPanel();
				var wasOpen = palettePanelEl.dataset.qxCollapsed === "false";
				palettePanelEl.dataset.qxCollapsed = wasOpen ? "true" : "false";
				if (!wasOpen) positionPanel();
			});
			body.append(toggleBtn);
			window.addEventListener("resize", function() {
				clampToggle();
			});

			// ── 新会话 · 清宵迎宾页 ──
			var heroWelcome = document.createElement("div");
			heroWelcome.dataset.skinChrome = "qingxiao-hero";
			heroWelcome.dataset.skinOwner = SKIN_OWNER;
			heroWelcome.setAttribute("aria-hidden", "true");
			heroWelcome.innerHTML =
				'<div class="qx-hero-name">清 宵</div>' +
				'<div class="qx-hero-title">镇玄司骑</div>' +
				'<div class="qx-hero-trim"></div>' +
				'<div class="qx-hero-quote">「徒儿，你来了……」</div>';
			body.append(heroWelcome);
			function syncHeroWelcome() {
				var root = document.querySelector("[data-slot='conversation'] > *");
				var on = !!(root && root.getAttribute("data-phase") === "hero");
				heroWelcome.dataset.on = on ? "true" : "false";
			}
			try {
				var heroObserver = new MutationObserver(function() { syncHeroWelcome(); });
				heroObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-phase"] });
			} catch (_) {}
			syncHeroWelcome();

			// ── 毛玻璃虚化（v0.1.4）：给独立插件窗打标 .qx-frost / .qx-frost-solid ──
			// 打标范围（对应 CSS 见 THEME_CSS 末尾「毛玻璃虚化」段）：
			//   1) body 直接子节点——usage-stats / genui / find-plugin / harness-zh-cn /
			//      dshmarket 等插件窗一律 append 到 body；
			//   2) body 级"零尺寸挂载壳"下探一层——better-sidebar 的 [data-dsh-panel-host]
			//      藏在 div[data-dsh-better-sidebar] 里，只看 body 子节点会漏（图二）；
			//   3) frame 的浮层容器 overlayLayer 与其 shell.overlay 槽——agent-teams 活动窗、
			//      aemeath 等走 slots.inject('shell.overlay') 的插件窗挂在这里。
			// 观察器一律只 childList（不碰 subtree/attributes），流式渲染零开销；命中后交给
			// frostSchedule() 做 60ms 去抖整表补扫，顺带兜住「预挂载 display:none、点击时
			// 只改 style 显示」这类没有 DOM 新增的漏网窗（报告 §4.1）。
			// DSH 原生弹窗已有自己的玻璃体系，绝不误伤：role=dialog|alertdialog|alert|menu|
			// listbox|tooltip、aria-modal、data-slot^="shell."、自身或后代带上述角色的节点全部
			// 跳过；铺满整个视口的（遮罩层/全屏视图）不算"窗"；overlayLayer 里只认"自己画了
			// 底色"的节点，透明包装层（精灵宠物、拖拽辅助层）放过。
			var QX_FROST_CLASS = "qx-frost";
			var QX_FROST_SOLID = "qx-frost-solid";
			var QX_FROST_HOSTS = "[data-shell-overlay], [data-slot='shell.overlay'], [class*='overlayLayer']";
			var QX_FROST_NATIVE = "[role='dialog'], [role='alertdialog'], [role='alert'], [role='menu'], [role='listbox'], [role='tooltip'], [aria-modal='true'], [data-slot^='shell.']";
			var frostHostsSeen = [];
			var frostPending = null;
			function frostPluginOn() {
				return body.getAttribute("data-qx-frost-plugin") === "on";
			}
			function frostAlpha(color) {
				if (!color || color === "transparent") return 0;
				var n = color.match(/[\d.]+/g);
				if (!n || n.length < 3) return 0;
				return n.length > 3 ? parseFloat(n[3]) : 1;	// rgb() 没有第四段 = 完全不透明
			}
			function frostPassThrough(el) {
				// 只往"自身什么都没画"的挂载壳里下探（better-sidebar 壳、display:contents 的槽包装）。
				// 应用主框 #root 永不进入：它里面的浮层全是 DSH 原生的。
				if (el.id === "root" || el.hasAttribute("data-skin-chrome")) return false;
				var st = getComputedStyle(el);
				if (st.position !== "static" && st.display !== "contents") return false;
				if (frostAlpha(st.backgroundColor) > 0.02) return false;
				return st.backgroundImage === "none";
			}
			function frostTag(el, inOverlay) {
				if (!el || el.nodeType !== 1 || !frostPluginOn()) return;
				if (el.hasAttribute("data-skin-chrome") || el.classList.contains(QX_FROST_CLASS)) return;
				var r = el.getBoundingClientRect();
				if (r.width < 120 || r.height < 80) return;
				if (r.width >= window.innerWidth * 0.98 && r.height >= window.innerHeight * 0.98) return;
				var st = getComputedStyle(el);
				if (st.display === "none" || st.visibility === "hidden") return;
				var z = parseInt(st.zIndex, 10);
				if (inOverlay) {
					// overlayLayer 自身 z=20 已经把整层抬到三列之上，层内窗不需要再卡 z-index
					// （agent-teams 活动窗 z 只有个位数，实测被 z>=10 误拒）；只排除负的 z。
					if (st.position !== "fixed" && st.position !== "absolute") return;
					if (z < 0) return;
					// 层内既有插件窗也有 DSH 原生包装：只认"自己画了底色/背景图"的节点。
					if (frostAlpha(st.backgroundColor) <= 0 && st.backgroundImage === "none") return;
				} else {
					if (st.position !== "fixed") return;
					if (!(z >= 10)) return;
				}
				if (el.matches(QX_FROST_NATIVE) || el.querySelector(QX_FROST_NATIVE)) return;
				el.classList.add(QX_FROST_CLASS);
				// 底色完全不透明的窗（图一 usage-stats 的 rgb(97,102,107)）会把 ::before 虚化层
				// 整个盖死，只剩一块死灰；补 solid 标记，由 CSS 换成半透明皮肤底 + 直接子层去底。
				if (frostAlpha(st.backgroundColor) >= 0.9 && st.backgroundImage === "none") el.classList.add(QX_FROST_SOLID);
				// 迟到复查：空的应用主框若先入 DOM 会被误判，600ms/2500ms 两次发现装着
				// 侧栏/对话区就摘标（慢挂载的 frame 也能兜住）。
				var unfrostIfApp = function() {
					if (el.isConnected && el.querySelector("[data-dsh-sidebar-root], [data-conversation-scroll]")) {
						el.classList.remove(QX_FROST_CLASS, QX_FROST_SOLID);
					}
				};
				setTimeout(unfrostIfApp, 600);
				setTimeout(unfrostIfApp, 2500);
			}
			function frostSweepFrom(host, inOverlay, depth) {
				var kids = host.children;
				for (var i = 0; i < kids.length; i++) {
					var el = kids[i];
					frostTag(el, inOverlay);
					if (depth < 3 && frostPassThrough(el)) frostSweepFrom(el, inOverlay, depth + 1);
				}
			}
			function frostClearMarks() {
				document.querySelectorAll("." + QX_FROST_CLASS).forEach(function(el) {
					el.classList.remove(QX_FROST_CLASS, QX_FROST_SOLID);
				});
			}
			function frostObserveHosts() {
				// 浮层容器由 React 后挂，找到就补挂一个 childList 观察器（同一个 observer 实例）。
				var hosts = document.querySelectorAll(QX_FROST_HOSTS);
				for (var i = 0; i < hosts.length; i++) {
					if (frostHostsSeen.indexOf(hosts[i]) >= 0) continue;
					frostHostsSeen.push(hosts[i]);
					frostObserver.observe(hosts[i], { childList: true });
				}
			}
			function frostSweep() {
				if (disposed) return;
				if (!frostPluginOn()) { frostClearMarks(); return; }
				frostSweepFrom(document.body, false, 1);
				var hosts = document.querySelectorAll(QX_FROST_HOSTS);
				for (var i = 0; i < hosts.length; i++) frostSweepFrom(hosts[i], true, 1);
				frostObserveHosts();
			}
			function frostSchedule() {
				if (disposed || frostPending) return;
				frostPending = setTimeout(function() { frostPending = null; frostSweep(); }, 60);
			}
			// 三个开关 + 强度 → body 属性 / CSS 变量。off 时属性写 'off'（而不是删掉），
			// CSS 只匹配 ='on'，所以 backdrop-filter 声明整条不落地，GPU 合成层随之消失。
			var frostPrev = null;
			function applyFrostState() {
				if (disposed) return;
				var blur = clamp(paletteSettings.frostBlur, 0, 30);
				var master = !!paletteSettings.frostMaster && blur > 0;	// 强度 0 = 关闭等效
				var plugin = master && !!paletteSettings.frostPlugin;
				body.setAttribute("data-qx-frost", master ? "on" : "off");
				body.setAttribute("data-qx-frost-plugin", plugin ? "on" : "off");
				body.setAttribute("data-qx-frost-native", master && paletteSettings.frostNative ? "on" : "off");
				body.style.setProperty("--qx-frost-blur", blur + "px");
				// 只有分项状态真变了才整表扫描；拖别的滑块（如面板不透明度）不重复扫。
				if (frostPrev === plugin) return;
				frostPrev = plugin;
				if (plugin) frostSweep();
				else frostClearMarks();
			}
			var frostObserver = new MutationObserver(function(muts) {
				for (var i = 0; i < muts.length; i++) {
					var added = muts[i].addedNodes;
					var inOverlay = muts[i].target !== document.body;
					for (var j = 0; j < added.length; j++) frostTag(added[j], inOverlay);
				}
				frostSchedule();
			});
			frostObserver.observe(document.body, { childList: true });
			document.addEventListener("click", frostSchedule, true);
			// 皮肤挂载前就已存在的插件窗（启动即挂载的常驻窗 + 已挂载的浮层容器）补扫一遍。
			frostSweep();

			// --- Boot ---
			applyPaletteSettings();
			rebuildPanel();
			loadPaletteSettings();

			// --- Sidebar width → css variable (decor follows rail/narrow/wide) ---
			var widthSheet = document.createElement("style");
			widthSheet.dataset.skinChrome = "sidebar-width-rule";
			widthSheet.dataset.skinOwner = SKIN_OWNER;
			document.head.append(widthSheet);
			widthSheet.sheet.insertRule("body[data-dsh-qingxiao] { --qx-sidebar-width: 280px; }", 0);
			var resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(function(entries) {
				var entry = entries[0];
				if (!entry) return;
				widthSheet.sheet.cssRules[0].style.setProperty("--qx-sidebar-width", Math.round(entry.contentRect.width) + "px");
			}) : null;
			var ensureSidebarObserved = function() {
				if (!resizeObserver) return;
				var sidebar = document.querySelector(SIDEBAR_COLUMN_SELECTOR);
				if (sidebar && !sidebar.dataset.qxObserved) {
					sidebar.dataset.qxObserved = "1";
					resizeObserver.observe(sidebar);
				}
			};
			var domIntervalId = setInterval(ensureSidebarObserved, 1200);
			ensureSidebarObserved();

			// --- Dispose: retract every DOM and CSS write ---
			// 幂等：运行时 dispose 与下一实例入场补刀都调它，只生效一次。
			var skinDispose = function() {
				if (skinDispose.done) return;
				skinDispose.done = true;
				disposed = true;
					// 先整批移除皮肤 DOM：即使后面的恢复步骤出问题，也不会再泄漏节点。
					// （旧版在此处之前引用过从未声明的 topTrim，ReferenceError 使清理中断，
					// 粒子层等被泄漏在页面里，重挂一次就多一套流光。）
					document.querySelectorAll("[data-skin-owner='" + SKIN_OWNER + "']").forEach(function(el) {
						el.remove();
					});
					delete body.dataset.dshQingxiao;
					["data-qx-contrast", "data-qx-blur", "data-qx-gold", "data-qx-charms",
					 "data-qx-frost", "data-qx-frost-plugin", "data-qx-frost-native"].forEach(function(attr) {
						body.removeAttribute(attr);
					});
					styleTag.remove();
					widthSheet.remove();
					fontSheet.remove();
					if (palettePanelEl) palettePanelEl.remove();
					toggleBtn.remove();
					if (particleField) particleField.remove();
					if (domIntervalId) clearInterval(domIntervalId);
					if (paletteSaveTimer !== null) clearTimeout(paletteSaveTimer);
					if (statusTimer) clearTimeout(statusTimer);
					if (veilTimer) clearTimeout(veilTimer);
					darkObserver.disconnect();
					themeColorObserver.disconnect();
					if (heroObserver) heroObserver.disconnect();
					if (resizeObserver) resizeObserver.disconnect();
					if (frostPending) clearTimeout(frostPending);
					document.removeEventListener("click", frostSchedule, true);
					frostObserver.disconnect();
					frostHostsSeen.length = 0;
					// 打标（.qx-frost / .qx-frost-solid）全部摘除，不给下一个实例/裸 DSH 留痕迹。
					document.querySelectorAll("." + QX_FROST_CLASS).forEach(function(el) {
						el.classList.remove(QX_FROST_CLASS, QX_FROST_SOLID);
					});
					previous.forEach(function(value, prop) {
						if (value === "") body.style.removeProperty(prop);
						else body.style.setProperty(prop, value);
					});
					body.style.removeProperty("--qx-frost-blur");
					document.querySelectorAll("[data-skin-owner='" + SKIN_OWNER + "']").forEach(function(el) {
						el.remove();
					});
					if (iconLink.isConnected) iconLink.remove();
					if (themeColorMeta && themeColorMeta.isConnected && previousThemeColor !== void 0) {
						themeColorMeta.content = previousThemeColor;
					}
					if (document.title === SKIN_TITLE) document.title = originalTitle;
				if (window.__QX_DISPOSE_PRIOR__ === skinDispose) window.__QX_DISPOSE_PRIOR__ = null;
			};
			ctx.effect(function() {
				window.__QX_DISPOSE_PRIOR__ = skinDispose;
				return skinDispose;
			}, "ui-skin-qingxiao: themed backdrop with scrim, glass columns, jade-gold keys, sword-light motes, palette panel");
		}

		exports.apply = apply;
		return module.exports;
	}
});
