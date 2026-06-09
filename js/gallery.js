export function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    const loadGalleryImage = (image) => {
        const src = image.dataset.src;

        if (!src || image.classList.contains('loaded')) {
            return;
        }

        image.classList.add('loading');

        const loader = new Image();
        loader.onload = () => {
            image.src = src;
            image.classList.remove('loading');
            image.classList.add('loaded');
        };
        loader.onerror = () => {
            image.classList.remove('loading');
        };
        loader.src = src;
    };

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadGalleryImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        galleryImages.forEach(image => imageObserver.observe(image));
    } else {
        galleryImages.forEach(loadGalleryImage);
    }

    if (!lightbox || !lightboxImage) {
        return;
    }

    const closeLightbox = () => {
        lightbox.classList.remove('active');

        if (!document.querySelector('.travel-modal.active')) {
            document.body.style.overflow = '';
        }
    };

    galleryItems.forEach(item => {
        const image = item.querySelector('.gallery-img');

        if (!image) {
            return;
        }

        item.addEventListener('click', () => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxImage.dataset.caption = image.dataset.caption || image.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('click', event => {
        if (event.target !== lightboxImage) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
