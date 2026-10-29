# Marci Metzger Homes – homepage revamp

Plain HTML / CSS / JS, no build step, no dependencies. Entry point: `index.html`.

## Deploy folder (upload exactly these)
`index.html`, `style.css`, `script.js` (and `assets/` if you add local copies, see below).
Do not upload `styles.css`, `index(6).html` (the standalone bird demo, now merged into `style.css` / `index.html`) or `launch.json` (VS Code config that contains a local `C:\Users\...` path).

## Logo
The supplied Ridge Realty Group image is used in the header and footer (`.brand-logo`), sized with `width:100%; height:auto` inside a fixed-width box so its 1071:334 ratio is never distorted. A white plate behind it keeps it legible on the photo/navy header; the image itself is not recoloured or cropped.

## Hero birds
Markup: `.birds` block inside `.hero` in `index.html` (decorative, `aria-hidden`). CSS: "Hero birds" section at the end of `style.css`.
The sprite is a 10-frame strip. `fly-cycle` steps through the frames; `fly-right-one` moves each bird across the hero. Birds sit above the photo's dimming gradient, below the headline and buttons, and never receive clicks.
Fewer birds under 860 px (2) and 520 px (1); hidden entirely when the visitor has `prefers-reduced-motion: reduce`. If the sprite fails to load the birds are simply invisible.

## Optional: host the sprite and logo yourself (more reliable than third-party hosts)
```
mkdir assets
curl -o assets/bird-cells-new.svg "https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg"
curl -o assets/logo.png "https://img1.wsimg.com/isteam/ip/067a4d42-19e8-46d9-9bed-578bf62dd44e/blob-6c0c2e0.png/:/rs=w:1071,h:334,cg:true,m/cr=w:1071,h:334/qt=q:95"
```
Then set `--bird-sprite: url("assets/bird-cells-new.svg")` in `.birds` (style.css) and change the two logo `src` values in `index.html` to `assets/logo.png`.

## Images
Photos load from the supplied img1.wsimg.com URLs. Check each photo and its alt text in a browser; the stock-photo section assignments were not visually verified.

## Test locally
Open `index.html`. Check 375, 768 and 1440 px wide, keyboard Tab order, and DevTools > Rendering > "Emulate prefers-reduced-motion: reduce".

## Deploy (free, gives a public URL)
- Netlify Drop: https://app.netlify.com/drop, drag the deploy folder in (`index.html` must be at its root).
- GitHub Pages: push the deploy files to a repo, Settings > Pages > deploy from branch `main` / root. URL: https://<user>.github.io/<repo>/
Open the live URL in a private window and re-check the logo, birds and menu before submitting. Submit the live URL, not the repo.

## Forms
Search: no listings API is connected; it validates, then links to marcimetzger.com/listings.
Contact: set `CONTACT_ENDPOINT` in `script.js` to a Formspree (or similar) URL to actually send messages. Until then the form says it is a demo and sends nothing.
