const heroNetworkCanvas = document.getElementById('hero-network');

if (heroNetworkCanvas) {
    const ctx = heroNetworkCanvas.getContext('2d');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrameId = null;

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
}

const gallery = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');

gallery.forEach(img => {
    img.addEventListener('click', () => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
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