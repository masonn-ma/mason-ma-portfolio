// const THRESHOLD = 100;
// let isScrolled = false;

const heroSection = document.getElementById('hero');
const sideNavbar = document.getElementById('side-navbar');

const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    const sideNavbarVisible = sideNavbar.classList.contains('visible');
    if (entry.isIntersecting && sideNavbarVisible) {
        sideNavbar.classList.remove('visible');
    } else if (!entry.isIntersecting && !sideNavbarVisible) {
        sideNavbar.classList.add('visible');
    }
}, { threshold: 0.5 });

observer.observe(heroSection);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();