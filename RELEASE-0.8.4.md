## 适配 DSH 0.2.2-rc.4 / rc.5

- 兼容上限更新为 `0.1.0-rc.6 - 0.2.2-rc.5`。
- 核对结论：rc.4 / rc.5 的界面层与 rc.3 逐字节一致——Web 前端 dist 哈希相同，`dsh-web-app` 无文件变化，侧栏 / 布局 / 主题 / 设置等客户端模块除构建号外没有改动，`dsh-host-webserver` 的注册 API 未变。因此选择器、令牌映射与路由都不需要改。
- 唯一可见变化是「设置 → 内置插件 → 网页搜索与读取工具」：搜索提供方新增「DeepSeek 服务端搜索」自动项、去掉旧的 `DeepSeek (legacy)` 文案。该卡沿用宿主通用卡片结构，皮肤设置页样式已覆盖。
- rc.5 侧栏 `[data-slot='sidebar']` 是 `display: contents` 的槽位锚点，实际列仍是 `[class*='sidebarCol']`；统一背板两条规则都能命中，观感与 rc.3 一致。

验证：客户端 145/145、服务端 66/66；用 `@deepseek-ai/dsh` 0.2.2-rc.5 的 npm 包新建独立 Web 档案真机复核——皮肤加载、侧栏统一背板（280px、无右分隔线）、调色盘 322×704（五标签顶栏均 45px、正文无横向溢出）、搜索（1 命中 / 14 收起）、专注模式（浓度 0.9）、设置页嵌入（头部隐藏、页脚保留、15 卡 / 6 通栏）、深浅两态均正常。

安装：对 DSH 说「安装一下这个皮肤包：@taosee258/dsh-client-ui-skin-qingxiao」，或 dsh plugin --profile desktop add @taosee258/dsh-client-ui-skin-qingxiao（网页端用 --profile web）。完整改动见 CHANGELOG.md。
