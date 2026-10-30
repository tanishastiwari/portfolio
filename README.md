# Tanisha Tiwari, portfolio

A static portfolio site: plain HTML, CSS and JavaScript. No framework, no build step, no tracking, no outside services. Fonts and icons are stored in this repository.

## Files

```
index.html          all page content
style.css           design (colours, type, layout)
script.js           tabs, project filter, copy email, nav highlighting
README.md
assets/
  favicon.svg
  fonts/            Newsreader + Instrument Sans (with licences)
  img/
    tanisha.webp    portrait
    og-cover.jpg    social preview image (1200 × 630)
    projects/       five project banner artworks
```

## Deploy on GitHub Pages

1. Create a repository (a root site is named `YOUR-USERNAME.github.io`; any other name also works).
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the root of the `main` branch.
3. Upload the `assets` folder: on github.com click **Add file → Upload files** and drag the whole `assets` folder from your computer onto the page, so the folder structure is kept.
4. Go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
5. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/` or `https://YOUR-USERNAME.github.io/REPO-NAME/`.

All asset paths are relative, so the site works in a repository subfolder and on a custom domain without changes.

**Custom domain:** in **Settings → Pages → Custom domain**, enter your domain and follow GitHub’s DNS instructions. GitHub adds a `CNAME` file for you.

## Social previews and canonical URL

Once you know the live address:

1. In `index.html`, change `<meta property="og:image" content="assets/img/og-cover.jpg">` to the full URL, for example `https://YOUR-USERNAME.github.io/assets/img/og-cover.jpg`. LinkedIn and WhatsApp need the full address to show the image.
2. In `index.html`, find the commented-out `<link rel="canonical" …>` line near the top, remove the `<!--` and `-->` around it, and replace `https://YOUR-DOMAIN/` with the live address.
3. Paste the link into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh the cached preview.

## Where to edit things

All content lives in `index.html`. Search for these comment markers or text:

| What | Where |
| --- | --- |
| Hero headline and introduction | `<!-- HERO -->` |
| Memorable line (navy band) | `class="statement__line"` |
| Selected achievements (figures and wording) | `<!-- ACHIEVEMENTS -->` |
| How I work | `<!-- HOW I WORK -->` |
| Skills tabs | `<!-- SKILLS -->`, one `role="tabpanel"` block per tab |
| Projects | `<!-- PROJECTS -->`, one `<article class="project">` per project |
| Project filter categories | each project’s `data-cats` attribute: `b2b`, `events`, `content` (space-separated) |
| Employment dates and roles | `<!-- EXPERIENCE -->`, `class="entry__date"` |
| Education dates | `<!-- EDUCATION -->` |
| Tools, certifications, languages | `<!-- TOOLS -->`, `<!-- CERTIFICATIONS -->` |
| Book | `<!-- PUBLICATIONS -->` |
| Email address | `<!-- CONTACT -->` (three places: visible text, `data-copy`, `mailto:`) and the `email` line in the structured data at the top |
| Page title and description | top of `index.html` (`<title>`, `description`, `og:` tags) |

**Adding a link** (LinkedIn, book purchase page): add an `<a class="btn btn--ghost-dark" href="…">` next to the email buttons in the Contact section, or a link in the Publications text. None are included until real links are supplied.

**Colours:** edit the variables at the top of `style.css` (`:root`). Keep body text dark enough for contrast; coral (`--coral`) is used only for decoration, never small text.

**Images:**
- Portrait: replace `assets/img/tanisha.webp`. Portrait orientation (4:5) works best; it is cropped to fit.
- Project banners: replace any file in `assets/img/projects/` with the same name. Wide images (around 1600 × 640) work best; titles sit on the left, so keep the left third fairly plain and dark.
- Book cover: the site shows a typographic illustration, not the real cover. To use the real cover, add `assets/img/book-cover.webp` and replace the contents of `<div class="book">` with an `<img>` of it.
- Keep file names lowercase with no spaces, and images under about 300 KB. After replacing an image, hard-refresh (Ctrl/⌘ + Shift + R).

## Privacy

The site deliberately does not include a phone number, street address or the original résumé PDF. Keep it that way unless a public-safe version is supplied.

## Testing checklist after changes

- Desktop (~1440px) and phone (~390px): no sideways scrolling, nothing clipped.
- Every nav link, both hero buttons, all four project filters and all five skill tabs work.
- Copy email shows a confirmation and pastes the right address.
- Tab through the page with the keyboard: focus is always visible.

## Credits

- Typefaces: Newsreader and Instrument Sans, SIL Open Font License (licences in `assets/fonts/`)
- Icons: Phosphor Icons (regular), MIT licence
- Project artwork: original abstract illustrations made for this site
