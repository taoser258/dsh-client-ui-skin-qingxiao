window.__ModuleLoader__.load({
	id: "@taosee258/dsh-client-ui-skin-qingxiao",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var React = require("react");
		var h = React.createElement;

		// ═══════════════════════════════════════════════════════════════
		//  清宵 · 弦凝清霄 —— client-side skin
		//  Palette: 冰蓝 ice-blue / 青碧 jade-cyan / 月白 moon-white /
		//           玄夜 night-indigo / 鎏金 gold trim
		// ═══════════════════════════════════════════════════════════════

		var SKIN_OWNER = "qingxiao";
		// 与 package.json 的 version 保持一致（面板页脚会展示）。
		var SKIN_VERSION = "0.8.2";
		var SKIN_TITLE = "清宵 · DeepSeek Harness";
		var SKIN_SYSTEM_CHROME_COLOR_LIGHT = "#EEF7FB";
		var SKIN_SYSTEM_CHROME_COLOR_DARK = "#0B1E2E";
		var SETTINGS_URL = "/api/dsh-qingxiao/settings";
		var DEFAULT_BG_URL = "/api/dsh-qingxiao/default-background";
		var LOCAL_SETTINGS_KEY = "dsh-client-ui-skin-qingxiao.settings";
		var BACKDROP_PROPERTIES = [
			"background-image",
			"background-position",
			"background-size",
			"background-attachment",
			"background-repeat"
		];

		// ── 正文字号缩放：DSH markdown 字体令牌表 ──
		// 基准取自 @deepseek-ai/dsh-client-ui-theme 0.2.1-rc.2 的令牌定义：
		//   base 系   : var(--dsh-content-font-size, 14px) / calc(24px + delta)
		//   h1/h2/h3  : (21/19/18px + delta) / (30/28/26px + delta)
		//   small 系  : 12px / 20px
		//   table 系  : var(--dsh-content-font-size-secondary, 13px) / calc(22px + delta2)
		//   code 系   : (12px+codeΔ)/19px+codeΔ · codeSize/19px+codeΔ · codeSize/16px+codeΔ
		// delta 是官方设置里的正文字号偏移（--dsh-content-font-delta，body 上
		// 定义为 calc(内容字号 - 14px)）。缩放把整个表达式乘上 S，官方偏移在皮肤
		// 缩放下继续生效；100% 时与官方令牌逐字节一致。
		// 每项：[名, 字重("" = 不写), 是否斜体, 字族, 字号表达式, 行高表达式]，
		// 表达式里的 $S 生成时替换为缩放字面量（如 1.05），再整体包进 calc()。
		// calc 包 var 的写法与官方令牌同构（官方 shorthand 本就带 calc+var）；
		// 不要退回纯 px 字面量——那会把官方的字号偏移一并抹掉。
		var QX_DELTA = "var(--dsh-content-font-delta, 0px)";
		var QX_DELTA_2 = "var(--dsh-content-font-delta-secondary, 0px)";
		// 0.2.1 起代码字号接入官方「代码字号」设置，缩放时保留其偏移
		var QX_CODE_DELTA = "var(--dsh-code-font-delta, 0px)";
		var QX_CODE_SIZE = "var(--dsh-code-font-size, 11px)";
		var QX_CONTENT_SIZE = "var(--dsh-content-font-size, 14px)";
		var QX_CONTENT_SIZE_2 = "var(--dsh-content-font-size-secondary, 13px)";
		var QX_FONT_TOKENS = [
			["base", "", false, "text", QX_CONTENT_SIZE + " * $S", "(24px + " + QX_DELTA + ") * $S"],
			["base-strong", "600", false, "text", QX_CONTENT_SIZE + " * $S", "(24px + " + QX_DELTA + ") * $S"],
			["base-italic", "", true, "text", QX_CONTENT_SIZE + " * $S", "(24px + " + QX_DELTA + ") * $S"],
			["base-strong-italic", "600", true, "text", QX_CONTENT_SIZE + " * $S", "(24px + " + QX_DELTA + ") * $S"],
			["h1", "700", false, "text", "(21px + " + QX_DELTA + ") * $S", "(30px + " + QX_DELTA + ") * $S"],
			["h2", "700", false, "text", "(19px + " + QX_DELTA + ") * $S", "(28px + " + QX_DELTA + ") * $S"],
			["h3", "700", false, "text", "(18px + " + QX_DELTA + ") * $S", "(26px + " + QX_DELTA + ") * $S"],
			["h4", "600", false, "text", QX_CONTENT_SIZE + " * $S", "(24px + " + QX_DELTA + ") * $S"],
			["small", "", false, "text", "12px * $S", "20px * $S"],
			["small-strong", "600", false, "text", "12px * $S", "20px * $S"],
			["small-italic", "", true, "text", "12px * $S", "20px * $S"],
			["small-strong-italic", "600", true, "text", "12px * $S", "20px * $S"],
			["table", "", false, "text", QX_CONTENT_SIZE_2 + " * $S", "(22px + " + QX_DELTA_2 + ") * $S"],
			["table-head", "500", false, "text", QX_CONTENT_SIZE_2 + " * $S", "(22px + " + QX_DELTA_2 + ") * $S"],
			["code", "", false, "code", "(12px + " + QX_CODE_DELTA + ") * $S", "(19px + " + QX_CODE_DELTA + ") * $S"],
			["code-block", "", false, "code", QX_CODE_SIZE + " * $S", "(19px + " + QX_CODE_DELTA + ") * $S"],
			["code-block-small", "", false, "code", QX_CODE_SIZE + " * $S", "(16px + " + QX_CODE_DELTA + ") * $S"]
		];
		var QX_FONT_SCOPE = "body[data-dsh-qingxiao] :is([data-slot='main.conversation'], [data-slot='conversation'], [data-conversation-scroll])";

		// ── 0.7.0 个性化定制：系统字体 / 色板 / 颜色工具 ──
		// 字体只存枚举 id，映射到固定栈；不下载字体，缺失时由后面的 fallback 接住。
		var QX_FONT_UI = [
			{ id: "system", label: "跟随系统", stack: "var(--dsw-font-family, system-ui, -apple-system, 'Segoe UI', 'Microsoft YaHei', sans-serif)" },
			{ id: "source-han-sans", label: "思源黑体", stack: "'Source Han Sans SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif" },
			{ id: "yahei", label: "微软雅黑", stack: "'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif" },
			{ id: "pingfang", label: "苹方", stack: "'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif" },
			{ id: "lxgw-wenkai", label: "霞鹜文楷", stack: "'LXGW WenKai', 'LXGW WenKai GB', 'Kaiti SC', KaiTi, serif" },
			{ id: "source-han-serif", label: "思源宋体", stack: "'Source Han Serif SC', 'Noto Serif CJK SC', 'Songti SC', SimSun, serif" },
			{ id: "kaiti", label: "楷体", stack: "KaiTi, 'Kaiti SC', STKaiti, serif" }
		];
		var QX_FONT_CODE = [
			{ id: "system", label: "跟随默认", stack: "var(--ds-font-family-code, ui-monospace, 'Cascadia Mono', Consolas, monospace)" },
			{ id: "consolas", label: "Consolas", stack: "Consolas, 'Cascadia Mono', ui-monospace, monospace" },
			{ id: "cascadia-code", label: "Cascadia Code", stack: "'Cascadia Code', 'Cascadia Mono', Consolas, monospace" },
			{ id: "jetbrains-mono", label: "JetBrains Mono", stack: "'JetBrains Mono', Consolas, ui-monospace, monospace" },
			{ id: "fira-code", label: "Fira Code", stack: "'Fira Code', Consolas, ui-monospace, monospace" },
			{ id: "menlo", label: "Menlo", stack: "Menlo, Monaco, Consolas, monospace" }
		];
		// 0.8.0 场景粒子形态（顺序即面板展示顺序）
		var QX_PARTICLE_STYLES = ["rise", "snow", "rain", "firefly"];
		var HOTKEY_ACTIONS = [
			{ key: "hotkeyPanel", label: "开关面板", action: "panel" },
			{ key: "hotkeyScene", label: "切换场景", action: "scene" },
			{ key: "hotkeyBlur", label: "面板磨砂", action: "blur" },
			{ key: "hotkeyLiquid", label: "液态输入框", action: "liquid" }
		];
		var HOTKEY_RE = /^(?:(?:Ctrl|Alt|Shift|Meta)\+)*(?:Key[A-Z]|F(?:[1-9]|1[0-2]))$/;
		function comboFromEvent(e) {
			var parts = [];
			if (e.ctrlKey) parts.push("Ctrl");
			if (e.altKey) parts.push("Alt");
			if (e.shiftKey) parts.push("Shift");
			if (e.metaKey) parts.push("Meta");
			if (e.code) parts.push(e.code);
			return parts.join("+");
		}
		function comboIsUsable(combo) {
			if (!HOTKEY_RE.test(combo)) return false;
			return /^(Ctrl|Alt|Meta)\+/.test(combo) || /^F[0-9]{1,2}$/.test(combo);
		}
		var QX_PALETTES = [
			{ id: "jade", label: "青碧", accent: "#2E9E98" },
			{ id: "ink", label: "墨蓝", accent: "#3D6FA8" },
			{ id: "bamboo", label: "竹青", accent: "#4F8A5B" },
			{ id: "lotus", label: "藕荷", accent: "#9A6A9E" },
			{ id: "amber", label: "琥珀", accent: "#C08A3E" },
			{ id: "crimson", label: "绯红", accent: "#B85C5C" }
		];
		var QX_JADE_DEFAULT = "#2E9E98";
		// 基准行高：正文 14px / 24px ≈ 1.7；默认值取 1.7 时生成结果与旧版逐字一致。
		var QX_LINE_BASE = 1.7;

		function qxFontStack(list, id) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].id === id) return list[i].stack;
			}
			return list[0].stack;
		}
		function qxHasId(list, id) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].id === id) return true;
			}
			return false;
		}
		function qxPaletteById(id) {
			for (var i = 0; i < QX_PALETTES.length; i++) {
				if (QX_PALETTES[i].id === id) return QX_PALETTES[i];
			}
			return QX_PALETTES[0];
		}
		function qxHexToRgb(hex) {
			var match = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
			if (!match) return null;
			var n = parseInt(match[1], 16);
			return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
		}
		function qxRgbToHex(rgb) {
			var part = function(v) {
				var s = Math.max(0, Math.min(255, Math.round(v))).toString(16);
				return s.length === 1 ? "0" + s : s;
			};
			return "#" + part(rgb.r) + part(rgb.g) + part(rgb.b);
		}
		function qxNormalizeHex(value) {
			var rgb = qxHexToRgb(value);
			return rgb ? qxRgbToHex(rgb).toLowerCase() : null;
		}
		function qxMixHex(a, b, t) {
			var ca = qxHexToRgb(a), cb = qxHexToRgb(b);
			if (!ca || !cb) return a;
			return qxRgbToHex({
				r: ca.r + (cb.r - ca.r) * t,
				g: ca.g + (cb.g - ca.g) * t,
				b: ca.b + (cb.b - ca.b) * t
			});
		}
		function qxRelLuminance(rgb) {
			var channel = function(v) {
				var c = v / 255;
				return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
		}
		function qxContrastRatio(a, b) {
			var ca = qxHexToRgb(a), cb = qxHexToRgb(b);
			if (!ca || !cb) return 1;
			var la = qxRelLuminance(ca), lb = qxRelLuminance(cb);
			return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
		}
		// 逐步向 toward 色靠拢，直到达到目标对比度；最多 20 步。
		function qxEnsureContrast(fg, bg, target, toward) {
			if (qxContrastRatio(fg, bg) >= target) return qxNormalizeHex(fg) || fg;
			var start = qxHexToRgb(fg), end = qxHexToRgb(toward);
			if (!start || !end) return fg;
			var out = start;
			for (var i = 1; i <= 20; i++) {
				var t = i / 20;
				out = {
					r: start.r + (end.r - start.r) * t,
					g: start.g + (end.g - start.g) * t,
					b: start.b + (end.b - start.b) * t
				};
				if (qxContrastRatio(qxRgbToHex(out), bg) >= target) break;
			}
			return qxRgbToHex(out).toLowerCase();
		}
		// 返回强调色的整套派生值；默认青碧且未自定义时不生成样式表（观感零变化）。
		function qxResolveAccent(settings) {
			var palette = qxPaletteById(settings.paletteId);
			var custom = qxNormalizeHex(settings.accentColor);
			var base = custom || palette.accent;
			var isDefault = !custom && palette.id === "jade";
			if (custom && palette.id === "jade" && custom === QX_JADE_DEFAULT) isDefault = true;
			var rgb = qxHexToRgb(base) || qxHexToRgb(QX_JADE_DEFAULT);
			var cyan = qxMixHex(base, "#FFFFFF", 0.27);
			var cyanRgb = qxHexToRgb(cyan) || rgb;
			return {
				isDefault: isDefault,
				base: base,
				strongLight: qxEnsureContrast(base, "#F8FCFE", 4.5, "#000000"),
				strongDark: qxEnsureContrast(base, "#0A1A28", 4.5, "#FFFFFF"),
				// 主按钮统一用月白字，按 4.5:1 校正底色，避免亮色系按钮发白
				fill: qxEnsureContrast(base, "#F4F9FC", 4.5, "#000000"),
				hover: qxMixHex(qxEnsureContrast(base, "#F4F9FC", 4.5, "#000000"), "#000000", 0.15),
				cyan: cyan,
				bright: qxMixHex(base, "#FFFFFF", 0.55),
				rgb: rgb.r + "," + rgb.g + "," + rgb.b,
				cyanRgb: cyanRgb.r + "," + cyanRgb.g + "," + cyanRgb.b
			};
		}
		function buildAccentCss(accent) {
			if (accent.isDefault) return "";
			var baseSel = "body[data-dsh-qingxiao]:not([data-ds-dark-theme]),\nbody[data-dsh-qingxiao][data-ds-dark-theme]";
			var lightSel = "body[data-dsh-qingxiao]:not([data-ds-dark-theme])";
			var darkSel = "body[data-dsh-qingxiao][data-ds-dark-theme]";
			return baseSel + " {\n"
				+ "\t--qx-cyan: " + accent.cyan + ";\n"
				+ "\t--qx-cyan-bright: " + accent.bright + ";\n"
				+ "\t--qx-cyan-rgb: " + accent.cyanRgb + ";\n"
				+ "\t--qx-jade: " + accent.fill + ";\n"
				+ "\t--dsw-alias-button-primary-fill: " + accent.fill + ";\n"
				+ "\t--dsw-alias-button-primary-hover: " + accent.hover + ";\n"
				+ "\t--dsw-alias-brand-primary: " + accent.fill + ";\n"
				+ "}\n"
				+ lightSel + " {\n"
				+ "\t--qx-accent-strong: " + accent.strongLight + ";\n"
				+ "\t--dsw-alias-state-business-primary: " + accent.strongLight + ";\n"
				+ "\t--qx-panel-border: rgba(" + accent.rgb + ", 0.42);\n"
				+ "\t--qx-panel-border-strong: rgba(" + accent.rgb + ", 0.62);\n"
				+ "}\n"
				+ darkSel + " {\n"
				+ "\t--qx-accent-strong: " + accent.strongDark + ";\n"
				+ "\t--dsw-alias-state-business-primary: " + accent.strongDark + ";\n"
				+ "\t--qx-panel-border: rgba(" + accent.rgb + ", 0.40);\n"
				+ "\t--qx-panel-border-strong: rgba(" + accent.rgb + ", 0.60);\n"
				+ "}\n"
				+ lightSel + " [id=root] { --dsw-alias-state-business-primary: " + accent.strongLight + "; }\n"
				+ darkSel + " [id=root] { --dsw-alias-state-business-primary: " + accent.strongDark + "; }\n";
		}

		function qxPx(value) {
			return Math.round(value * 100) / 100;
		}

		// 生成字号缩放表：基准表达式乘缩放字面量后包进 calc()，var()/delta 原样
		// 保留，这样 DSH 的 font:var(--dsw-font-markdown-*) 正常解析且官方字号
		// 偏移不被抹掉。同时补一组 font-size/line-height 长属性兜底：万一 DSH
		// 改了令牌名，正文仍然会跟着缩放，且 calc 值在嵌套 markdown 里不会二次放大。
		function buildFontScaleCss(scale, type) {
			var decls = [];
			var out = {};
			var s = qxPx(scale);
			type = type || {};
			// 默认行高按 1.7 处理：1.70 时乘数为 1，生成的令牌与旧版逐字一致。
			var lineFactor = qxPx((type.lineHeight || QX_LINE_BASE) / QX_LINE_BASE);
			QX_FONT_TOKENS.forEach(function(spec) {
				var name = spec[0];
				var weight = spec[1];
				var italic = spec[2];
				// 变量未设置时回落到宿主字体，默认状态与旧版完全一致。
				var family = spec[3] === "code"
					? "var(--qx-font-code, var(--ds-font-family-code))"
					: "var(--qx-font-ui, var(--dsw-font-family))";
				var size = "calc(" + spec[4].replace("$S", String(s)) + ")";
				var lineExpr = spec[5].replace("$S", String(s));
				if (lineFactor !== 1) lineExpr += " * " + lineFactor;
				var line = "calc(" + lineExpr + ")";
				out[name] = { size: size, line: line };
				decls.push("--dsw-font-markdown-" + name + ": " + (italic ? "italic " : "") + (weight ? weight + " " : "") + size + "/" + line + " " + family + ";");
				decls.push("--dsw-font-markdown-" + name + "-font-size: " + size + ";");
				decls.push("--dsw-font-markdown-" + name + "-line-height: " + line + ";");
			});
			var css = QX_FONT_SCOPE + "{--qx-font-scale:" + s + ";\n" + decls.join("\n") + "\n}";
			// 自定义字体：正文字体作用于整个会话作用域，代码字体只落到代码元素；
			// 未设置变量时回落到宿主字体，默认状态无变化。
			css += "\n" + QX_FONT_SCOPE + "{font-family:var(--qx-font-ui, inherit);}";
			css += "\n" + QX_FONT_SCOPE + " :not(pre) > code," + QX_FONT_SCOPE + " pre{font-family:var(--qx-font-code, var(--ds-font-family-code));}";
			// 字距不进 font 简写，用变量挂到正文；代码区恢复 normal，避免等宽错位。
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown']{letter-spacing:var(--qx-letter-spacing, 0em);}";
			css += "\n" + QX_FONT_SCOPE + " :is(pre, code, kbd, samp){letter-spacing:normal;}";
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown']{font-size:" + out.base.size + ";line-height:" + out.base.line + ";}";
			["h1", "h2", "h3"].forEach(function(h) {
				css += "\n" + QX_FONT_SCOPE + " [class*='_markdown'] " + h + "{font-size:" + out[h].size + ";line-height:" + out[h].line + ";}";
			});
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown'] :is(h4,h5,h6){font-size:" + out.base.size + ";line-height:" + out.base.line + ";}";
			css += "\n" + QX_FONT_SCOPE + " [class*='_markdown'] :is(th,td){font-size:" + out.table.size + ";line-height:" + out.table.line + ";}";
			return css;
		}

		// 实测对话正文当前的像素字号：给面板做自校验用。
		function measureConversationFont() {
			var el = document.querySelector("[data-conversation-scroll] [class*='_markdown']")
				|| document.querySelector(":is([data-slot='main.conversation'], [data-slot='conversation']) [class*='_markdown']");
			if (!el || typeof getComputedStyle !== "function") return null;
			var size = parseFloat(getComputedStyle(el).fontSize);
			return isFinite(size) ? Math.round(size * 100) / 100 : null;
		}

		// ═══════════════════════════════════════════════════════════════
		//  人格设置（settings.section「人格」）
		//  DSH 适配 character-persona-forge 三层注入模型：系统层写
		//  ~/.dsh/AGENTS.md（dsh-agent-instructions 的 user-global 指令），
		//  锚定/后置层并入同一块指令（DSH 无逐轮注入钩子）。
		//  组件纯 fetch 驱动，不依赖 DSH 内部 store；样式挂 .qx-persona
		//  作用域，复用皮肤调色板变量。
		// ═══════════════════════════════════════════════════════════════

		var PERSONA_API = "/api/dsh-qingxiao/persona";
		var PERSONA_DOCS_API = "/api/dsh-qingxiao/persona-docs";
		var PERSONA_APPLY_API = "/api/dsh-qingxiao/persona-apply";
		var PERSONA_LIBRARY_API = "/api/dsh-qingxiao/persona-library";
		var FORGE_URL = "https://www.npmjs.com/package/character-persona-forge";
		var FORGE_SITE_URL = "https://character-persona-forge-43i5vylizvh.qoder.zone";
		var FORGE_GITHUB_URL = "https://github.com/taoser258/character-persona-forge";

		// 槽组件用 class 实现：绕开 hooks 与槽渲染器的调用顺序差异
		function PersonaSettingsSection(props) {
			return h(PersonaSectionView, props);
		}

		class PersonaSectionView extends React.Component {
			constructor(props) {
				super(props);
				this.state = {
					loading: true, busy: false, settings: null, injected: false,
					agentsPath: "", preview: "", docs: { soul: "", style: "" }, docSource: "builtin",
					status: "", statusOk: true, tab: "soul", addr: "", ooc: "",
					editing: null, draft: "", viewing: null,
					library: { activeId: "qingxiao", personas: [] }, activeName: "", activeIsBuiltin: true,
					viewPersona: null, viewTab: "soul", renamingId: null, confirmDeleteId: null,
					editor: null, switchNotice: "", officialPersona: false
				};
				// 同步镜像：连点两个开关时，第二次点击必须看到第一次的改动。
				// state 更新是异步批处理的，光靠 this.state 会读到旧快照（丢更新）。
				this._pending = null;
				// 保存串行链：保证请求到达顺序 = 点击顺序，避免后发先至覆盖前一次。
				this._saveChain = null;
				this.load = this.load.bind(this);
				this.saveSettings = this.saveSettings.bind(this);
				this.setField = this.setField.bind(this);
				this.pickDoc = this.pickDoc.bind(this);
				this.reApply = this.reApply.bind(this);
				this.openEdit = this.openEdit.bind(this);
				this.closeEdit = this.closeEdit.bind(this);
				this.saveEdit = this.saveEdit.bind(this);
				this.openView = this.openView.bind(this);
				this.loadLibrary = this.loadLibrary.bind(this);
				this.libPost = this.libPost.bind(this);
				this.selectPersona = this.selectPersona.bind(this);
				this.renamePersona = this.renamePersona.bind(this);
				this.deletePersona = this.deletePersona.bind(this);
				this.viewPersonaDocs = this.viewPersonaDocs.bind(this);
				this.openEditor = this.openEditor.bind(this);
				this.editPersona = this.editPersona.bind(this);
				this.closeEditor = this.closeEditor.bind(this);
				this.saveEditor = this.saveEditor.bind(this);
				this.importIntoEditor = this.importIntoEditor.bind(this);
				this.exportPersona = this.exportPersona.bind(this);
				this.openPersonaImport = this.openPersonaImport.bind(this);
				this.detectOfficialPersona = this.detectOfficialPersona.bind(this);
			}
			componentDidMount() {
				this.load();
				this.detectOfficialPersona();
				var self = this;
				// 官方 @deepseek-ai/dsh-persona 会在设置导航里出现「人设」项；
				// 导航可能晚于本分区挂载，用 MutationObserver 跟进，避免误报/漏报。
				this._personaDetectTimer = null;
				this._personaObserver = new MutationObserver(function () {
					if (self._personaDetectTimer) return;
					self._personaDetectTimer = setTimeout(function () {
						self._personaDetectTimer = null;
						self.detectOfficialPersona();
					}, 400);
				});
				this._personaObserver.observe(document.body, { childList: true, subtree: true });
				// Esc 优先关闭本皮肤弹窗（capture 阶段拦截，避免顺带关掉外层设置弹窗）
				this._escHandler = function (e) {
					if (e.key !== "Escape") return;
					if (self.state.editing) { e.stopPropagation(); e.preventDefault(); self.closeEdit(); }
					else if (self.state.viewing) { e.stopPropagation(); e.preventDefault(); self.setState({ viewing: null }); }
					else if (self.state.editor) { e.stopPropagation(); e.preventDefault(); self.closeEditor(); }
					else if (self.state.viewPersona) { e.stopPropagation(); e.preventDefault(); self.setState({ viewPersona: null }); }
				};
				window.addEventListener("keydown", this._escHandler, true);
			}
			componentWillUnmount() {
				if (this._escHandler) window.removeEventListener("keydown", this._escHandler, true);
				if (this._personaObserver) { this._personaObserver.disconnect(); this._personaObserver = null; }
				if (this._personaDetectTimer) { clearTimeout(this._personaDetectTimer); this._personaDetectTimer = null; }
			}
			patch(p) { this.setState(p); }
			say(msg, ok) { this.setState({ status: msg, statusOk: ok !== false }); }
			// 官方人设插件（system prompt 通道）启用时，设置导航会出现「人设」项。
			// 只认导航控件且排除本分区自身文本，避免把卡片里的「人设」二字当成信号。
			detectOfficialPersona() {
				var found = false;
				var nodes = document.querySelectorAll("button, a, [role='tab'], [role='button'], [role='menuitem']");
				for (var i = 0; i < nodes.length; i++) {
					var el = nodes[i];
					if (el.closest && el.closest(".qx-persona")) continue;
					if (typeof el.getClientRects === "function" && el.getClientRects().length === 0) continue;
					if ((el.textContent || "").replace(/\s+/g, "") === "人设") { found = true; break; }
				}
				if (found !== this.state.officialPersona) this.setState({ officialPersona: found });
			}
			putJson(url, body) {
				return fetch(url, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
			}
			load() {
				var self = this;
				fetch(PERSONA_API).then(function (r) { return r.json(); }).then(function (d) {
					if (!d.ok) throw new Error(d.message || "HTTP");
					self.setState({ settings: d.settings, injected: d.injected, agentsPath: d.agentsPath, preview: d.preview, loading: false,
						addr: d.settings.address || "漂泊者", ooc: d.settings.oocWords || "出戏 / OOC / 退出角色" });
					return fetch(PERSONA_DOCS_API).then(function (r2) { return r2.json(); });
				}).then(function (d2) {
					if (d2 && d2.ok) self.setState({ docs: { soul: d2.soul, style: d2.style }, docSource: d2.source, activeName: d2.activeName || "", activeIsBuiltin: d2.activeId === "qingxiao" });
					self.loadLibrary();
				}).catch(function (e) { self.setState({ loading: false }); self.say("人格服务未就绪：" + e.message, false); });
			}
			reloadDocs() {
				var self = this;
				return fetch(PERSONA_DOCS_API).then(function (r) { return r.json(); }).then(function (d2) {
					if (d2 && d2.ok) self.setState({ docs: { soul: d2.soul, style: d2.style }, docSource: d2.source, activeName: d2.activeName || "", activeIsBuiltin: d2.activeId === "qingxiao" });
				}).catch(function () { /* 文档重载失败不阻断设置保存 */ });
			}
			loadLibrary() {
				var self = this;
				return fetch(PERSONA_LIBRARY_API).then(function (r) { return r.json(); }).then(function (d) {
					if (d && d.ok) self.setState({ library: { activeId: d.activeId, personas: d.personas || [] } });
				}).catch(function () {});
			}
			// 人格包：导出当前人格 / 导入 .qx-persona.json（0.5.0）
			exportPersona() {
				var self = this;
				var id = this.state.library.activeId;
				if (!id) { this.say("✗ 没有当前人格", false); return; }
				fetch(PERSONA_LIBRARY_API + "?id=" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) {
					if (!d.ok || !d.persona) throw new Error(d.message || "读取失败");
					var pack = {
						schema: "qingxiao-persona", version: 1,
						name: d.persona.name || "未命名人格",
						author: "", description: "",
						soul: d.persona.soul || "", style: d.persona.style || ""
					};
					var blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
					var url = URL.createObjectURL(blob);
					var link = document.createElement("a");
					link.href = url;
					link.download = "qingxiao-persona-" + String(pack.name).replace(/[\\/:*?"<>|]/g, "_") + ".json";
					document.body.appendChild(link);
					link.click();
					setTimeout(function () { URL.revokeObjectURL(url); link.remove(); }, 800);
					self.say("✓ 已导出人格「" + pack.name + "」");
				}).catch(function (e) { self.say("✗ 导出失败：" + (e.message || e), false); });
			}
			openPersonaImport() {
				var self = this;
				var input = document.createElement("input");
				input.type = "file";
				input.accept = ".json,application/json";
				input.style.display = "none";
				input.addEventListener("change", function () {
					var file = input.files && input.files[0];
					if (file) self.importPersonaFile(file);
					setTimeout(function () { input.remove(); }, 100);
				});
				document.body.appendChild(input);
				input.click();
			}
			importPersonaFile(file) {
				var self = this;
				if (!file) return;
				if (file.size > 4 * 1024 * 1024) { this.say("✗ 人格包不能超过 4MB", false); return; }
				var reader = new FileReader();
				reader.onload = function () {
					try {
						var raw = JSON.parse(String(reader.result || ""));
						if (!raw || raw.schema !== "qingxiao-persona" || raw.version !== 1) throw new Error("格式不正确");
						var name = String(raw.name || "导入的人格").trim().slice(0, 40) || "导入的人格";
						var soul = typeof raw.soul === "string" ? raw.soul : "";
						var style = typeof raw.style === "string" ? raw.style : "";
						if (!soul.trim() && !style.trim()) throw new Error("人格包没有 soul/style 内容");
						self.setState({ busy: true });
						fetch(PERSONA_LIBRARY_API, {
							method: "POST", headers: { "content-type": "application/json" },
							body: JSON.stringify({ action: "import", name: name, soul: soul, style: style })
						}).then(function (r) { return r.json(); }).then(function (d) {
							if (!d.ok) throw new Error(d.message || "导入失败");
							self.afterLibChange(d, "✓ 已导入人格「" + name + "」");
						}).catch(function (e) { self.say("✗ 导入失败：" + (e.message || e), false); })
							.finally(function () { self.setState({ busy: false }); });
					} catch (e) {
						self.say("✗ 人格包无效：" + (e.message || e), false);
					}
				};
				reader.onerror = function () { self.say("✗ 读取人格包失败", false); };
				reader.readAsText(file);
			}
			libPost(body) {
				return fetch(PERSONA_LIBRARY_API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
			}
			// 库操作成功后统一刷新：设置/注入状态/当前人格文档/预览/列表
			afterLibChange(d, msg) {
				var self = this;
				if (d.settings) this.setState({ settings: d.settings, injected: d.applied ? d.applied.enabled : this.state.injected });
				this.reloadDocs();
				this.loadLibrary();
				fetch(PERSONA_API).then(function (r) { return r.json(); }).then(function (p) { if (p && p.ok) self.setState({ preview: p.preview }); }).catch(function () {});
				if (msg) this.say(msg);
			}
			selectPersona(id) {
				var self = this;
				if (this.state.busy) return;
				var ps = this.state.library.personas || [];
				var prevName = ((ps.find(function (p) { return p.id === self.state.library.activeId; }) || {}).name) || "";
				var newName = ((ps.find(function (p) { return p.id === id; }) || {}).name) || id;
				this.setState({ busy: true });
				this.libPost({ action: "select", id: id }).then(function (d) {
					if (!d.ok) throw new Error(d.message || "切换失败");
					self.afterLibChange(d, "已切换人格");
					self.setState({ switchNotice: "已切换为「" + newName + "」。进行中的会话仍会延续「" + prevName + "」——要点左上的「新会话」，才会以「" + newName + "」对话。" });
				}).catch(function (e) { self.say("切换失败：" + e.message, false); })
					.finally(function () { self.setState({ busy: false }); });
			}
			renamePersona(id, currentName) {
				var self = this;
				var name = ((this.state.renameValue != null ? this.state.renameValue : currentName) || "").trim().slice(0, 40);
				this.setState({ renamingId: null, renameValue: null });
				if (!name) return;
				this.libPost({ action: "rename", id: id, name: name }).then(function (d) {
					if (d && d.ok) self.loadLibrary();
					else self.say("重命名失败：" + ((d && d.message) || ""), false);
				}).catch(function (e) { self.say("重命名失败：" + e.message, false); });
			}
			deletePersona(id) {
				var self = this;
				this.setState({ confirmDeleteId: null });
				this.libPost({ action: "delete", id: id }).then(function (d) {
					if (!d.ok) { self.say("删除失败：" + (d.message || ""), false); return; }
					self.afterLibChange(d, "已删除该人格");
				}).catch(function (e) { self.say("删除失败：" + e.message, false); });
			}
			viewPersonaDocs(id) {
				var self = this;
				fetch(PERSONA_LIBRARY_API + "?id=" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) {
					if (d && d.ok) self.setState({ viewPersona: d.persona, viewTab: "soul" });
					else self.say("读取失败：" + ((d && d.message) || ""), false);
				}).catch(function (e) { self.say("读取失败：" + e.message, false); });
			}
			openEditor() {
				this.setState({ editor: { mode: "create", id: null, name: "", soul: "", style: "", tab: "soul" } });
			}
			editPersona(id) {
				var self = this;
				fetch(PERSONA_LIBRARY_API + "?id=" + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) {
					if (d && d.ok && d.persona) self.setState({ editor: { mode: "edit", id: d.persona.id, name: d.persona.name, soul: d.persona.soul || "", style: d.persona.style || "", tab: "soul" } });
					else self.say("读取失败：" + ((d && d.message) || ""), false);
				}).catch(function (e) { self.say("读取失败：" + e.message, false); });
			}
			closeEditor() {
				if (this.state.busy) return;
				this.setState({ editor: null });
			}
			importIntoEditor(which) {
				var self = this;
				// 只在编辑弹窗内调用；文件内容是用户选完后在 onload 里读 state.editor，
				// 那时弹窗状态早已就位。
				var input = document.createElement("input");
				input.type = "file";
				input.accept = ".md,.markdown,.txt,text/markdown,text/plain";
				input.style.display = "none";
				input.addEventListener("change", function () {
					var file = input.files && input.files[0];
					if (input.parentNode) input.parentNode.removeChild(input);
					if (!file) return;
					if (file.size > 2 * 1024 * 1024) { self.say("文档不能超过 2MB", false); return; }
					var reader = new FileReader();
					reader.onload = function () {
						var ed = Object.assign({}, self.state.editor);
						if (!ed) return;
						ed[which] = String(reader.result || "");
						ed.tab = which;
						if (which === "soul" && !ed.name) ed.name = (file.name || "").replace(/\.(md|markdown|txt)$/i, "");
						self.setState({ editor: ed });
						self.say("已载入 " + file.name + " 到 " + which + "，点保存生效");
					};
					reader.onerror = function () { self.say("读取文件失败", false); };
					reader.readAsText(file);
				});
				document.body.appendChild(input);
				input.click();
			}
			saveEditor() {
				var self = this;
				var ed = this.state.editor;
				if (!ed || this.state.busy) return;
				var name = (ed.name || "").trim() || "未命名人格";
				this.setState({ busy: true });
				var body = ed.mode === "edit"
					? { action: "update", id: ed.id, name: name, soul: ed.soul, style: ed.style }
					: { action: "create", name: name, soul: ed.soul, style: ed.style };
				this.libPost(body).then(function (d) {
					if (!d.ok) throw new Error(d.message || "保存失败");
					self.setState({ editor: null });
					self.afterLibChange(d, ed.mode === "edit" ? "人格已更新" : "已新建人格并设为当前");
					if (ed.mode === "create") self.setState({ switchNotice: "已新建并启用「" + name + "」。请开「新会话」以该人格对话；进行中的会话不受影响。" });
				}).catch(function (e) { self.say("保存失败：" + e.message, false); })
					.finally(function () { self.setState({ busy: false }); });
			}
			saveSettings(next, note) {
				var self = this;
				this.setState({ busy: true, settings: next });
				// 串行执行：并发两次 PUT 时，后发的可能先到，最后落盘的反而丢掉前一次改动。
				this._saveChain = (this._saveChain || Promise.resolve()).then(function () {
					return self.putJson(PERSONA_API, { settings: next }).then(function (d) {
						if (!d.ok) throw new Error(d.message || "保存失败");
						self._pending = null;
						self.setState({ settings: d.settings, injected: d.applied.enabled });
						self.say(note || (d.applied.enabled ? "已写入 " + d.applied.path + "，新会话生效" : "已移除人格注入"));
						return self.reloadDocs();
					});
				}).catch(function (e) {
					// 失败时撤销乐观更新：重新拉服务端真实状态，别让界面显示一个没落盘的开关。
					self._pending = null;
					self.say("保存失败：" + e.message, false);
					return self.load();
				}).finally(function () { self.setState({ busy: false }); });
			}
			setField(key, value) {
				// 以 _pending（同步镜像）为基准，而不是 this.state.settings
				var base = this._pending || this.state.settings || {};
				var next = Object.assign({}, base);
				next[key] = value;
				this._pending = next;
				this.saveSettings(next);
			}
			openEdit(tab) {
				this.setState({ editing: tab, draft: this.state.docs[tab] || "" });
			}
			openView(which) {
				// which: "doc"（只读人格文档）| "preview"（注入预览）
				this.setState({ viewing: which });
			}
			closeEdit() {
				if (this.state.busy) return;
				this.setState({ editing: null, draft: "" });
			}
			saveEdit() {
				var self = this;
				var docs = Object.assign({}, this.state.docs);
				docs[this.state.editing] = this.state.draft;
				this.setState({ busy: true });
				this.putJson(PERSONA_DOCS_API, docs).then(function (d) {
					if (!d.ok) throw new Error(d.message || "保存失败");
					self.setState({ docs: docs, settings: d.settings, docSource: d.settings.source, injected: d.applied.enabled, editing: null, draft: "" });
					self.say("文档已保存并重新注入，新会话生效");
				}).catch(function (e) { self.say("保存失败：" + e.message, false); })
					.finally(function () { self.setState({ busy: false }); });
			}
			pickDoc() {
				// 渲染进程本地读文件：动态 <input type=file> + FileReader，不依赖服务端/原生框
				var self = this;
				var input = document.createElement("input");
				input.type = "file";
				input.accept = ".md,.markdown,.txt,text/markdown,text/plain";
				input.style.display = "none";
				input.addEventListener("change", function () {
					var file = input.files && input.files[0];
					if (input.parentNode) input.parentNode.removeChild(input);
					if (!file) return;
					var okType = /\.(md|markdown|txt)$/i.test(file.name || "") || /text\/|markdown/.test(file.type || "");
					if (!okType) { self.say("请选择 .md 文本文件", false); return; }
					if (file.size > 2 * 1024 * 1024) { self.say("文档不能超过 2MB", false); return; }
					var reader = new FileReader();
					reader.onload = function () {
						// 导入不直接落盘：先装进编辑弹窗，由用户确认后再保存
						self.setState({ editing: self.state.tab, draft: String(reader.result || "") });
						self.say("已载入 " + file.name + "，确认无误后点「保存文档并注入」");
					};
					reader.onerror = function () { self.say("读取文件失败", false); };
					reader.readAsText(file);
				});
				document.body.appendChild(input);
				input.click();
			}
			reApply() {
				var self = this;
				this.setState({ busy: true });
				fetch(PERSONA_APPLY_API, { method: "POST" }).then(function (r) { return r.json(); }).then(function (d) {
					if (!d.ok) throw new Error(d.message || "应用失败");
					self.setState({ injected: d.applied.enabled });
					self.say(d.applied.enabled ? "已重新写入 " + d.applied.path : "已移除注入");
				}).catch(function (e) { self.say("应用失败：" + e.message, false); })
					.finally(function () { self.setState({ busy: false }); });
			}
			render() {
				var s = this.state;
				if (s.loading) return h("div", { className: "qx-persona" }, h("p", { className: "qx-persona-status" }, "加载中…"));
				var g = s.settings || {};
				var self = this;
				var docText = s.docs[s.tab] || "";
				var docLines = docText ? docText.replace(/\r\n?/g, "\n").split("\n").length : 0;

				function Switch(on, onChange, disabled) {
					return h("button", {
						type: "button", role: "switch", "aria-checked": on ? "true" : "false",
						className: "qx-persona-switch" + (on ? " on" : ""), disabled: disabled,
						onClick: function () { if (!disabled) onChange(!on); }
					}, h("i", null));
				}
				function Row(label, control, hint) {
					return h("div", { className: "qx-persona-row" },
						h("div", { className: "qx-persona-row-label" }, label, hint ? h("div", { className: "qx-persona-row-hint" }, hint) : null),
						h("div", { className: "qx-persona-row-control" }, control));
				}
				function Select(value, options, onChange) {
					return h("select", { className: "qx-persona-select", value: value, onChange: function (e) { onChange(e.target.value); } },
						options.map(function (o) { return h("option", { key: o[0], value: o[0] }, o[1]); }));
				}
				function LibRow(p) {
					var active = p.id === s.library.activeId;
					var renaming = s.renamingId === p.id;
					return h("div", { key: p.id, className: "qx-persona-lib-row" + (active ? " active" : "") },
						h("div", { className: "qx-persona-lib-main" },
							h("span", { className: "qx-persona-avatar" }, String(p.name || "?").trim().charAt(0)),
							renaming
								? h("input", { className: "qx-persona-input qx-persona-lib-rename", autoFocus: true, defaultValue: p.name, maxLength: 40,
									onChange: function (e) { self.setState({ renameValue: e.target.value }); },
									onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); self.renamePersona(p.id, p.name); } else if (e.key === "Escape") { self.setState({ renamingId: null, renameValue: null }); } },
									onBlur: function () { self.renamePersona(p.id, p.name); } })
								: h("span", { className: "qx-persona-lib-name" }, p.name),
							p.builtin ? h("span", { className: "qx-persona-tag" }, "内置") : null,
							active ? h("span", { className: "qx-persona-badge ok" }, "使用中") : null),
						renaming ? null : h("div", { className: "qx-persona-lib-actions" },
							active ? null : h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.selectPersona(p.id); } }, "使用"),
							h("button", { type: "button", className: "qx-persona-btn", onClick: function () { self.viewPersonaDocs(p.id); } }, "查看"),
							p.builtin ? null : h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.editPersona(p.id); } }, "编辑"),
							p.builtin ? null : h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.setState({ renamingId: p.id, renameValue: p.name }); } }, "重命名"),
							p.builtin ? null : (s.confirmDeleteId === p.id
								? h("button", { type: "button", className: "qx-persona-btn danger", disabled: s.busy, onClick: function () { self.deletePersona(p.id); } }, "确认删除")
								: h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.setState({ confirmDeleteId: p.id }); } }, "删除"))));
				}

				return h("div", { className: "qx-persona" },
					s.officialPersona ? h("div", { className: "qx-persona-conflict", role: "status" },
						h("div", { className: "qx-persona-conflict-title" }, "检测到官方「人设」页"),
						h("div", { className: "qx-persona-conflict-body" },
							"官方人设走 system prompt，本皮肤走 AGENTS.md 用户指令通道；两者同时启用会出现双份人设，建议只保留一个。")) : null,
					h("p", { className: "qx-persona-desc" },
						"让 DSH 以指定角色的语气、称呼与边界持续对话。人格指令写入 ",
						h("code", null, s.agentsPath || "~/.dsh/AGENTS.md"),
						"（DSH 用户全局指令），对所有新会话生效；当前会话需重开一轮。"),

					h("div", { className: "qx-persona-card" },
						h("div", { className: "qx-persona-card-title" }, "人格注入"),
						Row("启用", Switch(!!g.enabled, function (v) { self.setField("enabled", v); }, s.busy), "关闭会移除 AGENTS.md 中的人格块"),
						Row("当前人格", h("span", { className: "qx-persona-badge ok" }, s.activeName || "清宵 · 鸣潮")),
						Row("注入状态", h("span", { className: "qx-persona-badge" + (s.injected ? " ok" : "") }, s.injected ? "已写入" : "未注入")),
						h("div", { className: "qx-persona-session-hint" }, "人格按【会话】生效：一个会话固定用它开始时的角色，中途切换不会改写进行中的会话。换人格后请点左上「新会话」再对话。"),
						s.switchNotice ? h("div", { className: "qx-persona-session-notice" }, s.switchNotice) : null),

					h("div", { className: "qx-persona-card" },
						h("div", { className: "qx-persona-card-title" }, "人格库",
							h("span", { className: "qx-persona-card-title-spacer" }),
							h("button", { type: "button", className: "qx-persona-btn", onClick: self.exportPersona, title: "导出当前人格为 .qx-persona.json" }, "导出"),
							h("button", { type: "button", className: "qx-persona-btn", onClick: self.openPersonaImport, title: "导入 .qx-persona.json" }, "导入"),
							h("button", { type: "button", className: "qx-persona-btn primary", disabled: s.busy, onClick: self.openEditor }, "新建人格")),
						h("div", { className: "qx-persona-lib" },
							(s.library.personas || []).map(LibRow),
							(s.library.personas || []).length <= 1 ? h("div", { className: "qx-persona-lib-empty" }, "点「新建人格」，在弹窗里用「导入 soul / style 文件」填入内容即可。想要任意角色，用下面的 character-persona-forge 生成 soul.md / style.md。") : null)),

					h("div", { className: "qx-persona-card" },
						h("div", { className: "qx-persona-card-title" }, "注入选项"),
						Row("剧透闸门", Select(g.spoiler || "latest", [["latest", "跟随最新剧情"], ["none", "禁止剧透"]], function (v) { self.setField("spoiler", v); })),
						Row("称呼使用者", h("input", { className: "qx-persona-input", value: s.addr, maxLength: 20,
							onChange: function (e) { self.setState({ addr: e.target.value }); },
							onBlur: function (e) { var v = e.target.value.trim() || "漂泊者"; self.setState({ addr: v }); if (v !== (g.address || "")) self.setField("address", v); } })),
						Row("OOC 触发词", h("input", { className: "qx-persona-input", value: s.ooc, maxLength: 120,
							onChange: function (e) { self.setState({ ooc: e.target.value }); },
							onBlur: function (e) { var v = e.target.value.trim() || "出戏 / OOC / 退出角色"; self.setState({ ooc: v }); if (v !== (g.oocWords || "")) self.setField("oocWords", v); } })),
						Row("身份锚与保持指令", Switch(g.includeAnchor !== false, function (v) { self.setField("includeAnchor", v); }), "对抗长对话漂移：工具调用后/压缩后自检"),
						Row("注入 soul 核心区", Switch(g.includeSoul !== false, function (v) { self.setField("includeSoul", v); })),
						Row("注入 style 核心区", Switch(g.includeStyle !== false, function (v) { self.setField("includeStyle", v); }))),

					h("div", { className: "qx-persona-card" },
						h("div", { className: "qx-persona-card-title" }, "人格文档",
							h("span", { className: "qx-persona-tag" }, s.activeIsBuiltin ? "内置 · 清宵" : "自定义"),
							h("span", { className: "qx-persona-doc-who" }, "编辑对象：" + (s.activeName || "清宵 · 鸣潮")),
							h("span", { className: "qx-persona-card-title-spacer" }),
							h("button", { type: "button", className: "qx-persona-btn primary", disabled: s.busy, onClick: function () { self.openEdit(s.tab); } }, "编辑")),
						h("div", { className: "qx-persona-doc-note" }, s.activeIsBuiltin ? "提示：直接编辑内置清宵会先复制成一份自定义人格再改，内置资源不受影响。" : "此处编辑的是当前启用的人格；切换人格请用上方「人格库」。"),
						h("div", { className: "qx-persona-tabs" },
							["soul", "style"].map(function (t) {
								return h("button", { key: t, type: "button", className: "qx-persona-tab" + (s.tab === t ? " on" : ""), onClick: function () { self.setState({ tab: t }); } },
									t === "soul" ? "soul.md · 我是谁" : "style.md · 我怎么说");
							}),
							h("span", { className: "qx-persona-tabs-spacer" }),
							h("span", { className: "qx-persona-doc-meta" }, docLines + " 行 · " + docText.length + " 字符")),
						h("div", { className: "qx-persona-actions" },
							h("button", { type: "button", className: "qx-persona-btn", onClick: function () { self.openView("doc"); } }, "查看文档"),
							h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: self.pickDoc }, "导入 .md 文件"),
							h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: self.reApply }, "重新应用"),
							h("button", { type: "button", className: "qx-persona-btn", onClick: function () { self.openView("preview"); } }, "查看注入预览"))),

					h("div", { className: "qx-persona-card qx-persona-forge" },
						h("div", { className: "qx-persona-card-title" }, "定制任意角色 · character-persona-forge"),
						h("p", { className: "qx-persona-desc" },
							"想换别的人物？用 ", h("a", { href: FORGE_SITE_URL, target: "_blank", rel: "noreferrer" }, "character-persona-forge"),
							" 这个 skill，从官方文本与配音考据出发，为任意游戏角色生成 soul.md / style.md / sources.md 三件套（官方优先、带证据与 OOC 红线），把 soul/style 放进上面的「自定义」即可让 DSH 以该角色对话。"),
						h("div", { className: "qx-persona-actions" },
							h("a", { className: "qx-persona-btn primary", href: FORGE_SITE_URL, target: "_blank", rel: "noreferrer" }, "访问 skill 网站"),
							h("a", { className: "qx-persona-btn", href: FORGE_GITHUB_URL, target: "_blank", rel: "noreferrer" }, "GitHub 仓库"),
							h("a", { className: "qx-persona-btn", href: FORGE_URL, target: "_blank", rel: "noreferrer" }, "查看 skill（npm）"),
							h("code", { className: "qx-persona-cmd" }, "对 DSH 说：用 character-persona-forge 给〈角色名〉做一套人格文档"))),

					s.editing ? h("div", { className: "qx-persona-modal-mask",
						onMouseDown: function (e) { if (e.target === e.currentTarget) self.closeEdit(); }
					},
						h("div", { className: "qx-persona-modal", role: "dialog", "aria-modal": "true", "aria-label": "编辑人格文档" },
							h("div", { className: "qx-persona-modal-head" },
								h("div", { className: "qx-persona-modal-titles" },
									h("div", { className: "qx-persona-modal-title" },
										s.editing === "soul" ? "编辑 soul.md · 我是谁" : "编辑 style.md · 我怎么说"),
									h("div", { className: "qx-persona-modal-sub" },
										"保存后写入自定义文档库并重新注入 ", h("code", null, s.agentsPath || "AGENTS.md"), "，新会话生效；Esc 关闭不保存")),
								h("button", { type: "button", className: "qx-persona-modal-x", "aria-label": "关闭", onClick: self.closeEdit }, "✕")),
							h("textarea", {
								className: "qx-persona-textarea qx-persona-modal-textarea", spellCheck: false, autoFocus: true,
								value: s.draft, onChange: function (e) { self.setState({ draft: e.target.value }); }
							}),
							h("div", { className: "qx-persona-modal-foot" },
								h("span", { className: "qx-persona-modal-count" }, s.draft.length + " 字符"),
								h("span", { className: "qx-persona-tabs-spacer" }),
								h("button", { type: "button", className: "qx-persona-btn", onClick: self.closeEdit }, "取消"),
								h("button", { type: "button", className: "qx-persona-btn primary", disabled: s.busy || !s.draft.trim(), onClick: self.saveEdit }, "保存文档并注入"))))
					: null,

					s.viewing ? h("div", { className: "qx-persona-modal-mask",
						onMouseDown: function (e) { if (e.target === e.currentTarget) self.setState({ viewing: null }); }
					},
						h("div", { className: "qx-persona-modal", role: "dialog", "aria-modal": "true", "aria-label": s.viewing === "doc" ? "查看人格文档" : "注入预览" },
							h("div", { className: "qx-persona-modal-head" },
								h("div", { className: "qx-persona-modal-titles" },
									h("div", { className: "qx-persona-modal-title" },
										s.viewing === "doc" ? (s.tab === "soul" ? "soul.md · 我是谁" : "style.md · 我怎么说") : "注入预览"),
									h("div", { className: "qx-persona-modal-sub" },
										s.viewing === "doc" ? "只读展示 · 如需修改请点「编辑此文档」" : h("span", null,
											"将写入 ", h("code", null, s.agentsPath || "AGENTS.md"), " 的人格块（哨兵注释包裹，不影响文件其余内容）"))),
								h("button", { type: "button", className: "qx-persona-modal-x", "aria-label": "关闭", onClick: function () { self.setState({ viewing: null }); } }, "✕")),
							h("div", { className: "qx-persona-doc qx-persona-doc-modal" },
								h("pre", null, s.viewing === "doc" ? (docText || "（暂无内容）") : (s.preview || "（预览暂不可用）"))),
							h("div", { className: "qx-persona-modal-foot" },
								h("span", { className: "qx-persona-modal-count" },
									s.viewing === "doc" ? docLines + " 行 · " + docText.length + " 字符" : (s.preview || "").length + " 字符"),
								h("span", { className: "qx-persona-tabs-spacer" }),
								s.viewing === "doc" ? h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.setState({ viewing: null }); self.openEdit(s.tab); } }, "编辑此文档") : null,
								h("button", { type: "button", className: "qx-persona-btn primary", onClick: function () { self.setState({ viewing: null }); } }, "关闭"))))
					: null,

					s.viewPersona ? h("div", { className: "qx-persona-modal-mask",
						onMouseDown: function (e) { if (e.target === e.currentTarget) self.setState({ viewPersona: null }); }
					},
						h("div", { className: "qx-persona-modal", role: "dialog", "aria-modal": "true", "aria-label": "查看人格" },
							h("div", { className: "qx-persona-modal-head" },
								h("div", { className: "qx-persona-modal-titles" },
									h("div", { className: "qx-persona-modal-title" }, s.viewPersona.name,
										s.viewPersona.builtin ? h("span", { className: "qx-persona-tag" }, "内置") : null),
									h("div", { className: "qx-persona-modal-sub" }, "只读预览 · 想改先「使用此人格」再编辑")),
								h("button", { type: "button", className: "qx-persona-modal-x", "aria-label": "关闭", onClick: function () { self.setState({ viewPersona: null }); } }, "✕")),
							h("div", { className: "qx-persona-tabs" },
								["soul", "style"].map(function (t) {
									return h("button", { key: t, type: "button", className: "qx-persona-tab" + (s.viewTab === t ? " on" : ""), onClick: function () { self.setState({ viewTab: t }); } },
										t === "soul" ? "soul.md · 我是谁" : "style.md · 我怎么说");
								})),
							h("div", { className: "qx-persona-doc qx-persona-doc-modal" },
								h("pre", null, ((s.viewPersona[s.viewTab] || "").trim()) || "（该人格此文档为空）")),
							h("div", { className: "qx-persona-modal-foot" },
								h("span", { className: "qx-persona-tabs-spacer" }),
								(s.viewPersona.id !== s.library.activeId) ? h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { var id = s.viewPersona.id; self.setState({ viewPersona: null }); self.selectPersona(id); } }, "使用此人格") : null,
								h("button", { type: "button", className: "qx-persona-btn primary", onClick: function () { self.setState({ viewPersona: null }); } }, "关闭"))))
					: null,

					s.editor ? h("div", { className: "qx-persona-modal-mask",
						onMouseDown: function (e) { if (e.target === e.currentTarget) self.closeEditor(); }
					},
						h("div", { className: "qx-persona-modal qx-persona-editor", role: "dialog", "aria-modal": "true", "aria-label": "编辑人格" },
							h("div", { className: "qx-persona-modal-head" },
								h("div", { className: "qx-persona-modal-titles" },
									h("div", { className: "qx-persona-modal-title" }, s.editor.mode === "edit" ? "编辑人格" : "新建人格"),
									h("div", { className: "qx-persona-modal-sub" }, "填名称、编辑文本，或用「导入」整篇替换 soul / style；保存写入人格库")),
								h("button", { type: "button", className: "qx-persona-modal-x", "aria-label": "关闭", onClick: self.closeEditor }, "✕")),
							h("div", { className: "qx-persona-editor-name" },
								h("span", { className: "qx-persona-editor-name-label" }, "名称"),
								h("input", { className: "qx-persona-input", value: s.editor.name, maxLength: 40, placeholder: "给人格起个名字",
									onChange: function (e) { self.setState({ editor: Object.assign({}, s.editor, { name: e.target.value }) }); } })),
							h("div", { className: "qx-persona-tabs" },
								["soul", "style"].map(function (t) {
									return h("button", { key: t, type: "button", className: "qx-persona-tab" + (s.editor.tab === t ? " on" : ""), onClick: function () { self.setState({ editor: Object.assign({}, s.editor, { tab: t }) }); } },
										t === "soul" ? "soul.md · 我是谁" : "style.md · 我怎么说");
								}),
								h("span", { className: "qx-persona-tabs-spacer" }),
								h("span", { className: "qx-persona-doc-meta" }, (s.editor[s.editor.tab] || "").length + " 字符")),
							h("textarea", {
								className: "qx-persona-textarea qx-persona-editor-textarea", spellCheck: false,
								value: s.editor[s.editor.tab] || "",
								placeholder: s.editor.tab === "soul" ? "soul.md 内容（我是谁 / 我知道什么 / 底线）" : "style.md 内容（我怎么说）",
								onChange: function (e) { var ed = Object.assign({}, s.editor); ed[ed.tab] = e.target.value; self.setState({ editor: ed }); }
							}),
							h("div", { className: "qx-persona-editor-import" },
								h("span", { className: "qx-persona-editor-import-label" }, "整篇替换："),
								h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.importIntoEditor("soul"); } }, "导入 soul 文件"),
								h("button", { type: "button", className: "qx-persona-btn", disabled: s.busy, onClick: function () { self.importIntoEditor("style"); } }, "导入 style 文件")),
							h("div", { className: "qx-persona-modal-foot" },
								h("span", { className: "qx-persona-tabs-spacer" }),
								h("button", { type: "button", className: "qx-persona-btn", onClick: self.closeEditor }, "取消"),
								h("button", { type: "button", className: "qx-persona-btn primary", disabled: s.busy || !(s.editor.name.trim() || s.editor.soul.trim() || s.editor.style.trim()), onClick: self.saveEditor }, s.editor.mode === "edit" ? "保存修改" : "创建人格"))))
					: null,

					h("div", { className: "qx-persona-status" + (s.statusOk ? "" : " bad") }, s.status));
			}
		}

		// 新会话 hero 区「人格」键：DOM 注入到 agentPreset 槽（该槽 display:contents，
		// 注入的 span 会作为 flex 项紧跟「标准模式」右侧）。槽只在欢迎/新会话页存在，
		// 会话一开始 hero 卸载，按钮随之消失。用 MutationObserver 跟随 hero 挂载/卸载。
		var heroPersonaCtl = null;
		function setupHeroPersona(body, isDisposed) {
			if (heroPersonaCtl) return heroPersonaCtl;
			var menuEl = null;
			var current = { personas: [], activeId: "qingxiao", activeName: "", enabled: true };
			function fetchLib(cb) {
				Promise.all([
					fetch(PERSONA_LIBRARY_API).then(function (r) { return r.json(); }).catch(function () { return null; }),
					fetch(PERSONA_API).then(function (r) { return r.json(); }).catch(function () { return null; })
				]).then(function (arr) {
					var d = arr[0], p = arr[1];
					if (d && d.ok) {
						current.personas = d.personas || [];
						current.activeId = d.activeId;
						var a = current.personas.find(function (x) { return x.id === d.activeId; }) || {};
						current.activeName = a.name || "未选";
					}
					if (p && p.ok && p.settings) current.enabled = !!p.settings.enabled;
					if (cb) cb();
				}).catch(function () { if (cb) cb(); });
			}
			function setLabel(btn) {
				var l = btn.querySelector(".qx-hero-persona-label");
				var ico = btn.querySelector(".qx-hero-persona-ico");
				if (!current.enabled) {
					if (l) l.textContent = "不使用人格";
					if (ico) ico.textContent = "⊘";
					btn.classList.add("off");
				} else {
					if (l) l.textContent = current.activeName || "人格";
					if (ico) ico.textContent = "◈";
					btn.classList.remove("off");
				}
			}
			function closeMenu() { if (menuEl && menuEl.parentNode) menuEl.parentNode.removeChild(menuEl); menuEl = null; }
			function buildItem(labelText, checked, onPick, extraClass) {
				var it = document.createElement("button"); it.type = "button";
				it.className = "qx-hero-persona-item" + (checked ? " on" : "") + (extraClass ? " " + extraClass : "");
				var nm = document.createElement("span"); nm.className = "qx-hero-persona-item-name"; nm.textContent = labelText; it.appendChild(nm);
				if (checked) { var ck = document.createElement("span"); ck.className = "qx-hero-persona-item-check"; ck.textContent = "✓"; it.appendChild(ck); }
				it.addEventListener("click", function (e) { e.stopPropagation(); onPick(); });
				return it;
			}
			function openMenu(btn) {
				closeMenu();
				var r = btn.getBoundingClientRect();
				menuEl = document.createElement("div");
				menuEl.className = "qx-hero-persona-menu";
				menuEl.style.top = (r.bottom + 6) + "px";
				menuEl.style.left = r.left + "px";
				var t = document.createElement("div"); t.className = "qx-hero-persona-menu-title"; t.textContent = "本会话人格"; menuEl.appendChild(t);
				// 「不使用人格」= 关闭注入，用普通助手身份
				menuEl.appendChild(buildItem("不使用人格", !current.enabled, function () { noPersona(btn); }, "qx-hero-persona-off"));
				var div = document.createElement("div"); div.className = "qx-hero-persona-divider"; menuEl.appendChild(div);
				current.personas.forEach(function (p) {
					var on = current.enabled && p.id === current.activeId;
					var it = buildItem(p.name, on, function () { pick(p.id, btn); });
					if (p.builtin) {
						var nm = it.querySelector(".qx-hero-persona-item-name");
						var tg = document.createElement("span"); tg.className = "qx-hero-persona-item-tag"; tg.textContent = "内置";
						it.insertBefore(tg, nm.nextSibling);
					}
					menuEl.appendChild(it);
				});
				var tip = document.createElement("div"); tip.className = "qx-hero-persona-menu-tip"; tip.textContent = "选定后本会话请勿中途更换；要换人格请开新会话。管理 / 导入请到 设置 · 人格。"; menuEl.appendChild(tip);
				body.appendChild(menuEl);
			}
			function pick(id, btn) {
				fetch(PERSONA_LIBRARY_API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "select", id: id, enabled: true }) })
					.then(function (r) { return r.json(); })
					.then(function (d) { if (d && d.ok) fetchLib(function () { setLabel(btn); if (menuEl) openMenu(btn); }); })
					.catch(function () {});
			}
			function noPersona(btn) {
				fetch(PERSONA_LIBRARY_API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "setEnabled", enabled: false }) })
					.then(function (r) { return r.json(); })
					.then(function (d) { if (d && d.ok) fetchLib(function () { setLabel(btn); if (menuEl) openMenu(btn); }); })
					.catch(function () {});
			}
			function ensure() {
				if (isDisposed()) return;
				var slot = body.querySelector('[data-slot="conversation.hero.agentPreset"]');
				var modeBtn = slot && slot.querySelector("button:not(.qx-hero-persona-btn)");
				var existing = body.querySelector(".qx-hero-persona");
				if (!slot || !modeBtn) { closeMenu(); if (existing && existing.parentNode) existing.parentNode.removeChild(existing); return; }
				var anchor = modeBtn.parentElement || slot;
				// 期望：wrap 恰好在模式键的 anchor 之后；已就位则跳过（避免每次改动都重排）
				if (existing && existing.previousElementSibling === anchor && existing.parentNode === anchor.parentNode) return;
				if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
				var wrap = document.createElement("span"); wrap.className = "qx-hero-persona";
				var btn = document.createElement("button"); btn.type = "button"; btn.className = "qx-hero-persona-btn"; btn.title = "选择本会话使用的人格";
				btn.innerHTML = '<span class="qx-hero-persona-ico">◈</span><span class="qx-hero-persona-label">人格</span><span class="qx-hero-persona-caret">▾</span>';
				btn.addEventListener("click", function (e) { e.stopPropagation(); if (menuEl) { closeMenu(); return; } fetchLib(function () { setLabel(btn); openMenu(btn); }); });
				wrap.appendChild(btn);
				anchor.after(wrap);
				fetchLib(function () { setLabel(btn); });
			}
			function onDown(e) {
				if (!menuEl) return;
				// 菜单本身是 .qx-hero-persona-menu（不是 .qx-hero-persona），必须单独放行，
				// 否则真实鼠标的 mousedown 会在 click 之前把菜单关掉，点选永远不生效。
				if (menuEl.contains(e.target)) return;
				if (e.target.closest && e.target.closest(".qx-hero-persona")) return;
				closeMenu();
			}
			document.addEventListener("mousedown", onDown, true);
			var pending = false;
			var observer = new MutationObserver(function () {
				if (pending) return; pending = true;
				setTimeout(function () { pending = false; ensure(); }, 80);
			});
			observer.observe(body, { childList: true, subtree: true });
			ensure();
			heroPersonaCtl = { dispose: function () { observer.disconnect(); document.removeEventListener("mousedown", onDown, true); closeMenu(); var ex = body.querySelector(".qx-hero-persona"); if (ex && ex.parentNode) ex.parentNode.removeChild(ex); heroPersonaCtl = null; } };
			return heroPersonaCtl;
		}

		// ═══════════════════════════════════════════════════════════════
		//  开屏动画：线稿显影 → 定格 → 闪白翻底 → 上色淡入 → 淡出归位
		//  手法学习自 panding999/codex-startup-animation（macOS 版）。
		//  线稿用 AI 生成的清宵白描稿原像（assets/qx-lineart.png，与原画
		//  同构图 3:2，经 /api/dsh-qingxiao/boot-lineart 下发），显影用
		//  「平滑噪声场 + 对角扫掠」的混合阈值场逐帧揭开，低分辨率噪声
		//  放大绘制自带羽化边缘，无锯齿且丝滑；翻底直接 CSS invert
		//  （白线黑底反相即墨线纸底），不再描线。
		// ═══════════════════════════════════════════════════════════════

		var bootAnimCancel = null;

		function playBootAnimation(body, settings, isDisposed) {
			if (window.__QX_BOOT_PLAYED__) return; // 每次页面装载只播一次（HMR 重挂不重播）
			window.__QX_BOOT_PLAYED__ = true;
			if (!settings.bootAnimation) return;
			if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
			if (isDisposed()) return;

			// 时间轴（ms）：显影 → 定格（看清完整线稿）→ 闪白翻底 → 上色 → 淡出
			var T_GROW = 2600, T_HOLD = 1150, T_FLASH = 320, T_COLOR = 850, T_FADE = 750;

			var overlay = document.createElement("div");
			overlay.dataset.skinChrome = "boot-veil";
			overlay.dataset.skinOwner = SKIN_OWNER;
			overlay.setAttribute("aria-hidden", "true");
			overlay.style.cssText = "position:fixed;inset:0;z-index:2147483300;overflow:hidden;pointer-events:none;background:#000;";
			var canvas = document.createElement("canvas");
			canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
			var dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(window.innerWidth * dpr);
			canvas.height = Math.round(window.innerHeight * dpr);
			var paper = document.createElement("div");
			paper.style.cssText = "position:absolute;inset:0;background-image:url('/api/dsh-qingxiao/boot-lineart');background-position:center;background-size:cover;filter:invert(1);opacity:0;";
			var artLayer = document.createElement("div");
			artLayer.style.cssText = "position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat;opacity:0;will-change:opacity,filter,transform;";
			var flash = document.createElement("div");
			flash.style.cssText = "position:absolute;inset:0;background:#F4F9FC;opacity:0;";
			overlay.append(canvas, paper, artLayer, flash);
			body.append(overlay);

			// 彩色画卷：与 body 背景同源（当前模式的自定义背景或默认画卷）
			var dark = isDarkMode(body);
			var custom = dark ? settings.darkBackground : settings.lightBackground;
			artLayer.style.backgroundImage = 'url("' + (custom || DEFAULT_BG_URL) + '")';

			// 噪声场（预生成一次）：平滑随机 + 对角扫掠混合，显影有运笔方向
			var NW = 132, NH = 88;
			var field = new Float32Array(NW * NH);
			var seed = 20260401;
			function rand() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
			var i, x, y;
			for (i = 0; i < field.length; i++) field[i] = rand();
			for (var pass = 0; pass < 2; pass++) {
				const src = Float32Array.from(field);
				for (y = 0; y < NH; y++) for (x = 0; x < NW; x++) {
					let s = 0;
					for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
						const yy = Math.min(NH - 1, Math.max(0, y + dy)), xx = Math.min(NW - 1, Math.max(0, x + dx));
						s += src[yy * NW + xx];
					}
					field[y * NW + x] = s / 25;
				}
			}
			var fmin = Infinity, fmax = -Infinity;
			for (i = 0; i < field.length; i++) {
				field[i] = field[i] * 0.55 + ((i % NW) / (NW - 1)) * 0.31 + (((i / NW) | 0) / (NH - 1)) * 0.14;
				if (field[i] < fmin) fmin = field[i];
				if (field[i] > fmax) fmax = field[i];
			}
			for (i = 0; i < field.length; i++) field[i] = (field[i] - fmin) / (fmax - fmin);

			// 低分辨率遮罩画布：逐帧阈值化后放大绘制，边缘自然羽化
			var mcv = document.createElement("canvas"); mcv.width = NW; mcv.height = NH;
			var mctx = mcv.getContext("2d");
			var mimg = mctx.createImageData(NW, NH);
			for (i = 0; i < field.length; i++) { mimg.data[i * 4] = 255; mimg.data[i * 4 + 1] = 255; mimg.data[i * 4 + 2] = 255; }
			function drawMask(p) {
				var d = mimg.data;
				for (i = 0; i < field.length; i++) {
					var a = (p - field[i]) / 0.055;
					d[i * 4 + 3] = a <= 0 ? 0 : a >= 1 ? 255 : a * 255;
				}
				mctx.putImageData(mimg, 0, 0);
			}

			var lineart = new Image();
			var raf = 0, start = 0, paperShown = false, ticking = false;
			function cleanup() {
				if (raf) { clearTimeout(raf); cancelAnimationFrame(raf); raf = 0; }
				document.removeEventListener("keydown", onKey, true);
				document.removeEventListener("click", onSkip, true);
				document.removeEventListener("visibilitychange", onVis, false);
				bootAnimCancel = null;
			}
			function removeOverlay() { if (overlay.isConnected) overlay.remove(); }
			function finishNow() {
				cleanup();
				overlay.style.transition = "opacity .3s ease";
				overlay.style.opacity = "0";
				setTimeout(removeOverlay, 320);
			}
			function onKey(e) { if (e.key === "Escape") { e.preventDefault(); finishNow(); } }
			function onSkip() { finishNow(); }
			function onVis() { if (!document.hidden) tick(); }
			document.addEventListener("keydown", onKey, true);
			document.addEventListener("click", onSkip, true);
			document.addEventListener("visibilitychange", onVis, false);
			bootAnimCancel = function() { cleanup(); removeOverlay(); };

			function renderGrow(p) {
				var ctx = canvas.getContext("2d");
				ctx.globalCompositeOperation = "copy";
				ctx.imageSmoothingEnabled = true;
				ctx.drawImage(lineart, 0, 0, canvas.width, canvas.height);
				ctx.globalCompositeOperation = "destination-in";
				ctx.drawImage(mcv, 0, 0, canvas.width, canvas.height);
				ctx.globalCompositeOperation = "source-over";
			}
			function frame(now) {
				if (isDisposed() || !overlay.isConnected) return;
				if (!start) start = now;
				var t = now - start;
				if (t < T_GROW) {
					var p = t / T_GROW;
					var e = 0.5 - Math.cos(Math.PI * p) / 2; // easeInOutSine，首尾柔、中段匀
					drawMask(e);
					renderGrow(e);
				} else if (t < T_GROW + T_HOLD) {
					drawMask(1);
					renderGrow(1);
				} else if (t < T_GROW + T_HOLD + T_FLASH) {
					if (!paperShown) { paperShown = true; drawMask(1); renderGrow(1); }
					var ft = (t - T_GROW - T_HOLD) / T_FLASH;
					paper.style.opacity = String(Math.min(1, ft / 0.55));
					flash.style.opacity = String(ft < 0.3 ? ft / 0.3 * 0.95 : 0.95 * (1 - (ft - 0.3) / 0.7));
				} else if (t < T_GROW + T_HOLD + T_FLASH + T_COLOR) {
					var ct = (t - T_GROW - T_HOLD - T_FLASH) / T_COLOR;
					var e2 = 1 - Math.pow(1 - ct, 3);
					artLayer.style.opacity = String(e2);
					artLayer.style.filter = "saturate(" + (0.25 + 0.8 * e2).toFixed(3) + ") brightness(" + (1 + 0.08 * (1 - e2)).toFixed(3) + ")";
					artLayer.style.transform = "scale(" + (1.05 - 0.05 * e2).toFixed(4) + ")";
					flash.style.opacity = "0";
				} else {
					var ft2 = (t - T_GROW - T_HOLD - T_FLASH - T_COLOR) / T_FADE;
					overlay.style.opacity = String(Math.max(0, 1 - ft2).toFixed(3));
					if (ft2 >= 1) { cleanup(); setTimeout(removeOverlay, 60); return; }
				}
				schedule();
			}
			function schedule() {
				if (ticking || isDisposed() || !overlay.isConnected) return;
				ticking = true;
				var go = function() { ticking = false; frame(performance.now()); };
				// 前台用 rAF（丝滑）；后台 rAF 冻结，改 setTimeout 兜底让墙钟
				// 推进、动画粗粒度走完，遮罩不会捂死界面
				if (document.visibilityState === "visible") raf = requestAnimationFrame(go);
				else raf = setTimeout(go, 16);
			}

			lineart.onload = function() {
				if (isDisposed() || !overlay.isConnected) { removeOverlay(); return; }
				schedule();
			};
			lineart.onerror = function() { finishNow(); }; // 线稿取不到就整段跳过
			lineart.src = "/api/dsh-qingxiao/boot-lineart";
		}

		// ═══════════════════════════════════════════════════════════════
		//  PALETTE STATE
		// ═══════════════════════════════════════════════════════════════

		// ═══════════════════════════════════════════════════════════════
		//  PALETTE STATE
		// ═══════════════════════════════════════════════════════════════

		var PALETTE_DEFAULTS = {
			/* 文字对比增强默认开：暗色用墨晕，亮色改用轻深色落影（白晕在亮底会糊字）。
			   亮色灰字另由更深的 label-secondary/tertiary 令牌与更实的面板底兜底。 */
			textContrastBoost: true,
			panelBlur: true,
			// 0.7.0 液态玻璃输入框：关闭后恢复 DSH 原版输入框
			liquidComposer: true,
			composerGlow: true,
			goldTrim: false,
			particles: true,
			lightCharms: false,
			darkCharms: false,
			scrimOpacity: 55,
			panelOpacity: 45,
			contentWidth: 880,
			particleCount: 25,
			particleSpeed: 100,
			// 0.8.0 氛围场景：流光形态（rise 剑气 / snow 雪 / rain 雨 / firefly 星屑）
			particleStyle: "rise",
			// 0.8.0 性能自适应：特效强度、掉帧自动降级、低功耗
			effectIntensity: 100,
			// 掉帧自动降级默认关闭：由用户主动开启，避免低配机器被静默降特效
			autoDegrade: false,
			lowPower: false,
			// 0.8.1 体验补完：快捷键 / 引导 / 场景轮换 / 自定义字体
			hotkeys: true,
			hotkeyPanel: "Ctrl+Alt+KeyQ",
			hotkeyScene: "Ctrl+Alt+KeyE",
			hotkeyBlur: "F9",
			hotkeyLiquid: "Ctrl+Alt+KeyL",
			onboarded: false,
			// 0.8.2 细节补完
			bgParallax: false,
			bgParallaxStrength: 70,
			chatEdgeFade: false,
			batterySaver: true,
			holidayEggs: true,
			sceneRotation: false,
			sceneDay: "qingzhou",
			sceneNight: "xuanye",
			customFont: null,
			fontScale: 100,
			// 0.7.0 个性化定制
			fontUi: "system",
			fontCode: "system",
			lineHeight: 1.7,
			letterSpacing: 0,
			paletteId: "jade",
			accentColor: null,
			bootAnimation: true,
			frostMaster: true,
			frostPlugin: true,
			frostNative: true,
			frostBlur: 14,
			bgFit: "cover",
			bgFocusX: 50,
			bgFocusY: 50,
			bgAutoDim: true,
			bgRotationOn: false,
			bgRotationMinutes: 30,
			bgRotation: [],
			bgVideoEnabled: false,
			bgVideoLowPower: true,
			bgVideoCompat: false,
			lightVideoId: null,
			darkVideoId: null,
			lightVideoPosterId: null,
			darkVideoPosterId: null,
			lightVideoUrl: null,
			darkVideoUrl: null,
			lightBackground: null,
			darkBackground: null
		};

		// 0.5.0 主题预设：只改外观/动效参数，不碰画卷（画卷由用户单独管理）。
		// 每套都写全非画卷键，应用后观感确定；亮暗跟随宿主主题，不强制切换。
		var THEME_PRESETS = [
			{
				id: "qingzhou", name: "清昼", desc: "均衡 · 月白庭院",
				settings: {
					textContrastBoost: true, panelBlur: false, goldTrim: false, particles: true,
					lightCharms: false, darkCharms: false, scrimOpacity: 55, panelOpacity: 50,
					contentWidth: 880, particleCount: 25, particleSpeed: 100, fontScale: 100,
					particleStyle: "rise", effectIntensity: 100, autoDegrade: false,
					bootAnimation: true, frostMaster: true, frostPlugin: true, frostNative: true, frostBlur: 12
				}
			},
			{
				id: "xuanye", name: "玄夜", desc: "深邃 · 玄夜剑鸣",
				settings: {
					textContrastBoost: true, panelBlur: true, goldTrim: true, particles: true,
					lightCharms: false, darkCharms: true, scrimOpacity: 62, panelOpacity: 45,
					contentWidth: 880, particleCount: 18, particleSpeed: 80, fontScale: 100,
					particleStyle: "rise", effectIntensity: 90, autoDegrade: false,
					bootAnimation: true, frostMaster: true, frostPlugin: true, frostNative: true, frostBlur: 16
				}
			},
			{
				id: "jianming", name: "剑鸣", desc: "锐利 · 高对比",
				settings: {
					textContrastBoost: true, panelBlur: true, goldTrim: true, particles: true,
					lightCharms: true, darkCharms: true, scrimOpacity: 70, panelOpacity: 58,
					contentWidth: 920, particleCount: 40, particleSpeed: 140, fontScale: 100,
					particleStyle: "rise", effectIntensity: 100, autoDegrade: false,
					bootAnimation: true, frostMaster: true, frostPlugin: true, frostNative: true, frostBlur: 18
				}
			},
			{
				id: "xueji", name: "雪霁", desc: "轻柔 · 低动效",
				settings: {
					textContrastBoost: true, panelBlur: false, goldTrim: false, particles: true,
					lightCharms: false, darkCharms: false, scrimOpacity: 42, panelOpacity: 36,
					contentWidth: 840, particleCount: 40, particleSpeed: 90, fontScale: 100,
					particleStyle: "snow", effectIntensity: 90, autoDegrade: false,
					bootAnimation: false, frostMaster: true, frostPlugin: true, frostNative: true, frostBlur: 10
				}
			},
			{
				id: "yeyu", name: "夜雨", desc: "湿润 · 雨丝与暗蓝",
				settings: {
					textContrastBoost: true, panelBlur: true, goldTrim: false, particles: true,
					lightCharms: false, darkCharms: true, scrimOpacity: 68, panelOpacity: 52,
					contentWidth: 880, particleCount: 60, particleSpeed: 160, fontScale: 100,
					particleStyle: "rain", effectIntensity: 100, autoDegrade: false,
					bootAnimation: true, frostMaster: true, frostPlugin: true, frostNative: true, frostBlur: 14
				}
			},
			{
				id: "xingxie", name: "星屑", desc: "细碎 · 星屑漂浮",
				settings: {
					textContrastBoost: true, panelBlur: true, goldTrim: false, particles: true,
					lightCharms: true, darkCharms: true, scrimOpacity: 52, panelOpacity: 46,
					contentWidth: 860, particleCount: 44, particleSpeed: 70, fontScale: 100,
					particleStyle: "firefly", effectIntensity: 100, autoDegrade: false,
					bootAnimation: true, frostMaster: true, frostPlugin: true, frostNative: true, frostBlur: 12
				}
			}
		];
		THEME_PRESETS.forEach(function(preset) {
			if (!preset.settings.bgFit) preset.settings.bgFit = "cover";
			if (preset.settings.bgFocusX === undefined) preset.settings.bgFocusX = 50;
			if (preset.settings.bgFocusY === undefined) preset.settings.bgFocusY = 50;
			if (preset.settings.bgAutoDim === undefined) preset.settings.bgAutoDim = true;
			// 0.7.0：预设写全个性化默认值，应用预设时才会重置用户的定制
			if (preset.settings.fontUi === undefined) preset.settings.fontUi = "system";
			if (preset.settings.fontCode === undefined) preset.settings.fontCode = "system";
			if (preset.settings.lineHeight === undefined) preset.settings.lineHeight = 1.7;
			if (preset.settings.letterSpacing === undefined) preset.settings.letterSpacing = 0;
			if (preset.settings.paletteId === undefined) preset.settings.paletteId = "jade";
			if (preset.settings.accentColor === undefined) preset.settings.accentColor = null;
			if (preset.settings.liquidComposer === undefined) preset.settings.liquidComposer = true;
			if (preset.settings.composerGlow === undefined) preset.settings.composerGlow = true;
			if (preset.settings.particleStyle === undefined) preset.settings.particleStyle = "rise";
			if (preset.settings.effectIntensity === undefined) preset.settings.effectIntensity = 100;
			if (preset.settings.autoDegrade === undefined) preset.settings.autoDegrade = false;
			if (preset.settings.lowPower === undefined) preset.settings.lowPower = false;
		});
		// 主题包允许的数值范围（与面板滑块一致）
		var THEME_NUM_RANGES = {
			scrimOpacity: [20, 95], panelOpacity: [30, 100], contentWidth: [500, 1000],
			particleCount: [0, 60], particleSpeed: [20, 200], fontScale: [85, 125], frostBlur: [0, 30],
			bgFocusX: [0, 100], bgFocusY: [0, 100], bgRotationMinutes: [5, 1440],
			// 0.7.0 个性化定制
			lineHeight: [1.3, 2.0], letterSpacing: [-0.02, 0.08],
			// 0.8.0 特效强度
			effectIntensity: [20, 100]
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
	--qx-text: #0B1E2B;
	--qx-text-soft: rgba(11, 30, 43, 0.92);
	--qx-text-faint: rgba(11, 30, 43, 0.76);
	--qx-panel-rgb: 248, 252, 254;
	/* 插件窗玻璃底不透明度（明/暗双选择器 0,2,1，0.1.3 防翻盘写法）：
	   亮色画卷偏亮，底要更实才不糊字 */
	--qx-frost-panel-alpha: 0.72;
	--qx-panel-border: rgba(86, 168, 200, 0.38);
	--qx-panel-border-strong: rgba(46, 158, 152, 0.55);
	--qx-sink: rgba(22, 48, 63, 0.06);
	--qx-field-bg: rgba(var(--qx-panel-rgb), 0.78);
	--qx-danger: #A94848;
	--qx-danger-rgb: 169, 72, 72;
	--qx-accent-strong: #0E615B;
}
body[data-dsh-qingxiao][data-ds-dark-theme] {
	--qx-text: #D9EDF5;
	--qx-text-soft: rgba(217, 237, 245, 0.92);
	--qx-text-faint: rgba(217, 237, 245, 0.68);
	--qx-panel-rgb: 10, 26, 40;
	/* 暗色下窗底可以更透，壁纸透得出来；正文垫着虚化层照样清晰 */
	--qx-frost-panel-alpha: 0.62;
	--qx-panel-border: rgba(127, 224, 214, 0.22);
	--qx-panel-border-strong: rgba(127, 224, 214, 0.45);
	--qx-sink: rgba(217, 237, 245, 0.07);
	--qx-field-bg: rgba(var(--qx-panel-rgb), 0.78);
	--qx-danger: #E59A9A;
	--qx-danger-rgb: 229, 154, 154;
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
	/* 主按钮文字：0.2.0 的按钮类用 --dsw-alias-label-primary-foreground 取字色，
	   皮肤的全局按钮墨色规则把它压掉了（青碧底配深墨字，发闷）。这里统一
	   回月白：青碧底 + 月白字，亮暗两态都干净。 */
	--dsw-alias-label-primary-foreground: #F4F9FC;
	/* 品牌主色：DSH 把它定义成反色墨/白（亮色模式近黑、暗色模式近白），
	   开关 ON 轨道和复选框 accent 都读它——暗色下开关全是白轨，与皮肤不搭。
	   改为清宵青碧后一并对齐；ON 旋钮走上面的月白，正好是青碧底月白钮。 */
	--dsw-alias-brand-primary: #2E9E98;
	/* 0.2.2-rc.3 新增令牌：会话卡片 / 悬浮卡 / 轨迹强调 / 选中描边 /
	   引导英雄区，以及 macOS 侧栏玻璃与上下渐变洗色。新组件若不同步
	   映射，会在清宵壁纸上露出宿主的中性灰底与酬蓝洗色。 */
	--dsw-alias-card-fill: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.72));
	--dsw-alias-card-fill-hover: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.82));
	--dsw-alias-card-tile-fill: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.58));
	--dsw-alias-hovercard-bg: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.94));
	--dsw-alias-hovercard-label-primary: var(--qx-text);
	--dsw-alias-hovercard-label-secondary: var(--qx-text-soft);
	--dsw-alias-hovercard-label-tertiary: var(--qx-text-faint);
	--dsw-alias-tooltip-label: #F4F9FC;
	--dsw-alias-label-on-color: #F4F9FC;
	--dsw-alias-border-selected: var(--qx-accent-strong);
	--dsw-alias-trajectory-accent: var(--qx-accent-strong);
	--dsw-alias-toast-action: var(--qx-accent-strong);
	--dsw-specific-guide-hero: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.78));
	--dsw-specific-sidebar-glass-fill: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.80));
	--dsw-specific-sidebar-glass-hover: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.90));
	--dsw-specific-sidebar-glass-collapsed-fill: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.86));
	--dsw-specific-sidebar-glass-collapsed-hover: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.93));
	--dsw-specific-sidebar-wash-top: rgba(var(--qx-cyan-rgb), 0.06);
	--dsw-specific-sidebar-wash-top-clear: rgba(var(--qx-cyan-rgb), 0);
	--dsw-specific-sidebar-wash-bottom: rgba(var(--qx-gold-rgb), 0.05);
	--dsw-specific-sidebar-wash-bottom-clear: rgba(var(--qx-gold-rgb), 0);
}
/* 浅色模式：面板底更实一档。亮色画卷上，半透明面板后的正文/灰字容易发飘；
   这里把 base/layer/侧栏底各提高约 0.1–0.15 的浓度，仍保留玻璃感。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) {
	--dsw-alias-bg-base: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.72));
	--dsw-alias-bg-layer-1: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.84));
	--dsw-alias-bg-layer-2: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.93));
	--dsw-alias-bg-layer-3: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.97));
	--dsw-specific-sidebar-fill: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.90));
}
/* 对话区淡灰字（用户反馈）：DSH 的次级/三级标签令牌在画卷底上太淡
   （浅色 #61666b/#81858c 的工具行标题、时间戳、卡片描述灰成一片）。
   各提浓一档、保留主次层级；暗色 ter 也微提（用户：暗色也有点糊）。
   特异度 (0,2,1) 明暗双选择器稳压主题包 (0,1,1)，0.1.3 防翻盘写法。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) {
	--dsw-alias-label-secondary: #1A252F;
	--dsw-alias-label-tertiary: #2B3743;
	/* 业务信息色：DSH 用 DeepSeek 蓝，信息标签（「实验性」徽章）、
	   输入聚焦边框等都读它，改成清宵青碧深色调。 */
	--dsw-alias-state-business-primary: #0E615B;
	/* 宿主的 success 是固定亮绿（#22c55e/#4ed17e），亮色底上几乎看不清；
	   浅色下沉到深绿，暗色仍保留宿主亮绿。 */
	--dsw-alias-state-success-primary: #12703F;
	--dsw-alias-state-success-secondary: #1B7A4A;
}
body[data-dsh-qingxiao][data-ds-dark-theme] {
	--dsw-alias-label-secondary: #dde1e5;
	--dsw-alias-label-tertiary: #c4cad1;
	--dsw-alias-state-business-primary: #7FE0D6;
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
	--qx-text: #061821;
	--qx-text-soft: rgba(6, 24, 33, 0.92);
	--qx-text-faint: rgba(6, 24, 33, 0.74);
}
body[data-dsh-qingxiao][data-qx-contrast='on'][data-ds-dark-theme] {
	--qx-text: #EAF6FB;
	--qx-text-soft: rgba(234, 246, 251, 0.85);
	--qx-text-faint: rgba(234, 246, 251, 0.6);
}
body[data-dsh-qingxiao][data-qx-contrast='on'] [id=root] :is(p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote) {
	text-shadow: 0 1px 2px rgba(var(--qx-panel-rgb), 0.55);
}
/* 整列聊天文字垫光晕（用户：对话区灰字仍不清）：挂 [id=root] 随继承落到
   每个 span/div，浅色白晕、暗色墨晕（panel-rgb 自动分主题）。 */
body[data-dsh-qingxiao][data-qx-contrast='on'] [id=root] {
	text-shadow: 0 0 1px rgba(var(--qx-panel-rgb), 0.72), 0 0 3px rgba(var(--qx-panel-rgb), 0.22);
}
/* 浅色模式不能再用白晕：亮底 + 白晕会把深色字边缘糊开。改用极轻的深色
   落影，保留字形锐度，同时把深色字从明亮画卷上“托”起来。 */
body[data-dsh-qingxiao][data-qx-contrast='on']:not([data-ds-dark-theme]) [id=root] :is(p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote) {
	text-shadow: 0 1px 1px rgba(8, 20, 30, 0.18);
}
body[data-dsh-qingxiao][data-qx-contrast='on']:not([data-ds-dark-theme]) [id=root] {
	text-shadow: 0 0 1px rgba(8, 20, 30, 0.10);
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
/* 浅色下 hover 不能再用浅薄荷（#7FE0D6 在亮底上几乎消失） */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [id=root] a:hover {
	color: var(--qx-accent-strong);
	text-decoration-thickness: 2px;
}

/* ── 玻璃列布局： sidebar / chat column / details turn translucent so
      the art shows through while text stays on solid-enough ground ── */
body[data-dsh-qingxiao] [id=root] > * {
	background: transparent;
}
body[data-dsh-qingxiao] [data-slot='sidebar'],
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
/* 0.2.0-rc.2 起布局把旧 detailsCol 更名为 rightbarCol（CSS Modules 前缀
   BynINW_，类名本体仍含列名后缀，子串匹配不受影响）。
   0.2.2-rc.1 起 detailsCol 彻底删除、旧 data-pane 属性也不再生效，右面板改由
   DockKit 承载（[data-dockkit-column] / [data-sidebar-right-panel]），一并纳入。 */
/* [data-sidebar-right-panel] 不在这里：它是宿主的 position:absolute 全屏面板
   （靠负 left 偏移铺满视口），设成 relative 会把它拽回文档流、变成右侧半屏。
   它本身就建立包含块，::after 无需再强制 relative。 */
body[data-dsh-qingxiao][data-qx-blur='on']:not([data-qx-frost='off']) :is([data-slot='sidebar'], [class*='sidebarCol'], [class*='_centerCol'], [class*='rightbarCol'], [data-dockkit-column]) {
	position: relative;
}
body[data-dsh-qingxiao][data-qx-blur='on']:not([data-qx-frost='off']) :is([data-slot='sidebar'], [class*='sidebarCol'], [class*='_centerCol'], [class*='rightbarCol'], [data-dockkit-column], [data-sidebar-right-panel][data-sidebar-right-open])::after {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	backdrop-filter: blur(5px) saturate(1.1);
	-webkit-backdrop-filter: blur(5px) saturate(1.1);
}
/* 只给 DockKit 面板本体上底色。_centerCol / rightbarCol 不再铺独立底板：
   0.2.2 在宿主保留右列网格时，中心列会变成一块明显的深色矩形。 */
body[data-dsh-qingxiao] [data-dockkit-column] {
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.72));
}
/* ── 对话区宽度 + 正文字号缩放：接到真正的对话内容上 ──
   0.2.0 起会话根（Dc7zOa_root，头部行/角部按钮/迎宾页/输入卡都在其中）
   是 [data-slot='main.conversation'] 的直接子元素。容器绝不能限宽：
   旧版规则把根压到内容宽度后，头部行右上的「打开右侧边栏」角部按钮
   会跟着内收（离右缘 182px 而非 ~16px），[data-slot='main'] 上更宽的
   旧限宽规则还会挤压插件页/任务页。宽度控制只走令牌：
   DSH 自带居中机制（50% ± 宽/2 的宽度手柄布局），会按令牌居中内容；
   但 0.2.0 的对话体在 _body 上重新定义了 --dsh-chat-content-width
   （var(--dsh-chat-user-width, clamp(...))，DSH 自己的拖宽手柄），
   所以令牌覆盖必须比它更深一层（_body），滑块才能继续生效。 */
body[data-dsh-qingxiao] :is([data-slot='main.conversation'], [data-slot='conversation']) > * {
	--dsh-chat-content-width: var(--qx-content-width);
	/* 居中显示。之前浮层跑到中间是 zoom 改了 position:fixed 坐标所致，
	   此处已去掉 zoom，浮层会正确锚定在标注旁。 */
	background: transparent !important;
}
body[data-dsh-qingxiao] :is([data-slot='main.conversation'], [data-slot='conversation']) [class*='_body'] {
	--dsh-chat-content-width: var(--qx-content-width);
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

/* ── 0.8.2 细节：壁纸视差 / 聊天渐隐 / 节日鎏金 ── */
body[data-qx-parallax='on'] {
	transition: background-position .35s ease-out;
}
body[data-dsh-qingxiao][data-qx-chatfade='on'] [data-conversation-scroll] > :first-child {
	-webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 22px, #000 calc(100% - 26px), transparent 100%);
	mask-image: linear-gradient(to bottom, transparent 0, #000 22px, #000 calc(100% - 26px), transparent 100%);
}
body[data-dsh-qingxiao][data-qx-holiday] [data-skin-chrome='palette-toggle'] {
	box-shadow: 0 6px 22px rgba(0, 0, 0, 0.28), 0 0 20px 2px rgba(var(--qx-gold-rgb), 0.55);
}
body[data-dsh-qingxiao][data-qx-holiday] [data-skin-chrome='qingxiao-hero'] .qx-hero-quote {
	color: var(--qx-gold-bright);
}

/* ── 侧边栏 ── */
body[data-dsh-qingxiao] [data-slot='sidebar'] *,
body[data-dsh-qingxiao] [class*='sidebarCol'] * {
	border-color: transparent;
}
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) button {
	background: transparent !important;
	border: 1px solid transparent !important;
	border-radius: 10px;
}
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) button:hover {
	background: rgba(var(--qx-cyan-rgb), 0.14) !important;
	border-color: rgba(var(--qx-cyan-rgb), 0.35) !important;
}
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) [aria-selected='true'],
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) [aria-current='true'],
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) .active,
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) [class*='active'] {
	background: rgba(var(--qx-cyan-rgb), 0.16) !important;
	box-shadow: inset 3px 0 0 0 var(--qx-cyan);
	color: var(--qx-accent-strong) !important;
}
body[data-dsh-qingxiao][data-qx-gold='on'] :is([data-slot='sidebar'], [class*='sidebarCol']) [aria-selected='true'],
body[data-dsh-qingxiao][data-qx-gold='on'] :is([data-slot='sidebar'], [class*='sidebarCol']) [aria-current='true'] {
	box-shadow: inset 3px 0 0 0 var(--qx-gold);
}
/* sidebar 云纹底饰（可开关的 charms）
   注意：只画在 sidebarCol::before 上会被 bsh 侧边栏子面板（hHd-Xa_root）
   的不透明背景盖住，所以同时在子面板自身底部画一层，才真正看得见。 */
body[data-dsh-qingxiao][data-qx-charms='on'] :is([data-slot='sidebar'], [class*='sidebarCol'])::before {
	content: "";
	position: absolute;
	inset: auto 0 0 0;
	height: 120px;
	pointer-events: none;
	background:
		radial-gradient(120% 90% at 50% 128%, rgba(var(--qx-cyan-rgb), 0.18), transparent 62%),
		radial-gradient(60% 40% at 18% 118%, rgba(var(--qx-gold-rgb), 0.16), transparent 70%);
}
/* 0.1.x 侧栏根带 data-dsh-sidebar-root；0.2.0-rc.2 起该属性取消，侧栏根只剩
   CSS Modules 哈希类（*_root），只能用 [class*='sidebarCol'] [class*='_root']
   在栏内定位——conversation 的 *_root 不在 sidebarCol 内，不会误伤。 */
body[data-dsh-qingxiao][data-qx-charms='on'] :is([data-dsh-sidebar-root], [class*='sidebarCol'] [class*='_root']) {
	position: relative;
}
body[data-dsh-qingxiao][data-qx-charms='on'] :is([data-dsh-sidebar-root], [class*='sidebarCol'] [class*='_root'])::after {
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
body[data-dsh-qingxiao] :is([data-slot='sidebar'], [class*='sidebarCol']) {
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

/* ═══════════════════════════════════════════════════════════════
   液态玻璃输入框（可在「界面 → 输入框质感」关闭）
   结构：seat 透明 + ::before 流动玻璃 + ::after 旋转流光描边
   ═══════════════════════════════════════════════════════════════ */
@property --qx-composer-angle {
	syntax: "<angle>";
	inherits: false;
	initial-value: 0deg;
}
@property --qx-px {
	syntax: "<percentage>";
	inherits: true;
	initial-value: 50%;
}
@property --qx-py {
	syntax: "<percentage>";
	inherits: true;
	initial-value: 50%;
}
@property --qx-pointer-core {
	syntax: "<number>";
	inherits: true;
	initial-value: 0;
}
@property --qx-pointer-halo {
	syntax: "<number>";
	inherits: true;
	initial-value: 0;
}
/* seat 只做定位：统计行在 card 外，不能被玻璃外壳盖进去 */
body[data-qx-composer='liquid'] [id=root] [class*='_composerSeat'] {
	border: 0 !important;
	border-radius: 0 !important;
	background: transparent !important;
	box-shadow: none !important;
	backdrop-filter: none !important;
	-webkit-backdrop-filter: none !important;
}
body[data-qx-composer='liquid'] [id=root] [class*='_composerSeat']:focus-within {
	border-color: transparent !important;
	box-shadow: none !important;
}
body[data-qx-composer='liquid'] [id=root] [class*='_composerSeat']::before,
body[data-qx-composer='liquid'] [id=root] [class*='_composerSeat']::after {
	content: none !important;
	background: transparent !important;
	box-shadow: none !important;
}
/* seat 里 card 之外的兄弟节点（统计行等）保持透明，避免在输入条底部留一条底色 */
body[data-qx-composer='liquid'] [id=root] [class*='_composerSeat'] > :not([data-composer-card]) {
	background: transparent !important;
	background-image: none !important;
	border-color: transparent !important;
	box-shadow: none !important;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] {
	--qx-liquid-cyan: 0.46;
	--qx-liquid-gold: 0.36;
	--qx-liquid-ice: 0.28;
	--qx-liquid-glass-a: 0.72;
	--qx-liquid-glass-b: 0.42;
	--qx-liquid-sheen: 0.36;
	isolation: isolate;
	border: 0 !important;
	border-radius: 18px;
	background: transparent !important;
	box-shadow: 0 0 30px rgba(var(--qx-cyan-rgb), 0.20), 0 10px 38px rgba(11, 30, 46, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.24);
	backdrop-filter: blur(20px) saturate(170%);
	-webkit-backdrop-filter: blur(20px) saturate(170%);
	transition: box-shadow .35s ease;
	color: var(--qx-text);
}
body[data-qx-composer='liquid']:not([data-ds-dark-theme]) [id=root] [data-composer-card] {
	--qx-liquid-cyan: 0.32;
	--qx-liquid-gold: 0.24;
	--qx-liquid-ice: 0.18;
	--qx-liquid-glass-a: 0.84;
	--qx-liquid-glass-b: 0.60;
	--qx-liquid-sheen: 0.34;
}
body[data-qx-composer='liquid'][data-ds-dark-theme] [id=root] [data-composer-card] {
	--qx-liquid-cyan: 0.50;
	--qx-liquid-gold: 0.40;
	--qx-liquid-ice: 0.34;
	--qx-liquid-glass-a: 0.70;
	--qx-liquid-glass-b: 0.44;
	--qx-liquid-sheen: 0.44;
}
/* 玻璃底只负责折射与底色，静态绘制；扫光 / 极光 / 描边全部搬到独立层，
   只用 transform / opacity 做动画。之前 7 层渐变 + background-position、
   filter 呼吸、drop-shadow、border-radius 变形全压在同一个毛玻璃大层上，
   每帧都要重画整块卡片，这就是卡顿的来源。 */
body[data-qx-composer='liquid'] [id=root] [data-composer-card]::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: 0;
	overflow: hidden;
	border-radius: inherit;
	pointer-events: none;
	background: linear-gradient(150deg, rgba(var(--qx-panel-rgb), var(--qx-liquid-glass-a)), rgba(var(--qx-panel-rgb), var(--qx-liquid-glass-b)));
}
/* 装饰容器常驻（关闭液态时不绘制、不占布局） */
body[data-dsh-qingxiao] [id=root] [data-composer-card] > [data-qx-composer-fx] {
	position: absolute;
	inset: 0;
	z-index: 0;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
	contain: paint;
}
body[data-dsh-qingxiao] [id=root] [data-composer-card] > [data-qx-composer-glow] {
	position: absolute;
	inset: 0;
	z-index: 0;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
	contain: paint;
}
body[data-dsh-qingxiao] [id=root] [data-composer-card] > [data-qx-composer-ring] {
	position: absolute;
	inset: 0;
	z-index: 3;
	box-sizing: border-box;
	padding: 2px;
	border-radius: inherit;
	pointer-events: none;
	/* 旋转的锥形层是 140% 的大方块，必须在这里裁掉；否则绝对定位的溢出
	   会计入祖先的 scrollable overflow，撑出横竖滚动条、把输入区顶跑。 */
	overflow: hidden;
	contain: paint;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-glow] > i {
	position: absolute;
	left: 0;
	top: 0;
	width: 320px;
	height: 320px;
	border-radius: 50%;
	/* 明暗两套固定强度写死在 CSS 里，跟随鼠标时只改 transform 和 opacity，
	   不再每帧写继承型自定义属性（那会让整棵文档重新计算样式）。 */
	--qx-glow-core: 0.306;
	--qx-glow-halo: 0.18;
	background-image:
		radial-gradient(circle, rgba(255, 255, 255, var(--qx-glow-core)) 0%, rgba(255, 255, 255, calc(var(--qx-glow-core) * 0.55)) 34%, transparent 62%),
		radial-gradient(circle, rgba(255, 255, 255, var(--qx-glow-halo)) 0%, transparent 70%);
	background-repeat: no-repeat;
	background-size: 112px 112px, 300px 300px;
	background-position: center, center;
	transform: translate3d(-160px, -160px, 0);
	opacity: 0;
	transition: opacity .12s ease;
	will-change: transform, opacity;
	pointer-events: none;
}
body[data-qx-composer='liquid'][data-ds-dark-theme] [id=root] [data-composer-card] [data-qx-composer-glow] > i {
	--qx-glow-core: 0.442;
	--qx-glow-halo: 0.26;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-glow][data-on='true'] > i {
	opacity: 1;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > * {
	position: absolute;
	pointer-events: none;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > .qx-fx-sheen {
	top: 0;
	bottom: 0;
	left: 0;
	width: 55%;
	background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, var(--qx-liquid-sheen)) 46%, rgba(255, 255, 255, calc(var(--qx-liquid-sheen) * 0.4)) 54%, transparent 100%);
	transform: translate3d(-120%, 0, 0);
	animation: qx-fx-sheen 9s ease-in-out infinite;
	will-change: transform;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > .qx-fx-aurora {
	border-radius: 50%;
	will-change: transform;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > .qx-fx-aurora.a {
	left: -6%;
	top: -40%;
	width: 58%;
	aspect-ratio: 1;
	background: radial-gradient(circle, rgba(var(--qx-cyan-rgb), var(--qx-liquid-cyan)) 0%, transparent 70%);
	animation: qx-fx-drift-a 11s ease-in-out infinite alternate;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > .qx-fx-aurora.b {
	right: -8%;
	bottom: -55%;
	width: 55%;
	aspect-ratio: 1;
	background: radial-gradient(circle, rgba(var(--qx-gold-rgb), var(--qx-liquid-gold)) 0%, transparent 70%);
	animation: qx-fx-drift-b 13s ease-in-out infinite alternate;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > .qx-fx-aurora.c {
	right: 2%;
	top: -45%;
	width: 48%;
	aspect-ratio: 1;
	background: radial-gradient(circle, rgba(143, 199, 234, var(--qx-liquid-ice)) 0%, transparent 70%);
	animation: qx-fx-drift-c 15s ease-in-out infinite alternate;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > .qx-fx-breath {
	inset: 0;
	background: radial-gradient(120% 120% at 50% 0%, rgba(255, 255, 255, 0.10), transparent 62%);
	opacity: 0.4;
	animation: qx-fx-breath 7s ease-in-out infinite;
	will-change: opacity;
}
/* 描边：遮罩容器静态，锥形渐变在内部整层旋转（transform 合成） */
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-ring] {
	-webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite: xor;
	mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	mask-composite: exclude;
	animation: qx-fx-halo 6s ease-in-out infinite;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-ring] > i {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 140%;
	aspect-ratio: 1;
	background: conic-gradient(from 0deg,
		rgba(var(--qx-cyan-rgb), 0.95),
		rgba(var(--qx-gold-rgb), 0.90),
		rgba(143, 199, 234, 0.95),
		rgba(var(--qx-cyan-rgb), 0.95));
	transform: translate(-50%, -50%) rotate(0deg);
	animation: qx-fx-spin 9s linear infinite;
	will-change: transform;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] > * {
	z-index: 1;
}
/* 定位只做零特异性兜底：宿主或插件自己的 position（尤其是浮层 composer
   的 absolute）必须优先。之前用高特异性强写 position: relative，会把
   原本绝对定位的浮层 composer 拽回文档流、显示在会话顶部。 */
:where(body[data-qx-composer='liquid'] [id=root] [data-composer-card]) {
	position: relative;
}
:where(body[data-qx-composer='liquid'] [id=root] [data-composer-card] > *) {
	position: relative;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is([data-composer-input], textarea, input, [contenteditable='true']) {
	background: transparent !important;
	border-color: transparent !important;
	box-shadow: none !important;
	color: var(--qx-text) !important;
	-webkit-text-fill-color: var(--qx-text);
	caret-color: var(--qx-accent-strong);
	font-weight: 500;
}
/* 宿主给输入区/工具行各自铺了一层底，会在卡片里留下一条横向色带；
   只清掉这些容器层，按钮自身的底色保留 */
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is(div, footer, section, header, nav, ul, form, fieldset, [class*='toolbar'], [class*='footer'], [class*='tools'], [class*='actions'], [class*='row'], [class*='group'], [class*='bar']) {
	background-color: transparent !important;
	background-image: none !important;
	border-color: transparent !important;
	backdrop-filter: none !important;
	-webkit-backdrop-filter: none !important;
}
/* 宿主有时用容器的伪元素画分隔线/底部渐变，一并清掉背景（保留图标内容） */
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is(div, footer, section, header, nav, ul, form, fieldset)::before,
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is(div, footer, section, header, nav, ul, form, fieldset)::after {
	background: transparent !important;
	box-shadow: none !important;
	border-color: transparent !important;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is(textarea, input)::placeholder,
body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-placeholder]::before {
	color: var(--qx-text) !important;
	opacity: 0.85 !important;
	font-weight: 500;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is([class*='placeholder'], [class*='Placeholder']) {
	color: var(--qx-text) !important;
	opacity: 0.85 !important;
	font-weight: 500;
}
body[data-qx-composer='liquid']:not([data-ds-dark-theme]) [id=root] [data-composer-card] :is([data-composer-input], textarea, input, [contenteditable='true']) {
	text-shadow: 0 1px 0 rgba(255, 255, 255, 0.55);
}
body[data-qx-composer='liquid'][data-ds-dark-theme] [id=root] [data-composer-card] :is([data-composer-input], textarea, input, [contenteditable='true']) {
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] :is(button, [role='button'], span, label) {
	color: var(--qx-text-soft);
	font-weight: 500;
	text-rendering: optimizeLegibility;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] svg {
	opacity: 0.95;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card] ::selection {
	background: rgba(var(--qx-cyan-rgb), 0.32);
	color: var(--qx-text);
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card]:hover {
	box-shadow: 0 0 34px rgba(var(--qx-cyan-rgb), 0.24), 0 14px 46px rgba(var(--qx-cyan-rgb), 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.26);
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card]:focus-within {
	box-shadow: 0 0 42px rgba(var(--qx-cyan-rgb), 0.34), 0 14px 52px rgba(var(--qx-cyan-rgb), 0.30), 0 0 64px rgba(var(--qx-gold-rgb), 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.30);
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card]:focus-within::before {
	animation-duration: 7s, 4.5s;
}
body[data-qx-composer='liquid'] [id=root] [data-composer-card]:focus-within::after {
	animation-duration: 4.5s, 3s;
	opacity: 1;
}
@keyframes qx-fx-sheen {
	0% { transform: translate3d(-120%, 0, 0); }
	50% { transform: translate3d(220%, 0, 0); }
	100% { transform: translate3d(-120%, 0, 0); }
}
@keyframes qx-fx-drift-a {
	from { transform: translate3d(0, 0, 0) scale(1); }
	to { transform: translate3d(26%, 18%, 0) scale(1.15); }
}
@keyframes qx-fx-drift-b {
	from { transform: translate3d(0, 0, 0) scale(1.05); }
	to { transform: translate3d(-22%, -16%, 0) scale(0.94); }
}
@keyframes qx-fx-drift-c {
	from { transform: translate3d(0, 0, 0) scale(0.96); }
	to { transform: translate3d(-14%, 20%, 0) scale(1.12); }
}
@keyframes qx-fx-breath {
	0%, 100% { opacity: 0.28; }
	50% { opacity: 0.62; }
}
@keyframes qx-fx-halo {
	0%, 100% { opacity: 0.78; }
	50% { opacity: 1; }
}
@keyframes qx-fx-spin {
	to { transform: translate(-50%, -50%) rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
	body[data-qx-composer='liquid'] [id=root] [data-composer-card],
	body[data-qx-composer='liquid'] [id=root] [data-composer-card]::before,
	body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx],
	body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-fx] > *,
	body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-ring],
	body[data-qx-composer='liquid'] [id=root] [data-composer-card] [data-qx-composer-ring] > i {
		animation: none;
	}
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
/* 浅色下 inline code / 文件引用：半透明青碧玻璃底 + 中框 + 深青字。
   code 里的文件名/路径常常是嵌套链接或 span，自带绿色会盖掉 code 的
   深色；这里强制 code 及其子节点统一用深青，同时把框加深一点。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [id=root] :not(pre) > code {
	color: #0B4A44 !important;
	background: rgba(86, 200, 192, 0.14);
	border: 1px solid rgba(47, 111, 101, 0.55);
	box-shadow: none;
	font-weight: 500;
	text-shadow: none !important;
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [id=root] :not(pre) > code * {
	color: #0B4A44 !important;
	text-shadow: none !important;
}
/* 浅色聊天区：链接与宿主的文件引用/diff/success 组件统一深色。
   宿主这些组件常用固定亮绿，只改 code 盖不住。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [data-conversation-scroll] a,
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [data-conversation-scroll] a * {
	color: var(--qx-accent-strong) !important;
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [id=root] :is([class*='fileLink'], [class*='fileReference'], [class*='diffAdded'], [class*='success'], [class*='Success']) {
	color: #12703F !important;
}
/* 宿主可能在 [id=root] 内部重新定义 success/business 令牌；在 root 上再压一次，
   确保聊天里的 diff/文件状态绿也被浅色规则覆盖。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [id=root] {
	--dsw-alias-state-success-primary: #12703F;
	--dsw-alias-state-success-secondary: #1B7A4A;
	--dsw-alias-state-business-primary: #0E615B;
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
/* 0.8.0 氛围场景粒子：雪 / 雨 / 雾。三种都只动 transform 与 opacity。 */
body[data-qx-particles='snow'] [data-skin-chrome='particle-field'] span {
	bottom: auto;
	top: -14px;
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background: radial-gradient(circle, #ffffff 0%, rgba(214, 238, 255, 0.85) 55%, transparent 74%);
	box-shadow: 0 1px 3px rgba(30, 60, 90, 0.35), 0 0 9px 1px rgba(198, 232, 255, 0.7);
	animation: qx-snow calc(18s * var(--qx-particle-speed)) linear infinite;
}
body[data-qx-particles='snow'] [data-skin-chrome='particle-field'] span:nth-child(5n+1) {
	width: 3px;
	height: 3px;
	opacity: 0;
}
@keyframes qx-snow {
	0% { transform: translate3d(0, -14vh, 0); opacity: 0; }
	10% { opacity: 0.9; }
	82% { opacity: 0.65; }
	100% { transform: translate3d(var(--qx-sway, 30px), 112vh, 0); opacity: 0; }
}
body[data-qx-particles='rain'] [data-skin-chrome='particle-field'] span {
	bottom: auto;
	top: -18vh;
	width: 1.5px;
	height: 22px;
	border-radius: 1px;
	background: linear-gradient(to bottom, transparent, rgba(186, 222, 255, 0.95));
	box-shadow: 0 0 4px rgba(120, 180, 230, 0.55);
	animation: qx-rain calc(1.7s * var(--qx-particle-speed)) linear infinite;
}
@keyframes qx-rain {
	0% { transform: translate3d(0, 0, 0); opacity: 0; }
	8% { opacity: 0.85; }
	100% { transform: translate3d(-10vw, 125vh, 0); opacity: 0.15; }
}
/* 星屑：小光点悬浮闪烁，只点缀不遮挡正文 */
body[data-qx-particles='firefly'] [data-skin-chrome='particle-field'] span {
	bottom: auto;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background: radial-gradient(circle, #FFF6D8 0%, rgba(232, 205, 143, 0.9) 45%, transparent 74%);
	box-shadow: 0 1px 2px rgba(40, 30, 10, 0.22), 0 0 8px 2px rgba(232, 205, 143, 0.55);
	animation: qx-firefly calc(9s * var(--qx-particle-speed)) ease-in-out infinite alternate;
}
body[data-qx-particles='firefly'] [data-skin-chrome='particle-field'] span:nth-child(4n+2) {
	background: radial-gradient(circle, #EAFBFF 0%, rgba(127, 224, 214, 0.9) 45%, transparent 74%);
	box-shadow: 0 1px 2px rgba(10, 30, 35, 0.22), 0 0 8px 2px rgba(127, 224, 214, 0.5);
}
@keyframes qx-firefly {
	0% { transform: translate3d(0, 0, 0) scale(0.85); opacity: 0.1; }
	25% { opacity: 0.95; }
	60% { opacity: 0.45; }
	100% { transform: translate3d(var(--qx-sway, 40px), -12vh, 0) scale(1.1); opacity: 0.9; }
}
/* 浅色壁纸上白粒子会消失：雪加冷色投影，雨改成深蓝灰雨丝 */
body[data-qx-particles='snow']:not([data-ds-dark-theme]) [data-skin-chrome='particle-field'] span {
	box-shadow: 0 1px 3px rgba(24, 54, 84, 0.4), 0 0 8px 1px rgba(186, 224, 250, 0.75);
}
body[data-qx-particles='rain']:not([data-ds-dark-theme]) [data-skin-chrome='particle-field'] span {
	background: linear-gradient(to bottom, transparent, rgba(66, 104, 140, 0.62));
	box-shadow: 0 0 3px rgba(60, 100, 140, 0.4);
}
/* 特效强度：降到中档关呼吸，低档再停极光与描边呼吸；全部只停动画不减质感 */
body[data-qx-fx='reduced'] [data-qx-composer-fx] > .qx-fx-breath { animation: none; opacity: 0.45; }
body[data-qx-fx='minimal'] [data-qx-composer-fx] > .qx-fx-breath { animation: none; opacity: 0.42; }
body[data-qx-fx='minimal'] [data-qx-composer-fx] > .qx-fx-aurora { animation: none; }
body[data-qx-fx='minimal'] [data-qx-composer-ring] { animation: none; }
body[data-qx-fx='minimal'] [data-qx-composer-ring] > i { animation-duration: 18s; }
/* 自动降级 / 低功耗：停掉最贵的极光漂移与呼吸，粒子数量由 JS 减半 */
body[data-qx-perf='low'] [data-qx-composer-fx] > .qx-fx-aurora { animation: none; }
body[data-qx-perf='low'] [data-qx-composer-fx] > .qx-fx-breath { animation: none; opacity: 0.42; }
body[data-qx-perf='low'] [data-qx-composer-ring] { animation: none; }
/* 窗口不可见时暂停所有皮肤动画，回前台再继续 */
body[data-qx-paused='true'] [data-skin-chrome='particle-field'] span,
body[data-qx-paused='true'] [data-qx-composer-fx] > *,
body[data-qx-paused='true'] [data-qx-composer-ring],
body[data-qx-paused='true'] [data-qx-composer-ring] > i {
	animation-play-state: paused !important;
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
	width: 320px;
	max-width: calc(100vw - 16px);
	max-height: min(78vh, 720px);
	display: flex;
	flex-direction: column;
	border-radius: 16px;
	border: 1px solid var(--qx-panel-border-strong);
	background: rgba(var(--qx-panel-rgb), 0.94);
	color: var(--qx-text);
	box-shadow: 0 10px 34px rgba(11, 30, 46, 0.3);
	overflow: hidden;
	/* 0.7.0 面板布局令牌 */
	--pp-pad: 12px;
	--pp-gap: 10px;
	--pp-row-h: 30px;
	--pp-radius: 11px;
	--pp-radius-sm: 7px;
	--pp-font: 12.5px;
	--pp-font-sm: 10.5px;
	--pp-line: 1.55;
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
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-dragover {
	background: rgba(var(--qx-cyan-rgb), 0.4);
	border-color: var(--qx-cyan-bright);
	box-shadow: 0 0 14px rgba(var(--qx-cyan-rgb), 0.6);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-row.pp-dragover {
	outline: 1px dashed rgba(var(--qx-cyan-rgb), 0.7);
	outline-offset: 3px;
	border-radius: 8px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-jump {
	display: block;
	width: 100%;
	padding: 7px 12px;
	font-size: 12.5px;
	font-weight: 600;
	letter-spacing: .02em;
	color: #F4F9FC;
	border-color: var(--qx-jade);
	background: linear-gradient(180deg, rgba(var(--qx-cyan-rgb), 0.28), rgba(46, 158, 152, 0.55));
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-jump:hover {
	background: linear-gradient(180deg, rgba(var(--qx-cyan-rgb), 0.42), rgba(38, 131, 126, 0.7));
	box-shadow: 0 0 12px rgba(var(--qx-cyan-rgb), 0.45);
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
/* 建议/提示条：浅色下「面板磨砂玻璃」提升可读性的说明 */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-note.pp-tip {
	font-size: 11.5px;
	color: var(--qx-text-soft);
	line-height: 1.55;
	padding: 6px 9px;
	margin: 2px 0 5px;
	border-left: 2px solid var(--qx-jade);
	border-radius: 3px;
	background: rgba(var(--qx-cyan-rgb), 0.10);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-note.pp-tip[data-on='true'] {
	border-left-color: var(--qx-accent-strong);
	background: rgba(46, 158, 152, 0.10);
}
/* 0.7.0 个性化定制 */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview {
	border: 1px solid var(--qx-panel-border);
	background: var(--qx-sink);
	border-radius: 9px;
	padding: 8px 10px;
	margin: 2px 0 6px;
	font-family: var(--qx-font-ui, inherit);
	line-height: var(--qx-line-height, 1.7);
	letter-spacing: var(--qx-letter-spacing, 0em);
	overflow: hidden;
	cursor: default;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-badge {
	display: block;
	text-align: right;
	font-size: 9.5px;
	letter-spacing: .08em;
	color: var(--qx-text-faint);
	pointer-events: none;
	margin-bottom: 2px;
}
/* 预览条只展示字体/配色，不是按钮：屏蔽指针事件，避免被当成可点控件 */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-text,
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-meta {
	pointer-events: none;
	user-select: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-text {
	font-size: 13px;
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-meta {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 7px;
	margin-top: 4px;
	font-size: 11.5px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-meta code {
	font-family: var(--qx-font-code, ui-monospace, monospace);
	font-size: 11px;
	padding: 1px 5px;
	border: 1px solid var(--qx-panel-border-strong);
	border-radius: 4px;
	background: rgba(var(--qx-cyan-rgb), 0.14);
	color: var(--qx-accent-strong);
	letter-spacing: normal;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-link {
	color: var(--qx-accent-strong);
	text-decoration: underline;
	text-underline-offset: 2px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .qx-type-preview-faint {
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	padding: 2px 0 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chip {
	display: flex;
	align-items: center;
	gap: 5px;
	padding: 4px 7px;
	border: 1px solid var(--qx-panel-border);
	border-radius: 7px;
	background: transparent;
	color: var(--qx-text);
	font-size: 11px;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chip:hover {
	border-color: var(--qx-panel-border-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chip i {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chip[data-active='true'] {
	border-color: var(--qx-accent-strong);
	background: rgba(var(--qx-cyan-rgb), 0.12);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-color-row {
	align-items: flex-start;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-color-wrap {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 5px;
	flex: 1;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-color {
	width: 30px;
	height: 24px;
	padding: 0;
	border: 1px solid var(--qx-panel-border);
	border-radius: 5px;
	background: transparent;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-hex {
	width: 74px;
	padding: 3px 6px;
	font-size: 11px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-hex-apply {
	padding: 3px 7px;
	font-size: 10.5px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-status {
	font-size: 11px;
	color: var(--qx-accent-strong);
	min-height: 15px;
	padding: 2px 0;
}
/* 0.5.0 主题中心 */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 6px;
	padding: 2px 0 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 2px;
	padding: 8px 10px;
	border: 1px solid var(--qx-panel-border);
	border-radius: 9px;
	background: rgba(var(--qx-cyan-rgb), 0.08);
	color: inherit;
	font: inherit;
	text-align: left;
	cursor: pointer;
	transition: background .12s ease, border-color .12s ease;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-card:hover {
	background: rgba(var(--qx-cyan-rgb), 0.16);
	border-color: var(--qx-panel-border-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-name {
	font-size: 12px;
	font-weight: 600;
	letter-spacing: .03em;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-desc {
	font-size: 10.5px;
	opacity: .55;
	line-height: 1.35;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-actions {
	flex-wrap: wrap;
	gap: 6px;
	padding: 2px 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-actions .pp-btn {
	flex: 1 1 auto;
	padding-left: 8px;
	padding-right: 8px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-code {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 2px 0 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tool-row {
	flex-wrap: wrap;
	gap: 6px;
	padding: 2px 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tool-row .pp-btn {
	flex: 1 1 auto;
	padding-left: 8px;
	padding-right: 8px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-font-actions {
	display: flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
	flex-wrap: wrap;
	justify-content: flex-end;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-hotkey-actions {
	display: flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-hotkey-code {
	max-width: 160px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 10.5px;
	color: var(--qx-text-faint);
	font-family: var(--ds-font-family-code, ui-monospace, monospace);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-font-name {
	max-width: 120px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 10.5px;
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-textarea {
	width: 100%;
	min-height: 72px;
	box-sizing: border-box;
	resize: vertical;
	font-family: var(--ds-font-family-code, ui-monospace, monospace);
	font-size: 10.5px;
	line-height: 1.5;
	border-radius: 8px;
	border: 1px solid var(--qx-panel-border);
	background: rgba(10, 26, 40, 0.35);
	color: inherit;
	padding: 6px 8px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-code-actions {
	display: flex;
	gap: 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-code-actions .pp-btn {
	flex: 1 1 auto;
}
/* 画卷 2.0：URL / 构图控件 */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-url-row {
	gap: 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-url-row .pp-input {
	flex: 1 1 auto;
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-input,
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-select {
	height: 28px;
	box-sizing: border-box;
	border: 1px solid var(--qx-panel-border);
	border-radius: 7px;
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.6));
	color: inherit;
	font-size: 11.5px;
	padding: 0 8px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-input:focus,
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-select:focus {
	outline: none;
	border-color: rgba(var(--qx-cyan-rgb), 0.65);
	box-shadow: 0 0 0 2px rgba(var(--qx-cyan-rgb), 0.15);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-input::placeholder {
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-select {
	flex: none;
	max-width: 116px;
}
/* 0.5.0 体检报告 */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-diagnose {
	margin: 4px 0 0;
	padding: 8px 10px;
	max-height: 230px;
	overflow: auto;
	font-family: var(--ds-font-family-code, ui-monospace, monospace);
	font-size: 10.5px;
	line-height: 1.55;
	white-space: pre-wrap;
	word-break: break-word;
	border-radius: 8px;
	border: 1px solid var(--qx-panel-border);
	background: rgba(10, 26, 40, 0.35);
	color: var(--qx-text-soft, inherit);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-rotation {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 2px 0 4px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-rotation .pp-btn {
	width: 100%;
}
/* 输入时自动压暗（固定层：壁纸之上、内容之下） */
body[data-dsh-qingxiao] [data-skin-chrome='bg-dim'] {
	position: fixed;
	inset: 0;
	pointer-events: none;
	z-index: -1;
	background: rgba(7, 19, 31, 0.28);
	opacity: 0;
	transition: opacity .35s ease;
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [data-skin-chrome='bg-dim'] {
	background: rgba(240, 248, 252, 0.22);
}
body[data-dsh-qingxiao][data-qx-dim='on'] [data-skin-chrome='bg-dim'] {
	opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
	body[data-dsh-qingxiao] [data-skin-chrome='bg-dim'] {
		transition: none;
	}
}
/* 视频壁纸层：video(-3) → scrim(-2) → bg-dim(-1) → 粒子(0) → 内容 */
body[data-dsh-qingxiao] [data-skin-chrome='bg-video'] {
	position: fixed;
	inset: 0;
	z-index: -3;
	pointer-events: none;
	overflow: hidden;
	background: #0b1e2e;
	display: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='bg-video'][data-on='true'] {
	display: block;
}
body[data-dsh-qingxiao] [data-skin-chrome='bg-video'] video {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: 50% 50%;
	display: block;
}
body[data-dsh-qingxiao] [data-skin-chrome='bg-video-scrim'] {
	position: fixed;
	inset: 0;
	z-index: -2;
	pointer-events: none;
	display: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='bg-video-scrim'][data-on='true'] {
	display: block;
}
/* 官方设置页「清宵」分区：内嵌同一套调色盘 DOM */
body[data-dsh-qingxiao] .qx-settings-embed {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
body[data-dsh-qingxiao] .qx-settings-embed-note {
	margin: 0;
	font-size: 12px;
	opacity: .65;
	line-height: 1.6;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] {
	position: static !important;
	left: auto !important;
	top: auto !important;
	width: auto !important;
	max-width: 780px;
	max-height: none;
	border: 0;
	background: transparent;
	box-shadow: none;
	overflow: visible;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-body {
	max-height: none;
	overflow: visible;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-footer {
	display: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer {
	padding: 6px 14px 10px;
	font-size: 10px;
	color: var(--qx-text-faint);
	border-top: 1px dashed var(--qx-panel-border);
	letter-spacing: 1px;
}

/* ═══════════════════════════════════════════════════════════════
   0.7.0 · 调色盘布局系统
   结构：header → tabs → body(pages > cards) → footer
   ═══════════════════════════════════════════════════════════════ */
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	height: 44px;
	padding: 0 14px;
	cursor: pointer;
	user-select: none;
	border-bottom: 1px solid var(--qx-panel-border);
	background: linear-gradient(135deg, rgba(var(--qx-cyan-rgb), 0.10), rgba(var(--qx-gold-rgb), 0.07));
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-header:focus-visible {
	outline: 2px solid var(--qx-accent-strong);
	outline-offset: -2px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-header-main {
	display: flex;
	align-items: baseline;
	gap: 7px;
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-title {
	font-family: "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif;
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 1px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-version {
	font-family: var(--ds-font-family-code, ui-monospace, monospace);
	font-size: 9.5px;
	letter-spacing: 0;
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-collapse {
	width: 7px;
	height: 7px;
	margin-right: 3px;
	border-right: 1.5px solid var(--qx-text-faint);
	border-bottom: 1.5px solid var(--qx-text-faint);
	transform: rotate(45deg);
	font-size: 0;
	color: transparent;
	overflow: hidden;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-advice {
	flex: none;
	display: flex;
	align-items: center;
	gap: 7px;
	padding: 7px 12px;
	border-bottom: 1px solid var(--qx-panel-border);
	background: linear-gradient(90deg, rgba(var(--qx-cyan-rgb), 0.14), rgba(var(--qx-gold-rgb), 0.10));
	color: var(--qx-text-soft);
	font-size: 11px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-advice-icon {
	color: var(--qx-accent-strong);
	font-size: 13px;
	line-height: 1;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-advice-text {
	flex: 1 1 auto;
	min-width: 0;
	font-weight: 600;
	letter-spacing: .02em;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-advice-tag {
	flex: none;
	padding: 1px 5px;
	border: 1px solid rgba(var(--qx-cyan-rgb), 0.35);
	border-radius: 999px;
	color: var(--qx-accent-strong);
	font-size: 9.5px;
	line-height: 1.4;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tabs {
	flex: none;
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: 3px;
	padding: 6px 10px 7px;
	border-bottom: 1px solid var(--qx-panel-border);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tab {
	position: relative;
	height: 30px;
	padding: 0 2px;
	border: 0;
	border-radius: 8px;
	background: transparent;
	color: var(--qx-text-faint);
	font: inherit;
	font-size: 12px;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tab:hover {
	color: var(--qx-text-soft);
	background: rgba(var(--qx-cyan-rgb), 0.08);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tab[aria-selected='true'] {
	color: var(--qx-text);
	font-weight: 600;
	background: rgba(var(--qx-cyan-rgb), 0.14);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tab[aria-selected='true']::after {
	content: "";
	position: absolute;
	left: 16px;
	right: 16px;
	bottom: 3px;
	height: 2px;
	border-radius: 2px;
	background: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-tab:focus-visible {
	outline: 2px solid var(--qx-accent-strong);
	outline-offset: -2px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-body {
	padding: 12px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-page {
	display: block;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-page[hidden] {
	display: none !important;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card {
	padding: 10px 12px 12px;
	border: 1px solid var(--qx-panel-border);
	border-radius: var(--pp-radius);
	background: var(--qx-sink);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card + .pp-card {
	margin-top: var(--pp-gap);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 8px;
	padding-bottom: 5px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-title {
	position: relative;
	margin: 0;
	padding-left: 8px;
	font-size: 13.5px;
	font-weight: 600;
	line-height: 1.3;
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-title::before {
	content: "";
	position: absolute;
	left: 0;
	top: 2px;
	bottom: 2px;
	width: 2px;
	border-radius: 2px;
	background: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-desc {
	margin: 2px 0 0 8px;
	font-size: var(--pp-font-sm);
	line-height: 1.45;
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-action {
	flex: none;
	padding: 2px 4px;
	border: 0;
	border-radius: 4px;
	background: transparent;
	color: var(--qx-accent-strong);
	font: inherit;
	font-size: 11px;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-action:hover {
	background: rgba(var(--qx-cyan-rgb), 0.12);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card-body {
	padding-top: 2px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-group + .pp-group {
	margin-top: 8px;
	padding-top: 8px;
	border-top: 1px dashed var(--qx-panel-border);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-group-title {
	padding: 0 0 3px;
	font-size: 10.5px;
	font-weight: 600;
	letter-spacing: .08em;
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card .pp-row {
	min-height: var(--pp-row-h);
	padding: 4px 0;
	gap: 10px;
	font-size: var(--pp-font);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card .pp-row label {
	flex: 0 0 auto;
	white-space: nowrap;
	font-size: var(--pp-font);
	color: var(--qx-text-soft);
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-slider-wrap {
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-slider-wrap input[type='range'] {
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card .pp-note {
	padding: 5px 0 0;
	font-size: var(--pp-font-sm);
	line-height: var(--pp-line);
	color: var(--qx-text-faint);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card .pp-note.pp-tip {
	padding: 6px 9px;
	margin: 6px 0 0;
	border-left: 2px solid var(--qx-jade);
	border-radius: 5px;
	background: rgba(var(--qx-cyan-rgb), 0.10);
	color: var(--qx-text-soft);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-card .pp-note.pp-tip[data-on='true'] {
	border-left-color: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle {
	width: 36px;
	height: 20px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle::after {
	left: 2px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-toggle[data-on='true']::after {
	left: 20px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-slider-wrap {
	gap: 8px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-val {
	width: 46px;
	padding: 1px 4px;
	border-radius: 4px;
	background: var(--qx-sink);
	font-size: 10.5px;
	color: var(--qx-text-soft);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn {
	height: 28px;
	padding: 0 10px;
	border-radius: var(--pp-radius-sm);
	font-size: 11.5px;
	line-height: 1;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-danger {
	color: var(--qx-danger);
	border-color: rgba(var(--qx-danger-rgb), 0.55);
	background: rgba(var(--qx-danger-rgb), 0.10);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-btn.pp-danger:hover {
	background: rgba(var(--qx-danger-rgb), 0.18);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-actions {
	flex-wrap: wrap;
	gap: 6px;
	padding-top: 2px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-actions .pp-btn {
	flex: 1 1 0;
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-grid {
	grid-template-columns: 1fr 1fr;
	gap: 8px;
	padding: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-card {
	min-height: 62px;
	padding: 8px 10px;
	border-radius: 9px;
	border: 1px solid var(--qx-panel-border);
	background: rgba(var(--qx-panel-rgb), 0.22);
	text-align: left;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-card[data-active='true'] {
	border-color: var(--qx-accent-strong);
	background: rgba(var(--qx-cyan-rgb), 0.12);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-card[data-active='true']::after {
	content: "✓";
	position: absolute;
	top: 6px;
	right: 8px;
	font-size: 10px;
	color: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-card {
	position: relative;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chips {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 6px;
	padding: 2px 0 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-palette-chip {
	justify-content: center;
	min-height: 28px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-color-wrap {
	gap: 6px;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-theme-textarea,
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-diagnose {
	background: var(--qx-field-bg);
	color: var(--qx-text);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-code-textarea {
	height: 76px;
	min-height: 76px;
	max-height: 76px;
	resize: none;
	overflow: auto;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-rotation {
	padding: 2px 0 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-url-wrap {
	display: flex;
	align-items: center;
	gap: 6px;
	flex: 1;
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-url-wrap .pp-input {
	flex: 1;
	min-width: 0;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] [data-dep='off'] {
	opacity: 0.45;
	pointer-events: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	flex: none;
	min-height: 38px;
	padding: 6px 12px;
	font-size: var(--pp-font-sm);
	letter-spacing: 0;
	color: var(--qx-text-faint);
	border-top: 1px solid var(--qx-panel-border);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-status {
	flex: 1 1 auto;
	min-width: 0;
	min-height: 0;
	padding: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 10.5px;
	color: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-status[data-kind='error'] {
	color: var(--qx-danger);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer-actions {
	display: flex;
	align-items: center;
	gap: 4px;
	flex: none;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer-reset {
	height: 26px;
	padding: 0 8px;
	border: 0;
	border-radius: 6px;
	background: transparent;
	color: var(--qx-text-faint);
	font: inherit;
	font-size: 10.5px;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer-reset:hover {
	color: var(--qx-danger);
	background: rgba(var(--qx-danger-rgb), 0.10);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer-reset[data-confirm='true'] {
	color: var(--qx-danger);
	background: rgba(var(--qx-danger-rgb), 0.16);
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer-reposition {
	height: 26px;
	padding: 0 6px;
	border: 0;
	border-radius: 6px;
	background: transparent;
	color: var(--qx-text-faint);
	font: inherit;
	font-size: 10.5px;
	cursor: pointer;
}
body[data-dsh-qingxiao] [data-skin-chrome='palette-panel'] .pp-footer-reposition:hover {
	color: var(--qx-accent-strong);
	background: rgba(var(--qx-cyan-rgb), 0.10);
}

/* 设置页嵌入：隐藏重复的悬浮头部，保留标签、双列卡片与页脚 */
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] {
	max-width: 780px;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-header {
	display: none;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-tabs {
	max-width: 560px;
	margin: 0 auto;
	padding: 2px 0 8px;
	border-bottom: 1px solid var(--qx-panel-border);
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-body {
	padding: 12px 0 0;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-footer {
	display: flex;
	padding: 10px 0 0;
	border-top: 0;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-footer-reposition {
	display: none;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-page[data-active='true'] {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
	gap: 12px;
	align-items: start;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-card + .pp-card {
	margin-top: 0;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-card[data-span='2'] {
	grid-column: 1 / -1;
}
body[data-dsh-qingxiao] .qx-settings-embed [data-skin-chrome='palette-panel'] .pp-page[hidden] {
	display: none !important;
}
/* ── 新会话 · 清宵迎宾页 ──
   挂进会话列根（main.conversation > *，position:relative）内做绝对居中：
   旧版用 50vw+侧栏宽的固定公式挂在 body 上，右栏打开/全屏/缩放时都会
   跟输入框脱节；放进列内则天然跟随任何布局变化。 */
body[data-dsh-qingxiao] [data-skin-chrome='qingxiao-hero'] {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: 13vh;
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
/* 浅色模式：题字的浅冰蓝渐变在亮画卷上会“化开”，压深一档；
   引文的白晕也改为轻深色落影，保持字形。 */
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [data-skin-chrome='qingxiao-hero'] .qx-hero-name {
	/* 用 background-image，不能用 background 简写：简写会把 background-clip
	   重置成 border-box，浅色下「清宵」就变成一整块渐变方格。 */
	background-image: linear-gradient(180deg, #3C7F9A 0%, #1F7E86 55%, #145E5A 100%);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [data-skin-chrome='qingxiao-hero'] .qx-hero-quote {
	text-shadow: 0 1px 2px rgba(8, 20, 30, 0.22);
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
/* 3) 原生面板虚化：左侧会话栏 + 右侧详情栏 + 图二文件面板（better-sidebar）。
      CSS Modules 前缀是构建哈希，只能用 [class*='后缀'] 子串匹配；
      _centerCol（对话正文列）与 _frame 绝不要碰。
      detailsCol 是旧版布局的右详情列，0.2.0-rc.2 更名 rightbarCol，两条并列；
      它们自身是 static，补 position:relative 让伪元素锚定在本列——
      relative 不产生 fixed 包含块，弹窗照样铺得开（v0.1.2 塌缩教训）。
      文件面板并不在 detailsCol 内（t7 纠正 t1 §1 的错误前提）：它是
      div[data-dsh-panel]（position:absolute、z=40，底色 --dsw-alias-bg-layer-1
      实测 rgba(10,26,40,0.314) 半透明），挂在 fixed 满视口壳
      [data-dsh-panel-host]（pointer-events:none、自身零底色）里，实测链
      panel→host→shell→body。打标分支按红线不认领它（图二是原生面板，
      归 frostNative 管），所以由本条原生规则接管：右侧面板与底部面板
      [data-dsh-bottom-panel] 都带 data-dsh-panel 且都是壳的直接子，
      一条 "[data-dsh-panel-host] > [data-dsh-panel]" 两处全收，壳本体保持
      零虚化。另并列一条字面 "[data-dsh-panel-host] > [data-dsh-bottom-panel]"
      作冗余保险（verifier 要求；实测宽 1654/窄 954 两态底部面板都带
      data-dsh-panel 且父级就是 host，前一条本已命中，多写一条不改行为、
      不改其它目标特异度，只在插件日后改掉 data-dsh-panel 时兜底）。这两个目标自身已是 absolute，**绝不能**加进上面那条
      position:relative 规则——relative 会盖掉 absolute 把面板拽回文档流。
      虚化依旧只挂 ::after：面板内 .nArs4W_mermaidModal 是 position:fixed，
      把 backdrop-filter 放到面板本体就会把它困进面板（v0.1.2 同款塌缩）。
      与旧「面板磨砂玻璃」共用 ::after：两列那条与旧规则同特异度 (0,4,2)，
      靠本块在 THEME_CSS 里排在后面取胜；面板这条独立成 (0,5,2)。
      同开时由虚化强度接管，不会叠成两层模糊。 */
/* 同上：[data-sidebar-right-panel] 已是 absolute，不能改成 relative。 */
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] :is([data-slot='sidebar'], [class*='sidebarCol'], [data-dockkit-column]) {
	position: relative;
}
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] :is([data-slot='sidebar'], [class*='sidebarCol'], [data-dockkit-column], [data-sidebar-right-panel][data-sidebar-right-open])::after,
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] [data-dsh-panel-host] > [data-dsh-panel]::after,
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] [data-dsh-panel-host] > [data-dsh-bottom-panel]::after {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
}
/* 4) 文字光晕（用户：浅色字淡、深色略糊）：琉璃/虚化表面上的全部文字垫一层
   底色光晕。text-shadow 随继承落到每个子节点，span/div 全覆盖——旧的对比度
   增强只挑 p/li/td，而面板与列表文字几乎全是 span/div，等于没管到。
   浅色白晕托深色字，暗色墨晕衬亮字；底色一丝未动，纯字体处理。
   挂在既有的「文字对比度增强」开关下（默认 on），调色盘可关。 */
body[data-dsh-qingxiao][data-qx-contrast='on']:not([data-ds-dark-theme]) :is(.qx-frost, [class*='sidebarCol'], [class*='rightbarCol'], [data-dockkit-column], [data-dockkit-pane], [data-dsh-panel], [data-dsh-bottom-panel]) {
	text-shadow: 0 0 1px rgba(255, 255, 255, 0.95), 0 0 3px rgba(255, 255, 255, 0.7), 0 0 6px rgba(255, 255, 255, 0.4);
}
body[data-dsh-qingxiao][data-qx-contrast='on'][data-ds-dark-theme] :is(.qx-frost, [class*='sidebarCol'], [class*='rightbarCol'], [data-dockkit-column], [data-dockkit-pane], [data-dsh-panel], [data-dsh-bottom-panel]) {
	text-shadow: 0 0 1px rgba(2, 8, 14, 0.9), 0 0 3px rgba(2, 8, 14, 0.6), 0 0 6px rgba(2, 8, 14, 0.35);
}
/* 5) 对话/设置弹窗背板（用户：设置页字看不清）：弹窗结构是 fixed 满视口
   overlay 里 mask + panel 兄弟。mask 是无后代的满视口空 div，backdrop-filter
   直接挂本体安全（不会困住 fixed 后代）；底下整屏（对话+画卷）先糊掉。
   面板底原本走 layer-2（45 不透明度下只剩 0.38 alpha），提到 0.80/0.74，
   玻璃感靠糊掉的背板而不是透到底，表单文字彻底干净。_mask 子串匹配哈希类。 */
body[data-dsh-qingxiao][data-qx-frost='on'] [class*='_mask']:has(+ [role='dialog']) {
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) [role='dialog'] {
	background: rgba(var(--qx-panel-rgb), 0.80);
}
body[data-dsh-qingxiao][data-ds-dark-theme] [role='dialog'] {
	background: rgba(var(--qx-panel-rgb), 0.74);
}

/* ── 0.2.0 桌面端标题栏：毛玻璃横带 + 消除原生按钮色块 ──
   html[data-windows-titlebar] 下，框架::before 是整条拖拽横带（应用/编辑
   菜单与窗口控件都浮在上面），中列另被卡片化（16px 圆角）——画卷在顶栏处
   被切成一条与下方内容分层异色的横带。这里：
   1) 横带改为面板色玻璃底 + 毛玻璃虚化（虚化受「毛玻璃虚化」总开关控制），
      与侧栏玻璃同源，顶部与下方内容连贯；
   2) 中列卡片圆角取消；
   3) 窗口控制按钮的原生实心底色来自 Electron titleBarOverlay（OS 级绘制，
      CSS 画不到，且不接受透明度——皮肤原先的半透明 sidebar-fill 被拆成
      不透明色块，就是按钮后面那块补丁）。preload 会测量一个读
      var(--dsw-specific-sidebar-fill) 的隐藏探针元素并经 IPC 发给
      setTitleBarOverlay；皮肤用 !important 把探针背景压成全透明（探针是
      body 下唯一内联引用该令牌的 span，!important 可压过内联样式），preload
      读到 rgba(0,0,0,0) 后 overlay 即变透明，三个窗口按钮成为浮在玻璃
      横带上的纯符号。 */
html[data-windows-titlebar] body[data-dsh-qingxiao] [class*='_frame']::before {
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.9));
}
html[data-windows-titlebar] body[data-dsh-qingxiao][data-qx-frost='on'] [class*='_frame']::before {
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
}
html[data-windows-titlebar] body[data-dsh-qingxiao] [class*='_centerCol'] {
	border-radius: 0;
}
body[data-dsh-qingxiao] > span[style*='--dsw-specific-sidebar-fill'] {
	background-color: transparent !important;
}

/* ── 整页视图毛玻璃背板（插件 / 自动化任务等 _page 页面）──
   0.2.0 的插件页、自动化任务页等整页视图是 [data-slot='main'] 下的
   SECTION[class*='_page']，直接铺在画卷上，文字没有任何垫底（浅色模式下
   尤其糊）。两层处理：
   1) 半透明面板底写在 _page 自身——它是滚动容器，元素背景不随内容滚动，
      常驻生效，不依赖任何开关；
   2) 毛玻璃虚化挂在其非滚动父层 [data-slot='main'] 的 ::before 上（页面
      容器自身滚动，伪元素挂它身上会被卷走）。:has 限定只有 _page 视图才
      挂，不碰会话区；position+z-index:0 让 main 自成层叠上下文，-1 伪元素
      落在 main 内容之下、画卷之上；backdrop-filter 只在伪元素上，无后代、
      不困浮层。虚化受「毛玻璃虚化」总开关控制（默认开），底色不受。
      背板必须用 > 直接子选择器：裸 [class*='_page'] 会连 pageTitle/pageHead
      这类类名一起命中，背板叠背板会浮出一块块白芯片。 */
body[data-dsh-qingxiao] [data-slot='main'] > [class*='_page'] {
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.88));
}
body[data-dsh-qingxiao][data-qx-frost='on'] [data-slot='main']:has(> [class*='_page']) {
	position: relative;
	z-index: 0;
}
body[data-dsh-qingxiao][data-qx-frost='on'] [data-slot='main']:has(> [class*='_page'])::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
}

/* ── 主按钮文字颜色还原 ──
   全局按钮墨色规则 (0,2,2) 会盖掉按钮类的
   var(--dsw-alias-label-primary-foreground)（0,2,0），青碧主按钮的字被涂成
   深墨、发闷。用 (0,3,2) 还回令牌；令牌值已在上面统一为月白。 */
body[data-dsh-qingxiao] [id=root] button[class*='_primary'] {
	color: var(--dsw-alias-label-primary-foreground);
}

/* ── markdown 任务复选框 ──
   DSH 把对话里任务列表的勾选框 accent 设成了次级灰，勾上后灰扑扑的；
   对齐到品牌主色（上面已改为清宵青碧），与整页勾选控件一致。 */
body[data-dsh-qingxiao] [id=root] [class*='_markdown'] input[type='checkbox'] {
	accent-color: var(--dsw-alias-brand-primary);
}

/* ── 底部面板开关 hover 对齐 ──
   右侧栏开关用官方 Button 原语（_ghost_），hover 走皮肤全局青底；
   底部面板开关是底部面板插件自有按钮（*toggleButton*），实测 hover 被
   插件样式截住呈透明底。用 !important 强制与右侧栏开关同款观感。 */
body[data-dsh-qingxiao] [id=root] button[class*='toggleButton']:hover,
body[data-dsh-qingxiao] [id=root] [data-sidebar-right-toggle]:hover {
	background: rgba(var(--qx-cyan-rgb), 0.15) !important;
	box-shadow: 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.4), 0 0 12px rgba(var(--qx-cyan-rgb), 0.22) !important;
	color: var(--qx-accent-strong) !important;
}

/* ── 面板全屏：背板铺满整页，观感与右侧栏完全一致 ──
   全屏面板几何上已是 width:100vw/right:0 铺满视口，但面板本体透明：
   列底色只覆盖右栏那一格，左半边直接透出会话内容。
   这里让面板本体承担整页背板，并使用与 rightbarCol 完全相同的配方：
   面板色 × 0.72 浓度 + 「毛玻璃虚化·原生面板」的强度与饱和（与右栏
   ::after 同参数同开关）——全屏前后颜色、磨砂状态一致；抬 z-index
   盖住输入卡等浮层；右栏列在全屏态让位，避免右侧叠出双倍浓度。 */
body[data-dsh-qingxiao] [data-sidebar-right-panel='fullscreen'][data-sidebar-right-open] {
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.72));
	z-index: 60;
}
body[data-dsh-qingxiao][data-qx-frost='on'][data-qx-frost-native='on'] [data-sidebar-right-panel='fullscreen'][data-sidebar-right-open]::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	pointer-events: none;
	backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
	-webkit-backdrop-filter: blur(var(--qx-frost-blur)) saturate(1.12);
}
body[data-dsh-qingxiao]:has([data-sidebar-right-panel='fullscreen']) [class*='rightbarCol'] {
	background: transparent !important;
	border-left: 0;
}

/* ── 思考/折叠区展开头：去衬底、不粘顶 ──
   DSH 给展开后的 disclosure 头（思考/工具调用等）做 sticky + bg-base
   衬底（滚动时正文从其下穿过的遮带）。在画卷壁纸上无论半透明还是实色，
   这条横带都突兀（「颜色不对的行」）。改为不粘顶、无衬底：头行随内容
   滚走，视觉与相邻行完全一致，也就不需要任何衬底。 */
body[data-dsh-qingxiao] [id=root] [data-open] [data-disclosure-header] {
	position: static;
	background: transparent;
}
/* 消息压缩行按钮同样是 sticky+bg-base 遮带（同类），一并去衬底不粘顶 */
body[data-dsh-qingxiao] [id=root] [class*='compactionButton'] {
	position: static;
	background: transparent;
}

/* ── 设置页「人格」栏 ── */
body[data-dsh-qingxiao] .qx-persona {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 4px 2px 12px;
	max-width: 780px;
}
body[data-dsh-qingxiao] .qx-persona-desc {
	margin: 0;
	font-size: 13px;
	line-height: 20px;
	opacity: .8;
}
body[data-dsh-qingxiao] .qx-persona-desc code {
	padding: 1px 5px;
	border-radius: 5px;
	background: rgba(var(--qx-cyan-rgb), 0.12);
	font-size: 12px;
}
body[data-dsh-qingxiao] .qx-persona-conflict {
	border: 1px solid rgba(214, 158, 74, 0.55);
	background: rgba(214, 158, 74, 0.12);
	border-radius: 12px;
	padding: 11px 14px;
	display: flex;
	flex-direction: column;
	gap: 4px;
}
body[data-dsh-qingxiao] .qx-persona-conflict-title {
	font-size: 13px;
	font-weight: 600;
	letter-spacing: .03em;
}
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) .qx-persona-conflict-title { color: #8A5A12; }
body[data-dsh-qingxiao][data-ds-dark-theme] .qx-persona-conflict-title { color: #E8C98F; }
body[data-dsh-qingxiao] .qx-persona-conflict-body {
	font-size: 12px;
	line-height: 1.65;
	opacity: .82;
}
body[data-dsh-qingxiao] .qx-persona-card {
	border: 1px solid var(--qx-panel-border);
	border-radius: 14px;
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.5));
	padding: 13px 16px 14px;
	display: flex;
	flex-direction: column;
	gap: 2px;
}
body[data-dsh-qingxiao] .qx-persona-card-title {
	font-size: 13px;
	font-weight: 600;
	letter-spacing: .04em;
	display: flex;
	align-items: center;
	gap: 8px;
	padding-bottom: 9px;
	margin-bottom: 6px;
	border-bottom: 1px solid rgba(var(--qx-cyan-rgb), 0.14);
}
body[data-dsh-qingxiao] .qx-persona-card-title::before {
	content: "";
	flex: none;
	width: 3px;
	height: 13px;
	border-radius: 2px;
	background: linear-gradient(180deg, var(--qx-cyan-bright), var(--qx-jade));
}
body[data-dsh-qingxiao] .qx-persona-card-title-spacer, body[data-dsh-qingxiao] .qx-persona-tabs-spacer { flex: 1 1 auto; }
body[data-dsh-qingxiao] .qx-persona-tag {
	font-size: 11px;
	font-weight: 500;
	padding: 1px 8px;
	border-radius: 999px;
	border: 1px solid rgba(var(--qx-cyan-rgb), 0.5);
	color: var(--qx-accent-strong);
}
body[data-dsh-qingxiao] .qx-persona-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 7px 0;
	font-size: 13px;
	min-height: 34px;
}
body[data-dsh-qingxiao] .qx-persona-row-label { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
body[data-dsh-qingxiao] .qx-persona-row-control { flex: none; display: flex; align-items: center; }
body[data-dsh-qingxiao] .qx-persona-row-hint { font-size: 11.5px; opacity: .55; line-height: 1.5; font-weight: 400; }
body[data-dsh-qingxiao] .qx-persona-switch {
	width: 40px; height: 22px; border-radius: 999px;
	border: 1px solid var(--qx-panel-border-strong);
	background: var(--qx-sink);
	position: relative; cursor: pointer; padding: 0; flex: none;
}
body[data-dsh-qingxiao] .qx-persona-switch i {
	content: ""; position: absolute; top: 3px; left: 3px;
	width: 14px; height: 14px; border-radius: 50%;
	background: var(--qx-text-faint);
	transition: left .16s ease, background .16s ease;
	display: block;
}
body[data-dsh-qingxiao] .qx-persona-switch.on { background: rgba(var(--qx-cyan-rgb), 0.35); border-color: rgba(var(--qx-cyan-rgb), 0.7); }
body[data-dsh-qingxiao] .qx-persona-switch.on i { left: 21px; background: var(--qx-cyan-bright); box-shadow: 0 0 6px rgba(var(--qx-cyan-rgb), 0.8); }
body[data-dsh-qingxiao] .qx-persona-seg { display: flex; gap: 2px; padding: 3px; border-radius: 9px; background: var(--qx-sink); }
body[data-dsh-qingxiao] .qx-persona-seg-btn {
	border: 0; background: transparent; cursor: pointer;
	font-size: 12px; padding: 4px 12px; border-radius: 7px; color: inherit; opacity: .75;
}
body[data-dsh-qingxiao] .qx-persona-seg-btn.on { background: rgba(var(--qx-cyan-rgb), 0.22); opacity: 1; color: var(--qx-accent-strong); font-weight: 600; }
body[data-dsh-qingxiao] .qx-persona-badge { font-size: 12px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--qx-panel-border); opacity: .8; }
body[data-dsh-qingxiao] .qx-persona-badge.ok { border-color: rgba(var(--qx-cyan-rgb), 0.7); color: var(--qx-accent-strong); background: rgba(var(--qx-cyan-rgb), 0.12); }
body[data-dsh-qingxiao] .qx-persona-input, body[data-dsh-qingxiao] .qx-persona-select {
	min-width: 180px; max-width: 280px; height: 30px; box-sizing: border-box;
	font-size: 13px; padding: 0 10px;
	border-radius: 8px; border: 1px solid var(--qx-panel-border);
	background: rgba(var(--qx-panel-rgb), calc(var(--qx-panel-alpha) * 0.6));
	color: inherit;
}
body[data-dsh-qingxiao] .qx-persona-input:focus, body[data-dsh-qingxiao] .qx-persona-select:focus, body[data-dsh-qingxiao] .qx-persona-textarea:focus {
	outline: none; border-color: rgba(var(--qx-cyan-rgb), 0.65);
	box-shadow: 0 0 0 2px rgba(var(--qx-cyan-rgb), 0.15);
}
body[data-dsh-qingxiao] .qx-persona-tabs { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
body[data-dsh-qingxiao] .qx-persona-tabs-spacer { flex: 1; }
body[data-dsh-qingxiao] .qx-persona-doc-meta { font-size: 11px; opacity: .5; margin-right: 2px; }
body[data-dsh-qingxiao] .qx-persona-tab {
	border: 1px solid var(--qx-panel-border); background: transparent; color: inherit;
	font-size: 12px; padding: 5px 12px; border-radius: 8px; cursor: pointer; opacity: .75;
	transition: background .12s ease, border-color .12s ease;
}
body[data-dsh-qingxiao] .qx-persona-tab:hover { background: rgba(var(--qx-cyan-rgb), 0.1); }
body[data-dsh-qingxiao] .qx-persona-tab.on { border-color: rgba(var(--qx-cyan-rgb), 0.7); color: var(--qx-accent-strong); background: rgba(var(--qx-cyan-rgb), 0.12); opacity: 1; font-weight: 600; }
body[data-dsh-qingxiao] .qx-persona-doc {
	overflow: auto; box-sizing: border-box;
	border-radius: 10px; border: 1px solid var(--qx-panel-border);
	background: rgba(10, 26, 40, 0.55);
	user-select: text; cursor: text;
}
body[data-dsh-qingxiao] .qx-persona-doc-modal { flex: 1 1 auto; min-height: 320px; max-height: calc(100vh - 300px); }
body[data-dsh-qingxiao] .qx-persona-doc pre {
	margin: 0; padding: 10px 12px;
	font-family: var(--ds-font-family-code, ui-monospace, monospace); font-size: 12px; line-height: 1.75;
	color: #D9EDF5;
	white-space: pre-wrap; word-break: break-word;
}
body[data-dsh-qingxiao] .qx-persona-textarea {
	width: 100%; min-height: 220px; resize: vertical; box-sizing: border-box;
	font-family: var(--ds-font-family-code, ui-monospace, monospace); font-size: 12px; line-height: 1.6;
	border-radius: 10px; border: 1px solid var(--qx-panel-border);
	background: rgba(10, 26, 40, 0.55); color: #D9EDF5; padding: 10px 12px;
}
body[data-dsh-qingxiao] .qx-persona-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
body[data-dsh-qingxiao] .qx-persona-btn {
	display: inline-flex; align-items: center; gap: 6px; height: 30px; box-sizing: border-box;
	border: 1px solid var(--qx-panel-border-strong); background: rgba(var(--qx-cyan-rgb), 0.12);
	color: inherit; border-radius: 8px; padding: 0 13px; font-size: 12px; cursor: pointer;
	text-decoration: none; white-space: nowrap;
	transition: background .12s ease, border-color .12s ease;
}
body[data-dsh-qingxiao] .qx-persona-btn:hover { background: rgba(var(--qx-cyan-rgb), 0.24); }
body[data-dsh-qingxiao] .qx-persona-btn.primary { background: var(--qx-jade); border-color: var(--qx-jade); color: #F4F9FC; font-weight: 600; }
body[data-dsh-qingxiao] .qx-persona-btn.primary:hover { background: #26837E; }
body[data-dsh-qingxiao] .qx-persona-btn.danger { border-color: rgba(217, 138, 138, 0.6); background: rgba(217, 138, 138, 0.14); color: #E6B7B7; }
body[data-dsh-qingxiao] .qx-persona-btn.danger:hover { background: rgba(217, 138, 138, 0.28); }
body[data-dsh-qingxiao] .qx-persona-doc-who { font-size: 11.5px; opacity: .6; }
body[data-dsh-qingxiao] .qx-persona-doc-note { font-size: 11.5px; opacity: .55; line-height: 1.5; margin: -2px 0 8px; }
body[data-dsh-qingxiao] .qx-persona-lib { display: flex; flex-direction: column; gap: 6px; margin-top: 2px; }
body[data-dsh-qingxiao] .qx-persona-lib-row {
	display: flex; align-items: center; justify-content: space-between; gap: 10px;
	padding: 8px 10px; border-radius: 10px;
	border: 1px solid var(--qx-panel-border); background: rgba(var(--qx-cyan-rgb), 0.05);
}
body[data-dsh-qingxiao] .qx-persona-lib-row.active { border-color: rgba(var(--qx-cyan-rgb), 0.55); background: rgba(var(--qx-cyan-rgb), 0.12); }
body[data-dsh-qingxiao] .qx-persona-lib-main { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto; }
body[data-dsh-qingxiao] .qx-persona-avatar {
	flex: none;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: 600;
	color: var(--qx-accent-strong);
	background: rgba(var(--qx-cyan-rgb), 0.12);
	border: 1px solid rgba(var(--qx-cyan-rgb), 0.45);
}
body[data-dsh-qingxiao] .qx-persona-lib-name { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
body[data-dsh-qingxiao] .qx-persona-lib-actions { display: flex; align-items: center; gap: 6px; flex: none; flex-wrap: wrap; justify-content: flex-end; }
body[data-dsh-qingxiao] .qx-persona-lib-rename { height: 28px; min-width: 120px; max-width: 200px; }
body[data-dsh-qingxiao] .qx-persona-lib-empty { font-size: 11.5px; opacity: .55; line-height: 1.6; padding: 4px 2px 2px; }
body[data-dsh-qingxiao] .qx-persona-session-hint { font-size: 11.5px; opacity: .6; line-height: 1.6; margin-top: 6px; padding-top: 8px; border-top: 1px dashed rgba(var(--qx-cyan-rgb), 0.16); }
body[data-dsh-qingxiao] .qx-persona-session-notice {
	font-size: 12px; line-height: 1.6; margin-top: 8px; padding: 8px 10px; border-radius: 9px;
	color: var(--qx-accent-strong); background: rgba(var(--qx-cyan-rgb), 0.14);
	border: 1px solid rgba(var(--qx-cyan-rgb), 0.5);
}
/* 新会话 hero 区「人格」键（与模式键同规格） */
body[data-dsh-qingxiao] .qx-hero-persona { position: relative; display: inline-flex; }
body[data-dsh-qingxiao] .qx-hero-persona-btn {
	display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 8px;
	font-size: 13px; line-height: 1.5; border-radius: 10px; border: 0; background: transparent;
	color: var(--dsw-alias-label-primary-foreground, #EAF6FB); cursor: pointer;
}
body[data-dsh-qingxiao] .qx-hero-persona-btn:hover,
body[data-dsh-qingxiao] .qx-hero-persona-btn.on { background: rgba(var(--qx-cyan-rgb), 0.16); }
body[data-dsh-qingxiao] .qx-hero-persona-ico { color: var(--qx-accent-strong); font-size: 12px; line-height: 1.5; }
/* 标签：line-height 不能是 1，否则 CJK 字形下半截被 overflow 裁掉 */
body[data-dsh-qingxiao] .qx-hero-persona-label { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.5; }
body[data-dsh-qingxiao] .qx-hero-persona-caret { opacity: .6; font-size: 10px; }
body[data-dsh-qingxiao] .qx-hero-persona-menu {
	position: fixed; z-index: 2147483260; min-width: 244px; max-width: 320px;
	background: rgba(13, 31, 49, 0.98); border: 1px solid var(--qx-panel-border-strong);
	border-radius: 12px; padding: 6px; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
body[data-dsh-qingxiao] .qx-hero-persona-menu-title { font-size: 11px; opacity: .55; padding: 4px 8px 6px; }
body[data-dsh-qingxiao] .qx-hero-persona-item {
	display: flex; align-items: center; gap: 8px; width: 100%; text-align: left;
	border: 0; background: transparent; color: inherit; font-size: 13px; padding: 7px 8px; border-radius: 8px; cursor: pointer;
}
/* 提高特异性（带 .qx-hero-persona-menu），避免被 DSH 全局 button:hover 压掉 */
body[data-dsh-qingxiao] .qx-hero-persona-menu .qx-hero-persona-item:hover {
	background: rgba(var(--qx-cyan-rgb), 0.24);
	box-shadow: inset 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.5);
}
body[data-dsh-qingxiao] .qx-hero-persona-menu .qx-hero-persona-item:hover .qx-hero-persona-item-name { color: var(--qx-accent-strong); }
body[data-dsh-qingxiao] .qx-hero-persona-menu .qx-hero-persona-item.on { background: rgba(var(--qx-cyan-rgb), 0.2); }
body[data-dsh-qingxiao] .qx-hero-persona-menu .qx-hero-persona-item.on:hover { background: rgba(var(--qx-cyan-rgb), 0.32); }
body[data-dsh-qingxiao] .qx-hero-persona-item-name { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
body[data-dsh-qingxiao] .qx-hero-persona-item-tag { font-size: 10px; opacity: .6; border: 1px solid var(--qx-panel-border); border-radius: 999px; padding: 0 6px; }
body[data-dsh-qingxiao] .qx-hero-persona-item-check { color: var(--qx-accent-strong); font-weight: 700; }
body[data-dsh-qingxiao] .qx-hero-persona-menu-tip { font-size: 11px; opacity: .6; line-height: 1.5; padding: 8px; margin-top: 4px; border-top: 1px solid var(--qx-panel-border); }
body[data-dsh-qingxiao] .qx-hero-persona-btn.off { color: var(--qx-text-faint, #9DB4C4); }
body[data-dsh-qingxiao] .qx-hero-persona-btn.off .qx-hero-persona-ico { color: var(--qx-text-faint, #9DB4C4); }
body[data-dsh-qingxiao] .qx-hero-persona-divider { height: 1px; margin: 4px 6px; background: var(--qx-panel-border); }
body[data-dsh-qingxiao] .qx-hero-persona-off .qx-hero-persona-item-name { opacity: .85; }
body[data-dsh-qingxiao] .qx-persona-cmd { font-size: 11px; padding: 3px 8px; border-radius: 6px; background: rgba(var(--qx-cyan-rgb), 0.1); }
body[data-dsh-qingxiao] .qx-persona-forge a { color: var(--qx-accent-strong); }
body[data-dsh-qingxiao] .qx-persona-status { font-size: 12px; min-height: 16px; color: var(--qx-accent-strong); }
body[data-dsh-qingxiao] .qx-persona-status.bad { color: #D98A8A; }
body[data-dsh-qingxiao] .qx-persona-btn:disabled, body[data-dsh-qingxiao] .qx-persona-switch:disabled { opacity: .45; cursor: default; }
/* 人格文档编辑弹窗 */
body[data-dsh-qingxiao] .qx-persona-modal-mask {
	position: fixed; inset: 0; z-index: 2147483000;
	display: flex; align-items: center; justify-content: center;
	background: rgba(6, 14, 24, 0.55);
	backdrop-filter: blur(3px) saturate(1.05);
	-webkit-backdrop-filter: blur(3px) saturate(1.05);
}
body[data-dsh-qingxiao] .qx-persona-modal {
	width: min(760px, calc(100vw - 48px));
	max-height: calc(100vh - 96px);
	display: flex; flex-direction: column; gap: 12px;
	padding: 18px 20px 16px;
	border-radius: 16px;
	border: 1px solid var(--qx-panel-border-strong);
	background: rgba(13, 31, 49, 0.97);
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.12);
	animation: qx-persona-modal-in 0.16s ease;
}
@keyframes qx-persona-modal-in {
	from { opacity: 0; transform: translateY(8px) scale(0.99); }
	to { opacity: 1; transform: none; }
}
/* 0.8.1 首次安装引导 */
body[data-dsh-qingxiao] [data-skin-chrome='onboard'] {
	position: fixed; inset: 0; z-index: 80;
	display: flex; align-items: center; justify-content: center;
	padding: 16px;
	background: rgba(4, 14, 22, 0.52);
	backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
body[data-dsh-qingxiao] .qx-onboard-card {
	width: min(500px, 100%);
	padding: 22px 22px 18px;
	border-radius: 18px;
	border: 1px solid var(--qx-panel-border-strong);
	background: rgba(var(--qx-panel-rgb), 0.97);
	color: var(--qx-text);
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(var(--qx-cyan-rgb), 0.12);
	animation: qx-persona-modal-in 0.18s ease;
}
body[data-dsh-qingxiao] .qx-onboard-badge { font-size: 10.5px; letter-spacing: .12em; color: var(--qx-accent-strong); }
body[data-dsh-qingxiao] .qx-onboard-title { margin-top: 7px; font-size: 17px; font-weight: 600; }
body[data-dsh-qingxiao] .qx-onboard-body { margin-top: 8px; font-size: 12.5px; line-height: 1.8; opacity: .84; }
body[data-dsh-qingxiao] .qx-onboard-body b { color: var(--qx-accent-strong); font-weight: 600; }
body[data-dsh-qingxiao] .qx-onboard-dots { display: flex; gap: 6px; margin-top: 16px; }
body[data-dsh-qingxiao] .qx-onboard-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--qx-panel-border-strong); transition: width .16s ease; }
body[data-dsh-qingxiao] .qx-onboard-dot[data-on='true'] { width: 16px; background: var(--qx-accent-strong); }
body[data-dsh-qingxiao] .qx-onboard-actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 18px; }
body[data-dsh-qingxiao] .qx-onboard-btn {
	height: 30px; padding: 0 14px; border-radius: 9px;
	border: 1px solid var(--qx-panel-border); background: transparent;
	color: var(--qx-text); font-size: 12px; cursor: pointer;
}
body[data-dsh-qingxiao] .qx-onboard-btn:hover { background: rgba(var(--qx-cyan-rgb), 0.14); }
body[data-dsh-qingxiao] .qx-onboard-btn.qx-primary { border-color: transparent; background: var(--qx-accent-strong); color: #061821; font-weight: 600; }
body[data-dsh-qingxiao]:not([data-ds-dark-theme]) .qx-onboard-btn.qx-primary { color: #F4F9FC; }
body[data-dsh-qingxiao] .qx-onboard-btn.qx-primary:hover { filter: brightness(1.06); }
body[data-dsh-qingxiao] [data-skin-chrome='hotkey-toast'] {
	position: fixed; left: 50%; bottom: 26px; z-index: 78;
	transform: translateX(-50%);
	padding: 6px 14px;
	border-radius: 999px;
	border: 1px solid var(--qx-panel-border-strong);
	background: rgba(var(--qx-panel-rgb), 0.94);
	color: var(--qx-text);
	font-size: 12px;
	letter-spacing: .02em;
	box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
	pointer-events: none;
	opacity: 0;
	transition: opacity .15s ease;
}
body[data-dsh-qingxiao] [data-skin-chrome='hotkey-toast'][data-on='true'] { opacity: 1; }
body[data-dsh-qingxiao] .qx-persona-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
body[data-dsh-qingxiao] .qx-persona-modal-titles { display: flex; flex-direction: column; gap: 3px; }
body[data-dsh-qingxiao] .qx-persona-modal-title { font-size: 14px; font-weight: 600; }
body[data-dsh-qingxiao] .qx-persona-modal-sub { font-size: 11.5px; opacity: .6; line-height: 1.5; }
body[data-dsh-qingxiao] .qx-persona-modal-sub code { font-size: 11px; padding: 1px 5px; border-radius: 5px; background: rgba(var(--qx-cyan-rgb), 0.12); }
body[data-dsh-qingxiao] .qx-persona-modal-x {
	flex: none; width: 26px; height: 26px; border-radius: 8px;
	border: 1px solid var(--qx-panel-border); background: transparent; color: inherit;
	font-size: 15px; line-height: 1; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
}
body[data-dsh-qingxiao] .qx-persona-modal-x:hover { background: rgba(var(--qx-cyan-rgb), 0.18); }
body[data-dsh-qingxiao] .qx-persona-modal-textarea { flex: 1; min-height: 320px; max-height: calc(100vh - 320px); }
body[data-dsh-qingxiao] .qx-persona-modal-foot { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
body[data-dsh-qingxiao] .qx-persona-modal-count { font-size: 11px; opacity: .5; }
body[data-dsh-qingxiao] .qx-persona-editor-name { display: flex; align-items: center; gap: 10px; }
body[data-dsh-qingxiao] .qx-persona-editor-name-label { font-size: 12px; opacity: .7; flex: none; }
body[data-dsh-qingxiao] .qx-persona-editor-name .qx-persona-input { flex: 1 1 auto; max-width: none; }
body[data-dsh-qingxiao] .qx-persona-editor-textarea { flex: 1 1 auto; min-height: 220px; max-height: calc(100vh - 360px); }
body[data-dsh-qingxiao] .qx-persona-editor-import { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
body[data-dsh-qingxiao] .qx-persona-editor-import-label { font-size: 11.5px; opacity: .6; }
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
			var paletteSaveQuiet = false;
			var palettePanel = null;
			var particleField = null;
			var particleKey = "";
			// 0.8.0 性能自适应：自动降级状态、最近帧率、降级冷却
			var autoPerfLow = false;
			var lastFps = 0;
			var autoPerfCooldownUntil = 0;
			var autoPerfFrame = 0;
			var autoPerfLastAt = 0;
			var autoPerfLowStreak = 0;
			var autoPerfHighStreak = 0;
			// 0.8.2：失焦暂停、电池省电、最低帧率
			var windowFocused = true;
			var batteryLow = false;
			var lastFpsMin = 0;
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
			// 0.8.1 自定义字体：单独一张 @font-face 表，避免被字号表重写
			var customFontSheet = document.createElement("style");
			customFontSheet.dataset.skinChrome = "custom-font";
			customFontSheet.dataset.skinOwner = SKIN_OWNER;
			document.head.append(customFontSheet);
			function syncCustomFontSheet() {
				var font = paletteSettings.customFont;
				customFontSheet.textContent = font && font.data
					? '@font-face{font-family:"QX Custom";src:url("' + font.data + '");font-display:swap;}'
					: "";
			}
			function qxFontStackWithCustom(list, id) {
				if (id === "custom" && paletteSettings.customFont) return '"QX Custom", ' + qxFontStack(list, "system");
				return qxFontStack(list, id);
			}
			// 0.7.0 强调色样式表：默认青碧且未自定义时保持为空，观感零变化。
			var accentSheet = document.createElement("style");
			accentSheet.dataset.skinChrome = "accent";
			accentSheet.dataset.skinOwner = SKIN_OWNER;
			document.head.append(accentSheet);
			var appliedFontKey = null;
			var appliedAccentKey = null;
			function syncFontScaleSheet() {
				var scale = clamp(paletteSettings.fontScale, 85, 125) / 100;
				var lineHeight = clamp(Number(paletteSettings.lineHeight) || QX_LINE_BASE, 1.3, 2.0);
				// 行高变化也要重算字体表，否则只拖行高会被旧缓存挡住
				var key = scale + "|" + lineHeight;
				if (key === appliedFontKey) return;
				appliedFontKey = key;
				fontSheet.textContent = buildFontScaleCss(scale, { lineHeight: lineHeight });
			}
			function syncAccentSheet() {
				var accent = qxResolveAccent(paletteSettings);
				var key = accent.isDefault ? "default" : accent.base;
				if (key === appliedAccentKey) return;
				appliedAccentKey = key;
				accentSheet.textContent = buildAccentCss(accent);
				syncPresetState();
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

			// 首次安装：服务端已把 ui-theme 偏好写成深色；本次会话也先切到深色显示。
			if (typeof fetch === "function") {
				fetch("/api/dsh-qingxiao/theme-default")
					.then(function(response) { return response.ok ? response.json() : null; })
					.then(function(data) {
						if (data && data.ok && data.appliedNow && !isDarkMode(body)) {
							body.setAttribute("data-ds-dark-theme", "");
						}
					})
					.catch(function() {});
			}

			// 输入时自动压暗：固定层位于壁纸之上、内容之下（z-index:-1）
			var bgDimEl = document.createElement("div");
			bgDimEl.dataset.skinChrome = "bg-dim";
			bgDimEl.dataset.skinOwner = SKIN_OWNER;
			body.append(bgDimEl);
			function isComposerTarget(t) {
				return !!(t && t.closest && t.closest("[data-composer-card], [data-composer-input]"));
			}
			function syncBgDim() {
				if (!paletteSettings.bgAutoDim) { body.removeAttribute("data-qx-dim"); return; }
				if (isComposerTarget(document.activeElement)) body.setAttribute("data-qx-dim", "on");
			}
			function onDimFocusIn(e) {
				if (paletteSettings.bgAutoDim && isComposerTarget(e.target)) body.setAttribute("data-qx-dim", "on");
			}
			function onDimFocusOut(e) {
				if (isComposerTarget(e.target)) body.removeAttribute("data-qx-dim");
			}
			document.addEventListener("focusin", onDimFocusIn, true);
			document.addEventListener("focusout", onDimFocusOut, true);

			// 液态玻璃：光标高光。移动时只写 transform 与 data-on，不再每帧写
			// 继承型自定义属性（那会让整棵文档重新计算样式，正是卡顿的来源）。
			function setComposerPointerGlow(card, on) {
				var clip = ensureComposerGlow(card);
				if (!clip) return;
				var value = on ? "true" : "false";
				if (clip.getAttribute("data-on") !== value) clip.setAttribute("data-on", value);
			}
			// 高光层挂到 composer card 里：外层裁剪成卡片圆角，内层圆斑只改
			// transform。搬动由合成器完成，不重绘玻璃背景，所以跟手。
			function ensureComposerGlow(card) {
				if (!card || !card.closest("[id=root]")) return null;
				var cached = card.__qxGlowClip;
				if (cached && cached.isConnected && cached.parentElement === card) return cached;
				var clip = null;
				for (var node = card.firstElementChild; node; node = node.nextElementSibling) {
					if (node.hasAttribute && node.hasAttribute("data-qx-composer-glow")) { clip = node; break; }
				}
				if (!clip) {
					clip = document.createElement("div");
					clip.setAttribute("data-qx-composer-glow", "");
					clip.setAttribute("aria-hidden", "true");
					clip.appendChild(document.createElement("i"));
					card.insertBefore(clip, card.firstChild);
				}
				if (!clip.firstElementChild) clip.appendChild(document.createElement("i"));
				card.__qxGlowClip = clip;
				return clip;
			}
			function moveComposerGlow(card, clip, x, y, forceRect) {
				if (!clip) return;
				var dot = clip.firstElementChild;
				if (!dot) return;
				var now = performance.now();
				var rect = clip.__qxRect;
				if (!rect || forceRect || now - (clip.__qxRectAt || 0) > 250) {
					rect = card.getBoundingClientRect();
					if (!rect.width || !rect.height) return;
					clip.__qxRect = rect;
					clip.__qxRectAt = now;
				}
				// 圆斑 320px，让中心落在光标上
				dot.style.transform = "translate3d(" + (x - rect.left - 160).toFixed(1) + "px," + (y - rect.top - 160).toFixed(1) + "px,0)";
			}
			// 流式输出时宿主会频繁重排 DOM，装饰层由 MutationObserver 补齐；
			// 指针事件本身只做两次轻量 DOM 写，直接更新，不再等 rAF。
			function ensureComposerFx(card) {
				if (!card || !card.closest("[id=root]")) return;
				var hasFx = false;
				var hasRing = false;
				for (var node = card.firstElementChild; node; node = node.nextElementSibling) {
					if (node.hasAttribute && node.hasAttribute("data-qx-composer-fx")) hasFx = true;
					if (node.hasAttribute && node.hasAttribute("data-qx-composer-ring")) hasRing = true;
				}
				if (!hasFx) {
					var fx = document.createElement("div");
					fx.setAttribute("data-qx-composer-fx", "");
					fx.setAttribute("aria-hidden", "true");
					["qx-fx-sheen", "qx-fx-aurora a", "qx-fx-aurora b", "qx-fx-aurora c", "qx-fx-breath"].forEach(function(className) {
						var layer = document.createElement("b");
						className.split(" ").forEach(function(name) { layer.classList.add(name); });
						fx.appendChild(layer);
					});
					card.insertBefore(fx, card.firstChild);
				}
				if (!hasRing) {
					var ring = document.createElement("div");
					ring.setAttribute("data-qx-composer-ring", "");
					ring.setAttribute("aria-hidden", "true");
					ring.appendChild(document.createElement("i"));
					card.insertBefore(ring, card.firstChild);
				}
			}
			var composerGlowFrame = 0;
			var composerGlowPending = null;
			function onComposerPointer(e) {
				if (!paletteSettings.liquidComposer || !paletteSettings.composerGlow) return;
				var card = e.target && e.target.closest ? e.target.closest("[data-composer-card]") : null;
				if (!card) return;
				var clip = ensureComposerGlow(card);
				if (!clip) return;
				composerGlowPending = { card: card, clip: clip, x: e.clientX, y: e.clientY };
				if (composerGlowFrame) return;
				// 每帧只写一次 transform：高回报率鼠标一帧能发多个 move 事件，
				// 直接写会变成每事件一次样式重算；rAF 合并后仍是合成器搬动。
				composerGlowFrame = requestAnimationFrame(function() {
					composerGlowFrame = 0;
					var pending = composerGlowPending;
					composerGlowPending = null;
					if (!pending || !pending.clip.isConnected) return;
					moveComposerGlow(pending.card, pending.clip, pending.x, pending.y, false);
					if (pending.clip.getAttribute("data-on") !== "true") pending.clip.setAttribute("data-on", "true");
				});
			}
			function onComposerPointerOver(e) {
				if (!paletteSettings.liquidComposer || !paletteSettings.composerGlow) return;
				var card = e.target && e.target.closest ? e.target.closest("[data-composer-card]") : null;
				if (!card) return;
				// 卡片内部子元素之间移动也会冒泡 pointerover，不必反复量尺寸
				if (e.relatedTarget && card.contains(e.relatedTarget)) return;
				var clip = ensureComposerGlow(card);
				if (!clip) return;
				moveComposerGlow(card, clip, e.clientX, e.clientY, true);
				clip.setAttribute("data-on", "true");
			}
			function onComposerPointerOut(e) {
				var card = e.target && e.target.closest ? e.target.closest("[data-composer-card]") : null;
				if (!card) return;
				if (e.relatedTarget && card.contains(e.relatedTarget)) return;
				// 位置留在元素上，只淡出光晕；不会回到中央再消失
				setComposerPointerGlow(card, false);
			}
			document.addEventListener("pointerover", onComposerPointerOver, true);
			document.addEventListener("pointermove", onComposerPointer, { capture: true, passive: true });
			document.addEventListener("pointerout", onComposerPointerOut, true);
			// 宿主重建 composer 时补齐装饰层；rAF 合并，流式输出每条 token 都改 DOM
			// 也只会在下一帧检查一次。
			var composerFxFrame = 0;
			function syncComposerDecorations() {
				var card = document.querySelector("[id=root] [data-composer-card]");
				if (!card || !card.closest("[id=root]")) return;
				if (!paletteSettings.liquidComposer) {
					card.querySelectorAll("[data-qx-composer-fx], [data-qx-composer-ring], [data-qx-composer-glow]").forEach(function(el) { el.remove(); });
					return;
				}
				ensureComposerFx(card);
				ensureComposerGlow(card);
			}
			var composerFxObserver = new MutationObserver(function() {
				if (composerFxFrame) return;
				composerFxFrame = requestAnimationFrame(function() {
					composerFxFrame = 0;
					syncComposerDecorations();
				});
			});
			composerFxObserver.observe(document.body, { childList: true, subtree: true });
			syncComposerDecorations();

			// 0.6.0 视频壁纸层：video(-3) + 专属 scrim(-2)；bg-dim(-1)、粒子(0) 保持在上方
			var bgVideoWrap = document.createElement("div");
			bgVideoWrap.dataset.skinChrome = "bg-video";
			bgVideoWrap.dataset.skinOwner = SKIN_OWNER;
			bgVideoWrap.dataset.on = "false";
			var bgVideoEl = document.createElement("video");
			bgVideoEl.muted = true;
			bgVideoEl.loop = true;
			bgVideoEl.playsInline = true;
			bgVideoEl.autoplay = true;
			bgVideoEl.preload = "metadata";
			bgVideoEl.setAttribute("muted", "");
			bgVideoEl.setAttribute("playsinline", "");
			bgVideoEl.setAttribute("disablepictureinpicture", "");
			bgVideoWrap.appendChild(bgVideoEl);
			var bgVideoScrim = document.createElement("div");
			bgVideoScrim.dataset.skinChrome = "bg-video-scrim";
			bgVideoScrim.dataset.skinOwner = SKIN_OWNER;
			bgVideoScrim.dataset.on = "false";
			body.append(bgVideoWrap, bgVideoScrim);
			var bgVideoSrcId = null;
			var bgVideoBlobUrl = null;
			var bgVideoFallbackTried = false;
			function videoReduced() {
				return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
			}
			var bgVideoSourceKey = null;
			var bgVideoRemote = false;
			var bgVideoPosterForId = null;
			function videoModeKeys() {
				return isDarkMode(body)
					? { id: "darkVideoId", url: "darkVideoUrl", poster: "darkVideoPosterId" }
					: { id: "lightVideoId", url: "lightVideoUrl", poster: "lightVideoPosterId" };
			}
			function safeVideoUrl(value) {
				if (typeof value !== "string") return null;
				var raw = value.trim();
				if (!/^https?:\/\//i.test(raw) || raw.length > 2048) return null;
				try {
					var url = new URL(raw);
					if (url.username || url.password) return null;
					if (/\.(m3u8|mpd)$/i.test(url.pathname)) return null;
					if (url.protocol === "http:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1" && url.hostname !== "[::1]" && url.hostname !== "::1") return null;
					if (url.protocol !== "http:" && url.protocol !== "https:") return null;
					return url.href;
				} catch (_) { return null; }
			}
			function videoActiveSource() {
				if (!paletteSettings.bgVideoEnabled || videoReduced()) return null;
				var keys = videoModeKeys();
				var id = paletteSettings[keys.id];
				if (typeof id === "string" && /^[a-f0-9]{32}$/i.test(id)) {
					return { kind: "local", id: id, src: videoSrc(id), poster: paletteSettings[keys.poster] };
				}
				var url = safeVideoUrl(paletteSettings[keys.url]);
				if (url) return { kind: "remote", url: url, src: url, poster: null };
				return null;
			}
			function videoSrc(id) { return "/api/dsh-qingxiao/media?id=" + encodeURIComponent(id); }
			function tryPlayVideo() {
				if (!bgVideoEl || !bgVideoEl.getAttribute("src")) return;
				var result = bgVideoEl.play();
				if (result && typeof result.catch === "function") result.catch(function() { /* 自动播放被拒时保留首帧 */ });
			}
			function stopVideo() { try { bgVideoEl.pause(); } catch (_) {} }
			function syncVideo() {
				if (!bgVideoWrap || !bgVideoEl) return;
				var source = videoActiveSource();
				if (!source) {
					stopVideo();
					bgVideoWrap.dataset.on = "false";
					bgVideoScrim.dataset.on = "false";
					bgVideoEl.removeAttribute("poster");
					if (bgVideoSourceKey !== null) {
						bgVideoSourceKey = null;
						bgVideoSrcId = null;
						try { bgVideoEl.removeAttribute("src"); bgVideoEl.load(); } catch (_) {}
					}
					if (bgVideoBlobUrl) { try { URL.revokeObjectURL(bgVideoBlobUrl); } catch (_) {} bgVideoBlobUrl = null; }
					if (paletteSettings.bgVideoEnabled) startBgRotation();
					return;
				}
				var key = source.kind + ":" + (source.id || source.url);
				bgVideoEl.style.objectFit = paletteSettings.bgFit === "contain" ? "contain" : "cover";
				bgVideoEl.style.objectPosition = clamp(paletteSettings.bgFocusX, 0, 100) + "% " + clamp(paletteSettings.bgFocusY, 0, 100) + "%";
				bgVideoEl.poster = source.poster ? videoSrc(source.poster) : "";
				bgVideoWrap.dataset.on = "true";
				bgVideoScrim.dataset.on = "true";
				if (bgVideoSourceKey !== key) {
					bgVideoSourceKey = key;
					bgVideoSrcId = source.kind === "local" ? source.id : null;
					bgVideoRemote = source.kind === "remote";
					bgVideoFallbackTried = false;
					bgVideoPosterForId = null;
					if (bgVideoBlobUrl) { try { URL.revokeObjectURL(bgVideoBlobUrl); } catch (_) {} bgVideoBlobUrl = null; }
					bgVideoEl.src = source.src;
					try { bgVideoEl.load(); } catch (_) {}
					tryPlayVideo();
					if (paletteSettings.bgVideoCompat && source.kind === "local") fallbackVideoBlob();
				} else if (paletteSettings.bgVideoCompat && source.kind === "local" && !bgVideoBlobUrl && !bgVideoFallbackTried) {
					fallbackVideoBlob();
				} else if (!paletteSettings.bgVideoCompat && bgVideoBlobUrl && source.kind === "local") {
					try { URL.revokeObjectURL(bgVideoBlobUrl); } catch (_) {}
					bgVideoBlobUrl = null;
					bgVideoFallbackTried = false;
					bgVideoEl.src = source.src;
					try { bgVideoEl.load(); } catch (_) {}
					tryPlayVideo();
				} else if (bgVideoEl.paused && !document.hidden && !(paletteSettings.bgVideoLowPower && !document.hasFocus())) {
					tryPlayVideo();
				}
				stopBgRotation();
			}
			function fallbackVideoBlob() {
				if (!bgVideoSrcId || bgVideoFallbackTried) return;
				var id = bgVideoSrcId;
				bgVideoFallbackTried = true;
				fetch(videoSrc(id), { cache: "no-store" }).then(function(response) {
					if (!response.ok) throw new Error("HTTP " + response.status);
					return response.blob();
				}).then(function(blob) {
					if (bgVideoSrcId !== id) return;
					bgVideoBlobUrl = URL.createObjectURL(blob);
					bgVideoEl.src = bgVideoBlobUrl;
					try { bgVideoEl.load(); } catch (_) {}
					tryPlayVideo();
					showStatus("✓ 已切换兼容播放（完整下载）");
				}).catch(function() {
					bgVideoWrap.dataset.on = "false";
					bgVideoScrim.dataset.on = "false";
					showStatus("✗ 视频播放失败，已回退静态画卷");
					startBgRotation();
				});
			}
			function captureVideoPoster() {
				if (!bgVideoSrcId || bgVideoRemote || !bgVideoEl || !bgVideoEl.videoWidth || !bgVideoEl.videoHeight) return;
				var id = bgVideoSrcId;
				var keys = videoModeKeys();
				if (paletteSettings[keys.poster] || bgVideoPosterForId === id) return;
				bgVideoPosterForId = id;
				var vw = bgVideoEl.videoWidth;
				var vh = bgVideoEl.videoHeight;
				var scale = Math.min(1, 1280 / Math.max(1, vw));
				var canvas = document.createElement("canvas");
				canvas.width = Math.max(1, Math.round(vw * scale));
				canvas.height = Math.max(1, Math.round(vh * scale));
				try { canvas.getContext("2d").drawImage(bgVideoEl, 0, 0, canvas.width, canvas.height); }
				catch (_) { return; }
				canvas.toBlob(function(blob) {
					if (!blob) return;
					fetch("/api/dsh-qingxiao/media?kind=poster&name=poster.jpg", {
						method: "PUT",
						headers: { "content-type": "image/jpeg" },
						body: blob
					}).then(function(response) {
						return response.json().catch(function() { return null; }).then(function(body) { return { status: response.status, body: body }; });
					}).then(function(result) {
						if (result.status !== 201 || !result.body || !result.body.ok) return;
						if (bgVideoSrcId !== id) return;
						paletteSettings[keys.poster] = result.body.id;
						savePaletteSettings(true);
						if (bgVideoEl) bgVideoEl.poster = videoSrc(result.body.id);
						showStatus("✓ 已生成首帧封面");
					}).catch(function() { /* 封面失败不影响播放 */ });
				}, "image/jpeg", 0.72);
			}
			bgVideoEl.addEventListener("loadeddata", captureVideoPoster);
			bgVideoEl.addEventListener("error", function() {
				if (bgVideoSrcId) fallbackVideoBlob();
				else {
					bgVideoWrap.dataset.on = "false";
					bgVideoScrim.dataset.on = "false";
					showStatus("✗ 远程视频播放失败，已回退静态画卷");
					startBgRotation();
				}
			});
			function onVideoVisibility() {
				if (document.hidden) { stopVideo(); return; }
				if (videoActiveSource() && !(paletteSettings.bgVideoLowPower && !document.hasFocus())) tryPlayVideo();
			}
			function onVideoBlur() { if (paletteSettings.bgVideoLowPower) stopVideo(); }
			function onVideoFocus() { if (videoActiveSource()) tryPlayVideo(); }
			function resumeVideoOnGesture() {
				if (videoActiveSource() && bgVideoEl.paused && !document.hidden) tryPlayVideo();
			}
			document.addEventListener("visibilitychange", onVideoVisibility);
			window.addEventListener("blur", onVideoBlur);
			window.addEventListener("focus", onVideoFocus);
			document.addEventListener("click", resumeVideoOnGesture, true);
			document.addEventListener("keydown", resumeVideoOnGesture, true);
			var videoMotionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
			function onVideoMotionChange() { syncVideo(); }
			if (videoMotionQuery && videoMotionQuery.addEventListener) videoMotionQuery.addEventListener("change", onVideoMotionChange);
			else if (videoMotionQuery && videoMotionQuery.addListener) videoMotionQuery.addListener(onVideoMotionChange);

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
			// 画卷 URL：只接受 http(s)，限制长度，并转义可能破坏 CSS url() 的字符。
			// data URL 由文件上传路径产生，原样保留。
			function safeBgUrl(value) {
				if (typeof value !== "string") return null;
				var raw = value.trim();
				if (!/^https?:\/\//i.test(raw) || raw.length > 2048) return null;
				try {
					var u = new URL(raw);
					if (u.protocol !== "http:" && u.protocol !== "https:") return null;
					return u.href.replace(/["\\\n\r]/g, function(ch) { return encodeURIComponent(ch); });
				} catch (_) { return null; }
			}
			function normalizeBg(value) {
				if (typeof value !== "string" || !value) return null;
				if (/^data:image\//i.test(value)) return value;
				return safeBgUrl(value);
			}

			// URL 轮播：列表只存 http(s) URL，不写入 settings 的大图；轮播开启时
			// 覆盖亮/暗自定义画卷，关闭后恢复。间隔到点只重绘，不写盘。
			var rotationTimer = null;
			var rotationIndex = 0;
			function currentRotationUrl() {
				var list = paletteSettings.bgRotation;
				if (!paletteSettings.bgRotationOn || !Array.isArray(list) || list.length === 0) return null;
				return list[rotationIndex % list.length];
			}
			function stopBgRotation() {
				if (rotationTimer !== null) { clearInterval(rotationTimer); rotationTimer = null; }
			}
			function startBgRotation() {
				stopBgRotation();
				if (videoActiveSource()) return;
				if (!paletteSettings.bgRotationOn) return;
				var list = paletteSettings.bgRotation;
				if (!Array.isArray(list) || list.length === 0) return;
				var minutes = clamp(paletteSettings.bgRotationMinutes, 5, 1440);
				rotationTimer = setInterval(function() {
					rotationIndex = (rotationIndex + 1) % list.length;
					syncBackdrop();
				}, minutes * 60 * 1000);
			}

			var syncBackdrop = function() {
				var dark = isDarkMode(body);
				var rotationUrl = normalizeBg(currentRotationUrl());
				var custom = rotationUrl || (dark ? paletteSettings.darkBackground : paletteSettings.lightBackground);
				var url = normalizeBg(custom) || DEFAULT_BG_URL;
				var strength = clamp(paletteSettings.scrimOpacity, 20, 95) / 100;
				if (paletteSettings.textContrastBoost) strength = clamp(strength * 0.5 + 0.01, 0, 0.45);
				var scrim;
				if (dark) {
					scrim = "linear-gradient(rgba(7,19,31," + (0.05 + 0.22 * strength) + ") 0%,rgba(9,24,38," + (0.045 + 0.19 * strength) + ") 45%,rgba(11,30,46," + (0.06 + 0.2 * strength) + ") 100%)";
				} else {
					// 浅色模式文字更吃底色：比暗色多留一档遮罩，避免亮画卷把深色字冲淡
					scrim = "linear-gradient(rgba(240,248,252," + (0.06 + 0.18 * strength) + ") 0%,rgba(232,244,250," + (0.05 + 0.16 * strength) + ") 45%,rgba(244,249,252," + (0.065 + 0.17 * strength) + ") 100%)";
				}
				var glows = "radial-gradient(52% 42% at 12% 8%,rgba(86,200,192,0.16),transparent 70%)," +
					"radial-gradient(46% 40% at 88% 90%,rgba(217,182,106,0.12),transparent 72%)";
				var fit = paletteSettings.bgFit === "contain" ? "contain" : "cover";
				var fx = clamp(paletteSettings.bgFocusX, 0, 100);
				var fy = clamp(paletteSettings.bgFocusY, 0, 100);
				body.style.setProperty("background-image", scrim + "," + glows + ",url(\"" + url + "\")");
				// 4 层：scrim、两团 glow、画卷；只有最后一层吃焦点与 fit
				body.style.setProperty("background-position", "center, center, center, " + fx + "% " + fy + "%");
				body.style.setProperty("background-size", "auto, auto, auto, " + fit);
				body.style.setProperty("background-attachment", "fixed");
				body.style.setProperty("background-repeat", "no-repeat");
				// 视频壁纸的专属 scrim：与静态画卷同配方，盖在 video 之上
				if (bgVideoScrim) bgVideoScrim.style.backgroundImage = scrim + "," + glows;
			};

			// 0.8.2 壁纸视差：低频更新 background-position，配合 CSS 过渡，避免每帧重绘大图
			var parallaxTimer = 0;
			var parallaxPending = null;
			function applyParallaxOffset(x, y) {
				if (!paletteSettings.bgParallax) return;
				// 只有真的有视频在播时才跳过静态壁纸视差
				if (paletteSettings.bgVideoEnabled && bgVideoEl && bgVideoEl.getAttribute("src") && !bgVideoEl.paused) return;
				if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
				var strength = clamp(Number(paletteSettings.bgParallaxStrength) || 0, 0, 100) / 100;
				var nx = (x / Math.max(1, window.innerWidth) - 0.5) * 2;
				var ny = (y / Math.max(1, window.innerHeight) - 0.5) * 2;
				var fx = clamp(clamp(paletteSettings.bgFocusX, 0, 100) + nx * 4.2 * strength, 0, 100);
				var fy = clamp(clamp(paletteSettings.bgFocusY, 0, 100) + ny * 3.2 * strength, 0, 100);
				body.style.setProperty("background-position", "center, center, center, " + fx.toFixed(2) + "% " + fy.toFixed(2) + "%");
			}
			function onParallaxPointer(e) {
				if (!paletteSettings.bgParallax || document.hidden) return;
				parallaxPending = { x: e.clientX, y: e.clientY };
				if (parallaxTimer) return;
				parallaxTimer = setTimeout(function() {
					parallaxTimer = 0;
					if (!parallaxPending) return;
					applyParallaxOffset(parallaxPending.x, parallaxPending.y);
					parallaxPending = null;
				}, 80);
			}
			window.addEventListener("pointermove", onParallaxPointer, { passive: true });

			// ── 氛围粒子 field：rise 剑气 / snow 雪 / rain 雨 / firefly 星屑 ──
			var buildParticles = function() {
				var style = QX_PARTICLE_STYLES.indexOf(paletteSettings.particleStyle) >= 0 ? paletteSettings.particleStyle : "rise";
				body.setAttribute("data-qx-particles", style);
				var baseCount = Math.round(clamp(paletteSettings.particleCount, 0, 60));
				var intensity = clamp(paletteSettings.effectIntensity, 20, 100) / 100;
				var perfLow = body.getAttribute("data-qx-perf") === "low";
				var count = Math.max(baseCount > 0 ? 1 : 0, Math.round(baseCount * intensity * (perfLow ? 0.5 : 1)));
				var key = (paletteSettings.particles ? "on" : "off") + "|" + count + "|" + paletteSettings.particleSpeed + "|" + style;
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
					var speed = (0.6 + Math.random() * 0.8) * (100 / clamp(paletteSettings.particleSpeed, 20, 200));
					span.style.setProperty("--qx-particle-speed", String(speed));
					span.style.setProperty("--qx-sway", ((Math.random() - 0.5) * 120) + "px");
					if (style === "snow") {
						var flake = 4 + Math.random() * 3;
						span.style.left = (Math.random() * 100) + "%";
						span.style.width = flake.toFixed(1) + "px";
						span.style.height = flake.toFixed(1) + "px";
						span.style.animationDelay = "-" + (Math.random() * 18).toFixed(1) + "s";
					} else if (style === "rain") {
						span.style.left = (Math.random() * 108 - 4) + "%";
						span.style.width = (1 + Math.random()).toFixed(1) + "px";
						span.style.height = (18 + Math.random() * 16).toFixed(0) + "px";
						span.style.animationDelay = "-" + (Math.random() * 3).toFixed(2) + "s";
					} else if (style === "firefly") {
						var glow = 4 + Math.random() * 3.5;
						span.style.left = (4 + Math.random() * 92).toFixed(1) + "%";
						span.style.top = (12 + Math.random() * 70).toFixed(1) + "%";
						span.style.width = glow.toFixed(1) + "px";
						span.style.height = glow.toFixed(1) + "px";
						span.style.animationDelay = "-" + (Math.random() * 9).toFixed(1) + "s";
					} else {
						span.style.left = (Math.random() * 100) + "%";
						span.style.width = (2 + Math.random() * 3) + "px";
						span.style.height = (18 + Math.random() * 30) + "px";
						span.style.animationDelay = "-" + (Math.random() * 30) + "s";
					}
					particleField.appendChild(span);
				}
				body.append(particleField);
			};

			// ── 0.8.0 性能自适应：帧率采样 + 自动降级 + 后台暂停 ──
			function isEffectLow() {
				return paletteSettings.lowPower || autoPerfLow || (paletteSettings.batterySaver && batteryLow);
			}
			var updatePerfStatus = function() {
				var node = document.querySelector('[data-skin-chrome="palette-panel"] .pp-perf-status');
				if (!node) return;
				var label = paletteSettings.lowPower ? "低功耗模式" : (autoPerfLow ? "已自动降级" : ((paletteSettings.batterySaver && batteryLow) ? "电池省电" : "标准"));
				var anims = document.getAnimations ? document.getAnimations().length : 0;
				var particles = document.querySelectorAll("[data-skin-chrome='particle-field'] span").length;
				node.textContent = "当前：" + label
					+ (lastFps ? " · 约 " + Math.round(lastFps) + " FPS" + (lastFpsMin ? "（最低 " + Math.round(lastFpsMin) + "）" : "") : "")
					+ " · 动画 " + anims + " · 粒子 " + particles;
			};
			var syncPerfMode = function() {
				if (isEffectLow()) body.setAttribute("data-qx-perf", "low");
				else body.removeAttribute("data-qx-perf");
				buildParticles();
				updatePerfStatus();
			};
			var syncPauseState = function() {
				var paused = document.visibilityState !== "visible" || (!windowFocused && paletteSettings.autoDegrade);
				if (paused) body.setAttribute("data-qx-paused", "true");
				else body.removeAttribute("data-qx-paused");
			};
			var onPerfVisibility = function() { syncPauseState(); };
			document.addEventListener("visibilitychange", onPerfVisibility);
			var onPerfBlur = function() { windowFocused = false; syncPauseState(); };
			var onPerfFocus = function() { windowFocused = true; syncPauseState(); };
			window.addEventListener("blur", onPerfBlur);
			window.addEventListener("focus", onPerfFocus);
			// 电池省电：低电量且未充电时进入同一低特效档（API 不可用则忽略）
			if (navigator.getBattery) {
				navigator.getBattery().then(function(battery) {
					var updateBattery = function() {
						batteryLow = !battery.charging && battery.level <= 0.2;
						if (!disposed) syncPerfMode();
					};
					battery.addEventListener("levelchange", updateBattery);
					battery.addEventListener("chargingchange", updateBattery);
					updateBattery();
				}).catch(function() {});
			}
			var perfSampleAt = 0;
			var perfSampleFrames = 0;
			var perfTick = function(now) {
				if (disposed) return;
				autoPerfFrame = requestAnimationFrame(perfTick);
				if (document.visibilityState !== "visible") { perfSampleAt = 0; perfSampleFrames = 0; return; }
				if (!perfSampleAt) { perfSampleAt = now; perfSampleFrames = 0; return; }
				perfSampleFrames++;
				var elapsed = now - perfSampleAt;
				if (elapsed < 2000) return;
				lastFps = perfSampleFrames / (elapsed / 1000);
				lastFpsMin = lastFpsMin ? Math.min(lastFpsMin, lastFps) : lastFps;
				perfSampleAt = now;
				perfSampleFrames = 0;
				if (!paletteSettings.autoDegrade || paletteSettings.lowPower) { updatePerfStatus(); return; }
				if (lastFps < 45) { autoPerfLowStreak++; autoPerfHighStreak = 0; }
				else if (lastFps > 55) { autoPerfHighStreak++; autoPerfLowStreak = 0; }
				if (!autoPerfLow) {
					if (autoPerfLowStreak >= 2 && now > autoPerfCooldownUntil) {
						autoPerfLow = true;
						autoPerfLowStreak = 0;
						autoPerfCooldownUntil = now + 30000;
						syncPerfMode();
						return;
					}
				} else if (autoPerfHighStreak >= 3 && now > autoPerfCooldownUntil) {
					autoPerfLow = false;
					autoPerfHighStreak = 0;
					autoPerfCooldownUntil = now + 30000;
					syncPerfMode();
					return;
				}
				updatePerfStatus();
			};
			autoPerfFrame = requestAnimationFrame(perfTick);


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
				syncVideo();
				syncSystemChrome();
				applyCharmState();	// 亮/暗各有一套云纹开关，切换形态要重算
				playFormVeil();
				// 主题切换后重建面板，让「（当前）」标记跟着亮/暗形态走
				if (palettePanelEl) rebuildPanel();
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
				statusLine.dataset.kind = /^\s*✗/.test(text) ? "error" : "ok";
				if (statusTimer) clearTimeout(statusTimer);
				statusTimer = setTimeout(function() {
					statusLine.textContent = "";
					statusLine.removeAttribute("data-kind");
				}, 3200);
			}

			// ── 0.8.1 首次安装引导（只展示一次，可在高级页重看）──
			var onboardEl = null;
			function showOnboarding(force) {
				if (disposed || onboardEl) return;
				if (!force && paletteSettings.onboarded) return;
				var steps = [
					{
						title: "欢迎来到清宵主题插件",
						body: "壁纸、配色、液态输入框都已经就位。右上角的<b>剑钰圆钮</b>可以拖动，点开就是全部设置。"
					},
					{
						title: "先挑一个氛围",
						body: "主题页有<b>六套场景</b>：清昼、玄夜、剑鸣、雪霁、夜雨、星屑。点一下同时切换配色、流光与动效，不会覆盖你的画卷。"
					},
					{
						title: "卡了就把特效调低",
						body: "界面 → 性能与特效可以调<b>特效强度</b>，掉帧会自动降级。快捷键默认是 <b>Ctrl+Alt+Q</b> 面板、<b>Ctrl+Alt+E</b> 场景、<b>F9</b> 磨砂、<b>Ctrl+Alt+L</b> 液态输入框，被系统占用时可在高级页重新录制。"
					}
				];
				var index = 0;
				var overlay = document.createElement("div");
				overlay.setAttribute("data-skin-chrome", "onboard");
				overlay.setAttribute("data-skin-owner", SKIN_OWNER);
				overlay.setAttribute("role", "dialog");
				overlay.setAttribute("aria-modal", "true");
				overlay.setAttribute("aria-label", "新手引导");
				var card = document.createElement("div");
				card.className = "qx-onboard-card";
				var badge = document.createElement("div");
				badge.className = "qx-onboard-badge";
				badge.textContent = "新手引导";
				var title = document.createElement("div");
				title.className = "qx-onboard-title";
				var bodyEl = document.createElement("div");
				bodyEl.className = "qx-onboard-body";
				var dots = document.createElement("div");
				dots.className = "qx-onboard-dots";
				var dotEls = steps.map(function() {
					var dot = document.createElement("span");
					dot.className = "qx-onboard-dot";
					dots.appendChild(dot);
					return dot;
				});
				var actions = document.createElement("div");
				actions.className = "qx-onboard-actions";
				var skip = document.createElement("button");
				skip.type = "button";
				skip.className = "qx-onboard-btn";
				skip.textContent = "跳过";
				var next = document.createElement("button");
				next.type = "button";
				next.className = "qx-onboard-btn qx-primary";
				var spacer = document.createElement("span");
				actions.append(skip, spacer, next);
				card.append(badge, title, bodyEl, dots, actions);
				overlay.appendChild(card);
				function close() {
					paletteSettings.onboarded = true;
					savePaletteSettings();
					overlay.remove();
					onboardEl = null;
					document.removeEventListener("keydown", onKey, true);
				}
				function render() {
					title.textContent = steps[index].title;
					bodyEl.innerHTML = steps[index].body;
					dotEls.forEach(function(dot, i) { dot.dataset.on = i === index ? "true" : "false"; });
					next.textContent = index === steps.length - 1 ? "开始使用" : "下一步";
				}
				function onKey(e) { if (e.key === "Escape") { e.preventDefault(); close(); } }
				skip.addEventListener("click", close);
				next.addEventListener("click", function() {
					if (index >= steps.length - 1) { close(); return; }
					index += 1;
					render();
				});
				overlay.addEventListener("click", function(e) { if (e.target === overlay) close(); });
				document.addEventListener("keydown", onKey, true);
				render();
				body.appendChild(overlay);
				onboardEl = overlay;
			}

			function mergePaletteSettings(saved) {
				if (!saved || typeof saved !== "object") return;
				for (var key in PALETTE_DEFAULTS) {
					if (Object.prototype.hasOwnProperty.call(saved, key)) paletteSettings[key] = saved[key];
				}
				// 0.7.0：localStorage 镜像/手改配置可能带非法值，合并后兜底，
				// 避免非法枚举或颜色把生成样式写坏。
				if (paletteSettings.fontUi !== "custom" && !qxHasId(QX_FONT_UI, paletteSettings.fontUi)) paletteSettings.fontUi = "system";
				if (paletteSettings.fontCode !== "custom" && !qxHasId(QX_FONT_CODE, paletteSettings.fontCode)) paletteSettings.fontCode = "system";
				if (!qxHasId(QX_PALETTES, paletteSettings.paletteId)) paletteSettings.paletteId = "jade";
				if (paletteSettings.accentColor === null || paletteSettings.accentColor === undefined) {
					paletteSettings.accentColor = null;
				} else {
					paletteSettings.accentColor = qxNormalizeHex(paletteSettings.accentColor);
				}
				paletteSettings.lineHeight = clamp(Number(paletteSettings.lineHeight) || 1.7, 1.3, 2.0);
				paletteSettings.letterSpacing = clamp(Number(paletteSettings.letterSpacing) || 0, -0.02, 0.08);
				["hotkeyPanel", "hotkeyScene", "hotkeyBlur", "hotkeyLiquid"].forEach(function(key) {
					if (typeof paletteSettings[key] !== "string" || !comboIsUsable(paletteSettings[key])) {
						paletteSettings[key] = PALETTE_DEFAULTS[key];
					}
				});
				if (!scenePreset(paletteSettings.sceneDay)) paletteSettings.sceneDay = "qingzhou";
				if (!scenePreset(paletteSettings.sceneNight)) paletteSettings.sceneNight = "xuanye";
				if (!paletteSettings.customFont || typeof paletteSettings.customFont !== "object"
					|| typeof paletteSettings.customFont.name !== "string" || typeof paletteSettings.customFont.data !== "string"
					|| paletteSettings.customFont.data.indexOf("data:") !== 0) paletteSettings.customFont = null;
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
				var payload = JSON.stringify({ settings: palettePayload() });
				// 服务端 body 上限 32MB；两张 10MB 原图的 base64 合计已接近 28MB。
				// 超限时先给可见提示，别发出一个注定失败的请求（旧版会静默丢图）。
				if (payload.length > 30 * 1024 * 1024) {
					showStatus("✗ 图片太大，保存被跳过（亮/暗两套背景请合计控制在 ~20MB 内）");
					return;
				}
				fetch(SETTINGS_URL, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: payload
				}).then(function(response) {
					if (!response.ok) throw new Error("HTTP " + response.status);
					// 背景/复原等操作会自带更具体的提示，quiet 保存不覆盖它
					if (!paletteSaveQuiet) showStatus("✓ 已保存");
				}).catch(function(error) {
					paletteDirty = true;
					try {
						localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(palettePayload()));
						showStatus("✓ 已保存（本地）");
						paletteDirty = false;
					} catch (_) {
						// 服务端与本地都存不下（典型是超大背景）：必须让用户看见，
						// 不能只留一条 console.warn。
						showStatus("✗ 保存失败：图片超出服务器与本地容量上限，请换小一点的图");
						console.warn("[qingxiao] palette settings save failed:", error.message || error);
					}
				});
			}

			function savePaletteSettings(quiet) {
				paletteSaveQuiet = !!quiet;
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
						syncSceneRotation(true);
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
							syncSceneRotation(true);
						} catch (_) {}
					});
			}

			// 0.8.2 节日彩蛋：固定公历日期，只加一点鎏金氛围 + 当天一次提示
			function holidayForToday() {
				var now = new Date();
				var md = (now.getMonth() + 1) + "-" + now.getDate();
				if (md === "1-1") return { id: "newyear", label: "元旦" };
				if (md >= "10-1" && md <= "10-7") return { id: "national", label: "国庆" };
				if (md === "12-24" || md === "12-25" || md === "12-26") return { id: "christmas", label: "圣诞" };
				return null;
			}
			function applyHolidayState() {
				var holiday = paletteSettings.holidayEggs ? holidayForToday() : null;
				if (!holiday) { body.removeAttribute("data-qx-holiday"); return; }
				body.setAttribute("data-qx-holiday", holiday.id);
				try {
					var key = "qx-holiday-" + new Date().toISOString().slice(0, 10);
					if (!localStorage.getItem(key)) {
						localStorage.setItem(key, "1");
						setTimeout(function() { if (!disposed) hotkeyToast(holiday.label + "快乐 · 清宵与你同贺"); }, 2500);
					}
				} catch (_) {}
			}

			function applyPaletteSettings() {
				if (disposed) return;
				// toggles → body attributes
				if (paletteSettings.textContrastBoost) body.setAttribute("data-qx-contrast", "on");
				else body.removeAttribute("data-qx-contrast");
				if (paletteSettings.panelBlur) body.setAttribute("data-qx-blur", "on");
				else body.removeAttribute("data-qx-blur");
				if (paletteSettings.liquidComposer) body.setAttribute("data-qx-composer", "liquid");
				else body.removeAttribute("data-qx-composer");
				if (!paletteSettings.liquidComposer || !paletteSettings.composerGlow) {
					body.style.setProperty("--qx-pointer-core", "0");
					body.style.setProperty("--qx-pointer-halo", "0");
					document.querySelectorAll("[data-composer-card]").forEach(function(card) {
						card.style.setProperty("--qx-pointer-core", "0");
						card.style.setProperty("--qx-pointer-halo", "0");
					});
					document.querySelectorAll("[data-qx-composer-glow]").forEach(function(clip) {
						clip.setAttribute("data-on", "false");
					});
				}
				if (paletteSettings.bgParallax) body.setAttribute("data-qx-parallax", "on");
				else body.removeAttribute("data-qx-parallax");
				if (paletteSettings.chatEdgeFade) body.setAttribute("data-qx-chatfade", "on");
				else body.removeAttribute("data-qx-chatfade");
				if (!paletteSettings.bgParallax) syncBackdrop();
				applyHolidayState();
				// 关闭液态输入框时把装饰节点一并摘掉，原版输入框下不留注入子节点
				if (typeof syncComposerDecorations === "function") syncComposerDecorations();
				// goldTrim / lightCharms / darkCharms：CSS 早已写好（顶栏鎏金细线、侧栏云纹、
				// 主按钮鎏金描边），但旧版从未写这两个 body 属性，三个键等于永久失效。
				// 面板暂未提供 UI 开关（保持「7 开关」规格），键仍可通过 settings.json 生效。
				if (paletteSettings.goldTrim) body.setAttribute("data-qx-gold", "on");
				else body.removeAttribute("data-qx-gold");
				applyCharmState();
				// numbers → css variables
				body.style.setProperty("--qx-panel-alpha", String(clamp(paletteSettings.panelOpacity, 30, 100) / 100));
				body.style.setProperty("--qx-content-width", clamp(paletteSettings.contentWidth, 500, 1000) + "px");
				body.style.setProperty("--qx-font-scale", String(clamp(paletteSettings.fontScale, 85, 125) / 100));
				// 字体：跟随系统时不写内联变量，生成表回落到宿主字体（默认零变化）
				syncCustomFontSheet();
				if (!paletteSettings.customFont && paletteSettings.fontUi === "custom") paletteSettings.fontUi = "system";
				if (!paletteSettings.customFont && paletteSettings.fontCode === "custom") paletteSettings.fontCode = "system";
				if (paletteSettings.fontUi && paletteSettings.fontUi !== "system") {
					body.style.setProperty("--qx-font-ui", qxFontStackWithCustom(QX_FONT_UI, paletteSettings.fontUi));
				} else {
					body.style.removeProperty("--qx-font-ui");
				}
				if (paletteSettings.fontCode && paletteSettings.fontCode !== "system") {
					body.style.setProperty("--qx-font-code", qxFontStackWithCustom(QX_FONT_CODE, paletteSettings.fontCode));
				} else {
					body.style.removeProperty("--qx-font-code");
				}
				body.style.setProperty("--qx-letter-spacing", clamp(Number(paletteSettings.letterSpacing) || 0, -0.02, 0.08) + "em");
				body.style.setProperty("--qx-line-height", String(clamp(Number(paletteSettings.lineHeight) || QX_LINE_BASE, 1.3, 2.0)));
				syncFontScaleSheet();
				syncAccentSheet();
				syncBackdrop();
				startBgRotation();
				syncBgDim();
				syncVideo();
				// 0.8.0 特效强度：高中低三档只停动画，不删装饰
				var fxIntensity = clamp(Number(paletteSettings.effectIntensity) || 100, 20, 100);
				body.setAttribute("data-qx-fx", fxIntensity <= 40 ? "minimal" : (fxIntensity <= 69 ? "reduced" : "full"));
				// 低功耗 / 自动降级 / 电池省电统一落到 data-qx-perf
				if (!paletteSettings.autoDegrade) autoPerfLow = false;
				if (isEffectLow()) body.setAttribute("data-qx-perf", "low");
				else body.removeAttribute("data-qx-perf");
				buildParticles();
				// 毛玻璃虚化：总开关 / 两个分项子开关 / 强度（详见 applyFrostState）
				applyFrostState();
				// 令牌写完后实测一次，面板上的「实测正文」才是落地后的真值。
				syncFontReadout();
				syncPresetState();
				syncDependencyState();
			}

			// 侧栏云纹：亮/暗两套开关（lightCharms / darkCharms），按当前形态取一个。
			function applyCharmState() {
				if (disposed) return;
				var charms = isDarkMode(body) ? paletteSettings.darkCharms : paletteSettings.lightCharms;
				if (charms) body.setAttribute("data-qx-charms", "on");
				else body.removeAttribute("data-qx-charms");
			}

			function resetPaletteSettings() {
				for (var key in PALETTE_DEFAULTS) paletteSettings[key] = PALETTE_DEFAULTS[key];
				applyPaletteSettings();
				savePaletteSettings(true);
				rebuildPanel();
				showStatus("✓ 已恢复默认");
			}

			// ── 0.5.0 主题包：预设 / 导出 / 导入 / 主题码 ──
			// 主题包只承载外观与动效参数，不包含画卷（data URL 太大）；
			// 画卷由「背景画卷」区独立管理，应用主题不会覆盖用户的图。
			function themeEffectSettings(src) {
				var out = {};
				for (var key in PALETTE_DEFAULTS) {
					// 画卷与轮播列表属于本机资源，不随主题包导出
					if (key === "lightBackground" || key === "darkBackground") continue;
					if (key === "bgRotation" || key === "bgRotationOn" || key === "bgRotationMinutes") continue;
					if (key === "bgVideoEnabled" || key === "bgVideoLowPower" || key === "bgVideoCompat") continue;
					if (key === "lightVideoId" || key === "darkVideoId" || key === "lightVideoPosterId" || key === "darkVideoPosterId") continue;
					if (key === "lightVideoUrl" || key === "darkVideoUrl") continue;
					if (key === "customFont") continue; // 字体文件太大，不进主题包（完整备份会包含）
					if (key.indexOf("hotkey") === 0) continue; // 快捷键属于本机习惯
					if (src && Object.prototype.hasOwnProperty.call(src, key)) out[key] = src[key];
				}
				return out;
			}

			function sanitizeThemePack(raw) {
				if (!raw || typeof raw !== "object") return null;
				if (raw.schema !== "qingxiao-theme" || (raw.version !== 1 && raw.version !== 2)) return null;
				var src = raw.settings;
				if (!src || typeof src !== "object") return null;
				var clean = {};
				for (var key in PALETTE_DEFAULTS) {
					if (key === "lightBackground" || key === "darkBackground") continue;
					if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
					var v = src[key];
					var d = PALETTE_DEFAULTS[key];
					// accentColor 默认 null（typeof object），必须在类型分支前单独处理
					if (key === "accentColor") {
						if (v === null) clean[key] = null;
						else if (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)) clean[key] = v.toLowerCase();
						continue;
					}
					if (typeof d === "boolean") {
						if (typeof v === "boolean") clean[key] = v;
					} else if (typeof d === "number") {
						if (typeof v === "number" && isFinite(v)) {
							var range = THEME_NUM_RANGES[key];
							clean[key] = range ? clamp(v, range[0], range[1]) : v;
						}
					} else if (typeof d === "string") {
						if (key === "bgFit" && (v === "cover" || v === "contain")) clean[key] = v;
						else if (key === "fontUi" && qxHasId(QX_FONT_UI, v)) clean[key] = v;
						else if (key === "fontCode" && qxHasId(QX_FONT_CODE, v)) clean[key] = v;
						else if (key === "paletteId" && qxHasId(QX_PALETTES, v)) clean[key] = v;
						else if (key === "particleStyle" && QX_PARTICLE_STYLES.indexOf(v) >= 0) clean[key] = v;
						else if ((key === "sceneDay" || key === "sceneNight") && THEME_PRESETS.some(function(p) { return p.id === v; })) clean[key] = v;
					}
				}
				if (Object.keys(clean).length === 0) return null;
				return {
					id: String(raw.id || "custom").slice(0, 40),
					name: String(raw.name || "自定义清宵主题").slice(0, 40),
					author: String(raw.author || "").slice(0, 40),
					description: String(raw.description || "").slice(0, 120),
					settings: clean
				};
			}

			function currentThemePack() {
				return {
					schema: "qingxiao-theme",
					version: 1,
					id: "custom",
					name: "我的清宵主题",
					author: "",
					description: "清宵外观参数（不含画卷）",
					settings: themeEffectSettings(palettePayload())
				};
			}

			function applyThemePack(pack) {
				if (!pack || !pack.settings) return;
				for (var key in pack.settings) {
					if (key === "lightBackground" || key === "darkBackground") continue;
					if (Object.prototype.hasOwnProperty.call(PALETTE_DEFAULTS, key)) paletteSettings[key] = pack.settings[key];
				}
				applyPaletteSettings();
				savePaletteSettings(true);
				rebuildPanel();
				showStatus("✓ 已应用主题「" + (pack.name || "自定义") + "」");
			}

			// ── 0.8.1 场景按时间轮换 ──
			// 只应用场景相关的观感键，不动字体/配色/画卷，避免每天把用户定制冲掉
			var SCENE_ROTATE_KEYS = ["particleStyle", "particles", "particleCount", "particleSpeed", "effectIntensity", "scrimOpacity", "panelOpacity", "goldTrim", "lightCharms", "darkCharms", "frostBlur"];
			var lastSceneBucket = "";
			var sceneRotationBusy = false;
			function scenePreset(id) {
				for (var i = 0; i < THEME_PRESETS.length; i++) if (THEME_PRESETS[i].id === id) return THEME_PRESETS[i];
				return null;
			}
			function currentSceneBucket() {
				var hour = new Date().getHours();
				return hour >= 6 && hour < 18 ? "day" : "night";
			}
			function applySceneSubset(id) {
				var preset = scenePreset(id);
				if (!preset) return false;
				for (var i = 0; i < SCENE_ROTATE_KEYS.length; i++) {
					var key = SCENE_ROTATE_KEYS[i];
					if (Object.prototype.hasOwnProperty.call(preset.settings, key)) paletteSettings[key] = preset.settings[key];
				}
				applyPaletteSettings();
				savePaletteSettings(true);
				if (palettePanelEl) rebuildPanel();
				return true;
			}
			function syncSceneRotation(force) {
				if (!paletteSettings.sceneRotation || sceneRotationBusy) return;
				var bucket = currentSceneBucket();
				if (!force && bucket === lastSceneBucket) return;
				lastSceneBucket = bucket;
				sceneRotationBusy = true;
				try { applySceneSubset(bucket === "day" ? paletteSettings.sceneDay : paletteSettings.sceneNight); }
				finally { sceneRotationBusy = false; }
			}
			var sceneRotationTimer = setInterval(function() { syncSceneRotation(false); }, 60000);

			function downloadThemePack() {
				var stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
				var blob = new Blob([JSON.stringify(currentThemePack(), null, 2)], { type: "application/json" });
				var url = URL.createObjectURL(blob);
				var link = document.createElement("a");
				link.href = url;
				link.download = "qingxiao-theme-" + stamp + ".json";
				document.body.appendChild(link);
				link.click();
				setTimeout(function() { URL.revokeObjectURL(url); link.remove(); }, 800);
				showStatus("✓ 已导出主题文件");
			}

			function importThemeFile(file) {
				if (!file) return;
				if (file.size > 1024 * 1024) { showStatus("✗ 主题文件不能超过 1MB"); return; }
				var reader = new FileReader();
				reader.onload = function() {
					try {
						var pack = sanitizeThemePack(JSON.parse(String(reader.result || "")));
						if (!pack) throw new Error("格式不正确");
						applyThemePack(pack);
					} catch (e) {
						showStatus("✗ 主题文件无效：" + (e.message || "解析失败"));
					}
				};
				reader.onerror = function() { showStatus("✗ 读取主题文件失败"); };
				reader.readAsText(file);
			}

			// ── 0.8.1 完整备份 / 恢复（含画卷与自定义字体，不含本地视频文件）──
			function currentBackup() {
				return {
					schema: "qingxiao-backup",
					version: 1,
					at: new Date().toISOString(),
					settings: palettePayload()
				};
			}
			function downloadBackup() {
				var stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
				var blob = new Blob([JSON.stringify(currentBackup())], { type: "application/json" });
				var url = URL.createObjectURL(blob);
				var link = document.createElement("a");
				link.href = url;
				link.download = "qingxiao-backup-" + stamp + ".json";
				document.body.appendChild(link);
				link.click();
				setTimeout(function() { URL.revokeObjectURL(url); link.remove(); }, 900);
				showStatus("✓ 已导出完整备份（含画卷与字体）");
			}
			function restoreBackupFile(file) {
				if (!file) return;
				if (file.size > 40 * 1024 * 1024) { showStatus("✗ 备份文件不能超过 40MB"); return; }
				var reader = new FileReader();
				reader.onload = function() {
					var pack = null;
					try { pack = JSON.parse(String(reader.result || "")); } catch (_) { pack = null; }
					if (!pack || pack.schema !== "qingxiao-backup" || !pack.settings || typeof pack.settings !== "object") {
						showStatus("✗ 不是有效的清宵备份文件");
						return;
					}
					showStatus("正在恢复备份…");
					fetch(SETTINGS_URL, {
						method: "PUT",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ settings: pack.settings })
					})
						.then(function(response) { return response.json().then(function(body) { return { ok: response.ok, body: body }; }); })
						.then(function(result) {
							if (!result.ok || !result.body || !result.body.ok || !result.body.settings) throw new Error("保存被拒绝");
							paletteSettings = Object.assign({}, PALETTE_DEFAULTS, result.body.settings);
							try { localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(palettePayload())); } catch (_) {}
							applyPaletteSettings();
							rebuildPanel();
							showStatus("✓ 备份已恢复");
						})
						.catch(function(error) {
							showStatus("✗ 恢复失败：" + (error && error.message ? error.message : "文件过大或格式不正确"));
						});
				};
				reader.onerror = function() { showStatus("✗ 读取备份失败"); };
				reader.readAsText(file);
			}

			function encodeThemeCode(pack) {
				return btoa(unescape(encodeURIComponent(JSON.stringify(pack))));
			}
			function decodeThemeCode(code) {
				return JSON.parse(decodeURIComponent(escape(atob(String(code || "").trim()))));
			}
			function copyText(text, okMsg) {
				var done = function() { showStatus(okMsg || "✓ 已复制"); };
				var fallback = function() {
					var ta = document.createElement("textarea");
					ta.value = text;
					ta.style.position = "fixed";
					ta.style.opacity = "0";
					document.body.appendChild(ta);
					ta.select();
					try { document.execCommand("copy"); done(); }
					catch (_) { showStatus("✗ 复制失败，请手动选择文本"); }
					ta.remove();
				};
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(text).then(done, fallback);
				} else {
					fallback();
				}
			}
			function copyThemeCode() {
				copyText(encodeThemeCode(currentThemePack()), "✓ 主题码已复制");
			}

			// 背景图片在渲染进程本地读取（FileReader→dataURL），不依赖任何原生对话框：
			// 点「更换画卷」走 <input type=file>（disableDialogs 只屏蔽 alert/confirm/print，
			// 不屏蔽文件框）；万一某些环境仍弹不出，可把图片直接拖到按钮上（drop 事件）。
			var MAX_BG_FILE_BYTES = 10 * 1024 * 1024;
			function readFileAsBackground(file, modeKey) {
				if (!file) return;
				var okType = /^image\/(png|jpe?g|webp|gif)$/i.test(file.type || "") || /\.(png|jpe?g|webp|gif)$/i.test(file.name || "");
				if (!okType) { showStatus("✗ 请选择 PNG / JPG / WebP / GIF 图片"); return; }
				if (file.size > MAX_BG_FILE_BYTES) { showStatus("✗ 图片不能超过 10MB"); return; }
				var reader = new FileReader();
				reader.onload = function() {
					paletteSettings[modeKey] = String(reader.result);
					applyPaletteSettings();
					savePaletteSettings(true);
					rebuildPanel();
					// 设的不是当前形态时，明确告诉用户切主题后才可见，别让人以为没生效
					var current = (modeKey === "darkBackground") === isDarkMode(body);
					if (current) showStatus("✓ 背景已更换");
					else showStatus("✓ 已设为「" + (modeKey === "lightBackground" ? "亮色形态" : "暗色形态") + "」背景；当前是" + (isDarkMode(body) ? "暗色" : "亮色") + "形态，切换主题后可见");
				};
				reader.onerror = function() { showStatus("✗ 读取图片失败"); };
				reader.readAsDataURL(file);
			}

			function clearCustomBackground(modeKey) {
				paletteSettings[modeKey] = null;
				applyPaletteSettings();
				savePaletteSettings(true);
				rebuildPanel();
				showStatus("✓ 已恢复默认背景（清宵画卷）");
			}

			// 「跳转到人格设置」：皮肤面板是插件自绘的浮层，人格分区在官方设置
			// 弹窗里。用与手动操作一致的合成点击链（账号菜单 → 设置 → 人格）抵达，
			// 已实测该链路在 disableDialogs 环境下依然生效。
			function qxAwait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
			function qxTrim(el) { return ((el && el.textContent) || "").trim(); }
			function qxPersonaNav() {
				// 0.2.2 里侧栏本身也是 [role="dialog"]，不能再只看第一个 dialog；
				// 遍历所有 dialog（设置弹窗通常是最后一个），再退回全文查找。
				var scopes = document.querySelectorAll('[role="dialog"]');
				for (var s = 0; s < scopes.length; s++) {
					var btns = scopes[s].querySelectorAll("button");
					for (var i = 0; i < btns.length; i++) { if (qxTrim(btns[i]) === "人格") return btns[i]; }
				}
				var all = document.querySelectorAll("button");
				for (var j = 0; j < all.length; j++) { if (qxTrim(all[j]) === "人格") return all[j]; }
				return null;
			}
			function openPersonaSettings() {
				if (palettePanelEl) palettePanelEl.dataset.qxCollapsed = "true"; // 收起浮层，别盖住设置页
				var nav = qxPersonaNav();
				if (nav) { nav.click(); showStatus("✓ 已打开人格设置"); return; }
				// 0.2.2 侧栏收起时账号菜单被移到视口外（rect.right <= 0），先展开侧栏再点
				var ensureSidebar = function () {
					var acct = document.querySelector('[aria-label="账号菜单"]');
					if (!acct) return Promise.resolve(false);
					if (acct.getBoundingClientRect().right > 0) return Promise.resolve(true);
					var opener = document.querySelector('[aria-label="打开侧边栏"]');
					if (!opener) return Promise.resolve(true);
					opener.click();
					return qxAwait(320).then(function () { return true; });
				};
				ensureSidebar().then(function (ok) {
					if (!ok) { showStatus("✗ 找不到账号菜单"); return; }
					var acct = document.querySelector('[aria-label="账号菜单"]');
					if (!acct) { showStatus("✗ 找不到账号菜单"); return; }
					acct.click();
					return qxAwait(300).then(function () {
						var items = document.querySelectorAll('[role="menuitem"]');
						var settings = null;
						for (var i = 0; i < items.length; i++) { if (qxTrim(items[i]).indexOf("设置") === 0) { settings = items[i]; break; } }
						if (!settings) { showStatus("✗ 找不到设置入口"); return; }
						settings.click();
						// 设置弹窗挂载有快有慢，轮询等待「人格」导航出现再点，别用固定延时赌时机
						return (function poll(n) {
							var nav2 = qxPersonaNav();
							if (nav2) { nav2.click(); showStatus("✓ 已打开人格设置"); return; }
							if (n > 20) { showStatus("✗ 设置页里没找到「人格」分区"); return; }
							return qxAwait(120).then(function () { return poll(n + 1); });
						})(0);
					});
				}).catch(function (e) { showStatus("✗ 跳转失败：" + (e.message || e)); });
			}

			function makeToggle(label, key, onChange) {
				var row = document.createElement("div");
				row.className = "pp-row";
				row.dataset.key = key;
				var lab = document.createElement("label");
				lab.textContent = label;
				var btn = document.createElement("button");
				btn.className = "pp-toggle";
				btn.type = "button";
				btn.dataset.on = paletteSettings[key] ? "true" : "false";
				btn.setAttribute("role", "switch");
				btn.setAttribute("aria-label", label);
				btn.setAttribute("aria-checked", btn.dataset.on);
				var toggle = function() {
					paletteSettings[key] = !paletteSettings[key];
					btn.dataset.on = paletteSettings[key] ? "true" : "false";
					btn.setAttribute("aria-checked", btn.dataset.on);
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
				row.dataset.key = key;
				var lab = document.createElement("label");
				lab.textContent = label;
				lab.htmlFor = "pp-" + key;
				var wrap = document.createElement("div");
				wrap.className = "pp-slider-wrap";
				var input = document.createElement("input");
				input.type = "range";
				input.id = "pp-" + key;
				input.setAttribute("aria-label", label);
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

			function makeSelectRow(label, key, options) {
				var row = document.createElement("div");
				row.className = "pp-row";
				row.dataset.key = key;
				var lab = document.createElement("label");
				lab.textContent = label;
				lab.htmlFor = "pp-" + key;
				var sel = document.createElement("select");
				sel.className = "pp-select";
				sel.id = "pp-" + key;
				sel.setAttribute("aria-label", label);
				options.forEach(function(o) {
					var opt = document.createElement("option");
					opt.value = o[0];
					opt.textContent = o[1];
					sel.append(opt);
				});
				sel.value = paletteSettings[key];
				sel.addEventListener("change", function() {
					paletteSettings[key] = sel.value;
					applyPaletteSettings();
					savePaletteSettings();
				});
				row.append(lab, sel);
				return row;
			}

			function uploadVideo(file, idKey) {
				if (!file) return;
				var type = String(file.type || "").toLowerCase();
				if (type !== "video/mp4" && type !== "video/webm") { showStatus("✗ 请选择 MP4 / WebM 视频"); return; }
				if (file.size > 64 * 1024 * 1024) { showStatus("✗ 视频不能超过 64MB"); return; }
				showStatus("上传视频…");
				fetch("/api/dsh-qingxiao/media?kind=video&name=" + encodeURIComponent(file.name || ""), {
					method: "PUT",
					headers: { "content-type": type || "application/octet-stream" },
					body: file
				}).then(function(response) {
					return response.json().catch(function() { return null; }).then(function(body) {
						return { status: response.status, body: body };
					});
				}).then(function(result) {
					if (result.status !== 201 || !result.body || !result.body.ok) {
						throw new Error((result.body && result.body.message) || ("HTTP " + result.status));
					}
					var isLight = idKey === "lightVideoId";
					var posterKey = isLight ? "lightVideoPosterId" : "darkVideoPosterId";
					var otherIdKey = isLight ? "darkVideoId" : "lightVideoId";
					var otherPosterKey = isLight ? "darkVideoPosterId" : "lightVideoPosterId";
					var oldId = paletteSettings[idKey];
					var oldPoster = paletteSettings[posterKey];
					paletteSettings[idKey] = result.body.id;
					paletteSettings[isLight ? "lightVideoUrl" : "darkVideoUrl"] = null;
					paletteSettings[posterKey] = null;
					paletteSettings.bgVideoEnabled = true;
					applyPaletteSettings();
					savePaletteSettings(true);
					rebuildPanel();
					showStatus("✓ 已上传视频（" + (result.body.bytes / 1048576).toFixed(1) + " MB）");
					// 替换视频时清掉旧文件与旧封面；另一形态仍在用则保留
					if (oldId && oldId !== result.body.id && paletteSettings[otherIdKey] !== oldId) {
						fetch("/api/dsh-qingxiao/media?id=" + encodeURIComponent(oldId) + "&force=1", { method: "DELETE" }).catch(function() {});
					}
					if (oldPoster && paletteSettings[otherPosterKey] !== oldPoster) {
						fetch("/api/dsh-qingxiao/media?id=" + encodeURIComponent(oldPoster) + "&force=1", { method: "DELETE" }).catch(function() {});
					}
				}).catch(function(error) {
					showStatus("✗ 上传失败：" + (error.message || error));
				});
			}

			function clearVideo(idKey) {
				var isLight = idKey === "lightVideoId";
				var urlKey = isLight ? "lightVideoUrl" : "darkVideoUrl";
				var posterKey = isLight ? "lightVideoPosterId" : "darkVideoPosterId";
				var otherKey = isLight ? "darkVideoId" : "lightVideoId";
				var otherPosterKey = isLight ? "darkVideoPosterId" : "lightVideoPosterId";
				var old = paletteSettings[idKey];
				var oldPoster = paletteSettings[posterKey];
				var shared = !!(old && paletteSettings[otherKey] === old);
				var posterShared = !!(oldPoster && paletteSettings[otherPosterKey] === oldPoster);
				paletteSettings[idKey] = null;
				paletteSettings[urlKey] = null;
				paletteSettings[posterKey] = null;
				applyPaletteSettings();
				savePaletteSettings(true);
				rebuildPanel();
				if (!old && !oldPoster) { showStatus("✓ 已清除视频"); return; }
				if (old && shared) showStatus("✓ 已清除；另一形态仍在使用，文件保留");
				else if (old) {
					// 防抖 PUT 可能还没落盘；force=1 让服务端清掉同 id 的残留引用后再删文件
					fetch("/api/dsh-qingxiao/media?id=" + encodeURIComponent(old) + "&force=1", { method: "DELETE" }).catch(function() {});
				}
				if (oldPoster && !posterShared) {
					fetch("/api/dsh-qingxiao/media?id=" + encodeURIComponent(oldPoster) + "&force=1", { method: "DELETE" }).catch(function() {});
				}
				if (!old || !shared) showStatus("✓ 已清除视频");
			}

			function makeVideoRow(title, idKey) {
				var fragment = document.createDocumentFragment();
				var isLight = idKey === "lightVideoId";
				var urlKey = isLight ? "lightVideoUrl" : "darkVideoUrl";
				var posterKey = isLight ? "lightVideoPosterId" : "darkVideoPosterId";
				var id = paletteSettings[idKey];
				var url = paletteSettings[urlKey];
				var note = document.createElement("div");
				note.className = "pp-note";
				var summary = id
					? "本地视频 · " + String(id).slice(0, 8) + "…"
					: (url ? "远程 URL · " + String(url).replace(/^https?:\/\//i, "").split("/")[0] : "默认静态画卷");
				note.textContent = title + "：" + summary;
				var row = document.createElement("div");
				row.className = "pp-row";
				var upload = document.createElement("button");
				upload.type = "button";
				upload.className = "pp-btn";
				upload.textContent = "选择视频";
				var file = document.createElement("input");
				file.type = "file";
				file.accept = "video/mp4,video/webm";
				file.style.display = "none";
				upload.addEventListener("click", function() { file.click(); });
				file.addEventListener("change", function() {
					uploadVideo(file.files && file.files[0], idKey);
					file.value = "";
				});
				row.append(upload, file);
				if (id || url) {
					var clear = document.createElement("button");
					clear.type = "button";
					clear.className = "pp-btn pp-danger";
					clear.textContent = "清除";
					clear.addEventListener("click", function() { clearVideo(idKey); });
					row.append(clear);
				}
				fragment.append(note, row);
				return fragment;
			}

			// 高级页远程视频地址：只负责 URL 的输入/应用；清除仍走动态画卷里的「清除」
			function makeVideoUrlRow(title, idKey) {
				var isLight = idKey === "lightVideoId";
				var urlKey = isLight ? "lightVideoUrl" : "darkVideoUrl";
				var posterKey = isLight ? "lightVideoPosterId" : "darkVideoPosterId";
				var row = document.createElement("div");
				row.className = "pp-row pp-url-row";
				var lab = document.createElement("label");
				lab.textContent = title;
				var wrap = document.createElement("div");
				wrap.className = "pp-url-wrap";
				var input = document.createElement("input");
				input.type = "text";
				input.className = "pp-input";
				input.placeholder = "https:// 视频 URL（不支持 HLS/DASH）";
				input.value = /^https?:\/\//i.test(paletteSettings[urlKey] || "") ? paletteSettings[urlKey] : "";
				var apply = document.createElement("button");
				apply.type = "button";
				apply.className = "pp-btn";
				apply.textContent = "应用";
				apply.addEventListener("click", function() {
					var normalized = safeVideoUrl(input.value);
					if (!normalized) { showStatus("✗ 请输入 https（或本机 http）视频 URL；不支持 HLS/DASH"); return; }
					var oldId = paletteSettings[idKey];
					var oldPoster = paletteSettings[posterKey];
					var otherIdKey = isLight ? "darkVideoId" : "lightVideoId";
					var otherPosterKey = isLight ? "darkVideoPosterId" : "lightVideoPosterId";
					paletteSettings[idKey] = null;
					paletteSettings[posterKey] = null;
					paletteSettings[urlKey] = normalized;
					applyPaletteSettings();
					savePaletteSettings(true);
					rebuildPanel();
					if (oldId && paletteSettings[otherIdKey] !== oldId) fetch("/api/dsh-qingxiao/media?id=" + encodeURIComponent(oldId) + "&force=1", { method: "DELETE" }).catch(function() {});
					if (oldPoster && paletteSettings[otherPosterKey] !== oldPoster) fetch("/api/dsh-qingxiao/media?id=" + encodeURIComponent(oldPoster) + "&force=1", { method: "DELETE" }).catch(function() {});
					showStatus("✓ 已应用远程视频 URL");
				});
				wrap.append(input, apply);
				row.append(lab, wrap);
				return row;
			}

			function makeBgRow(title, modeKey) {
				var fragment = document.createDocumentFragment();
				var isCurrent = (modeKey === "darkBackground") === isDarkMode(body);
				var note = document.createElement("div");
				note.className = "pp-note";
				note.textContent = title + (isCurrent ? "（当前）" : "") + "：" + (paletteSettings[modeKey] ? "已使用自定义画卷" : "默认 · 清宵画卷");
				var row = document.createElement("div");
				row.className = "pp-row";
				var uploadBtn = document.createElement("button");
				uploadBtn.className = "pp-btn";
				uploadBtn.type = "button";
				uploadBtn.textContent = "更换画卷";
				uploadBtn.title = "点击选择图片，或直接把图片拖到这里";
				var fileInput = document.createElement("input");
				fileInput.type = "file";
				fileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
				fileInput.style.display = "none";
				uploadBtn.addEventListener("click", function() { fileInput.click(); });
				fileInput.addEventListener("change", function() {
					readFileAsBackground(fileInput.files && fileInput.files[0], modeKey);
					fileInput.value = "";
				});
				// 拖放兜底：drop 不是对话框，任何环境都能收到文件
				function bindDrop(el) {
					el.addEventListener("dragover", function(e) { e.preventDefault(); el.classList.add("pp-dragover"); });
					el.addEventListener("dragleave", function() { el.classList.remove("pp-dragover"); });
					el.addEventListener("drop", function(e) {
						e.preventDefault();
						el.classList.remove("pp-dragover");
						var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
						readFileAsBackground(f, modeKey);
					});
				}
				bindDrop(uploadBtn);
				bindDrop(row);
				row.append(uploadBtn, fileInput);
				if (paletteSettings[modeKey]) {
					var clearBtn = document.createElement("button");
					clearBtn.className = "pp-btn pp-danger";
					clearBtn.type = "button";
					clearBtn.textContent = "复原默认";
					clearBtn.addEventListener("click", function() { clearCustomBackground(modeKey); });
					row.append(clearBtn);
				}
				var urlRow = document.createElement("div");
				urlRow.className = "pp-row pp-url-row";
				var urlInput = document.createElement("input");
				urlInput.type = "text";
				urlInput.className = "pp-input";
				urlInput.placeholder = "https:// 图片 URL";
				urlInput.value = /^https?:\/\//i.test(paletteSettings[modeKey] || "") ? paletteSettings[modeKey] : "";
				var urlBtn = document.createElement("button");
				urlBtn.type = "button";
				urlBtn.className = "pp-btn";
				urlBtn.textContent = "应用";
				urlBtn.title = "使用网络图片 URL 作为画卷";
				urlBtn.addEventListener("click", function() {
					var u = safeBgUrl(urlInput.value);
					if (!u) { showStatus("✗ 请输入 http(s) 图片 URL"); return; }
					paletteSettings[modeKey] = u;
					applyPaletteSettings();
					savePaletteSettings(true);
					rebuildPanel();
					showStatus("✓ 已更换「" + (modeKey === "lightBackground" ? "亮色" : "暗色") + "」URL 画卷");
				});
				urlRow.append(urlInput, urlBtn);
				fragment.append(note, row, urlRow);
				return fragment;
			}

			// 主题卡当前态：只比较预设真正定义的键；画卷构图等本机参数不参与，
			// 避免用户调一下焦点就误判「主题已改变」。
			function syncPresetState() {
				if (disposed || !palettePanelEl) return;
				var cards = palettePanelEl.querySelectorAll("[data-theme-id]");
				var ignored = { bgFit: 1, bgFocusX: 1, bgFocusY: 1, bgAutoDim: 1 };
				for (var i = 0; i < cards.length; i++) {
					var preset = null;
					for (var j = 0; j < THEME_PRESETS.length; j++) {
						if (THEME_PRESETS[j].id === cards[i].dataset.themeId) { preset = THEME_PRESETS[j]; break; }
					}
					var match = !!preset;
					if (preset) {
						for (var key in preset.settings) {
							if (ignored[key]) continue;
							if (key === "accentColor") {
								if ((paletteSettings.accentColor || null) !== (preset.settings.accentColor || null)) { match = false; break; }
							} else if (paletteSettings[key] !== preset.settings[key]) {
								match = false;
								break;
							}
						}
					}
					cards[i].dataset.active = match ? "true" : "false";
				}
			}

			// 依赖项只做视觉降级：不改保存值、不设原生 disabled、不加点击守卫，
			// 既让用户看懂「总开关没开」，也不破坏既有合成点击测试。
			function syncDependencyState() {
				if (!palettePanelEl) return;
				var frostOn = !!paletteSettings.frostMaster && clamp(Number(paletteSettings.frostBlur) || 0, 0, 30) > 0;
				var rules = [
					{ keys: ["frostPlugin", "frostNative", "frostBlur"], on: frostOn },
					{ keys: ["particleCount", "particleSpeed"], on: !!paletteSettings.particles },
					{ keys: ["bgRotationMinutes"], on: !!paletteSettings.bgRotationOn },
					{ keys: ["bgParallaxStrength"], on: !!paletteSettings.bgParallax },
					{ keys: ["panelBlur"], on: frostOn },
					{ keys: ["composerGlow"], on: !!paletteSettings.liquidComposer }
				];
				rules.forEach(function(rule) {
					rule.keys.forEach(function(key) {
						var row = palettePanelEl.querySelector('.pp-row[data-key="' + key + '"]');
						if (!row) return;
						if (rule.on) {
							row.removeAttribute("data-dep");
							row.removeAttribute("aria-disabled");
						} else {
							row.setAttribute("data-dep", "off");
							row.setAttribute("aria-disabled", "true");
						}
					});
				});
			}

			// 高级页主题码编辑器：始终可见，打开高级页/点重新生成时填入当前码
			var themeCodeRefresh = null;
			function buildThemeCodeEditor(parent) {
				var wrap = document.createElement("div");
				wrap.className = "pp-theme-code";
				var ta = document.createElement("textarea");
				ta.className = "pp-theme-textarea pp-code-textarea";
				ta.placeholder = "粘贴主题码…";
				var actions = document.createElement("div");
				actions.className = "pp-theme-code-actions";
				var refreshBtn = document.createElement("button");
				refreshBtn.type = "button";
				refreshBtn.className = "pp-btn";
				refreshBtn.textContent = "重新生成";
				var copyBtn = document.createElement("button");
				copyBtn.type = "button";
				copyBtn.className = "pp-btn";
				copyBtn.textContent = "复制";
				var applyBtn = document.createElement("button");
				applyBtn.type = "button";
				applyBtn.className = "pp-btn";
				applyBtn.textContent = "应用主题码";
				var refresh = function() { ta.value = encodeThemeCode(currentThemePack()); };
				refreshBtn.addEventListener("click", function() {
					refresh();
					showStatus("✓ 已生成当前主题码");
				});
				copyBtn.addEventListener("click", function() {
					var code = ta.value.trim();
					if (!code) { refresh(); code = ta.value.trim(); }
					copyText(code, "✓ 主题码已复制");
				});
				applyBtn.addEventListener("click", function() {
					try {
						var pack = sanitizeThemePack(decodeThemeCode(ta.value));
						if (!pack) throw new Error("主题码无效");
						applyThemePack(pack);
					} catch (e) {
						showStatus("✗ " + (e.message || "主题码无效"));
					}
				});
				actions.append(refreshBtn, copyBtn, applyBtn);
				wrap.append(ta, actions);
				parent.append(wrap);
				themeCodeRefresh = refresh;
				refresh();
				return wrap;
			}

			function buildPanelInto(panel) {
				var TABS = [
					{ id: "theme", label: "主题" },
					{ id: "read", label: "阅读" },
					{ id: "ui", label: "界面" },
					{ id: "bg", label: "画卷" },
					{ id: "adv", label: "高级" }
				];
				var TAB_KEY = "dsh-qingxiao-panel-tab";
				function readTab() {
					try {
						var saved = localStorage.getItem(TAB_KEY);
						for (var i = 0; i < TABS.length; i++) if (TABS[i].id === saved) return saved;
					} catch (_) {}
					return "theme";
				}
				var tabButtons = {};
				var tabPages = {};

				var header = document.createElement("div");
				header.className = "pp-header";
				header.setAttribute("role", "button");
				header.setAttribute("tabindex", "0");
				header.setAttribute("aria-expanded", panel.dataset.qxCollapsed === "false" ? "true" : "false");
				var headerMain = document.createElement("div");
				headerMain.className = "pp-header-main";
				var title = document.createElement("span");
				title.className = "pp-title";
				title.textContent = "清宵";
				var version = document.createElement("span");
				version.className = "pp-version";
				version.textContent = "v" + SKIN_VERSION;
				headerMain.append(title, version);
				var chevron = document.createElement("span");
				chevron.className = "pp-collapse";
				chevron.textContent = "▾";
				header.append(headerMain, chevron);
				var toggleCollapse = function() {
					if (panel.dataset.qxEmbedded === "true") return;
					var next = panel.dataset.qxCollapsed === "true" ? "false" : "true";
					panel.dataset.qxCollapsed = next;
					header.setAttribute("aria-expanded", next === "false" ? "true" : "false");
					if (next === "false" && typeof positionPanel === "function") positionPanel();
				};
				header.addEventListener("click", toggleCollapse);
				header.addEventListener("keydown", function(e) {
					if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCollapse(); }
				});

				var advice = document.createElement("div");
				advice.className = "pp-advice";
				var adviceMoon = document.createElement("span");
				adviceMoon.className = "pp-advice-icon";
				adviceMoon.textContent = "☾";
				var adviceText = document.createElement("span");
				adviceText.className = "pp-advice-text";
				adviceText.textContent = "建议搭配深色模式使用";
				var adviceTag = document.createElement("span");
				adviceTag.className = "pp-advice-tag";
				adviceTag.textContent = "默认深色";
				advice.append(adviceMoon, adviceText, adviceTag);

				var tabbar = document.createElement("div");
				tabbar.className = "pp-tabs";
				tabbar.setAttribute("role", "tablist");
				tabbar.setAttribute("aria-label", "清宵设置分区");
				var bodyEl = document.createElement("div");
				bodyEl.className = "pp-body";

				TABS.forEach(function(tab, index) {
					var btn = document.createElement("button");
					btn.type = "button";
					btn.className = "pp-tab";
					btn.id = "pp-tab-" + tab.id;
					btn.textContent = tab.label;
					btn.setAttribute("role", "tab");
					btn.setAttribute("aria-controls", "pp-page-" + tab.id);
					btn.setAttribute("aria-selected", "false");
					btn.tabIndex = -1;
					btn.addEventListener("click", function() { setActiveTab(tab.id, false); });
					btn.addEventListener("keydown", function(e) {
						var next = -1;
						if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
						else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
						else if (e.key === "Home") next = 0;
						else if (e.key === "End") next = TABS.length - 1;
						if (next >= 0) { e.preventDefault(); setActiveTab(TABS[next].id, true); }
					});
					tabbar.append(btn);
					tabButtons[tab.id] = btn;

					var page = document.createElement("section");
					page.className = "pp-page";
					page.id = "pp-page-" + tab.id;
					page.setAttribute("role", "tabpanel");
					page.setAttribute("aria-labelledby", btn.id);
					page.hidden = true;
					tabPages[tab.id] = page;
					bodyEl.append(page);
				});

				function setActiveTab(id, focus) {
					if (!tabPages[id]) id = "theme";
					for (var i = 0; i < TABS.length; i++) {
						var key = TABS[i].id;
						var on = key === id;
						tabButtons[key].setAttribute("aria-selected", on ? "true" : "false");
						tabButtons[key].tabIndex = on ? 0 : -1;
						tabPages[key].hidden = !on;
						tabPages[key].dataset.active = on ? "true" : "false";
					}
					panel.dataset.qxTab = id;
					try { localStorage.setItem(TAB_KEY, id); } catch (_) {}
					if (id === "adv" && typeof themeCodeRefresh === "function") themeCodeRefresh();
					bodyEl.scrollTop = 0;
					if (panel.dataset.qxEmbedded !== "true" && panel.dataset.qxCollapsed === "false"
						&& typeof positionPanel === "function") {
						requestAnimationFrame(function() { positionPanel(); });
					}
					if (focus) tabButtons[id].focus();
				}

				function makeCard(pageId, cardTitle, options) {
					options = options || {};
					var card = document.createElement("section");
					card.className = "pp-card";
					if (options.span) card.dataset.span = "2";
					var head = document.createElement("header");
					head.className = "pp-card-head";
					var text = document.createElement("div");
					var heading = document.createElement("h3");
					heading.className = "pp-card-title";
					heading.textContent = cardTitle;
					text.append(heading);
					if (options.desc) {
						var desc = document.createElement("p");
						desc.className = "pp-card-desc";
						desc.textContent = options.desc;
						text.append(desc);
					}
					head.append(text);
					if (options.action) {
						var action = document.createElement("button");
						action.type = "button";
						action.className = "pp-card-action";
						action.textContent = options.action.label;
						if (options.action.id) action.dataset.action = options.action.id;
						action.addEventListener("click", options.action.onClick);
						head.append(action);
					}
					var cardBody = document.createElement("div");
					cardBody.className = "pp-card-body";
					card.append(head, cardBody);
					tabPages[pageId].append(card);
					return { card: card, body: cardBody };
				}

				function makeGroup(parent, groupTitle) {
					var group = document.createElement("div");
					group.className = "pp-group";
					if (groupTitle) {
						var heading = document.createElement("div");
						heading.className = "pp-group-title";
						heading.textContent = groupTitle;
						group.append(heading);
					}
					var groupBody = document.createElement("div");
					group.append(groupBody);
					parent.append(group);
					return groupBody;
				}

				var themeCard = makeCard("theme", "氛围场景", {
					span: true,
					desc: "配色、流光与动效一键切换；不覆盖你的画卷",
					action: { id: "open-theme-code", label: "打开主题码", onClick: function() { setActiveTab("adv"); } }
				});

				var themeGrid = document.createElement("div");
				themeGrid.className = "pp-theme-grid";
				THEME_PRESETS.forEach(function(preset) {
					var card = document.createElement("button");
					card.type = "button";
					card.className = "pp-theme-card";
					card.dataset.themeId = preset.id;
					var nameEl = document.createElement("span");
					nameEl.className = "pp-theme-name";
					nameEl.textContent = preset.name;
					var descEl = document.createElement("span");
					descEl.className = "pp-theme-desc";
					descEl.textContent = preset.desc;
					card.append(nameEl, descEl);
					card.addEventListener("click", function() {
						lastSceneBucket = currentSceneBucket();
						applyThemePack(preset);
					});
					themeGrid.append(card);
				});
				themeCard.body.append(themeGrid);

				// 0.8.1 按时间自动轮换：只切场景观感，不动字体与画卷
				var sceneOptions = THEME_PRESETS.map(function(preset) { return [preset.id, preset.name]; });
				themeCard.body.append(makeToggle("按时间自动轮换（白天 / 夜间）", "sceneRotation", function() { syncSceneRotation(true); }));
				themeCard.body.append(makeSelectRow("白天场景", "sceneDay", sceneOptions));
				themeCard.body.append(makeSelectRow("夜间场景", "sceneNight", sceneOptions));
				var rotateNote = document.createElement("div");
				rotateNote.className = "pp-note";
				rotateNote.textContent = "6:00–18:00 用白天场景，其余时间用夜间场景；只切换流光与动效，不覆盖字体、配色与画卷。";
				themeCard.body.append(rotateNote);

				var themeActions = document.createElement("div");
				themeActions.className = "pp-row pp-theme-actions";
				var exportThemeBtn = document.createElement("button");
				exportThemeBtn.type = "button";
				exportThemeBtn.className = "pp-btn";
				exportThemeBtn.textContent = "导出主题";
				exportThemeBtn.title = "导出当前外观参数（不含画卷）";
				exportThemeBtn.addEventListener("click", downloadThemePack);
				var importThemeBtn = document.createElement("button");
				importThemeBtn.type = "button";
				importThemeBtn.className = "pp-btn";
				importThemeBtn.textContent = "导入主题";
				var themeFile = document.createElement("input");
				themeFile.type = "file";
				themeFile.accept = ".json,application/json";
				themeFile.style.display = "none";
				themeFile.addEventListener("change", function() {
					importThemeFile(themeFile.files && themeFile.files[0]);
					themeFile.value = "";
				});
				importThemeBtn.addEventListener("click", function() { themeFile.click(); });
				themeActions.append(exportThemeBtn, importThemeBtn);
				themeCard.body.append(themeActions, themeFile);

				var themeNote = document.createElement("div");
				themeNote.className = "pp-note";
				themeNote.textContent = "场景同时切换流光形态：剑气 / 飘雪 / 夜雨 / 星屑。主题包只包含配色与动效参数，不包含画卷；应用场景不会覆盖你的背景图。文件上限 1MB。";
				themeCard.body.append(themeNote);

				var bgCard = makeCard("bg", "背景画卷", {
					span: true,
					desc: "亮/暗两套画卷；支持 PNG / JPG / WebP / GIF，单张 ≤10MB"
				});
				var bgSource = makeGroup(bgCard.body, "来源");
				bgSource.append(makeBgRow("亮色形态", "lightBackground"));
				bgSource.append(makeBgRow("暗色形态", "darkBackground"));
				var bgCompose = makeGroup(bgCard.body, "构图");
				bgCompose.append(makeSelectRow("填充方式", "bgFit", [["cover", "覆盖裁切"], ["contain", "完整显示"]]));
				bgCompose.append(makeSlider("水平焦点", "bgFocusX", 0, 100, 5, function(v) { return v + "%"; }));
				bgCompose.append(makeSlider("垂直焦点", "bgFocusY", 0, 100, 5, function(v) { return v + "%"; }));
				bgCompose.append(makeToggle("壁纸视差（跟随鼠标）", "bgParallax", function() {
					if (!paletteSettings.bgParallax) syncBackdrop();
					else hotkeyToast("壁纸视差已开启，移动鼠标试试");
				}));
				bgCompose.append(makeSlider("视差强度", "bgParallaxStrength", 0, 100, 10, function(v) { return v + "%"; }));
				var bgRotate = makeGroup(bgCard.body, "轮播");
				bgRotate.append(makeToggle("URL 轮播", "bgRotationOn", function() { rotationIndex = 0; startBgRotation(); }));
				bgRotate.append(makeSlider("轮播间隔", "bgRotationMinutes", 5, 1440, 5, function(v) { return v + " 分钟"; }));
				var rotationTa = document.createElement("textarea");
				rotationTa.className = "pp-theme-textarea pp-rotation-textarea";
				rotationTa.placeholder = "每行一个 http(s) 图片 URL（最多 20 个）";
				rotationTa.value = (paletteSettings.bgRotation || []).join("\n");
				var rotationBtn = document.createElement("button");
				rotationBtn.type = "button";
				rotationBtn.className = "pp-btn";
				rotationBtn.textContent = "应用轮播列表";
				rotationBtn.addEventListener("click", function() {
					var lines = String(rotationTa.value || "").split(/\r?\n/).map(function(s) { return s.trim(); }).filter(Boolean);
					var urls = [];
					for (var i = 0; i < lines.length; i++) {
						var u = safeBgUrl(lines[i]);
						if (!u) { showStatus("✗ 第 " + (i + 1) + " 行不是有效 http(s) URL"); return; }
						urls.push(u);
					}
					if (urls.length > 20) { showStatus("✗ 最多 20 个 URL"); return; }
					paletteSettings.bgRotation = urls;
					rotationIndex = 0;
					applyPaletteSettings();
					savePaletteSettings(true);
					rebuildPanel();
					showStatus("✓ 轮播列表已保存（" + urls.length + " 个）");
				});
				var rotationWrap = document.createElement("div");
				rotationWrap.className = "pp-rotation";
				rotationWrap.append(rotationTa, rotationBtn);
				bgRotate.append(rotationWrap);
				var rotationNote = document.createElement("div");
				rotationNote.className = "pp-note";
				rotationNote.textContent = "轮播会覆盖亮/暗自定义画卷；关闭「URL 轮播」后恢复。间隔到点只重绘，不写盘；最多 20 个 URL。";
				bgRotate.append(rotationNote);

				var videoCard = makeCard("bg", "动态画卷", {
					span: true,
					desc: "本地视频随亮/暗形态切换；远程地址在「高级」"
				});
				var videoSource = makeGroup(videoCard.body, "来源");
				videoSource.append(makeToggle("启用视频壁纸", "bgVideoEnabled"));
				videoSource.append(makeVideoRow("亮色形态", "lightVideoId"));
				videoSource.append(makeVideoRow("暗色形态", "darkVideoId"));
				var remoteRow = document.createElement("div");
				remoteRow.className = "pp-row";
				var remoteLabel = document.createElement("label");
				remoteLabel.textContent = "远程视频地址";
				var remoteBtn = document.createElement("button");
				remoteBtn.type = "button";
				remoteBtn.className = "pp-btn";
				remoteBtn.textContent = "管理 →";
				remoteBtn.addEventListener("click", function() { setActiveTab("adv"); });
				remoteRow.append(remoteLabel, remoteBtn);
				videoSource.append(remoteRow);
				var videoPlay = makeGroup(videoCard.body, "播放");
				videoPlay.append(makeToggle("低功耗（失焦暂停）", "bgVideoLowPower"));
				videoPlay.append(makeToggle("兼容播放（完整下载）", "bgVideoCompat"));
				var videoNote = document.createElement("div");
				videoNote.className = "pp-note";
				videoNote.textContent = "本地 MP4(H.264)/WebM(VP9) ≤64MB；视频播放时 URL 轮播暂停，填充/焦点同时作用于视频。";
				videoCard.body.append(videoNote);

				var readCard = makeCard("read", "阅读清晰度", {
					span: true,
					desc: "文字与底色的对比；浅色下可配合面板磨砂"
				});
				readCard.body.append(makeToggle("文字对比增强", "textContrastBoost"));
				readCard.body.append(makeSlider("背景遮罩浓度", "scrimOpacity", 20, 95, 5, function(v) { return v + "%"; }));
				readCard.body.append(makeSlider("面板不透明度", "panelOpacity", 30, 100, 5, function(v) { return v + "%"; }));
				readCard.body.append(makeSlider("正文字号缩放", "fontScale", 85, 125, 5, function(v) { return v + "%"; }));
				// 自校验：直接读对话正文的实测像素字号，滑块有没有真落地一眼可见。
				fontReadoutEl = document.createElement("div");
				fontReadoutEl.className = "pp-note";
				readCard.body.append(fontReadoutEl);
				var clarityTip = document.createElement("div");
				clarityTip.className = "pp-note pp-tip";
				clarityTip.textContent = "浅色下若正文或绿色行内引用仍不够清晰，建议到「界面 → 对话与面板」开启面板磨砂玻璃：面板底色更实，对比度更高。";
				readCard.body.append(clarityTip);

				// ── 个性定制：字体与排版 / 配色与强调色 ──
				var typeCard = makeCard("read", "字体与排版", {
					desc: "只作用于对话正文与代码",
					action: {
						id: "reset-type",
						label: "恢复",
						onClick: function() {
							paletteSettings.fontUi = "system";
							paletteSettings.fontCode = "system";
							paletteSettings.lineHeight = 1.7;
							paletteSettings.letterSpacing = 0;
							applyPaletteSettings();
							savePaletteSettings(true);
							rebuildPanel();
							showStatus("✓ 字体与排版已恢复推荐");
						}
					}
				});

				var preview = document.createElement("div");
				preview.className = "qx-type-preview";
				preview.title = "预览示例，不可点击";
				var pvBadge = document.createElement("span");
				pvBadge.className = "qx-type-preview-badge";
				pvBadge.textContent = "预 览";
				var pvText = document.createElement("div");
				pvText.className = "qx-type-preview-text";
				pvText.textContent = "清宵照夜，剑鸣如歌。The quick brown fox 0123。";
				var pvMeta = document.createElement("div");
				pvMeta.className = "qx-type-preview-meta";
				var pvCode = document.createElement("code");
				pvCode.textContent = "npm run build";
				var pvLink = document.createElement("span");
				pvLink.className = "qx-type-preview-link";
				pvLink.textContent = "链接示例";
				var pvFaint = document.createElement("span");
				pvFaint.className = "qx-type-preview-faint";
				pvFaint.textContent = "次级说明文字";
				pvMeta.append(pvCode, pvLink, pvFaint);
				preview.append(pvBadge, pvText, pvMeta);
				typeCard.body.append(preview);
				var previewNote = document.createElement("div");
				previewNote.className = "pp-note";
				previewNote.textContent = "预览示例，不可点击；字体与色板在下方选择。";
				typeCard.body.append(previewNote);

				var uiFontOptions = QX_FONT_UI.map(function(f) { return [f.id, f.label]; });
				var codeFontOptions = QX_FONT_CODE.map(function(f) { return [f.id, f.label]; });
				if (paletteSettings.customFont) {
					uiFontOptions.push(["custom", "自定义字体"]);
					codeFontOptions.push(["custom", "自定义字体"]);
				}
				typeCard.body.append(makeSelectRow("正文字体", "fontUi", uiFontOptions));
				typeCard.body.append(makeSelectRow("代码字体", "fontCode", codeFontOptions));
				var fontRow = document.createElement("div");
				fontRow.className = "pp-row pp-font-row";
				var fontRowLabel = document.createElement("label");
				fontRowLabel.textContent = "自定义字体";
				var fontRowCtl = document.createElement("div");
				fontRowCtl.className = "pp-font-actions";
				var fontName = document.createElement("span");
				fontName.className = "pp-font-name";
				fontName.textContent = paletteSettings.customFont ? paletteSettings.customFont.name : "未上传";
				var uploadFontBtn = document.createElement("button");
				uploadFontBtn.type = "button";
				uploadFontBtn.className = "pp-btn";
				uploadFontBtn.textContent = paletteSettings.customFont ? "更换" : "上传";
				var removeFontBtn = document.createElement("button");
				removeFontBtn.type = "button";
				removeFontBtn.className = "pp-btn";
				removeFontBtn.textContent = "移除";
				removeFontBtn.hidden = !paletteSettings.customFont;
				var fontFile = document.createElement("input");
				fontFile.type = "file";
				fontFile.accept = ".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf";
				fontFile.style.display = "none";
				uploadFontBtn.addEventListener("click", function() { fontFile.click(); });
				fontFile.addEventListener("change", function() {
					var file = fontFile.files && fontFile.files[0];
					fontFile.value = "";
					if (!file) return;
					if (!/\.(woff2?|ttf|otf)$/i.test(file.name)) { showStatus("✗ 只支持 woff / woff2 / ttf / otf"); return; }
					if (file.size > 5 * 1024 * 1024) { showStatus("✗ 字体文件不能超过 5MB"); return; }
					var reader = new FileReader();
					reader.onload = function() {
						// 浏览器对 ttf/otf 常给出 application/octet-stream，统一成 font/* 才能通过服务端白名单
						var mime = /\.woff2$/i.test(file.name) ? "font/woff2"
							: /\.woff$/i.test(file.name) ? "font/woff"
							: /\.otf$/i.test(file.name) ? "font/otf" : "font/ttf";
						var dataUrl = String(reader.result || "").replace(/^data:[^;,]*/, "data:" + mime);
						paletteSettings.customFont = { name: String(file.name).slice(0, 60), data: dataUrl };
						paletteSettings.fontUi = "custom";
						applyPaletteSettings();
						savePaletteSettings(true);
						rebuildPanel();
						showStatus("✓ 已应用自定义字体");
					};
					reader.onerror = function() { showStatus("✗ 读取字体失败"); };
					reader.readAsDataURL(file);
				});
				removeFontBtn.addEventListener("click", function() {
					paletteSettings.customFont = null;
					if (paletteSettings.fontUi === "custom") paletteSettings.fontUi = "system";
					if (paletteSettings.fontCode === "custom") paletteSettings.fontCode = "system";
					applyPaletteSettings();
					savePaletteSettings(true);
					rebuildPanel();
					showStatus("✓ 已移除自定义字体");
				});
				fontRowCtl.append(fontName, uploadFontBtn, removeFontBtn, fontFile);
				fontRow.append(fontRowLabel, fontRowCtl);
				typeCard.body.append(fontRow);
				var fontNote = document.createElement("div");
				fontNote.className = "pp-note";
				fontNote.textContent = "字体只作用于对话正文与代码，不改变 DSH 工具栏；只列系统字体，缺失时自动回退。自定义字体 ≤5MB，随完整备份导出，不进入主题包。";
				typeCard.body.append(fontNote);
				typeCard.body.append(makeSlider("行高", "lineHeight", 1.3, 2, 0.05, function(v) { return Number(v).toFixed(2); }));
				typeCard.body.append(makeSlider("字距", "letterSpacing", -0.02, 0.08, 0.01, function(v) { return Number(v).toFixed(2) + "em"; }));

				var colorCard = makeCard("read", "配色与强调色", {
					desc: "强调色会自动校正到可读对比度",
					action: {
						id: "reset-color",
						label: "恢复",
						onClick: function() {
							paletteSettings.paletteId = "jade";
							paletteSettings.accentColor = null;
							applyPaletteSettings();
							savePaletteSettings(true);
							rebuildPanel();
							showStatus("✓ 配色已恢复青碧");
						}
					}
				});
				var chipsWrap = document.createElement("div");
				chipsWrap.className = "pp-palette-chips";
				colorCard.body.append(chipsWrap);
				var chipButtons = [];
				QX_PALETTES.forEach(function(p) {
					var chip = document.createElement("button");
					chip.type = "button";
					chip.className = "pp-palette-chip";
					chip.dataset.accentId = p.id;
					chip.title = p.label;
					var dot = document.createElement("i");
					dot.style.background = p.accent;
					var name = document.createElement("span");
					name.textContent = p.label;
					chip.append(dot, name);
					chip.addEventListener("click", function() {
						paletteSettings.paletteId = p.id;
						paletteSettings.accentColor = null;
						syncAccentSheet();
						savePaletteSettings();
						syncChips();
						syncColorRow();
					});
					chipButtons.push(chip);
					chipsWrap.append(chip);
				});

				var colorRow = document.createElement("div");
				colorRow.className = "pp-row pp-color-row";
				var colorLab = document.createElement("label");
				colorLab.textContent = "强调色";
				colorLab.htmlFor = "pp-accent-color";
				var colorWrap = document.createElement("div");
				colorWrap.className = "pp-color-wrap";
				var colorInput = document.createElement("input");
				colorInput.type = "color";
				colorInput.className = "pp-color";
				colorInput.id = "pp-accent-color";
				colorInput.setAttribute("aria-label", "强调色");
				var hexInput = document.createElement("input");
				hexInput.type = "text";
				hexInput.className = "pp-input pp-hex";
				hexInput.setAttribute("aria-label", "强调色十六进制值");
				hexInput.maxLength = 7;
				hexInput.spellcheck = false;
				hexInput.placeholder = "#2E9E98";
				var followBtn = document.createElement("button");
				followBtn.type = "button";
				followBtn.className = "pp-btn pp-hex-apply";
				followBtn.textContent = "跟随色板";
				colorWrap.append(colorInput, hexInput, followBtn);
				colorRow.append(colorLab, colorWrap);
				colorCard.body.append(colorRow);

				function currentAccent() {
					return qxNormalizeHex(paletteSettings.accentColor) || qxPaletteById(paletteSettings.paletteId).accent;
				}
				function syncChips() {
					chipButtons.forEach(function(btn) {
						var active = !paletteSettings.accentColor && btn.dataset.accentId === paletteSettings.paletteId;
						btn.dataset.active = active ? "true" : "false";
					});
				}
				function syncColorRow() {
					var value = currentAccent();
					colorInput.value = value;
					hexInput.value = paletteSettings.accentColor ? value : "";
					hexInput.placeholder = value;
				}
				colorInput.addEventListener("input", function() {
					paletteSettings.accentColor = qxNormalizeHex(colorInput.value);
					// 只改强调色时不必重跑 backdrop/粒子/毛玻璃：重写小样式表即可
					syncAccentSheet();
					savePaletteSettings();
					syncChips();
					syncColorRow();
				});
				hexInput.addEventListener("change", function() {
					var next = qxNormalizeHex(hexInput.value);
					if (!next) {
						showStatus("✗ 颜色格式应为 #RRGGBB");
						syncColorRow();
						return;
					}
					paletteSettings.accentColor = next;
					syncAccentSheet();
					savePaletteSettings();
					syncChips();
					syncColorRow();
				});
				followBtn.addEventListener("click", function() {
					paletteSettings.accentColor = null;
					syncAccentSheet();
					savePaletteSettings();
					syncChips();
					syncColorRow();
				});
				syncChips();
				syncColorRow();

				var customNote = document.createElement("div");
				customNote.className = "pp-note";
				customNote.textContent = "强调色用于链接、主按钮、聚焦边框、选区与流光，并自动校正到可读对比度；行内代码、文件引用与成功状态配色保持不变。";
				colorCard.body.append(customNote);

				var uiCard = makeCard("ui", "对话与面板", {
					desc: "内容宽度与面板磨砂；磨砂依赖毛玻璃总开关"
				});
				uiCard.body.append(makeSlider("对话区宽度", "contentWidth", 500, 1000, 20, function(v) { return v + "px"; }));
				var blurHint = document.createElement("div");
				blurHint.className = "pp-note pp-tip";
				var syncBlurHint = function() {
					var on = !!paletteSettings.panelBlur;
					blurHint.dataset.on = on ? "true" : "false";
					blurHint.textContent = on
						? "✓ 已开启面板磨砂玻璃：面板底色更实，浅色主题下的正文、行内代码和文件引用更清晰。"
						: "建议开启：面板磨砂玻璃让面板底色更实，浅色主题下的正文、行内代码和文件引用明显更清晰。";
				};
				syncBlurHint();
				uiCard.body.append(makeToggle("面板磨砂玻璃", "panelBlur", syncBlurHint));
				uiCard.body.append(makeToggle("聊天区上下渐隐", "chatEdgeFade"));
				uiCard.body.append(blurHint);

				var composerCard = makeCard("ui", "输入框质感", {
					desc: "液态玻璃流光，跟随深浅主题"
				});
				composerCard.body.append(makeToggle("液态玻璃输入框", "liquidComposer"));
				composerCard.body.append(makeToggle("鼠标光晕跟随", "composerGlow"));
				var composerNote = document.createElement("div");
				composerNote.className = "pp-note";
				composerNote.textContent = "关闭液态玻璃会恢复 DSH 原版输入框；鼠标光晕只在悬停输入框时显示，可单独关闭。";
				composerCard.body.append(composerNote);

				// 毛玻璃虚化：总开关 + 两个分项子开关 + 独立强度（0–30px，0=关闭等效）。
				// 关掉的分项对应 CSS 整条不匹配，backdrop-filter 彻底不存在（省 GPU 合成层）。
				var frostCard = makeCard("ui", "毛玻璃虚化", {
					desc: "插件窗与侧栏的虚化强度"
				});
				frostCard.body.append(makeToggle("毛玻璃虚化（总开关）", "frostMaster"));
				frostCard.body.append(makeToggle("插件独立窗", "frostPlugin"));
				frostCard.body.append(makeToggle("原生面板（侧栏/详情栏）", "frostNative"));
				frostCard.body.append(makeSlider("虚化强度", "frostBlur", 0, 30, 1, function(v) { return v === 0 ? "关闭" : v + "px"; }));
				var frostNote = document.createElement("div");
				frostNote.className = "pp-note";
				frostNote.textContent = "强度 0 等同于关闭；总开关关闭时所有虚化层（含面板磨砂）一并移除。";
				frostCard.body.append(frostNote);

				var fxCard = makeCard("ui", "动效与流光", {
					desc: "开屏动画与粒子装饰"
				});
				fxCard.body.append(makeToggle("开屏动画（线稿上色）", "bootAnimation"));
				fxCard.body.append(makeToggle("启用流光", "particles"));
				fxCard.body.append(makeSlider("流光数量", "particleCount", 0, 60, 2, function(v) { return String(v); }));
				fxCard.body.append(makeSlider("流光速度", "particleSpeed", 20, 200, 10, function(v) { return v + "%"; }));
				fxCard.body.append(makeToggle("节日彩蛋（鎏金点缀）", "holidayEggs"));

				// ── 0.8.0 性能与特效 ──
				var perfCard = makeCard("ui", "性能与特效", {
					desc: "特效强度 · 掉帧自动降级 · 低功耗"
				});
				perfCard.body.append(makeSlider("特效强度", "effectIntensity", 20, 100, 10, function(v) { return v + "%"; }));
				perfCard.body.append(makeToggle("掉帧自动降级", "autoDegrade", updatePerfStatus));
				perfCard.body.append(makeToggle("低功耗模式", "lowPower", updatePerfStatus));
				perfCard.body.append(makeToggle("电池低电量自动省电", "batterySaver", updatePerfStatus));
				var perfStatus = document.createElement("div");
				perfStatus.className = "pp-note pp-perf-status";
				var perfLow = paletteSettings.lowPower || autoPerfLow;
				perfStatus.textContent = "当前：" + (paletteSettings.lowPower ? "低功耗模式" : (autoPerfLow ? "已自动降级" : "标准")) + (lastFps ? " · 约 " + Math.round(lastFps) + " FPS" : "");
				perfCard.body.append(perfStatus);
				var perfTip = document.createElement("div");
				perfTip.className = "pp-tip";
				perfTip.textContent = "强度低于 40% 会停掉极光漂移与描边呼吸；自动降级在连续掉帧时把粒子减半并停掉最贵的动画，恢复后自动回到标准。";
				perfCard.body.append(perfTip);
				setTimeout(updatePerfStatus, 400);

				// ── 高级：远程视频 / 主题码 / 人格与诊断 ──
				var advVideoCard = makeCard("adv", "远程视频", {
					desc: "https；浏览器直连，对方可见你的 IP"
				});
				advVideoCard.body.append(makeVideoUrlRow("亮色形态", "lightVideoId"));
				advVideoCard.body.append(makeVideoUrlRow("暗色形态", "darkVideoId"));
				var advVideoNote = document.createElement("div");
				advVideoNote.className = "pp-note";
				advVideoNote.textContent = "本机 http 仅限 localhost/127.0.0.1；不支持 HLS/DASH；清除入口在「画卷 · 动态画卷」。";
				advVideoCard.body.append(advVideoNote);

				var advCodeCard = makeCard("adv", "主题码", {
					desc: "复制分享，或粘贴应用"
				});
				buildThemeCodeEditor(advCodeCard.body);
				var advCodeNote = document.createElement("div");
				advCodeNote.className = "pp-note";
				advCodeNote.textContent = "主题码与 .qx-theme.json 等价，不含画卷与视频。";
				advCodeCard.body.append(advCodeNote);

				var advToolsCard = makeCard("adv", "备份与引导", {
					span: true,
					desc: "完整备份、全局快捷键与新手引导"
				});
				advToolsCard.body.append(makeToggle("启用全局快捷键", "hotkeys"));
				HOTKEY_ACTIONS.forEach(function(def) {
					var row = document.createElement("div");
					row.className = "pp-row";
					row.dataset.key = def.key;
					var label = document.createElement("label");
					label.textContent = def.label;
					var ctl = document.createElement("div");
					ctl.className = "pp-hotkey-actions";
					var code = document.createElement("span");
					code.className = "pp-hotkey-code";
					code.textContent = recordingHotkey === def.key ? "按下组合键…" : paletteSettings[def.key];
					var btn = document.createElement("button");
					btn.type = "button";
					btn.className = "pp-btn";
					btn.textContent = recordingHotkey === def.key ? "取消" : "录制";
					btn.addEventListener("click", function() {
						recordingHotkey = recordingHotkey === def.key ? "" : def.key;
						rebuildPanel();
					});
					ctl.append(code, btn);
					row.append(label, ctl);
					advToolsCard.body.append(row);
				});
				var keyNote = document.createElement("div");
				keyNote.className = "pp-note";
				keyNote.textContent = "点「录制」后按下组合键，需要 Ctrl / Alt / Meta 或 F 键；Esc 取消。输入框内不触发；桌面壳吞掉的组合键可以在这里换成 F9 之类的键。";
				advToolsCard.body.append(keyNote);
				var toolRow = document.createElement("div");
				toolRow.className = "pp-row pp-tool-row";
				var backupBtn = document.createElement("button");
				backupBtn.type = "button";
				backupBtn.className = "pp-btn";
				backupBtn.textContent = "导出完整备份";
				var restoreBtn = document.createElement("button");
				restoreBtn.type = "button";
				restoreBtn.className = "pp-btn";
				restoreBtn.textContent = "从备份恢复";
				var guideBtn = document.createElement("button");
				guideBtn.type = "button";
				guideBtn.className = "pp-btn";
				guideBtn.textContent = "新手引导";
				var backupFile = document.createElement("input");
				backupFile.type = "file";
				backupFile.accept = ".json,application/json";
				backupFile.style.display = "none";
				backupBtn.addEventListener("click", downloadBackup);
				restoreBtn.addEventListener("click", function() { backupFile.click(); });
				backupFile.addEventListener("change", function() {
					restoreBackupFile(backupFile.files && backupFile.files[0]);
					backupFile.value = "";
				});
				guideBtn.addEventListener("click", function() { showOnboarding(true); });
				toolRow.append(backupBtn, restoreBtn, guideBtn, backupFile);
				advToolsCard.body.append(toolRow);
				var backupNote = document.createElement("div");
				backupNote.className = "pp-note";
				backupNote.textContent = "完整备份包含设置、画卷与自定义字体；本地视频文件不随备份迁移，换机器后需重新选择视频。";
				advToolsCard.body.append(backupNote);

				var advPeopleCard = makeCard("adv", "人格与诊断", {
					span: true,
					desc: "跳转到人格设置；只读体检"
				});
				var jumpRow = document.createElement("div");
				jumpRow.className = "pp-row";
				var jumpBtn = document.createElement("button");
				jumpBtn.className = "pp-btn pp-jump";
				jumpBtn.type = "button";
				jumpBtn.textContent = "跳转到人格设置";
				jumpBtn.title = "打开官方设置页并定位到「人格」分区";
				jumpBtn.addEventListener("click", openPersonaSettings);
				jumpRow.append(jumpBtn);
				advPeopleCard.body.append(jumpRow);
				var diagActions = document.createElement("div");
				diagActions.className = "pp-row pp-theme-actions";
				var diagBtn = document.createElement("button");
				diagBtn.type = "button";
				diagBtn.className = "pp-btn";
				diagBtn.textContent = "运行体检";
				var diagCopy = document.createElement("button");
				diagCopy.type = "button";
				diagCopy.className = "pp-btn";
				diagCopy.textContent = "复制报告";
				diagCopy.disabled = true;
				diagActions.append(diagBtn, diagCopy);
				advPeopleCard.body.append(diagActions);
				var diagNote = document.createElement("div");
				diagNote.className = "pp-note";
				diagNote.textContent = "只读检查：宿主版本、boot graph、皮肤标记、设置/诊断接口、dshmarket 禁用与 patch 行。不会修改任何配置。";
				advPeopleCard.body.append(diagNote);
				var diagPre = document.createElement("pre");
				diagPre.className = "pp-diagnose";
				diagPre.textContent = "点击「运行体检」…";
				advPeopleCard.body.append(diagPre);

				var diagTimeout = function(promise, ms) {
					return Promise.race([
						promise,
						new Promise(function(_, reject) { setTimeout(function() { reject(new Error("timeout")); }, ms); })
					]);
				};
				var runDiagnose = function() {
					diagBtn.disabled = true;
					diagBtn.textContent = "检查中…";
					var report = { at: new Date().toISOString(), client: {}, settings: null, server: null, errors: [] };
					var boot = window.__DSH_BOOT__ || {};
					report.client = {
						title: document.title,
						root: !!document.getElementById("root"),
						bodyAttr: document.body.hasAttribute("data-dsh-qingxiao"),
						qxCount: document.querySelectorAll("[class*='qx-']").length,
						styleTags: Array.prototype.map.call(document.querySelectorAll("style[data-skin-chrome]"), function(s) { return s.getAttribute("data-skin-chrome"); }),
						bootEntries: (boot.entries || []).length,
						qingxiaoInBoot: (boot.entries || []).some(function(e) { return /qingxiao/i.test(e.id || ""); }),
						release: boot.release || null,
						heroBtn: !!document.querySelector(".qx-hero-persona-btn"),
						rightPanel: !!document.querySelector("[data-sidebar-right-panel]")
					};
					var p1 = diagTimeout(fetch("/api/dsh-qingxiao/settings").then(function(r) { report.settings = { status: r.status }; }), 5000)
						.catch(function(e) { report.errors.push("settings: " + (e.message || e)); });
					var p2 = diagTimeout(fetch("/api/dsh-qingxiao/diagnose").then(function(r) {
						if (!r.ok) { report.server = { status: r.status }; return; }
						return r.json().then(function(j) { report.server = j; });
					}), 5000).catch(function(e) { report.errors.push("diagnose: " + (e.message || e)); });
					Promise.all([p1, p2]).then(function() {
						var c = report.client;
						var s = report.server || {};
						var lines = [];
						lines.push("宿主: " + ((c.release && c.release.version) || "?") + (c.release && c.release.commit ? " (" + c.release.commit + ")" : ""));
						lines.push("页面: " + (c.title || "(空)") + " · #root " + (c.root ? "✓" : "✗") + " · body 标记 " + (c.bodyAttr ? "✓" : "✗"));
						lines.push("boot graph: " + c.bootEntries + " 项 · 清宵 " + (c.qingxiaoInBoot ? "✓ 已收录" : "✗ 未收录"));
						lines.push("皮肤样式: " + (c.styleTags.join(", ") || "无") + " · qx 节点 " + c.qxCount + " · Hero 键 " + (c.heroBtn ? "✓" : "✗"));
						lines.push("设置接口: " + (report.settings ? "HTTP " + report.settings.status : "失败"));
						lines.push("诊断接口: " + (s.ok ? "✓" : "失败" + (s.status ? " (HTTP " + s.status + ")" : "")));
						if (s.market) lines.push("dshmarket: " + (s.market.disabled ? "✗ 被禁用（从 state.json 的 disabled 移除）" : "✓ 未禁用"));
						if (s.patch) {
							lines.push("patch 行: " + (!s.patch.found ? "未找到" : (s.patch.disabled ? "✗ 存在 disabled:true" : (s.patch.forced ? "✓ disabled:false" : "未设置 disabled"))));
						}
						if (report.errors.length) lines.push("错误: " + report.errors.join("; "));
						diagPre.textContent = lines.join("\n") + "\n\n" + JSON.stringify(report, null, 2);
						diagBtn.disabled = false;
						diagBtn.textContent = "重新体检";
						diagCopy.disabled = false;
						showStatus("✓ 体检完成");
					});
				};
				diagBtn.addEventListener("click", runDiagnose);
				diagCopy.addEventListener("click", function() {
					copyText(diagPre.textContent || "", "✓ 体检报告已复制");
				});

				var footer = document.createElement("div");
				footer.className = "pp-footer";
				statusLine = document.createElement("div");
				statusLine.className = "pp-status";
				statusLine.setAttribute("role", "status");
				statusLine.setAttribute("aria-live", "polite");
				statusLine.setAttribute("aria-atomic", "true");
				footer.append(statusLine);
				var footerActions = document.createElement("div");
				footerActions.className = "pp-footer-actions";
				var footerReset = document.createElement("button");
				footerReset.type = "button";
				footerReset.className = "pp-footer-reset";
				footerReset.textContent = "恢复默认";
				var resetTimer = null;
				footerReset.addEventListener("click", function() {
					if (footerReset.dataset.confirm === "true") {
						if (resetTimer) clearTimeout(resetTimer);
						resetPaletteSettings();
						return;
					}
					footerReset.dataset.confirm = "true";
					footerReset.textContent = "确认恢复？";
					showStatus("再点一次恢复默认；不会删除已上传媒体");
					resetTimer = setTimeout(function() {
						if (footerReset.isConnected) {
							footerReset.dataset.confirm = "false";
							footerReset.textContent = "恢复默认";
						}
					}, 3000);
				});
				var footerPos = document.createElement("button");
				footerPos.type = "button";
				footerPos.className = "pp-footer-reposition";
				footerPos.textContent = "回位";
				footerPos.title = "把右上角的清宵按钮复位到窗口右上角";
				footerPos.addEventListener("click", function() {
					if (typeof resetTogglePos === "function") resetTogglePos();
				});
				footerActions.append(footerReset, footerPos);
				footer.append(footerActions);

				panel.append(header, advice, tabbar, bodyEl, footer);
				setActiveTab(panel.dataset.qxTab || readTab());
				syncPresetState();
				syncDependencyState();
			}

			var palettePanelEl = null;
			function rebuildPanel() {
				if (disposed) return;
				var embedded = !!(palettePanelEl && palettePanelEl.dataset.qxEmbedded === "true");
				var parent = embedded && palettePanelEl.parentElement && palettePanelEl.parentElement.isConnected ? palettePanelEl.parentElement : body;
				if (embedded && parent === body) embedded = false;
				var collapsed = palettePanelEl ? palettePanelEl.dataset.qxCollapsed : "true";
				// 重建前保存标签页、滚动位置与焦点，避免应用主题/上传后跳回顶部
				var activeTab = palettePanelEl ? palettePanelEl.dataset.qxTab : null;
				var oldBody = palettePanelEl ? palettePanelEl.querySelector(".pp-body") : null;
				var scrollTop = oldBody ? oldBody.scrollTop : 0;
				var hadFocus = !!(palettePanelEl && palettePanelEl.contains(document.activeElement));
				if (palettePanelEl) palettePanelEl.remove();
				palettePanelEl = document.createElement("div");
				palettePanelEl.dataset.skinChrome = "palette-panel";
				palettePanelEl.dataset.skinOwner = SKIN_OWNER;
				palettePanelEl.dataset.qxEmbedded = embedded ? "true" : "false";
				palettePanelEl.dataset.qxCollapsed = embedded ? "false" : (collapsed || "true");
				if (activeTab) palettePanelEl.dataset.qxTab = activeTab;
				buildPanelInto(palettePanelEl);
				parent.append(palettePanelEl);
				var newBody = palettePanelEl.querySelector(".pp-body");
				if (newBody && scrollTop) newBody.scrollTop = scrollTop;
				if (hadFocus) {
					var currentTab = palettePanelEl.querySelector('.pp-tab[aria-selected="true"]');
					if (currentTab) currentTab.focus({ preventScroll: true });
				}
				syncFontReadout();
				if (!embedded && palettePanelEl.dataset.qxCollapsed === "false") positionPanel();
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
				// 宽度以 CSS 为准，避免第二份 304/320 常量不同步
				var pw = palettePanelEl.offsetWidth || 320;
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
				if (palettePanelEl && palettePanelEl.dataset.qxEmbedded === "true") return;
				if (!palettePanelEl) rebuildPanel();
				var wasOpen = palettePanelEl.dataset.qxCollapsed === "false";
				palettePanelEl.dataset.qxCollapsed = wasOpen ? "true" : "false";
				var panelHeader = palettePanelEl.querySelector(".pp-header");
				if (panelHeader) panelHeader.setAttribute("aria-expanded", wasOpen ? "false" : "true");
				if (!wasOpen) positionPanel();
			});
			body.append(toggleBtn);

			// ── 0.8.1 全局快捷键 ──
			var sceneCycleIndex = -1;
			function cycleScene() {
				sceneCycleIndex = (sceneCycleIndex + 1) % THEME_PRESETS.length;
				var preset = THEME_PRESETS[sceneCycleIndex];
				lastSceneBucket = currentSceneBucket();
				applyThemePack(preset);
			}
			var hotkeyToastEl = null;
			var hotkeyToastTimer = null;
			function hotkeyToast(text) {
				if (!hotkeyToastEl || !hotkeyToastEl.isConnected) {
					hotkeyToastEl = document.createElement("div");
					hotkeyToastEl.dataset.skinChrome = "hotkey-toast";
					hotkeyToastEl.dataset.skinOwner = SKIN_OWNER;
					hotkeyToastEl.setAttribute("aria-hidden", "true");
					body.appendChild(hotkeyToastEl);
				}
				hotkeyToastEl.textContent = text;
				hotkeyToastEl.dataset.on = "true";
				if (hotkeyToastTimer) clearTimeout(hotkeyToastTimer);
				hotkeyToastTimer = setTimeout(function() {
					if (hotkeyToastEl) hotkeyToastEl.remove();
					hotkeyToastEl = null;
				}, 1200);
			}
			function isHotkeyLetter(e, letter) {
				if (e.code) return e.code === "Key" + letter;
				return String(e.key || "").toLowerCase() === letter.toLowerCase();
			}
			var recordingHotkey = "";
			function onHotkey(e) {
				// 录制模式：下一次非修饰键写入对应动作，Esc 取消
				if (recordingHotkey) {
					if (e.key === "Escape") {
						e.preventDefault(); e.stopImmediatePropagation();
						recordingHotkey = "";
						rebuildPanel();
						return;
					}
					if (!e.code || /^(Control|Shift|Alt|Meta)(Left|Right)$/.test(e.code)) return;
					e.preventDefault(); e.stopImmediatePropagation();
					var recorded = comboFromEvent(e);
					if (!comboIsUsable(recorded)) { hotkeyToast("需要 Ctrl / Alt / Meta 组合或 F 键"); return; }
					paletteSettings[recordingHotkey] = recorded;
					recordingHotkey = "";
					savePaletteSettings();
					rebuildPanel();
					hotkeyToast("快捷键已设为 " + recorded);
					return;
				}
				if (!paletteSettings.hotkeys || e.repeat) return;
				var target = e.target;
				if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
				var combo = comboFromEvent(e);
				var hit = null;
				for (var i = 0; i < HOTKEY_ACTIONS.length; i++) {
					if (paletteSettings[HOTKEY_ACTIONS[i].key] === combo) { hit = HOTKEY_ACTIONS[i]; break; }
				}
				if (!hit) return;
				e.preventDefault();
				e.stopImmediatePropagation();
				if (hit.action === "panel") {
					toggleBtn.click();
					hotkeyToast("面板 " + (palettePanelEl && palettePanelEl.dataset.qxCollapsed === "false" ? "已打开" : "已收起"));
				} else if (hit.action === "scene") {
					cycleScene();
					hotkeyToast("已切换场景：" + THEME_PRESETS[Math.max(0, sceneCycleIndex)].name);
				} else if (hit.action === "blur") {
					paletteSettings.panelBlur = !paletteSettings.panelBlur;
					applyPaletteSettings();
					savePaletteSettings();
					if (palettePanelEl) rebuildPanel();
					hotkeyToast("面板磨砂 " + (paletteSettings.panelBlur ? "开" : "关"));
				} else if (hit.action === "liquid") {
					paletteSettings.liquidComposer = !paletteSettings.liquidComposer;
					applyPaletteSettings();
					savePaletteSettings();
					if (palettePanelEl) rebuildPanel();
					hotkeyToast("液态输入框 " + (paletteSettings.liquidComposer ? "开" : "关"));
				}
			}
			window.addEventListener("keydown", onHotkey, true);
			// 具名引用：dispose 时必须能摘掉。匿名监听会让每次 HMR/重挂都多一个 resize
			// 回调，且闭包一直吊着已废弃的按钮 DOM。
			var onWindowResize = function() { clampToggle(); };
			window.addEventListener("resize", onWindowResize);

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
				// 0.2.0-rc.2 起会话槽位改名为 main.conversation（0.1.x 为 conversation）。
				// 迎宾页挂进会话列根内做绝对居中：右栏开关/全屏/缩放时天然跟随输入框，
				// 旧版 50vw+侧栏宽固定公式会脱节（还会把字映到右栏上）。
				var root = document.querySelector(":is([data-slot='main.conversation'], [data-slot='conversation']) > *");
				var on = !!(root && root.getAttribute("data-phase") === "hero");
				heroWelcome.dataset.on = on ? "true" : "false";
				if (on && root && heroWelcome.parentElement !== root) root.appendChild(heroWelcome);
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
			var QX_FROST_HOSTS = "[data-shell-overlay], [data-slot='shell.overlay'], [class*='overlayLayer'], [data-dockkit-host]";
			// 0.2.2-rc.1 起应用不再产出 role=alertdialog（全 asar 仅剩 aria-query 的角色表），摘掉
			var QX_FROST_NATIVE = "[role='dialog'], [role='alert'], [role='menu'], [role='listbox'], [role='tooltip'], [aria-modal='true'], [data-slot^='shell.']";
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
					if (disposed) return;	// t4/t5 nit：HMR 重挂后旧实例的迟到复查不得摘新实例刚打的标（摘标是 class 变化，childList-only 观察器看不见）
					// 0.2.0-rc.2 起侧栏根不再带 data-dsh-sidebar-root：改认布局列
					// [class*='sidebarCol']（应用主框必含布局列，插件窗不含）。
					if (el.isConnected && el.querySelector("[data-conversation-scroll], [class*='sidebarCol']")) {
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
			setTimeout(function() { if (!disposed) showOnboarding(false); }, 1800);
			playBootAnimation(body, paletteSettings, function() { return disposed; });

			// 官方设置页「清宵」分区：把右上角调色盘的同一个 DOM 内嵌进来，
			// 两边共用一套控件与保存链，不复制第二份设置。
			// 必须定义在 apply 作用域内，才能访问 palettePanelEl / disposed / positionPanel。
			function SkinSettingsSection(props) {
				return h(SkinSettingsView, props);
			}
			class SkinSettingsView extends React.Component {
				constructor(props) {
					super(props);
					this._mount = null;
					this._wasCollapsed = null;
				}
				componentDidMount() { this.attachPanel(); }
				componentDidUpdate() { this.attachPanel(); }
				componentWillUnmount() { this.detachPanel(); }
				attachPanel() {
					if (disposed || !this._mount || !palettePanelEl) return;
					if (palettePanelEl.parentElement === this._mount) return;
					this._wasCollapsed = palettePanelEl.dataset.qxCollapsed;
					this._mount.appendChild(palettePanelEl);
					palettePanelEl.dataset.qxCollapsed = "false";
					palettePanelEl.dataset.qxEmbedded = "true";
				}
				detachPanel() {
					if (!palettePanelEl) return;
					if (palettePanelEl.parentElement === this._mount) {
						body.appendChild(palettePanelEl);
						palettePanelEl.dataset.qxEmbedded = "false";
						palettePanelEl.dataset.qxCollapsed = this._wasCollapsed || "true";
						if (palettePanelEl.dataset.qxCollapsed === "false" && typeof positionPanel === "function") positionPanel();
					}
				}
				render() {
					var self = this;
					return h("div", { className: "qx-settings-embed" },
						h("p", { className: "qx-settings-embed-note" }, "这里的设置与右上角「清宵」调色盘完全同步；改哪边都一样。"),
						h("div", { className: "qx-settings-embed-mount", ref: function (el) { self._mount = el; } }));
				}
			}

			// ── 设置页「清宵」与「人格」分区（settings.section 槽）──
			if (ctx.slots && typeof ctx.slots.inject === "function") {
				ctx.slots.inject("settings.section", function () {
					var disposers = [];
					try {
						disposers.push(ctx.slots.register({ name: "settings.section", id: "qingxiao-appearance", order: 15, label: function () { return "清宵主题设置"; } }, SkinSettingsSection));
					} catch (error) {
						console.error("[qx-settings] register failed:", error && error.stack || error);
					}
					try {
						disposers.push(ctx.slots.register({ name: "settings.section", id: "qingxiao-persona", order: 16, label: function () { return "人格"; } }, PersonaSettingsSection));
					} catch (error) {
						console.error("[qx-persona] register failed:", error && error.stack || error);
					}
					return function () {
						disposers.forEach(function (dispose) { try { dispose(); } catch (_) {} });
					};
				});
			}

				// ── 新会话 hero 区「人格」键（DOM 注入到 agentPreset 槽，随 hero 生灭）──
				setupHeroPersona(body, function() { return disposed; });

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
					["data-qx-contrast", "data-qx-blur", "data-qx-composer", "data-qx-gold", "data-qx-charms",
					 "data-qx-frost", "data-qx-frost-plugin", "data-qx-frost-native", "data-qx-dim",
					 "data-qx-particles", "data-qx-fx", "data-qx-perf", "data-qx-paused"].forEach(function(attr) {
						body.removeAttribute(attr);
					});
					styleTag.remove();
					fontSheet.remove();
					customFontSheet.remove();
					accentSheet.remove();
					if (palettePanelEl) palettePanelEl.remove();
					toggleBtn.remove();
					if (heroPersonaCtl) heroPersonaCtl.dispose();
					if (particleField) particleField.remove();
					if (paletteSaveTimer !== null) clearTimeout(paletteSaveTimer);
					if (typeof stopBgRotation === "function") stopBgRotation();
					if (typeof stopVideo === "function") stopVideo();
					if (bgVideoEl) { try { bgVideoEl.removeAttribute("src"); bgVideoEl.load(); } catch (_) {} }
					if (bgVideoBlobUrl) { try { URL.revokeObjectURL(bgVideoBlobUrl); } catch (_) {} bgVideoBlobUrl = null; }
					document.removeEventListener("visibilitychange", onVideoVisibility);
					document.removeEventListener("visibilitychange", onPerfVisibility);
					window.removeEventListener("pointermove", onParallaxPointer);
					if (parallaxTimer) { clearTimeout(parallaxTimer); parallaxTimer = 0; }
					window.removeEventListener("blur", onPerfBlur);
					window.removeEventListener("focus", onPerfFocus);
					window.removeEventListener("keydown", onHotkey, true);
					if (hotkeyToastTimer) clearTimeout(hotkeyToastTimer);
					if (hotkeyToastEl) { hotkeyToastEl.remove(); hotkeyToastEl = null; }
					if (autoPerfFrame) { cancelAnimationFrame(autoPerfFrame); autoPerfFrame = 0; }
					window.removeEventListener("blur", onVideoBlur);
					window.removeEventListener("focus", onVideoFocus);
					document.removeEventListener("click", resumeVideoOnGesture, true);
					document.removeEventListener("keydown", resumeVideoOnGesture, true);
					if (videoMotionQuery && videoMotionQuery.removeEventListener) videoMotionQuery.removeEventListener("change", onVideoMotionChange);
					else if (videoMotionQuery && videoMotionQuery.removeListener) videoMotionQuery.removeListener(onVideoMotionChange);
					document.removeEventListener("focusin", onDimFocusIn, true);
					document.removeEventListener("focusout", onDimFocusOut, true);
					document.removeEventListener("pointerover", onComposerPointerOver, true);
					document.removeEventListener("pointermove", onComposerPointer, true);
					document.removeEventListener("pointerout", onComposerPointerOut, true);
					if (composerFxObserver) composerFxObserver.disconnect();
					if (composerFxFrame) { cancelAnimationFrame(composerFxFrame); composerFxFrame = 0; }
					document.querySelectorAll("[data-qx-composer-glow], [data-qx-composer-fx], [data-qx-composer-ring]").forEach(function(el) { el.remove(); });
					if (statusTimer) clearTimeout(statusTimer);
					if (sceneRotationTimer) clearInterval(sceneRotationTimer);
					if (veilTimer) clearTimeout(veilTimer);
					darkObserver.disconnect();
					themeColorObserver.disconnect();
					if (heroObserver) heroObserver.disconnect();
					if (frostPending) clearTimeout(frostPending);
					document.removeEventListener("click", frostSchedule, true);
					frostObserver.disconnect();
					frostHostsSeen.length = 0;
					window.removeEventListener("resize", onWindowResize);
					if (typeof bootAnimCancel === "function") { try { bootAnimCancel(); } catch (_) {} }
					// 打标（.qx-frost / .qx-frost-solid）全部摘除，不给下一个实例/裸 DSH 留痕迹。
					document.querySelectorAll("." + QX_FROST_CLASS).forEach(function(el) {
						el.classList.remove(QX_FROST_CLASS, QX_FROST_SOLID);
					});
					previous.forEach(function(value, prop) {
						if (value === "") body.style.removeProperty(prop);
						else body.style.setProperty(prop, value);
					});
					// 皮肤写在 body 内联样式上的自定义属性必须一起撤掉，否则下一个实例
					// （或卸掉插件后的裸 DSH）会继承上一份皮肤留下的宽度/透明度。
					["--qx-frost-blur", "--qx-panel-alpha", "--qx-content-width", "--qx-font-scale",
					 "--qx-font-ui", "--qx-font-code", "--qx-letter-spacing", "--qx-line-height",
					 "--qx-px", "--qx-py", "--qx-pointer-core", "--qx-pointer-halo"].forEach(function(prop) {
						body.style.removeProperty(prop);
					});
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
		exports.inject = ["slots"];
		return module.exports;
	}
});
