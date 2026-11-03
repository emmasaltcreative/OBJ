# Oh Betty Jaletti — Shopify theme

The source for the theme published at **ohbettyjaletti.com**.

This repository tracks the live theme, **OBJ v5.24 · agents.md accuracy**
(`gid://shopify/OnlineStoreTheme/189438591029`). It was reconciled against that
theme on 3 November 2026, file by file.

## Design language

- **Palette** — cream `#F6F1E7`, paper `#FDFAF3`, ink `#2A2320`, house green
  `#3A544A`, ticking blue `#3D4E6E`, gold `#A5834B`, soft ink `#6F6355`.
  The five editable ones live under **Theme settings → Colors**.
- **Type** — Fraunces (display), Literata (body), Work Sans (letterspaced small
  caps for eyebrows and buttons). All three are **self-hosted `.woff2` in
  `assets/`**, declared with `@font-face` in `base.css` and preloaded from
  `layout/theme.liquid`. There is no request to fonts.googleapis.com; do not
  add one.
- **House mark** — a quatrefoil: four circles at 50 ±26.39, radius 18.11,
  punched by a centre circle of 12.14, in `#333045`. Shipped as
  `obj-floral-mark.svg` / `obj-seal.svg` / `obj-monogram-obj.svg` (identical
  artwork, three names kept for stable references) and as the Liquid snippets
  `icon-floral` and `icon-obj-monogram`. `obj-logo-script.svg` is the traced
  handwritten wordmark; `obj-quatrefoil-tile.svg` is the wallpaper tile.
- **Voice** — "Your parcel" for the cart, "Between editions" for sold out,
  editions numbered in Roman numerals, pieces numbered within an edition.

## Structure

| Where | What |
|---|---|
| `templates/agents.md.liquid` | The canonical agent-facing description of the store. Treat it as the house's own source of truth for brand facts and published policy. |
| `layout/theme.liquid` | Head, fonts, GA4, `window.BettyRoutes`, cart drawer, toast |
| `assets/base.css` | The whole design system |
| `assets/obj-pattern.css` | The quatrefoil wallpaper, used only behind the buy box, drawer checkout and cart totals |
| `assets/purse-preorder.css` | In Her Purse landing and preorder styles |
| `assets/theme.js` | Parcel drawer, variant picker, reveals, referral codes, guest-book beckon |
| `sections/hero-atelier.liquid` | Homepage hero with the claim form (`#claim`) |
| `sections/collection-hero.liquid`, `collection-grid.liquid` | Edition landing pages |
| `sections/main-product.liquid` | Product page |
| `sections/cart-drawer.liquid` (snippet) | The parcel drawer |
| `sections/waitlist-home.liquid` | Renders `/pages/waitlist` as the homepage, with render-time fixes |
| `sections/collectors-ledger.liquid` | The customer-facing Collector's Ledger (`/pages/ledger`) |
| `sections/sealed-confirmation.liquid` | `/pages/sealed`, the signup confirmation |
| `sections/sticky-buy.liquid` | Bottom buy bar on product pages — **currently inert**, see below |

## Editions

- **Edition I · In Her Purse** — `/collections/in-her-purse`.
  The Brownstone Tote ($86) and A Woman Remembered ($43), both in stock.
- **Edition II · The Reading Hour** — `/collections/the-reading-hour`.
  The Chaperone ($103), preorder, ships by 15 December 2026. The Good Lines,
  One More Chapter and The Good Glass are named but not published and have no
  date — do not list prices for them.

Prices and availability are authoritative in Shopify, not here.

## Product metafields

| Namespace & key | Type | Example |
|---|---|---|
| `custom.edition_number` | Integer | `1` → renders "No. 1" |
| `custom.cta_label` | Single line text | `Escort my paperback →` |
| `custom.preorder` | Boolean | `true` → sell as a preorder |

A product sells as a preorder when any of these is true: template suffix
`preorder`, tag `preorder`, handle `the-chaperone`, or `custom.preorder`.

## Analytics and apps

GA4 (`G-JX4MHEKBWG`) is hard-coded in `layout/theme.liquid`. Klaviyo, Lucky
Orange and Bloom Analytics are app embeds configured in
`config/settings_data.json`.

## Working on this theme

```bash
shopify theme dev                                   # live preview
shopify theme push --theme "OBJ v5.24 · agents.md accuracy"
```

**Keeping this repository honest.** The repo and the live theme had drifted
apart by four major versions before this reconciliation, because theme edits
are made in Shopify and never travel back here. The durable fix is Shopify's
**GitHub integration** (Online Store → Themes → Add theme → Connect from
GitHub), which pushes the theme source to a branch on every change. Until that
is connected, assume the live theme is ahead of this repository and check
before building on it.

## Known issues

- `sections/sticky-buy.liquid` renders a bottom bar on product pages, but it
  has no CSS in `base.css` and nothing in `theme.js` unhides it. It is inert
  and invisible. Either finish it or remove the section.
- `assets/obj-hero-atelier.jpg` and `assets/obj-share-image.jpg` were recovered
  from the Shopify CDN, which re-compresses images, so they are not byte-identical
  to the originals in the theme. Replace them from the original files if you
  have them. Every other file in this repository is byte-identical to v5.24.
