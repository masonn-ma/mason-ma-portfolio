export function initHeroCanvas() {
    const canvas = document.getElementById('hero-network');

    if (!canvas) {
        return;
    }

    try {
        const heroSection = canvas.closest('header');
        const ctx = canvas.getContext('2d');
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
            canvasWidth = canvas.offsetWidth;
            canvasHeight = canvas.offsetHeight;
            canvas.width = Math.floor(canvasWidth * dpr);
            canvas.height = Math.floor(canvasHeight * dpr);
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
                const particle = particles[i];

                if (!motionPreference) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
                ctx.fill();
            }

            for (let i = 0; i < particles.length; i += 1) {
                for (let j = i + 1; j < particles.length; j += 1) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt((dx * dx) + (dy * dy));

                    if (distance < connectionDistance) {
                        const opacity = (1 - (distance / connectionDistance)) * 0.26;
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

        let canvasResizeFrameId = null;

        const resizeCanvas = () => {
            canvasResizeFrameId = null;

            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }

            setCanvasSize();
            drawScene();
        };

        const queueCanvasResize = () => {
            if (canvasResizeFrameId) {
                window.cancelAnimationFrame(canvasResizeFrameId);
            }

            canvasResizeFrameId = window.requestAnimationFrame(resizeCanvas);
        };

        window.addEventListener('resize', queueCanvasResize);

        if ('ResizeObserver' in window) {
            const canvasResizeObserver = new ResizeObserver(queueCanvasResize);
            canvasResizeObserver.observe(canvas);
        }

        const updateHeroVisibility = () => {
            const hideThreshold = window.innerHeight * 0.18;

            if (heroSection) {
                heroSection.classList.toggle('hero-content-hidden', window.scrollY > hideThreshold);
            }

            scrollFrameId = null;
        };

        window.addEventListener('scroll', () => {
            if (!scrollFrameId) {
                scrollFrameId = window.requestAnimationFrame(updateHeroVisibility);
            }
        }, { passive: true });

        updateHeroVisibility();
    } catch (error) {
        console.warn('Hero canvas disabled:', error);
    }
}
