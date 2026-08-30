'use client';

export default function AdminEnableToggle({
    enabled,
    onChange,
    enabledLabel = 'تعطيل',
    disabledLabel = 'تفعيل',
    className = '',
}) {
    const label = enabled ? enabledLabel : disabledLabel;

    return (
        <button
            type="button"
            className={`admin-enable-toggle ${enabled ? 'is-enabled' : 'is-disabled'} ${className}`.trim()}
            onClick={() => onChange(!enabled)}
            aria-label={label}
            aria-pressed={enabled}
            title={label}
        >
            <i className={`fa-solid ${enabled ? 'fa-toggle-on' : 'fa-toggle-off'}`} aria-hidden="true"></i>
        </button>
    );
}
