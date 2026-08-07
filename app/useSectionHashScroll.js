'use client';

import { useEffect } from 'react';

export function useSectionHashScroll(validTargetIds, ready = true, initialTargetId = '') {
    useEffect(() => {
        if (!ready || typeof window === 'undefined') return undefined;

        let frameId = 0;
        let nestedFrameId = 0;

        const scrollToHashTarget = () => {
            const targetId = window.location.hash.replace(/^#/, '') || initialTargetId;
            if (!validTargetIds.includes(targetId)) return;

            frameId = window.requestAnimationFrame(() => {
                nestedFrameId = window.requestAnimationFrame(() => {
                    document.getElementById(targetId)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                });
            });
        };

        scrollToHashTarget();
        window.addEventListener('hashchange', scrollToHashTarget);

        return () => {
            window.removeEventListener('hashchange', scrollToHashTarget);
            window.cancelAnimationFrame(frameId);
            window.cancelAnimationFrame(nestedFrameId);
        };
    }, [initialTargetId, ready, validTargetIds]);
}
