'use client';

import styles from './Toast.module.css';

const toastIcon = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
};

export default function Toast({ message, type = 'info', visible = false, onClose }) {
    if (!message) return null;

    const normalizedType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';

    return (
        <div
            className={`${styles.toast} ${styles[normalizedType]} ${visible ? styles.visible : ''}`}
            role={normalizedType === 'error' ? 'alert' : 'status'}
            aria-live={normalizedType === 'error' ? 'assertive' : 'polite'}
            dir="rtl"
        >
            <span className={styles.iconWrap} aria-hidden="true">
                <i className={`fa-solid ${toastIcon[normalizedType]}`}></i>
            </span>
            <span className={styles.message}>{message}</span>
            {onClose && (
                <button className={styles.closeButton} type="button" onClick={onClose} aria-label="إغلاق التنبيه">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            )}
        </div>
    );
}
