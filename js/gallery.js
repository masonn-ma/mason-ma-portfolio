import { openDialog } from './dialog.js';

export function initGallery() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const links = document.querySelectorAll('a[data-lightbox]');

    if (!lightbox || !lightboxImage || !links.length) {
        return;
    }

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const thumb = link.querySelector('img');

            lightboxImage.src = link.getAttribute('href');
            lightboxImage.alt = thumb ? thumb.alt : '';
            lightboxCaption.textContent = link.dataset.caption || (thumb ? thumb.alt : '');

            openDialog(lightbox, link);
        });
    });
}
