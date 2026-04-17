# Mason Ma's Portfolio

> A clean, static portfolio site for showcasing IT skills, projects, and photography work.

![GitHub Pages Ready](https://img.shields.io/badge/GitHub%20Pages-ready-brightgreen)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-visit-green)](https://masonn-ma.github.io/mason-ma-portfolio/)
![Tech Stack](https://img.shields.io/badge/HTML%20%2B%20CSS%20%2B%20JS-static%20site-blue)

## Snapshot

| Item | Details |
| --- | --- |
| Purpose | Personal IT portfolio and project showcase |
| Runtime | Static HTML, CSS, and vanilla JavaScript |
| Deployment | GitHub Pages from the repository root |
| Entry Point | `index.html` |
| Styling | Split across `css/base.css`, `css/layout.css`, and `css/components.css` |
| Behavior | Interactive logic in `js/main.js` |

## What’s Inside

- A professional hero section with contact links.
- About, skills, projects, and photography sections.
- Responsive card-based layout for readable presentation on desktop and mobile.
- Masonry-style photography grid with lazy loading and captions.
- Scroll-based section navigation dots and a back-to-top button.
- Lightbox modal for enlarged photo viewing.
- Separate CSS files and a dedicated JavaScript file for maintainable structure.

## File Structure

```text
.
├── index.html
├── js
│   └── main.js
├── imgs
│   └── ...
└── css
    ├── base.css
    ├── layout.css
    └── components.css
```

## Local Preview

Because this is a static site, you do not need a build tool.

1. Open `index.html` directly in a browser, or
2. Use a local server if you prefer live reload and more consistent behavior for media-heavy pages.

## GitHub Pages Deployment

This repository is already set up to work with GitHub Pages because it uses relative paths only.

1. Push the repo to GitHub.
2. In the repository settings, open **Pages**.
3. Set the source to the `main` branch and the root folder.
4. Save the settings and wait for the site to publish.

## Customization Guide

- Update the content in `index.html` to match your latest experience.
- Adjust colors and typography in `css/base.css`.
- Change spacing, layout, and page sections in `css/layout.css`.
- Tweak reusable cards, skill tags, and other components in `css/components.css`.
- Edit interactive behavior (hero canvas, active nav dots, lightbox, lazy loading) in `js/main.js`.
- Replace or add images in `imgs/` and update corresponding entries in the photography gallery.

## Notes

- Header links include Email, GitHub, LinkedIn, and Instagram.
- `og:url` in `index.html` is currently empty and should be updated when the final deployment URL is known.
- The site is intentionally lightweight so it remains easy to host and maintain on GitHub Pages.
