import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('admin delete confirmation', () => {
    it('does not intercept the confirmation dialog delete button', () => {
        const source = readFileSync(join(process.cwd(), 'app', 'admin', 'AdminShell.jsx'), 'utf8');
        const dialogGuard = source.indexOf("button.closest('.admin-delete-confirm')");
        const deleteDetection = source.indexOf("button.querySelector('.fa-trash')");

        expect(dialogGuard).toBeGreaterThan(-1);
        expect(deleteDetection).toBeGreaterThan(dialogGuard);
    });

    it('centers the confirmation actions while keeping them responsive', () => {
        const source = readFileSync(join(process.cwd(), 'app', 'admin', 'AdminDashboard.css'), 'utf8');
        const actionsRule = source.match(/\.admin-delete-confirm-actions\s*\{[^}]+\}/)?.[0] || '';

        expect(actionsRule).toContain('justify-content: center');
        expect(actionsRule).toContain('grid-template-columns: repeat(2, minmax(120px, 160px))');
    });
});
