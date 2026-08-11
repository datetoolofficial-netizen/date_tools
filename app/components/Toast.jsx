'use client';

import styles from './Toast.module.css';

const toastIcon = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
};

export default function Toast({
    message,
    type = 'info',
    visible = false,
    onClose,
    modal = false,
    title = '',
    referenceLabel = '',
    referenceValue = '',
    linkHref = '',
    linkLabel = '',
}) {
    if (!message) return null;

    const normalizedType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    const content = (
        <div
            className={`${styles.toast} ${styles[normalizedType]} ${modal ? styles.modal : ''} ${visible ? styles.visible : ''}`}
            role={modal ? (normalizedType === 'error' ? 'alertdialog' : 'dialog') : (normalizedType === 'error' ? 'alert' : 'status')}
            aria-live={normalizedType === 'error' ? 'assertive' : 'polite'}
            aria-modal={modal ? 'true' : undefined}
            dir="rtl"
        >
            <span className={styles.iconWrap} aria-hidden="true">
                <i className={`fa-solid ${toastIcon[normalizedType]}`}></i>
            </span>
            <span className={styles.content}>
                {title ? <strong className={styles.title}>{title}</strong> : null}
                <span className={styles.message}>{message}</span>
                {referenceValue ? (
                    <span className={styles.reference}>
                        <small>{referenceLabel}</small>
                        <b dir="ltr">{referenceValue}</b>
                    </span>
                ) : null}
                {linkHref && linkLabel ? (
                    <a className={styles.supportLink} href={linkHref}>{linkLabel}</a>
                ) : null}
            </span>
            {onClose && (
                <button className={styles.closeButton} type="button" onClick={onClose} aria-label="إغلاق التنبيه">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            )}
            {modal && onClose ? (
                <button className={styles.modalCloseAction} type="button" onClick={onClose}>إغلاق</button>
            ) : null}
        </div>
    );

    if (!modal) return content;

    return (
        <div className={`${styles.backdrop} ${visible ? styles.backdropVisible : ''}`}>
            {content}
        </div>
    );
}
