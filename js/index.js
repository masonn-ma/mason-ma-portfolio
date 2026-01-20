const THRESHOLD = 100;
let isScrolled = false;

function onScroll() {
    if (!isScrolled && window.scrollY > THRESHOLD) {
        isScrolled = true;
        navbar.classList.add("scrolled");
    } else if (isScrolled && window.scrollY < THRESHOLD - 10) {
        isScrolled = false;
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();