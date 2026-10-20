import { initDialogs } from './dialog.js';
import { initGallery } from './gallery.js';
import { initHeroCanvas } from './hero-canvas.js';
import { initProjectPanels } from './project-panels.js';
import { initReveal } from './reveal.js';
import { initSectionNavigation } from './section-navigation.js';
import { initTravelModal } from './travel-modal.js';

initDialogs();
initHeroCanvas();
initReveal();
initSectionNavigation();
initGallery();
initTravelModal();
initProjectPanels();

window.__siteReady = true;
