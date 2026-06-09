const categoryDescriptions = {
    all: 'Click a category in the matrix to filter and inspect the toolset.',
    frontend: 'UI and interaction tooling for fast, responsive, and polished interfaces.',
    backend: 'Server-side architecture and API implementation for production workflows.',
    database: 'Data modeling and storage across relational and distributed document systems.',
    security: 'Practical security and network analysis skills for resilient systems.',
    language: 'Core programming languages used across web, systems, and automation projects.',
    tool: 'Day-to-day engineering platforms for collaboration, deployment, and operations.'
};

export function initSkillsMatrix() {
    const matrixCells = document.querySelectorAll('.matrix-cell');
    const skillChips = document.querySelectorAll('.skill-chip');
    const previewTitle = document.getElementById('skills-preview-title');
    const previewDescription = document.getElementById('skills-preview-description');

    if (!matrixCells.length || !skillChips.length) {
        return;
    }

    const applySkillFilter = (category) => {
        skillChips.forEach(chip => {
            const isMatch = category === 'all' || chip.dataset.category === category;
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
        previewTitle.textContent = labelNode ? labelNode.textContent.trim() : 'All Skills';
        previewDescription.textContent = categoryDescriptions[category] || categoryDescriptions.all;
    };

    const setActiveMatrixCell = (nextCell) => {
        matrixCells.forEach(cell => {
            const isActive = cell === nextCell;
            cell.classList.toggle('active', isActive);
            cell.setAttribute('aria-selected', String(isActive));
        });
    };

    matrixCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => setPreview(cell));
        cell.addEventListener('focus', () => setPreview(cell));
        cell.addEventListener('click', () => {
            const category = cell.dataset.category || 'all';
            setActiveMatrixCell(cell);
            applySkillFilter(category);
            setPreview(cell);
        });
    });

    const defaultCell = document.querySelector('.matrix-cell.active') || matrixCells[0];
    setActiveMatrixCell(defaultCell);
    applySkillFilter(defaultCell.dataset.category || 'all');
    setPreview(defaultCell);

    document.querySelector('.skills-matrix')?.addEventListener('mouseleave', () => {
        setPreview(document.querySelector('.matrix-cell.active'));
    });
}
