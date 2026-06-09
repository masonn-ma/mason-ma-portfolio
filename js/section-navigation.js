export function initSectionNavigation() {
    const sectionNav = document.querySelector('.section-nav');
    const sectionDots = document.querySelectorAll('.section-dot');
    const sections = document.querySelectorAll('section[id]');

    if (!sectionNav || !sectionDots.length || !sections.length) {
        return;
    }

    const updateActiveDot = () => {
        if (window.matchMedia('(max-width: 900px)').matches) {
            sectionNav.style.opacity = '0';
            sectionNav.style.visibility = 'hidden';
            sectionNav.style.pointerEvents = 'none';
            return;
        }

        let activeSection = null;
        let closestDistance = Infinity;

        sections.forEach(section => {
            const distance = Math.abs(section.getBoundingClientRect().top);

            if (distance < closestDistance) {
                closestDistance = distance;
                activeSection = section.id;
            }
        });

        sectionDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === activeSection);
        });

        const isVisible = window.scrollY >= window.innerHeight * 0.72;
        sectionNav.style.opacity = isVisible ? '1' : '0';
        sectionNav.style.visibility = isVisible ? 'visible' : 'hidden';
        sectionNav.style.pointerEvents = isVisible ? 'auto' : 'none';
    };

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    window.addEventListener('resize', updateActiveDot);
    updateActiveDot();
}
