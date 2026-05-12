# Dax Dickenson Portfolio

A custom static portfolio for resume highlights, security research, lab builds, and CTF write-ups. The site is intentionally lightweight: no CMS, no template framework, no build pipeline, and no runtime dependencies. GitHub Pages can serve it directly from the repository root.

## Site Structure

```text
index.html              Main page shell
styles.css              Visual system, layout, and responsive styling
content/site-data.js    Editable portfolio content
scripts/app.js          Rendering, filtering, and animation behavior
writeups/               Standalone write-up pages
```

## Content Model

Most public-facing text is stored in `content/site-data.js`:

- `profile` controls the hero, summary, primary links, and footer line.
- `signals` controls the four quick-status cards near the top of the page.
- `experience` and `skills` power the resume section.
- `projects` lists builds, labs, and research tracks.
- `writeups` lists CTFs, study notes, and technical posts.
- `contact` controls the public contact links.

## Write-ups

Use `writeups/ctf-template.html` as a starting point for new CTF or lab notes. After creating a new page, add an entry for it in the `writeups` array inside `content/site-data.js`.

## Local Preview

Open `index.html` directly in a browser. Because the site uses plain HTML, CSS, and JavaScript, no local server is required for normal previewing.

## Deployment

The repository is designed for GitHub Pages with the root of `main` as the publishing source.
