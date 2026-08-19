# Changelog

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
