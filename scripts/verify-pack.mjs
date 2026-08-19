/**
 * 发布前校验：`npm pack --dry-run` 的产物必须只含白名单文件，
 * 防止把 dev 文件（test/、docs/、scripts/、.github/ 等）夹带进 npm 发布包。
 * 用法：node scripts/verify-pack.mjs
 */
import { execFileSync } from 'node:child_process';

const WHITELIST = [
  /^package\.json$/,
  /^cordis\.patch\.yml$/,
  /^README\.md$/,
  /^LICENSE$/,
  /^install\.sh$/,
  /^lib\/[^/]+\.js$/,
];

let raw;
try {
  raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
} catch (error) {
  console.error('verify-pack 失败：`npm pack --dry-run --json` 执行出错');
  console.error(String(error.stderr ?? error.message));
  process.exit(1);
}

const [pack] = JSON.parse(raw);
if (!pack || !Array.isArray(pack.files)) {
  console.error('verify-pack: 无法解析 `npm pack --dry-run --json` 输出');
  process.exit(1);
}

const files = pack.files.map((f) => f.path).sort();
const stray = files.filter((f) => !WHITELIST.some((re) => re.test(f)));

if (stray.length) {
  console.error('verify-pack 失败：以下文件不应进入 npm 发布包（请检查 package.json 的 files 白名单）：');
  for (const f of stray) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`verify-pack 通过：发布包共 ${files.length} 个文件，全部在白名单内`);
for (const f of files) console.log(`  ${f}`);
