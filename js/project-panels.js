export function initProjectPanels() {
    const projects = document.querySelectorAll('.project');

    if (!projects.length) {
        return;
    }

    projects.forEach((project) => {
        const toggle = project.querySelector('.project-toggle');

        if (!toggle) {
            return;
        }

        toggle.setAttribute('aria-expanded', String(project.classList.contains('is-open')));

        toggle.addEventListener('click', () => {
            const willOpen = !project.classList.contains('is-open');

            projects.forEach((other) => {
                const otherToggle = other.querySelector('.project-toggle');
                other.classList.remove('is-open');
                otherToggle?.setAttribute('aria-expanded', 'false');
            });

            if (willOpen) {
                project.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });
}
