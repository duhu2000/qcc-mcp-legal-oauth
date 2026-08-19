# 上架清单 / Publish Checklist

> 企查查法律数据 MCP OAuth 插件 → DeepSeek Harness 社区插件市场
> 本地开发与测试已全部完成（`npm run lint` 通过；`npm test` 35 用例全绿）。

## 0. 产物速览

| 项 | 值 |
|---|---|
| 本地工程 | `qcc-mcp-legal-oauth-plugin/`（本目录） |
| npm 包名 | `qcc-dsh-mcp-legal-oauth`（已查 registry 可用） |
| GitHub 仓库 | `duhu2000/qcc-mcp-legal-oauth`（已查可用） |
| 插件 id / name | `qcc-legal-mcp-oauth` |
| 工具前缀 | `mcp__legal-regulation__*`（法规）/ `mcp__legal-case__*`（案例） |
| 管理工具 | `qcc_legal_oauth_connect` / `qcc_legal_oauth_status` / `qcc_legal_oauth_disconnect` |
| clientName | `DeepSeek Harness - QCC Legal MCP` |

---

## 1. 本地自检（已完成 ✅）

```bash
npm run lint     # ✅ 通过
npm test         # ✅ 35/35 通过（单测 + mock 全流程集成 + 插件加载冒烟）
```

建议发布前再跑一次（发布前把 `version` 定稿）：

```bash
cd qcc-mcp-legal-oauth-plugin
npm run lint && npm test
```

## 2. GitHub 建仓 + 推送（需你在有 gh / 已登录 GitHub 的环境执行）

本机无 `gh` CLI 且 git remote 无写入凭据，以下由你执行（或提供 `GITHUB_TOKEN` 后我代办）：

```bash
cd qcc-mcp-legal-oauth-plugin

# 2.1 初始化 git（骨架拷贝时已剔除 .git，需重建）
git init -b main
git add -A
git commit -m "feat: 企查查法律数据 MCP OAuth 插件 v0.1.0（法规/案例，PKCE 一键授权）"

# 2.2 建仓并推送（二选一）
#   A) gh CLI（登录后）
gh repo create qcc-mcp-legal-oauth --public --source . --push
#   B) 网页 New repository（duhu2000 下建 qcc-mcp-legal-oauth，public，不勾 README/.gitignore）
git remote add origin https://github.com/duhu2000/qcc-mcp-legal-oauth.git
git push -u origin main
```

## 3. npm 发布

### 方式 A：GitHub Actions 自动发布（推荐，同周一公司插件）

1. 仓库 Settings → Secrets and variables → Actions → 新增 `NPM_TOKEN`（npm 访问令牌，类型 Automation/`--access public`）。
2. 打 tag 推送即触发 `release.yml`（lint + test + npm publish + GitHub Release）：

```bash
git tag v0.1.0
git push origin main --tags
```

### 方式 B：手动发布

```bash
npm login            # 登录有发布权限的 npm 账号
npm publish --access public
```

发布后验证：

```bash
npm view qcc-dsh-mcp-legal-oauth version   # 应输出 0.1.0
npm view qcc-dsh-mcp-legal-oauth repository.url   # 应指向 duhu2000/qcc-mcp-legal-oauth
```

> `repository`/`homepage` 字段用于市场 npm 探测反查（对齐公司插件 0.1.4 修复），务必保留。

## 4. 加入插件市场（核心一步）

市场由 GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic 驱动，给仓库打上 topic 即上架：

- GitHub 仓库页 → 右上角 ⚙️ 齿轮 → Topics → 添加：
  `dsh-plugin` `dsh` `deepseek-harness` `mcp` `oauth` `oauth2` `pkce` `qcc` `qichacha` `legal`
- 或 API（需 token）：

```bash
curl -X PUT -H "Authorization: token <GITHUB_TOKEN>" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/duhu2000/qcc-mcp-legal-oauth/topics" \
  -d '{"names":["dsh-plugin","dsh","deepseek-harness","mcp","oauth","oauth2","pkce","qcc","qichacha","legal"]}'
```

## 5. 市场内验证

1. DSH web → 设置 → 插件 → 插件市场 → 搜索 `qcc` 或 `legal`，应出现「企查查法律数据 MCP OAuth 插件」卡片。
2. 点击安装（优先走 npm `qcc-dsh-mcp-legal-oauth@latest`）；重启 harness。
3. 对话输入「连接企查查法律数据」→ 自动弹授权页 → 授权后 `mcp__legal-regulation__*` / `mcp__legal-case__*` 工具可用。
4. 对话 `market_install` 工具兜底：`market_install("qcc-dsh-mcp-legal-oauth")`。

## 6. 发布后自检清单

- [ ] GitHub 仓库 public、默认分支 `main`、带 `dsh-plugin` topic
- [ ] 根 `package.json` 声明 `dsh.bundle.patch`（根级插件形态）
- [ ] npm `latest` = 0.1.0，`repository`/`homepage` 指向 GitHub 仓库
- [ ] GitHub Release 已生成（v0.1.0 tag）
- [ ] 市场搜索可见、一键安装成功、重启后工具出现
- [ ] 与公司插件（`qcc-dsh-mcp-oauth`）同 profile 共存验证：两插件工具名不冲突（`qcc_oauth_*` vs `qcc_legal_oauth_*`；`mcp__company__*` vs `mcp__legal-regulation__*`）

## 7. 与公司插件的关系（避免误解）

| | 企查查 MCP OAuth 插件 | 本插件（法律数据 MCP OAuth） |
|---|---|---|
| npm / repo | qcc-dsh-mcp-oauth / qcc-mcp-oauth | qcc-dsh-mcp-legal-oauth / qcc-mcp-legal-oauth |
| 覆盖 | company/risk/ipr/operation/history/executive | legal-regulation / legal-case |
| 产品页 | agent.qcc.com（企业数据） | agent.qcc.com/legal（法律数据） |
| 能否共存 | 能（工具名/存储域/条目 id 全独立） | 能 |

两插件为**独立上架的两个市场卡片**，用户按需分别安装。
