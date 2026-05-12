<!-- Back to top link -->
<a id="readme-top"></a>

<p align="center">
  <a href="https://www.rmit.edu.vn/"><img alt="RMIT Vietnam" src="https://img.shields.io/badge/RMIT%20Vietnam-CC0000?style=for-the-badge&logo=rmit&logoColor=white" /></a>
  <img alt="Mason Ma Portfolio" src="https://img.shields.io/badge/Mason%20Ma%20Portfolio-1f2937?style=for-the-badge&logo=github&logoColor=white" />
  <a href="https://masonn-ma.github.io/mason-ma-portfolio/"><img alt="Live on GitHub Pages" src="https://img.shields.io/badge/Live%20on%20GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://github.com/masonn-ma/mason-ma-portfolio"><img alt="View Repository" src="https://img.shields.io/badge/View%20Repository-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
</p>

<p align="center">
  <img src="imgs/favicons/favicon-512x512.png" alt="Mason Ma Portfolio Logo" width="180" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=23&duration=3500&pause=1000&color=00FF41&center=true&vCenter=true&width=700&lines=%3E+LOADING+PORTFOLIO;%3E+SHOWCASING+PROJECTS;%3E+DISPLAYING+SKILLS" />
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3B82F6,100:1F2937&height=220&section=header&text=Mason%20Ma&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=IT%20Student%20%7C%20DevOps%20%26%20Cyber%20Security&descAlignY=58" />
</p>

## Table of Contents

- [Quick Overview](#quick-overview)
- [Built With](#built-with)
- [Project Snapshot](#project-snapshot)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Preview](#local-preview)
- [Deploying on GitHub Pages](#deploying-on-github-pages)
- [Customization Guide](#customization-guide)
- [File Structure](#file-structure)
- [Features](#features)
- [Development Notes](#development-notes)
- [Limitations](#limitations)
- [Recommended Improvements](#recommended-improvements)

<p align="right"><a href="#readme-top">back to top</a></p>

## Quick Overview

Mason Ma's Portfolio is a clean, professional portfolio website designed to showcase IT skills, technical projects, and photography work. The site features a responsive, static design with interactive elements and a modern aesthetic.

- Professional hero section with network animation and contact links
- Responsive card-based layout for all sections
- Masonry-style photography gallery with lazy loading and lightbox modal
- Scroll-based section navigation dots
- Mobile-first responsive design
- No build tools required — pure HTML, CSS, and vanilla JavaScript

<p align="right"><a href="#readme-top">back to top</a></p>

## Built With

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,javascript&theme=dark" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-181717?style=flat-square&logo=github&logoColor=white" />
</p>

<p align="right"><a href="#readme-top">back to top</a></p>

## Project Snapshot

This repository contains a static portfolio website hosted on GitHub Pages. The site showcases education, technical skills, completed projects, and photography portfolio.

**Project structure:**

```text
.
├── index.html
├── README.md
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   └── main.js
├── imgs/
│   ├── catalog/
│   ├── favicons/
│   ├── logo/
│   └── ...
```

- `index.html` is the main entry point and contains all page content.
- `css/` contains styling split across base, layout, and component files.
- `js/main.js` handles interactive behavior and animations.
- `imgs/` stores all images including favicons, logos, and photography gallery.

<p align="right"><a href="#readme-top">back to top</a></p>

## Getting Started

Follow these steps to preview or customize the portfolio.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Node.js (16+) and npm for local server with live reload

### Local Preview

Because this is a static site, you do not need a build tool.

**Option 1: Direct browser**

1. Clone the repository: `git clone https://github.com/masonn-ma/mason-ma-portfolio.git`
2. Navigate to the folder and open `index.html` directly in a browser.

**Option 2: Local server (recommended)**

1. Clone and navigate to the repository folder.
2. Start a simple HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   ```
3. Open `http://localhost:8000` in your browser.

<p align="right"><a href="#readme-top">back to top</a></p>

## Deploying on GitHub Pages

This repository is already configured for GitHub Pages deployment.

1. Push the repository to GitHub.
2. Navigate to the repository **Settings** → **Pages**.
3. Set the source to `main` branch and the root folder.
4. Save and wait for the site to publish.
5. Access the live site at `https://masonn-ma.github.io/mason-ma-portfolio/`

Verification:
- Check that all images load correctly across sections.
- Test responsive behavior on mobile and desktop.
- Verify all contact links and external links function properly.

<p align="right"><a href="#readme-top">back to top</a></p>

## Customization Guide

- **Content Updates**: Edit sections directly in `index.html` — update experience, projects, skills, and photography.
- **Colors & Typography**: Adjust base styles in `css/base.css` (fonts, primary/accent colors, sizing).
- **Layout & Spacing**: Modify layout rules in `css/layout.css` (grid, sections, responsive breakpoints).
- **Components**: Customize cards, buttons, skill tags, and galleries in `css/components.css`.
- **Interactivity**: Edit hero canvas animation, section navigation dots, lightbox, and lazy loading in `js/main.js`.
- **Images**: Replace or add images in `imgs/` and update corresponding entries in the gallery or metadata.

<p align="right"><a href="#readme-top">back to top</a></p>

## File Structure

```text
.
├── index.html              # Main entry point and page content
├── README.md               # This file
├── css/
│   ├── base.css            # Base styles, colors, typography
│   ├── layout.css          # Layout, grid, responsive breakpoints
│   └── components.css      # Reusable components (cards, buttons, etc.)
├── js/
│   └── main.js             # Interactive behavior and animations
└── imgs/
    ├── catalog/            # Photography gallery images
    ├── favicons/           # Favicon assets
    ├── logo/               # Logo and branding assets
    └── quickview.png       # OG preview image
```

<p align="right"><a href="#readme-top">back to top</a></p>

## Features

- **Hero Section**: Network animation canvas with contact links and social profiles.
- **Responsive Design**: Mobile-first layout that adapts to all screen sizes.
- **Section Navigation**: Sticky dots for quick navigation between sections.
- **Photography Gallery**: Masonry grid with lazy loading and lightbox modal.
- **Skill Showcase**: Organized skill cards for frontend, backend, databases, security, languages, and tools.
- **Project Cards**: Detailed project cards with technologies and key achievements.
- **Back-to-Top Button**: Easy navigation for long pages.
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support.

<p align="right"><a href="#readme-top">back to top</a></p>

## Development Notes

- All assets use relative paths for maximum portability across deployment environments.
- CSS is intentionally split into three files for maintainability and organization.
- JavaScript is vanilla (no frameworks) to keep the bundle size minimal and improve performance.
- Images are lazy-loaded in the gallery to optimize page load times.
- Hero canvas animation is responsive and scales based on viewport.

<p align="right"><a href="#readme-top">back to top</a></p>

## Limitations

- The site is static HTML/CSS/JavaScript with no backend — contact forms require external service integration.
- Gallery images are loaded from the `imgs/` folder — external CDN could be used for better performance.
- Browser support is limited to modern browsers with CSS Grid and ES6 JavaScript support.
- Animation performance depends on device capabilities; older devices may experience slower canvas rendering.

<p align="right"><a href="#readme-top">back to top</a></p>

## Recommended Improvements

- Integrate a contact form backend (Formspree, Netlify Forms, etc.).
- Optimize images with WebP format and responsive image sizes.
- Add dark mode toggle with persistent preference storage.
- Implement Service Worker for offline access and faster page loads.
- Add SEO schema markup (JSON-LD) for better search engine indexing.
- Integrate analytics (Google Analytics, Plausible) for visitor insights.
- Create dedicated project detail pages instead of inline cards.

<p align="right"><a href="#readme-top">back to top</a></p>

<p align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=0:3B82F6,100:1F2937"/>
</p>
