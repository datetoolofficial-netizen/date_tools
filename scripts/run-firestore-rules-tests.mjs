import { existsSync, readdirSync } from 'node:fs';
import { delimiter, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const isWindows = process.platform === 'win32';
const demoProjectId = 'demo-date-tools-security';

function findLocalJavaBin() {
    const javaRoot = join(root, '.tools', 'java');
    if (!existsSync(javaRoot)) return '';

    for (const entry of readdirSync(javaRoot, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const bin = join(javaRoot, entry.name, 'bin');
        if (existsSync(join(bin, isWindows ? 'java.exe' : 'java'))) return bin;
    }
    return '';
}

function canRun(command, args = ['--version']) {
    const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
    return result.status === 0;
}

const env = { ...process.env };
env.PATH = `${dirname(process.execPath)}${delimiter}${env.PATH || ''}`;
env.XDG_CONFIG_HOME = join(root, '.tools', 'config');
env.XDG_CACHE_HOME = join(root, '.tools', 'cache');
env.FIREBASE_EMULATORS_PATH = join(root, '.tools', 'firebase-emulators');
env.FIREBASE_CLI_DISABLE_UPDATE_CHECK = 'true';
const localJavaBin = findLocalJavaBin();
if (!canRun('java') && localJavaBin) {
    env.JAVA_HOME = dirname(localJavaBin);
    env.PATH = `${localJavaBin}${process.platform === 'win32' ? ';' : ':'}${env.PATH || ''}`;
}

const localFirebase = join(
    root,
    '.tools',
    'firebase-cli',
    'node_modules',
    'firebase-tools',
    'lib',
    'bin',
    'firebase.js',
);

let command;
let args;
if (existsSync(localFirebase)) {
    command = process.execPath;
    args = [localFirebase];
} else {
    command = isWindows ? 'npx.cmd' : 'npx';
    args = ['--yes', 'firebase-tools@15.30.0'];
}

args.push(
    'emulators:exec',
    '--only',
    'firestore',
    '--project',
    demoProjectId,
    'npm run test:rules:spec',
);

console.log(`[security] Firestore rules are running against ${demoProjectId}; production is not used.`);
const result = spawnSync(command, args, {
    cwd: root,
    env,
    shell: false,
    stdio: 'inherit',
});

if (result.error) {
    console.error(`[security] Could not start the Firestore Emulator: ${result.error.message}`);
    process.exit(1);
}

process.exit(result.status ?? 1);
