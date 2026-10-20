import { openDialog } from './dialog.js';

export function initTravelModal() {
    const modal = document.getElementById('travel-modal');
    const triggers = document.querySelectorAll('[data-travel-open]');

    if (!modal || !triggers.length) {
        return;
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            openDialog(modal, trigger);
        });
    });

    if (window.location.hash === '#travel-modal') {
        openDialog(modal, null);
    }
}
