# 企查查法律数据 MCP OAuth 插件（DeepSeek Harness）开发规划

> 版本：v1.0 ｜ 日期：2026-08 ｜ 依据：《企查查MCP OAuth 接入文档》+ DeepSeek Harness rc.6 平台机制实测
> 复用：周一已上架的 `qcc-dsh-mcp-oauth`（company/risk/...）同构骨架

---

## 1. 目标与需求

### 1.1 用户故事

> 作为 DeepSeek Harness 用户，我安装"企查查法律数据 MCP OAuth 插件"后，在对话中输入"连接企查查法律数据"，插件自动打开浏览器跳转企查查授权页；我登录授权后，插件自动完成 token 换取与 MCP 连接配置，之后即可直接使用 `mcp__legal-regulation__*`（法规）、`mcp__legal-case__*`（案例）工具，无需手工粘贴 token。

### 1.2 功能需求清单

| # | 需求 | 说明 |
|---|---|---|
| F1 | 一键 OAuth 连接 | 触发后自动完成：Protected Resource Metadata → OAuth Server Metadata → 动态注册客户端 → 打开授权页 → loopback 回调 → 换 token |
| F2 | 一次授权、全 Server 可用 | 一份 `access_token`/`refresh_token` 覆盖法律数据 MCP OAuth 集合内全部 resource（legal-regulation / legal-case） |
| F3 | Token 自动刷新 | 过期前自动 refresh（token 轮换），刷新失败才重新授权 |
| F4 | 连接状态可视 | 提供 `qcc_legal_oauth_status` 工具 |
| F5 | 断开/撤销 | `qcc_legal_oauth_disconnect`：revoke refresh_token 并停用条目 |
| F6 | 持久化 | 重启 Host 后自动恢复连接（存储域 `qcc_legal_mcp_oauth`） |
| F7 | 401 容错 | 单资源 401 → 先刷新一次重试 → 仍失败才引导重新授权 |
| F8 | 幂等安装 | 重复安装/重复连接不产生重复条目 |
| F9 | 与企业数据插件共存 | 工具名/存储域/条目 id 独立，可同时安装 |

---

## 2. 架构

```mermaid
flowchart LR
  U[用户浏览器] <-->|登录授权 / loopback 回跳| A[企查查 OAuth Server<br/>agent.qcc.com]
  P[qcc-legal-mcp-oauth 插件] -->|启动时恢复| S[ctx.storageDomain<br/>qcc_legal_mcp_oauth]
  P -->|PKCE+DCR+token/refresh/revoke| A
  P -->|loader.create/update| L[ctx.loader 条目树]
  L -->|mcp-qcc-legal-regulation| M1[mcp-client: legal-regulation]
  L -->|mcp-qcc-legal-case| M2[mcp-client: legal-case]
  M1 & M2 -->|Bearer access_token| Q[agent.qcc.com/mcp/{regulation,case}/stream]
  P -->|注册工具| T[qcc_legal_oauth_connect / status / disconnect]
  T <-->|模型调用| CHAT[用户对话]
```

## 3. 关键技术方案

- **插件形态**：DSH Bundle（包内 `cordis.patch.yml` + `package.json` 的 `dsh.bundle.patch`）
- **OAuth**：Authorization Code + PKCE(S256) + 动态注册（无 client_secret），endpoint 全部动态发现
- **动态配置**：`ctx.loader` 为 `@deepseek-ai/dsh-mcp-client` 条目注入 Bearer header；`serverName` = `legal-regulation` / `legal-case`
- **持久化**：`ctx.storageDomain`（域 `qcc_legal_mcp_oauth`，表 `grants`）
- **按 token 授权动态挂载**：解析 JWT `resource` claim，与 `resources` 求交集

## 4. 命名对照（与公司插件差异清单）

| 项 | 公司插件 | 法律插件 |
|---|---|---|
| npm / repo | qcc-dsh-mcp-oauth / qcc-mcp-oauth | qcc-dsh-mcp-legal-oauth / qcc-mcp-legal-oauth |
| 插件 name | qcc-mcp-oauth | qcc-legal-mcp-oauth |
| 存储域 | qcc_mcp_oauth | qcc_legal_mcp_oauth |
| 工具 | qcc_oauth_* | qcc_legal_oauth_* |
| resources | company/risk/ipr/operation/history/executive | legal-regulation / legal-case |
| 工具前缀 | mcp__company__* 等 | mcp__legal-regulation__* / mcp__legal-case__* |
| clientName | DeepSeek Harness - QCC MCP | DeepSeek Harness - QCC Legal MCP |

## 5. 验收标准（Definition of Done）

1. 全新 DSH web 实例按 README 三步安装插件后，对话输入"连接企查查法律数据"即可完成 OAuth 全流程。
2. 授权后 `mcp__legal-regulation__*`、`mcp__legal-case__*` 工具可真实返回数据；两个 Server 共用同一授权。
3. 重启 DSH Host 后自动恢复连接；token 过期前自动刷新（mock 缩短有效期可验证）。
4. `qcc_legal_oauth_status` 正确反映状态；`qcc_legal_oauth_disconnect` 撤销成功且工具下线。
5. 重复安装/连接幂等；token 不进入 git/日志。
6. GitHub 仓库公开可用：CI 绿、Release 含包与安装文档、npm 可安装、带 `dsh-plugin` topic（进入社区插件市场）。
