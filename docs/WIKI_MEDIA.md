# Wiki: images and video

How to add wiki pages and embed images or video. Wiki content lives in the repo; a build step copies media and generates HTML for the site.

## Quick reference

| What                | Path                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| Page content        | `contents/markdown/*.md`                                              |
| Image & video files | `contents/media/` (`images/`, `videos/`, …)                           |
| Generated output    | `public/html/`, `public/media/` — run `npm run dev:html` (gitignored) |
| Live URL            | `/wiki/YourPage.html`                                                 |

```
contents/
├── markdown/
│   └── YourPage.md          ← write here
└── media/
    ├── images/photo.png     ← add files here
    └── videos/clip.mp4
```

---

## Add a new page

1. Create `contents/markdown/YourPage.md`.
2. Start the file with a top-level heading: `# Your Page Title`.
3. Run `npm run dev:html` to generate `public/html/YourPage.html`.

---

## Add an image

1. Put the file in `contents/media/`, for example `contents/media/images/photo.png`.
2. Reference it from your markdown page:

```markdown
![Description of the image](media/images/photo.png)
```

Raw HTML also works:

```html
<img src="media/images/photo.png" alt="Description of the image" />
```

Paths always start with `media/` — not `contents/media/` and not `/media/`.

---

## Add a video

1. Put the file in `contents/media/videos/`, for example `contents/media/videos/clip.mp4`.
2. Paste a **raw** HTML `<video>` tag into your markdown file.

```html
<video controls width="800" playsinline>
  <source src="media/videos/clip.mp4" type="video/mp4" />
  Your browser does not support embedded video.
</video>
```

### Video tips

| Do                                               | Don't                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| Use a raw `<video>` tag in the `.md` file        | Use `![...]()` — that only works for images                               |
| Prefer **`.mp4` (H.264)** for Chrome and Firefox | Rely on `.mov` outside Safari                                             |
| Leave the tag outside any markdown code fence    | Wrap the tag in a ` ```html ` code block — it will show as text, not play |

---

## Preview locally

```sh
npm run dev:html   # copy media + generate HTML
npm run dev        # start the site
```

Open [http://localhost:3000/wiki](http://localhost:3000/wiki).

Re-run `dev:html` after any change to markdown or media files.

---

## Deploy

Commit both:

- `contents/markdown/`
- `contents/media/`

CI runs `build:html` before deploy. You do not need to commit anything under `public/html/` or `public/media/`.
