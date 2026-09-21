import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const npmCli = process.env.npm_execpath;
const npm = npmCli ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
const steps = [
    ['ESLint static checks', ['run', 'lint']],
    ['Repository secret scan', ['run', 'security:secrets']],
    ['Production dependency audit', ['audit', '--omit=dev', '--audit-level=high']],
    ['Unit and integration tests', ['run', 'test']],
    ['Firestore authorization tests', ['run', 'test:rules']],
    ['Next.js production build', ['run', 'build']],
    ['Browser workflows and accessibility', ['run', 'test:e2e']],
];

for (const [label, args] of steps) {
    console.log(`\n[quality] ${label}`);
    const commandArgs = npmCli ? [npmCli, ...args] : args;
    const result = spawnSync(npm, commandArgs, {
        cwd: root,
        stdio: 'inherit',
        shell: !npmCli && process.platform === 'win32',
    });
    if (result.error) {
        console.error(`[quality] ${label} could not start: ${result.error.message}`);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`[quality] ${label} failed.`);
        process.exit(result.status ?? 1);
    }
}

console.log('\n[quality] All local release checks passed. Nothing was published.');
