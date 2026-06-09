export function initBackToTop() {
    const button = document.querySelector('.back-to-top');

    if (!button) {
        return;
    }

    const updateVisibility = () => {
        button.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    updateVisibility();
}
