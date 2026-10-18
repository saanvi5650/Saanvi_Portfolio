# Saanvi Portfolio v3

A one-page scrapbook-style portfolio in plain HTML, CSS and JavaScript. Same lilac / pink / paper palette and fonts as v2, with more motion and more personality.

## Run locally
Double-click `index.html`, or use VS Code Live Server.

## Before you deploy (5 minutes)
Open `script.js` and edit the `CONFIG` block at the very top:

| Key | What it does |
| --- | --- |
| `email` | Where the postcard form and "copy my email" point |
| `linkedin`, `github` | Your profile URLs |
| `resume` | Path like `assets/Saanvi_Singh_Resume.pdf`. Leave `''` and the resume buttons stay hidden |
| `timezone` | Used by the little "chennai · 8:41 am" chip |

Then put your resume PDF in `assets/` if you want the resume buttons.

### Adding GitHub / live links to a project
Open `script.js` and find `projectData` (search for `library:`). Each project has `github: ''` and `live: ''` — paste a URL into either one and a small "code ↗" / "live ↗" link appears on that project's card and inside its scrapbook note automatically. Leave both blank and no links show up.

For nicer link previews on LinkedIn / WhatsApp, uncomment the `og:image` line in `index.html` and use your real domain.

## Privacy: keep the HARMAN badge photo out of the repo
`harman-badge.jpeg` shows your employee ID. It is **not** included in this folder on purpose. If you push to a public GitHub repo, leave that file out (or crop the ID first). The two visible notes about it in v2 have also been removed from the page, since visitors don't need to see them.

## What's new in v3
**Page-load moment**
- Name drops in letter by letter, the polaroid falls and settles, tape presses on, the lily and underline draw themselves
- Typewriter role line, a greeting based on the visitor's local time, and a live Chennai clock

**Things you can play with**
- Drag the polaroids, sticky note and photo wall around (mouse). On phones, tap to wiggle instead
- "shuffle the pile" scatters the photo wall, "tidy up" resets it
- Click "progress over perfection" for a burst of confetti
- Sparkle trail behind the cursor, hero parallax, tilt + glare on project cards
- Toolkit stickers with filter tabs (languages / web / data & ML / people stuff)
- Beyond-work cards flip to reveal a note on the back (tap on touch devices)
- Project notes open like paper with previous / next arrows, arrow-key support and focus trapping

**Scroll**
- Washi-tape progress bar at the top, a ticker strip under the hero
- Timeline thread fills as you scroll and dots light up
- Animated "receipts" counters, marker highlight in the About text
- A tiny UAV docking on a charging pad in the patent strip

**Contact**
- A postcard form that opens the visitor's email app with the message ready to send (no backend needed)
- "copy my email" button

**Under the hood**
- Images resized and compressed (about 1.4 MB total instead of about 3.7 MB), lazy loaded, with width/height set
- Scroll-spy nav highlighting, visible keyboard focus, and `prefers-reduced-motion` respected

## Copy you may want to rewrite
These are drafts in your voice, so change anything that isn't quite you:
- The typewriter roles (`roles` array in `script.js`)
- The notes on the back of the "beyond work" cards (`index.html`)
- The sticker list in the Toolkit section (only tools from your project chips are listed, add or remove freely)
- The "receipts" numbers (`data-count` in `index.html`)

## Deploy on Vercel
1. Create a GitHub repository and upload this folder.
2. In Vercel choose **Add New > Project** and import the repo.
3. Framework preset: **Other**. No build command needed.
4. Deploy, then add a custom domain under **Project Settings > Domains**.

## Deploy on GitHub Pages
Push the files to a repository, then enable Pages from the repository settings (root of the main branch).

## Files
```
index.html      structure and content
styles.css      all styling and animation
script.js       CONFIG block + all interactions
vercel.json     clean URLs
assets/         optimised photos
```
