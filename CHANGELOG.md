# Changelog

## [0.1.4] - 2026-08-19

### 变更

- 修正插件市场定性：`dsh-plugin` topic 为官方推荐发现渠道；`dshmarket` 为社区插件市场（人工精选 + PR 守门审核）；官方 CLI 为通用 pnpm 转发器，`dsh plugin --profile web add dshmarket` 系 dshmarket 依通用安装语提供，不再是「官方 CLI 引导装 dshmarket」口径。

## [0.1.3] - 2026-08-19

### 变更

- README 安装指引与「插件市场收录」章节统一为推荐市场 **dshmarket**（人工精选 + PR 守门审核）；`dsh-plugin-marketplace` 等社区自动聚合改为「非官方、无审核、仅供知悉」口径，不再作为推荐入口。

## [0.1.2] - 2026-08-19

### 修复

- `output.render` 由返回字符串改为返回 content 块数组（`[{ type: 'text', text }]`），修复工具调用时报 `content.some is not a function`（DSH 工具契约要求 render 返回块数组）。新增回归用例。

## [0.1.1] - 2026-08-19

### 变更

- `extractTokenResources` 兼容 `resource` claim 为单个字符串（RFC 9068 允许字符串或数组）
- npm 关键词与描述补全（中文：企查查/法律数据/法律产品；英文：legal/law/legal-tech/legal-data/mcp-client/mcp-server），便于插件市场检索
- 新增 `docs/TOOLS.md`（工具清单与示例）、`docs/architecture.svg`（授权流程图）
- README 增加「插件市场收录与搜索关键词」章节

### 工程

- 新增 `npm run verify-pack`：发布前校验 `npm pack` 产物只含白名单文件（防止 dev 文件夹带），并接入 CI
- 新增损坏 grant 恢复失败 → `needsReauth` 的回归用例

## [0.1.0] - 2026-08

首个可运行版本（企查查法律数据 MCP OAuth 插件）。

### 新增

- 一键 OAuth 授权连接企查查法律数据 MCP（Authorization Code + PKCE S256，动态注册客户端，无 client_secret）
- 一次授权覆盖法律数据 MCP OAuth 集合全部 Server（`legal-regulation` 法规 / `legal-case` 案例，共 2 个）
- 按 token 实际授权动态配置条目：解析 access_token（JWT）的 `resource` claim，与 `resources` 配置求交集，只挂载实际授权的 Server（法规+案例 2 个 / 仅法规 1 个）
- loopback 回调（127.0.0.1 随机端口），state 校验，code 单次使用
- token 持久化（DSH 存储域 `qcc_legal_mcp_oauth`，`~/.dsh/storages`）与重启自动恢复
- access_token 过期前自动刷新（refresh token 轮换、单飞刷新）
- 断开时调用 OAuth revoke 撤销 refresh_token
- 对话工具：`qcc_legal_oauth_connect` / `qcc_legal_oauth_status` / `qcc_legal_oauth_disconnect`
- 通过 `ctx.loader` 动态配置 `@deepseek-ai/dsh-mcp-client` 条目（注入 Bearer header）
- DSH Bundle 分发（包内 `cordis.patch.yml` 自动合入插件行）
- 支持「让 Agent 安装」：一键安装脚本 `install.sh` + README 安装指引
- 与「企查查 MCP OAuth 插件」（company/risk/...）工具名/存储域/条目 id 完全独立，可同时安装

### 测试

- 单元：PKCE、元数据发现、动态注册、完整授权码流程（mock OAuth 服务器）、refresh 轮换、revoke、`extractTokenResources`（法规+案例 / 仅法规）
- 插件级集成：连接（自动模拟用户授权）/幂等/自动刷新/断开/重启恢复/按 token 授权动态挂载
- 基于周一 `qcc-dsh-mcp-oauth` 同构骨架，沿用其全部实测修复（`ctx.effect` 立即执行、`loader.resolve` 抛错探测、`loader.await` 自死锁、Windows `cmd /c start` 的 `&` 分隔符等回归项）
