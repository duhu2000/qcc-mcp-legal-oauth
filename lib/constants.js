/**
 * 企查查法律数据 MCP OAuth 插件 - 常量定义
 * 依据《企查查MCP OAuth 接入文档》§2（法律数据 MCP：legal-regulation 法规 / legal-case 案例）
 */
export const DEFAULT_ISSUER = 'https://agent.qcc.com';

/** 企查查法律数据 MCP SERVER（OAuth 授权集合，共 2 个，对齐官网「法律数据 MCP」口径）
 *  一次授权覆盖 token 实际授权的 resource 集合；插件按 token 实际授权范围动态配置条目。 */
export const QCC_RESOURCES = {
  'legal-regulation': 'https://agent.qcc.com/mcp/regulation/stream',
  'legal-case': 'https://agent.qcc.com/mcp/case/stream',
};

export const DEFAULT_SCOPE = 'mcp:tools';
export const DEFAULT_GRANT_KEY = 'default';

/** 授权码换 token 的默认入口 resource（以 legal-regulation 法规作为首次接入示例） */
export const DEFAULT_ENTRY_RESOURCE = QCC_RESOURCES['legal-regulation'];

/** client_id 默认有效期（文档 §7：90 天），用于日志提示 */
export const CLIENT_ID_TTL_MS = 90 * 24 * 60 * 60 * 1000;

/** 文档 §8：code_verifier 允许字符集 */
export const VERIFIER_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._~-';

/** 文档 §8：code_verifier 长度约束 */
export const VERIFIER_MIN_LENGTH = 43;
export const VERIFIER_MAX_LENGTH = 128;
