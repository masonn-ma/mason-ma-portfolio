const heroNetworkCanvas = document.getElementById('hero-network');

if (heroNetworkCanvas) {
    const heroSection = heroNetworkCanvas.closest('header');
    const ctx = heroNetworkCanvas.getContext('2d');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrameId = null;
    let scrollFrameId = null;

    const createParticle = () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        radius: Math.random() * 1.8 + 1.1
    });

    const setCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvasWidth = heroNetworkCanvas.offsetWidth;
        canvasHeight = heroNetworkCanvas.offsetHeight;
        heroNetworkCanvas.width = Math.floor(canvasWidth * dpr);
        heroNetworkCanvas.height = Math.floor(canvasHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const particleCount = Math.max(36, Math.min(90, Math.floor((canvasWidth * canvasHeight) / 17000)));
        particles = Array.from({ length: particleCount }, createParticle);
    };

    const drawScene = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < particles.length; i += 1) {
            const p = particles[i];

            if (!motionPreference) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvasWidth) p.vx *= -1;
                if (p.y < 0 || p.y > canvasHeight) p.vy *= -1;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i += 1) {
            for (let j = i + 1; j < particles.length; j += 1) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt((dx * dx) + (dy * dy));
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const opacity = (1 - (distance / maxDistance)) * 0.26;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        if (!motionPreference) {
            animationFrameId = window.requestAnimationFrame(drawScene);
        }
    };

    setCanvasSize();
    drawScene();

    if (motionPreference) {
        drawScene();
    }

    window.addEventListener('resize', () => {
        if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
        }
        setCanvasSize();
        drawScene();
    });

    const updateHeroVisibility = () => {
        const hideThreshold = window.innerHeight * 0.18;
        const shouldHideHeroContent = window.scrollY > hideThreshold;

        if (heroSection) {
            heroSection.classList.toggle('hero-content-hidden', shouldHideHeroContent);
        }

        scrollFrameId = null;
    };

    window.addEventListener('scroll', () => {
        if (scrollFrameId) {
            return;
        }

        scrollFrameId = window.requestAnimationFrame(updateHeroVisibility);
    }, { passive: true });

    updateHeroVisibility();
}

const galleryItems = document.querySelectorAll('.gallery-item');
const galleryImgs = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');

// Lazy loading with Intersection Observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;

            img.classList.add('loading');

            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                observer.unobserve(img);
            };
            tempImg.onerror = () => {
                img.classList.remove('loading');
                observer.unobserve(img);
            };
            tempImg.src = src;
        }
    });
}, {
    rootMargin: '50px'
});

galleryImgs.forEach(img => {
    imageObserver.observe(img);
});

// Lightbox functionality
galleryItems.forEach(item => {
    const img = item.querySelector('.gallery-img');
    item.addEventListener('click', () => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        const caption = img.dataset.caption || img.alt;
        lightboxImage.dataset.caption = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImage) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// Card skeleton loader
const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
    card.classList.add('loading');

    setTimeout(() => {
        card.classList.remove('loading');
    }, 400 + index * 100);
});

// Section Navigation Dots (Option 3)
const sectionNav = document.querySelector('.section-nav');
const sectionDots = document.querySelectorAll('.section-dot');
const sections = document.querySelectorAll('section[id]');

const updateActiveDot = () => {
    let activeSection = null;
    let closestDistance = Infinity;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        // Find the section closest to the top of the viewport
        if (distance < closestDistance) {
            closestDistance = distance;
            activeSection = section.id;
        }
    });

    sectionDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.section === activeSection) {
            dot.classList.add('active');
        }
    });

    // Hide section nav when in hero section with smooth transition
    if (window.scrollY < window.innerHeight) {
        sectionNav.style.opacity = '0';
        sectionNav.style.visibility = 'hidden';
        sectionNav.style.pointerEvents = 'none';
    } else {
        sectionNav.style.opacity = '1';
        sectionNav.style.visibility = 'visible';
        sectionNav.style.pointerEvents = 'auto';
    }
};

window.addEventListener('scroll', updateActiveDot);
updateActiveDot();

// Back to Top Button (Option 4)
const backToTopBtn = document.querySelector('.back-to-top');

const updateBackToTopVisibility = () => {
    if (window.scrollY > window.innerHeight * 0.5) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
};

window.addEventListener('scroll', updateBackToTopVisibility);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

