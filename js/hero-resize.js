export function initHeroResizeStability() {
    const pageHero = document.querySelector('header');
    const pageContent = document.querySelector('.content-layer');

    if (!pageHero || !pageContent || !('ResizeObserver' in window)) {
        return;
    }

    let previousHeroHeight = pageHero.getBoundingClientRect().height;
    let previousContentTop = pageContent.getBoundingClientRect().top;

    window.addEventListener('scroll', () => {
        previousContentTop = pageContent.getBoundingClientRect().top;
    }, { passive: true });

    const heroHeightObserver = new ResizeObserver(entries => {
        const newHeroHeight = entries[0].contentRect.height;
        const heightDelta = newHeroHeight - previousHeroHeight;
        const currentContentTop = pageContent.getBoundingClientRect().top;
        const contentShift = currentContentTop - previousContentTop;
        const wasPastHero = previousContentTop <= 2;

        previousHeroHeight = newHeroHeight;

        if (wasPastHero && Math.abs(heightDelta) > 0.5 && Math.abs(contentShift) > 0.5) {
            window.scrollTo({
                top: window.scrollY + contentShift,
                left: window.scrollX,
                behavior: 'instant'
            });
        }

        previousContentTop = pageContent.getBoundingClientRect().top;
    });

    heroHeightObserver.observe(pageHero);
}
