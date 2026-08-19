# 工具清单与使用示例

插件连接成功后，会在 DeepSeek Harness 里注册两类工具：

1. **法律数据工具**（企查查服务端透传，前缀 `mcp__legal-regulation__*` / `mcp__legal-case__*`）
2. **连接管理工具**（插件自带，前缀 `qcc_legal_oauth_*`）

## 一、法律数据工具（服务端透传）

企查查法律数据 MCP 提供两个 Server，插件按 `mcp__<serverName>__<toolName>` 规则挂载：

| Server | serverName | 工具前缀 | 数据域 |
| --- | --- | --- | --- |
| 法规检索 | `legal-regulation` | `mcp__legal-regulation__*` | 法律法规、法条检索 |
| 案例检索 | `legal-case` | `mcp__legal-case__*` | 司法案例检索 |

> 具体工具名以企查查服务端实际返回为准：连接成功后，在 DeepSeek Harness 的
> 工具列表（或对话中的 /tools）即可看到 `mcp__legal-regulation__…`、
> `mcp__legal-case__…` 开头的全部法律数据工具。插件不重命名、不包装，直接透传。

如果账号 token 只授权了其中某个 Server（例如只开通法规），插件只挂载已授权的
那一组前缀，不会把未授权的 resource 挂出来。

## 二、连接管理工具（插件自带）

### `qcc_legal_oauth_connect` — 一键连接

完成 OAuth（PKCE）授权并配置法律数据 MCP Server。会打开系统浏览器跳转企查查
授权页，登录授权后自动回跳完成连接；已在连接状态时调用会复用现有授权（token
自动刷新），不会重复弹授权页。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `server` | string（enum） | 授权入口 resource，可选 `legal-regulation`、`legal-case`，默认 `legal-regulation`。授权一次覆盖 token 实际授权的全部法律 MCP Server。 |

示例：`连接企查查法律数据`（默认法规入口），或 `连接企查查案例检索`。

### `qcc_legal_oauth_status` — 查看状态

返回是否已授权、access_token 过期时间、覆盖的 MCP Server、是否需要重新授权等。

### `qcc_legal_oauth_disconnect` — 断开连接

撤销 refresh_token（调用 OAuth revoke）、清除本地授权、停用法律数据 MCP 工具。
之后需重新 `qcc_legal_oauth_connect` 才能再次使用。

## 三、典型用法

```text
# 首次连接（自动打开浏览器授权）
连接企查查法律数据

# 查看连接状态（是否已授权 / 过期时间 / 覆盖哪些 Server）
qcc_legal_oauth_status

# 之后即可直接调用法律数据工具，例如（以服务端实际工具名为准）
mcp__legal-regulation__search_regulation ...

# 断开（撤销 token + 停用工具）
qcc_legal_oauth_disconnect
```

## 四、命名约定小结

- 服务端工具：`mcp__legal-regulation__<tool>`、`mcp__legal-case__<tool>`（与
  `mcp-client` 条目的 `serverName` 一致，断开/重连后工具名不变，幂等）。
- 插件工具：`qcc_legal_oauth_connect` / `qcc_legal_oauth_status` /
  `qcc_legal_oauth_disconnect`（与公司数据插件 `qcc_oauth_*` 前缀区分，避免冲突）。
