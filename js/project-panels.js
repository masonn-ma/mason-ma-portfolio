export function initProjectPanels() {
    const projectPanels = document.querySelectorAll('.project-panel');

    if (!projectPanels.length) {
        return;
    }

    const toggleProjectPanel = (targetPanel) => {
        const isOpening = !targetPanel.classList.contains('open');

        projectPanels.forEach(panel => {
            panel.classList.remove('open');
            panel.querySelector('.project-toggle')?.setAttribute('aria-expanded', 'false');
        });

        if (isOpening) {
            targetPanel.classList.add('open');
            targetPanel.querySelector('.project-toggle')?.setAttribute('aria-expanded', 'true');
        }
    };

    projectPanels.forEach(panel => {
        const content = panel.querySelector('.project-content');
        const trigger = panel.querySelector('.project-toggle');

        content?.removeAttribute('hidden');

        if (trigger) {
            trigger.setAttribute('aria-expanded', String(panel.classList.contains('open')));
            trigger.addEventListener('click', () => toggleProjectPanel(panel));
        }
    });
}
