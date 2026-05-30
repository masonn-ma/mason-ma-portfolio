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

const diceNetworkCanvas = document.getElementById('dice-network');

if (diceNetworkCanvas) {
    try {
        const diceContainer = diceNetworkCanvas.closest('.dice-stage');
        const ctx = diceNetworkCanvas.getContext('2d');
        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lowPowerMode = motionPreference
            || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
            || (navigator.deviceMemory && navigator.deviceMemory <= 4)
            || (navigator.connection && navigator.connection.saveData);
        const frameDuration = 1000 / (lowPowerMode ? 12 : 16);
        const phi = (1 + Math.sqrt(5)) / 2;
        const vertices = [];
        const edges = [];
        let canvasWidth = 0;
        let canvasHeight = 0;
        let animationFrameId = null;
        let lastFrameTime = 0;
        let rotation = 0;

        if (!ctx) {
            throw new Error('Canvas 2D context is unavailable.');
        }

        const buildVertices = () => {
            vertices.length = 0;
            edges.length = 0;

            const rawVertices = [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
                [0, -1 / phi, -phi], [0, 1 / phi, -phi], [0, -1 / phi, phi], [0, 1 / phi, phi],
                [-1 / phi, -phi, 0], [1 / phi, -phi, 0], [-1 / phi, phi, 0], [1 / phi, phi, 0],
                [-phi, 0, -1 / phi], [phi, 0, -1 / phi], [-phi, 0, 1 / phi], [phi, 0, 1 / phi]
            ];

            const scale = Math.min(canvasWidth, canvasHeight) * 0.46;
            const normalize = Math.sqrt(3);

            rawVertices.forEach(([x, y, z], index) => {
                vertices.push({
                    x: (x / normalize) * scale,
                    y: (y / normalize) * scale,
                    z: (z / normalize) * scale,
                    radius: 1.15 + ((index % 4) * 0.06),
                    phase: index * 0.42,
                    role: index < 12 ? 'body' : 'ring'
                });
            });

            let shortestDistance = Infinity;
            for (let i = 0; i < vertices.length; i += 1) {
                for (let j = i + 1; j < vertices.length; j += 1) {
                    const dx = vertices[i].x - vertices[j].x;
                    const dy = vertices[i].y - vertices[j].y;
                    const dz = vertices[i].z - vertices[j].z;
                    const distance = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
                    if (distance > 0.0001 && distance < shortestDistance) {
                        shortestDistance = distance;
                    }
                }
            }

            const edgeThreshold = shortestDistance * 1.06;
            for (let i = 0; i < vertices.length; i += 1) {
                for (let j = i + 1; j < vertices.length; j += 1) {
                    const dx = vertices[i].x - vertices[j].x;
                    const dy = vertices[i].y - vertices[j].y;
                    const dz = vertices[i].z - vertices[j].z;
                    const distance = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));

                    if (distance <= edgeThreshold) {
                        edges.push([i, j]);
                    }
                }
            }
        };

        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvasWidth = diceContainer ? diceContainer.offsetWidth : diceNetworkCanvas.offsetWidth;
            canvasHeight = diceContainer ? diceContainer.offsetHeight : diceNetworkCanvas.offsetHeight;
            diceNetworkCanvas.width = Math.floor(canvasWidth * dpr);
            diceNetworkCanvas.height = Math.floor(canvasHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildVertices();
        };

        const roundRectPath = (x, y, width, height, radius) => {
            const safeRadius = Math.min(radius, width / 2, height / 2);
            ctx.beginPath();
            ctx.moveTo(x + safeRadius, y);
            ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
            ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
            ctx.arcTo(x, y + height, x, y, safeRadius);
            ctx.arcTo(x, y, x + width, y, safeRadius);
            ctx.closePath();
        };

        const drawScene = (timestamp = 0) => {
            if (!motionPreference && (timestamp - lastFrameTime) < frameDuration) {
                animationFrameId = window.requestAnimationFrame(drawScene);
                return;
            }

            lastFrameTime = timestamp;
            if (!motionPreference) {
                rotation += 0.00065;
            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            const roundRectRadius = Math.min(canvasWidth, canvasHeight) * 0.12;
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            const cameraDistance = Math.max(canvasWidth, canvasHeight) * 2.5;
            const xTilt = -0.5;

            const projectVertex = (vertex) => {
                const cosY = Math.cos(rotation);
                const sinY = Math.sin(rotation);
                const cosX = Math.cos(xTilt);
                const sinX = Math.sin(xTilt);

                let x = (vertex.x * cosY) + (vertex.z * sinY);
                let z = (-vertex.x * sinY) + (vertex.z * cosY);
                let y = (vertex.y * cosX) - (z * sinX);
                z = (vertex.y * sinX) + (z * cosX);

                const depth = cameraDistance / (cameraDistance + z);

                return {
                    x: centerX + (x * depth),
                    y: centerY + (y * depth),
                    scale: depth,
                    depth
                };
            };

            const projected = vertices.map(projectVertex);

            ctx.save();
            roundRectPath(8, 8, canvasWidth - 16, canvasHeight - 16, roundRectRadius);
            ctx.clip();

            edges.forEach(([startIndex, endIndex], index) => {
                const start = projected[startIndex];
                const end = projected[endIndex];
                const dx = start.x - end.x;
                const dy = start.y - end.y;
                const distance = Math.sqrt((dx * dx) + (dy * dy));
                const maxDistance = Math.max(canvasWidth, canvasHeight) * 0.42;
                const opacity = Math.max(0.07, (1 - (distance / maxDistance)) * 0.28);

                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
                ctx.lineWidth = index % 5 === 0 ? 1.2 : 0.9;
                ctx.stroke();
            });

            projected.forEach((point, index) => {
                const vertex = vertices[index];
                const pulse = motionPreference ? 0 : Math.sin((timestamp / 1800) + vertex.phase) * 0.05;
                const baseRadius = 1.65;

                ctx.beginPath();
                ctx.arc(point.x, point.y, (baseRadius + pulse) * point.scale, 0, Math.PI * 2);
                ctx.fillStyle = index < 12
                    ? 'rgba(255, 255, 255, 0.78)'
                    : 'rgba(255, 255, 255, 0.86)';
                ctx.fill();
            });

            ctx.restore();

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
    } catch (error) {
        console.warn('Dice canvas disabled:', error);
    }
}

const galleryItems = document.querySelectorAll('.gallery-item');
const galleryImgs = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const travelLink = document.querySelector('.hero-travel-link');
const travelModal = document.getElementById('travel-modal');
const travelModalClose = document.getElementById('travel-modal-close');

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
if (lightbox && lightboxImage) {
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
}

const closeLightbox = () => {
    if (!lightbox) return;
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
    const heroSection = document.querySelector('header');
    if (heroSection) {
        heroSection.classList.add('hero-content-hidden');
    }
};

const closeTravelModal = () => {
    if (!travelModal) {
        return;
    }

    travelModal.classList.remove('active');
    travelModal.setAttribute('aria-hidden', 'true');
    if (!lightbox || !lightbox.classList.contains('active')) {
        document.body.style.overflow = '';
    }
    const heroSection = document.querySelector('header');
    if (heroSection) {
        const hideThreshold = window.innerHeight * 0.18;
        heroSection.classList.toggle('hero-content-hidden', window.scrollY > hideThreshold);
    }
};

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImage) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
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

// Skills matrix interactions (hover preview + click filtering)
const matrixCells = document.querySelectorAll('.matrix-cell');
const skillChips = document.querySelectorAll('.skill-chip');
const previewTitle = document.getElementById('skills-preview-title');
const previewDescription = document.getElementById('skills-preview-description');

const categoryDescriptions = {
    all: 'Click a category in the matrix to filter and inspect the toolset.',
    frontend: 'UI and interaction tooling for fast, responsive, and polished interfaces.',
    backend: 'Server-side architecture and API implementation for production workflows.',
    database: 'Data modeling and storage across relational and distributed document systems.',
    security: 'Practical security and network analysis skills for resilient systems.',
    language: 'Core programming languages used across web, systems, and automation projects.',
    tool: 'Day-to-day engineering platforms for collaboration, deployment, and operations.'
};

const applySkillFilter = (category) => {
    skillChips.forEach(chip => {
        const chipCategory = chip.dataset.category;
        const isMatch = category === 'all' || chipCategory === category;

        chip.classList.toggle('is-highlighted', isMatch);
        chip.classList.toggle('is-dimmed', !isMatch);
    });
};

const setPreview = (cell) => {
    if (!cell || !previewTitle || !previewDescription) {
        return;
    }

    const category = cell.dataset.category || 'all';
    const labelNode = cell.querySelector('.matrix-label');
    const label = labelNode ? labelNode.textContent.trim() : 'All Skills';
    previewTitle.textContent = label;
    previewDescription.textContent = categoryDescriptions[category] || categoryDescriptions.all;
};

const setActiveMatrixCell = (nextCell) => {
    matrixCells.forEach(cell => {
        const isActive = cell === nextCell;
        cell.classList.toggle('active', isActive);
        cell.setAttribute('aria-selected', String(isActive));
    });
};

if (matrixCells.length && skillChips.length) {
    matrixCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            setPreview(cell);
        });

        cell.addEventListener('focus', () => {
            setPreview(cell);
        });

        cell.addEventListener('click', () => {
            const category = cell.dataset.category || 'all';
            setActiveMatrixCell(cell);
            applySkillFilter(category);
            setPreview(cell);
        });
    });

    const defaultCell = document.querySelector('.matrix-cell.active') || matrixCells[0];
    if (defaultCell) {
        setActiveMatrixCell(defaultCell);
        applySkillFilter(defaultCell.dataset.category || 'all');
        setPreview(defaultCell);
    }

    const matrixContainer = document.querySelector('.skills-matrix');
    if (matrixContainer) {
        matrixContainer.addEventListener('mouseleave', () => {
            const activeCell = document.querySelector('.matrix-cell.active');
            setPreview(activeCell);
        });
    }
}

// Editorial project accordion interactions
const projectPanels = document.querySelectorAll('.project-panel');

const toggleProjectPanel = (targetPanel) => {
    const isOpening = !targetPanel.classList.contains('open');

    // Close all other panels
    projectPanels.forEach(panel => {
        panel.classList.remove('open');
        const toggle = panel.querySelector('.project-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });

    // Open target panel if it was closed
    if (isOpening) {
        targetPanel.classList.add('open');
        const toggle = targetPanel.querySelector('.project-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
};

if (projectPanels.length) {
    projectPanels.forEach(panel => {
        const content = panel.querySelector('.project-content');
        const trigger = panel.querySelector('.project-toggle');
        
        if (content) {
            content.removeAttribute('hidden');
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', panel.classList.contains('open'));
            trigger.addEventListener('click', () => {
                toggleProjectPanel(panel);
            });
        }
    });
}

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

window.addEventListener('scroll', updateActiveDot, { passive: true });
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

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
