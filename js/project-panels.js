export function initProjectPanels() {
    const projectPanels = document.querySelectorAll('.project-panel');

    if (!projectPanels.length) {
        return;
    }

    const getContentHeight = (content) => {
        content.style.removeProperty('max-height');
        content.style.removeProperty('visibility');
        content.style.removeProperty('opacity');
        const height = content.scrollHeight;
        content.style.maxHeight = '0';
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
        return height;
    };

    const toggleProjectPanel = (targetPanel) => {
        const isOpening = !targetPanel.classList.contains('open');
        const targetContent = targetPanel.querySelector('.project-content');

        projectPanels.forEach(panel => {
            const content = panel.querySelector('.project-content');
            if (panel === targetPanel) return;
            panel.classList.remove('open');
            content?.style.removeProperty('max-height');
            content?.style.removeProperty('visibility');
            content?.style.removeProperty('opacity');
            panel.querySelector('.project-toggle')?.setAttribute('aria-expanded', 'false');
        });

        if (isOpening && targetContent) {
            const height = getContentHeight(targetContent);
            requestAnimationFrame(() => {
                targetContent.style.removeProperty('visibility');
                targetContent.style.removeProperty('opacity');
                targetContent.style.maxHeight = height + 'px';
                targetPanel.classList.add('open');
                targetPanel.querySelector('.project-toggle')?.setAttribute('aria-expanded', 'true');
            });
        } else {
            targetContent?.style.removeProperty('max-height');
            targetContent?.style.removeProperty('visibility');
            targetContent?.style.removeProperty('opacity');
        }
    };

    projectPanels.forEach(panel => {
        const content = panel.querySelector('.project-content');
        const trigger = panel.querySelector('.project-toggle');

        content?.removeAttribute('hidden');

        if (panel.classList.contains('open') && content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', String(panel.classList.contains('open')));
            trigger.addEventListener('click', () => toggleProjectPanel(panel));
        }
    });
}
