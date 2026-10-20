export function initReveal() {
    const targets = Array.from(document.querySelectorAll('[data-reveal]'));

    if (!targets.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            let batchIndex = 0;

            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.setProperty('--reveal-delay', `${Math.min(batchIndex * 60, 180)}ms`);
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
                batchIndex += 1;
            });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));
}
