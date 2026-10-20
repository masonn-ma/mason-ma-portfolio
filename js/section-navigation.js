export function initSectionNavigation() {
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!links.length || !sections.length) {
        return;
    }

    const updateActiveLink = () => {
        const probe = window.innerHeight * 0.35;
        let activeId = null;

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= probe) {
                activeId = section.id;
            }
        });

        links.forEach((link) => {
            const isActive = activeId !== null && link.getAttribute('href') === `#${activeId}`;

            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveLink();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();
}
