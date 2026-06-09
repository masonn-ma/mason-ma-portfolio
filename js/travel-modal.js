export function initTravelModal() {
    const travelLink = document.querySelector('.nav-list .hero-travel-link[href="#"]');
    const travelModal = document.getElementById('travel-modal');
    const travelModalClose = document.getElementById('travel-modal-close');

    if (!travelLink || !travelModal) {
        return;
    }

    const heroSection = document.querySelector('header');

    const openTravelModal = () => {
        travelModal.classList.add('active');
        travelModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (heroSection) {
            heroSection.classList.add('hero-content-hidden');
        }
    };

    const closeTravelModal = () => {
        travelModal.classList.remove('active');
        travelModal.setAttribute('aria-hidden', 'true');

        if (!document.querySelector('.lightbox.active')) {
            document.body.style.overflow = '';
        }

        if (heroSection) {
            const hideThreshold = window.innerHeight * 0.18;
            heroSection.classList.toggle('hero-content-hidden', window.scrollY > hideThreshold);
        }
    };

    travelLink.addEventListener('click', event => {
        event.preventDefault();
        openTravelModal();
    });

    travelModal.addEventListener('click', event => {
        if (event.target === travelModal || event.target.classList.contains('travel-modal-overlay')) {
            closeTravelModal();
        }
    });

    travelModalClose?.addEventListener('click', closeTravelModal);

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && travelModal.classList.contains('active')) {
            closeTravelModal();
        }
    });
}
