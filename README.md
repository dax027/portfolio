# Terminal Portfolio

A dependency-free static site for GitHub Pages. It is built as a small personal security archive: resume highlights, builds, and CTF/write-up cards are rendered from one editable content file.

## Edit your content

Most personal data lives in `content/site-data.js`.

- Update `profile` for your name, role, summary, contact copy, and primary links.
- Update `experience` and `skills` for resume content.
- Update `projects` for builds, labs, and research.
- Update `writeups` for CTFs or technical posts.

## Add write-ups

Duplicate `writeups/ctf-template.html`, rename it, and point a `writeups` entry in `content/site-data.js` at the new file.

## GitHub Pages

Push this repository to GitHub, then enable Pages from the repository settings. Use the root of the default branch as the publishing source.
