const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

let activeDialog = null;
let lastFocused = null;

function getFocusable(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    );
}

function onDocumentKeydown(event) {
    if (!activeDialog) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog(activeDialog);
        return;
    }

    if (event.key !== 'Tab') {
        return;
    }

    const panel = activeDialog.querySelector('[role="dialog"]');

    if (!panel) {
        return;
    }

    const focusable = getFocusable(panel);

    if (!focusable.length) {
        event.preventDefault();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

export function openDialog(dialog, trigger) {
    if (activeDialog && activeDialog !== dialog) {
        closeDialog(activeDialog);
    }

    lastFocused = trigger || document.activeElement;
    dialog.classList.add('is-open');
    document.body.classList.add('is-locked');
    activeDialog = dialog;

    const panel = dialog.querySelector('[role="dialog"]');
    const focusable = panel ? getFocusable(panel) : [];
    const target = focusable[0] || panel;

    if (target && typeof target.focus === 'function') {
        target.focus();
    }
}

export function closeDialog(dialog) {
    if (!dialog || !dialog.classList.contains('is-open')) {
        return;
    }

    dialog.classList.remove('is-open');
    document.body.classList.remove('is-locked');

    if (activeDialog === dialog) {
        activeDialog = null;
    }

    if (lastFocused && typeof lastFocused.focus === 'function' && lastFocused.isConnected) {
        lastFocused.focus();
    }

    lastFocused = null;
}

export function initDialogs() {
    document.querySelectorAll('.dialog').forEach((dialog) => {
        dialog.querySelectorAll('[data-dialog-close]').forEach((control) => {
            control.addEventListener('click', (event) => {
                event.preventDefault();
                closeDialog(dialog);
            });
        });

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                closeDialog(dialog);
            }
        });
    });

    document.addEventListener('keydown', onDocumentKeydown);
}
