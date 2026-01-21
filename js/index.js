// const THRESHOLD = 100;
// let isScrolled = false;

const heroSection = document.getElementById('hero');
const sideNavbar = document.getElementById('side-navbar');

const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
        sideNavbar.classList.remove('visible');
    } else if (!entry.isIntersecting) {
        sideNavbar.classList.add('visible');
    }
}, { threshold: 0.1 });


function onScroll() {
    // if (!isScrolled && window.scrollY > THRESHOLD) {
    //     isScrolled = true;
    //     navbar.classList.add("scrolled");
    // } else if (isScrolled && window.scrollY < THRESHOLD - 10) {
    //     isScrolled = false;
    //     navbar.classList.remove("scrolled");
    // }


}

observer.observe(heroSection);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();