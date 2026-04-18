const heroNetworkCanvas = document.getElementById('hero-network');

if (heroNetworkCanvas) {
    try {
        const heroSection = heroNetworkCanvas.closest('header');
        const ctx = heroNetworkCanvas.getContext('2d');
        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lowPowerMode = motionPreference
            || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
            || (navigator.deviceMemory && navigator.deviceMemory <= 4)
            || (navigator.connection && navigator.connection.saveData);
        let particles = [];
        let canvasWidth = 0;
        let canvasHeight = 0;
        let animationFrameId = null;
        let scrollFrameId = null;
        let lastFrameTime = 0;

        if (!ctx) {
            throw new Error('Canvas 2D context is unavailable.');
        }

        const particleCountConfig = lowPowerMode
            ? { min: 22, max: 56, divisor: 25000 }
            : { min: 36, max: 84, divisor: 18500 };
        const connectionDistance = lowPowerMode ? 108 : 142;
        const targetFps = lowPowerMode ? 25 : 32;
        const frameDuration = 1000 / targetFps;

        const createParticle = () => ({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            vx: (Math.random() - 0.5) * (lowPowerMode ? 0.2 : 0.28),
            vy: (Math.random() - 0.5) * (lowPowerMode ? 0.2 : 0.28),
            radius: Math.random() * 1.8 + 1.1
        });

        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvasWidth = heroNetworkCanvas.offsetWidth;
            canvasHeight = heroNetworkCanvas.offsetHeight;
            heroNetworkCanvas.width = Math.floor(canvasWidth * dpr);
            heroNetworkCanvas.height = Math.floor(canvasHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const particleCount = Math.max(
                particleCountConfig.min,
                Math.min(
                    particleCountConfig.max,
                    Math.floor((canvasWidth * canvasHeight) / particleCountConfig.divisor)
                )
            );
            particles = Array.from({ length: particleCount }, createParticle);
        };

        const drawScene = (timestamp = 0) => {
            if (!motionPreference && (timestamp - lastFrameTime) < frameDuration) {
                animationFrameId = window.requestAnimationFrame(drawScene);
                return;
            }

            lastFrameTime = timestamp;
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
                    const maxDistance = connectionDistance;

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
    } catch (error) {
        console.warn('Hero canvas disabled:', error);
    }
}

const galleryItems = document.querySelectorAll('.gallery-item');
const galleryImgs = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const travelLink = document.querySelector('.hero-travel-link');
const travelModal = document.getElementById('travel-modal');
const travelModalClose = document.getElementById('travel-modal-close');
const heroSectionElement = document.querySelector('header');

const syncHeroVisibilityWithScroll = () => {
    if (!heroSectionElement) {
        return;
    }

    const hideThreshold = window.innerHeight * 0.18;
    heroSectionElement.classList.toggle('hero-content-hidden', window.scrollY > hideThreshold);
};

const loadGalleryImage = (img) => {
    const src = img.dataset.src;

    if (!src || img.classList.contains('loaded')) {
        return;
    }

    img.classList.add('loading');

    const tempImg = new Image();
    tempImg.onload = () => {
        img.src = src;
        img.classList.remove('loading');
        img.classList.add('loaded');
    };
    tempImg.onerror = () => {
        img.classList.remove('loading');
    };
    tempImg.src = src;
};

// Lazy loading with Intersection Observer
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadGalleryImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    galleryImgs.forEach(img => {
        imageObserver.observe(img);
    });
} else {
    galleryImgs.forEach((img) => loadGalleryImage(img));
}

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
    if (!travelModal || !travelModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
};

const openTravelModal = () => {
    if (!travelModal) {
        return;
    }

    travelModal.classList.add('active');
    travelModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (heroSectionElement) {
        heroSectionElement.classList.add('hero-content-hidden');
    }
};

const closeTravelModal = () => {
    if (!travelModal) {
        return;
    }

    travelModal.classList.remove('active');
    travelModal.setAttribute('aria-hidden', 'true');
    if (!lightbox.classList.contains('active')) {
        document.body.style.overflow = '';
    }
    syncHeroVisibilityWithScroll();
};

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImage) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
        return;
    }

    if (e.key === 'Escape' && travelModal && travelModal.classList.contains('active')) {
        closeTravelModal();
    }
});

if (travelLink) {
    travelLink.addEventListener('click', (e) => {
        e.preventDefault();
        openTravelModal();
    });
}

if (travelModal) {
    travelModal.addEventListener('click', (e) => {
        if (e.target === travelModal || e.target.classList.contains('travel-modal-overlay')) {
            closeTravelModal();
        }
    });
}

if (travelModalClose) {
    travelModalClose.addEventListener('click', closeTravelModal);
}

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
    if (!sectionNav || !sectionDots.length || !sections.length) {
        return;
    }

    if (window.matchMedia('(max-width: 900px)').matches) {
        sectionNav.style.opacity = '0';
        sectionNav.style.visibility = 'hidden';
        sectionNav.style.pointerEvents = 'none';
        return;
    }

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

    // Show dots before hero is fully gone for smoother wayfinding.
    const navRevealThreshold = window.innerHeight * 0.72;
    if (window.scrollY < navRevealThreshold) {
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
    if (!backToTopBtn) {
        return;
    }

    if (window.scrollY > window.innerHeight * 0.5) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
};

window.addEventListener('scroll', updateBackToTopVisibility);

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

