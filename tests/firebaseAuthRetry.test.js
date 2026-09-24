import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
    getFirebaseNetworkErrorMessage,
    isFirebaseNetworkError,
    runFirebaseAuthRequestWithRetry,
} from '../app/firebaseAuthRetry';

function networkError() {
    return Object.assign(new Error('Firebase network request failed.'), {
        code: 'auth/network-request-failed',
    });
}

describe('Firebase Authentication network recovery', () => {
    it('protects sign-in flows without retrying account creation', () => {
        const adminLogin = readFileSync(join(process.cwd(), 'app', 'admin_login', 'page.jsx'), 'utf8');
        const advertiserLogin = readFileSync(join(process.cwd(), 'app', 'client', 'page.jsx'), 'utf8');
        const advertiserRegistration = readFileSync(join(process.cwd(), 'app', 'client', 'register', 'page.jsx'), 'utf8');

        expect(adminLogin).toContain('runFirebaseAuthRequestWithRetry');
        expect(advertiserLogin).toContain('runFirebaseAuthRequestWithRetry');
        expect(advertiserRegistration).not.toContain('runFirebaseAuthRequestWithRetry');
    });

    it('retries one transient network failure and returns the successful result', async () => {
        const operation = vi.fn()
            .mockRejectedValueOnce(networkError())
            .mockResolvedValueOnce({ user: { uid: 'admin-1' } });
        const sleep = vi.fn().mockResolvedValue(undefined);

        await expect(runFirebaseAuthRequestWithRetry(operation, { sleep })).resolves.toEqual({
            user: { uid: 'admin-1' },
        });
        expect(operation).toHaveBeenCalledTimes(2);
        expect(sleep).toHaveBeenCalledWith(600);
    });

    it('does not retry credential or permission failures', async () => {
        const credentialError = Object.assign(new Error('Invalid credential.'), {
            code: 'auth/invalid-credential',
        });
        const operation = vi.fn().mockRejectedValue(credentialError);
        const sleep = vi.fn();

        await expect(runFirebaseAuthRequestWithRetry(operation, { sleep })).rejects.toBe(credentialError);
        expect(operation).toHaveBeenCalledTimes(1);
        expect(sleep).not.toHaveBeenCalled();
    });

    it('stops after the configured number of network attempts', async () => {
        const operation = vi.fn().mockRejectedValue(networkError());
        const sleep = vi.fn().mockResolvedValue(undefined);

        await expect(runFirebaseAuthRequestWithRetry(operation, { attempts: 3, sleep })).rejects.toMatchObject({
            code: 'auth/network-request-failed',
        });
        expect(operation).toHaveBeenCalledTimes(3);
        expect(sleep).toHaveBeenCalledTimes(2);
    });

    it('turns a stalled authentication request into a retryable network error', async () => {
        const operation = vi.fn(() => new Promise(() => {}));
        const sleep = vi.fn().mockResolvedValue(undefined);

        await expect(runFirebaseAuthRequestWithRetry(operation, {
            attempts: 1,
            operationTimeoutMs: 5,
            sleep,
        })).rejects.toMatchObject({
            code: 'auth/network-request-failed',
            reason: 'timeout',
        });
        expect(operation).toHaveBeenCalledTimes(1);
        expect(sleep).not.toHaveBeenCalled();
    });

    it('provides useful Arabic messages without exposing Firebase internals', () => {
        expect(isFirebaseNetworkError(networkError())).toBe(true);
        expect(getFirebaseNetworkErrorMessage(true)).toContain('VPN');
        expect(getFirebaseNetworkErrorMessage(false)).toContain('لا يوجد اتصال بالإنترنت');
        expect(getFirebaseNetworkErrorMessage(true)).not.toContain('auth/network-request-failed');
    });
});
