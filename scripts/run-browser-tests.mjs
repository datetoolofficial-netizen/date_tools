import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const nextCli = resolve(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const playwrightCli = resolve(root, 'node_modules', '@playwright', 'test', 'cli.js');

function getAvailablePort() {
    return new Promise((resolvePort, reject) => {
        const probe = createServer();
        probe.once('error', reject);
        probe.listen(0, '127.0.0.1', () => {
            const address = probe.address();
            const port = typeof address === 'object' && address ? address.port : 0;
            probe.close((error) => (error ? reject(error) : resolvePort(port)));
        });
    });
}

const port = await getAvailablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const env = {
    ...process.env,
    LOCAL_E2E_ISOLATED: '1',
    PLAYWRIGHT_BASE_URL: baseUrl,
    XDG_CONFIG_HOME: resolve(root, '.tools', 'config'),
    XDG_CACHE_HOME: resolve(root, '.tools', 'cache'),
};

function waitForExit(child) {
    return new Promise((resolveExit) => {
        child.once('exit', (code, signal) => resolveExit({ code, signal }));
        child.once('error', (error) => resolveExit({ code: 1, error }));
    });
}

async function waitForServer() {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
        try {
            const response = await fetch(`${baseUrl}/api/health`);
            if (response.ok) return;
        } catch {
            // The server may still be starting.
        }
        await new Promise((resolveWait) => setTimeout(resolveWait, 250));
    }
    throw new Error('Timed out while starting the local browser-test server.');
}

async function stopServer(server) {
    if (!server || server.exitCode !== null) return;

    if (process.platform === 'win32') {
        const killer = spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], {
            stdio: 'ignore',
            windowsHide: true,
        });
        await waitForExit(killer);
        return;
    }

    server.kill('SIGTERM');
    await Promise.race([
        waitForExit(server),
        new Promise((resolveWait) => setTimeout(resolveWait, 3000)),
    ]);
    if (server.exitCode === null) server.kill('SIGKILL');
}

const server = spawn(
    process.execPath,
    [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    { cwd: root, env, stdio: 'inherit' },
);

let exitCode = 1;
try {
    await waitForServer();
    const testProcess = spawn(
        process.execPath,
        [playwrightCli, 'test', ...process.argv.slice(2)],
        { cwd: root, env, stdio: 'inherit' },
    );
    const result = await waitForExit(testProcess);
    if (result.error) throw result.error;
    exitCode = result.code ?? 1;
} catch (error) {
    console.error(`[e2e] ${error.message}`);
} finally {
    await stopServer(server);
}

process.exit(exitCode);
