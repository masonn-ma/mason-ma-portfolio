export function initDiceCanvas() {
    const canvas = document.getElementById('dice-network');

    if (!canvas) {
        return;
    }

    try {
        const container = canvas.closest('.dice-stage');
        const ctx = canvas.getContext('2d');
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
            canvasWidth = container ? container.offsetWidth : canvas.offsetWidth;
            canvasHeight = container ? container.offsetHeight : canvas.offsetHeight;
            canvas.width = Math.floor(canvasWidth * dpr);
            canvas.height = Math.floor(canvasHeight * dpr);
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

        if ('ResizeObserver' in window && container) {
            const canvasResizeObserver = new ResizeObserver(queueCanvasResize);
            canvasResizeObserver.observe(container);
        }
    } catch (error) {
        console.warn('Dice canvas disabled:', error);
    }
}
