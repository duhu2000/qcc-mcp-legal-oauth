import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import semver from 'semver';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('DSH 0.2.0-rc.2 满足插件的宿主依赖声明（含预发布版本）', () => {
  // 对齐目标 DSH 官方包的版本；默认 semver 规则会排除未明确声明的预发布版本。
  const host = {
    '@deepseek-ai/cordis': '4.0.4',
    '@deepseek-ai/dsh-mcp-client': '0.2.0-rc.2',
    '@deepseek-ai/dsh-storage-domain': '0.2.0-rc.2',
    '@deepseek-ai/dsh-tools': '0.2.0-rc.2',
    '@deepseek-ai/schemastery': '3.18.4',
    zod: '4.4.3',
  };
  for (const [name, version] of Object.entries(host)) {
    assert.ok(pkg.peerDependencies[name], `${name} 必须声明为宿主依赖`);
    assert.ok(semver.satisfies(version, pkg.peerDependencies[name]),
      `${name}@${version} 不满足 ${pkg.peerDependencies[name]}`);
  }
  assert.equal('cordis' in pkg.peerDependencies, false, '新版宿主使用 @deepseek-ai/cordis');
});

test('兼容范围不把旧版或下一不兼容次版本声明为受支持', () => {
  for (const name of ['dsh-mcp-client', 'dsh-storage-domain', 'dsh-tools']) {
    const range = pkg.peerDependencies[`@deepseek-ai/${name}`];
    for (const version of ['0.1.0-rc.6', '0.2.0-rc.1', '0.3.0']) {
      assert.equal(semver.satisfies(version, range), false, `${name}@${version}`);
    }
  }
});
