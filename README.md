# Mason Ma Portfolio

> A clean, static portfolio site for showcasing IT skills, projects, and photography work.

![GitHub Pages Ready](https://img.shields.io/badge/GitHub%20Pages-ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/HTML%20%2B%20CSS-static%20site-blue)
![No Build Step](https://img.shields.io/badge/build-step-none-lightgrey)

## Snapshot

| Item | Details |
| --- | --- |
| Purpose | Personal IT portfolio and project showcase |
| Runtime | Static HTML and CSS only |
| Deployment | GitHub Pages from the repository root |
| Entry Point | `index.html` |
| Styling | Split across `css/base.css`, `css/layout.css`, and `css/components.css` |

## What’s Inside

- A professional hero section with contact links.
- About, skills, projects, and photography sections.
- Responsive card-based layout for readable presentation on desktop and mobile.
- Separate CSS files to keep structure, layout, and reusable components organized.

## File Structure

```text
.
├── index.html
└── css
    ├── base.css
    ├── layout.css
    └── components.css
```

## Local Preview

Because this is a static site, you do not need a build tool.

1. Open `index.html` directly in a browser, or
2. Use a local server if you prefer live reload.

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

## Notes

- The contact links in the header still use placeholder GitHub and LinkedIn URLs.
- The gallery currently uses placeholder images, so you can swap in your own photos anytime.
- The site is intentionally lightweight so it remains easy to host and maintain on GitHub Pages.
