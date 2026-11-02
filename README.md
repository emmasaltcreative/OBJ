# Oh Betty Jaletti — Custom Shopify Theme

A bespoke Online Store 2.0 theme for **Maison Betty Jaletti** · *petits plaisirs, faits exprès*.

## Design language

- **Palette** — cream paper (`#F6F1E7`), warm ink (`#26221B`), bordeaux accent (`#7E2F2A`), ticking-stripe blue (`#3D4E6E`). All editable under **Theme settings → Colors**.
- **Type** — Cormorant Garamond (display serif), Lora (body), Jost (letterspaced small caps for eyebrows & buttons).
- **Voice baked in** — "Your parcel" instead of cart, "Between editions" instead of sold out, the fulfillment promise on every product page, the letter on the homepage.

## Structure

| Where | What |
|---|---|
| `sections/hero.liquid` | Editorial homepage hero |
| `sections/purse-hero.liquid` | In Her Purse debut landing hero — carries the price and a buy button |
| `sections/purse-lead.liquid` | The advertised piece, first: image, price, add-to-cart above the fold |
| `sections/purse-shop.liquid` | "Shop the edition" — every piece with its price and an add-to-cart |
| `templates/collection.in-her-purse.json` | Ad landing for the collection, leading with the tote |
| `templates/collection.purse-scent.json` | Same landing, leading with A Woman Remembered (`?view=purse-scent`) |
| `sections/purse-tote.liquid` | The Brownstone Tote, No. 1 of the debut |
| `templates/page.in-her-purse.json` | Landing page template for the debut |
| `sections/edition-grid.liquid` | "The First Edition" numbered product grid (No. 1–4) |
| `sections/the-letter.liquid` | Letter-from-the-maison excerpt with drop cap & signature |
| `sections/ritual.liquid` | I / II / III made-to-order value props |
| `sections/marquee.liquid` | Scrolling ribbon of house phrases |
| `sections/main-product.liquid` | Product page with edition number, custom CTA, accordions |
| `templates/page.the-letter.json` | Full About / "Our Why" letter page |

## Product metafields (optional but recommended)

Create these under **Settings → Custom data → Products**:

| Namespace & key | Type | Example |
|---|---|---|
| `custom.edition_number` | Integer | `1` → renders "No. 1" |
| `custom.cta_label` | Single line text | `Escort my paperback →` |
| `custom.preorder` | Boolean | `true` → sell as a preorder |

Without them the theme falls back to grid position for numbering and "Add to my parcel →" for the button.

## Getting it onto Shopify

```bash
# from this directory
shopify theme dev    # live preview against your store
shopify theme push --unpublished --theme "Oh Betty Jaletti"
```

Or zip the folder and upload via **Online Store → Themes → Add theme → Upload zip file**.

## Ad landings: In Her Purse

### Why this was rebuilt

Store analytics for the 60 days to 2 Nov 2026, grouped by the page the visitor
arrived on:

| Landing page | Sessions | Reached checkout |
|---|---|---|
| `/collections/in-her-purse` | 150 (123 from social) | **0** |
| `/products/a-woman-remembered` | 117 (91 from social) | **5** |
| `/` | 679 (mostly direct) | 1 |

Ads pointed at the **collection** converted nobody. Ads pointed at a **product
page** converted at 4.3%. The collection page was the problem, not the traffic:
it opened with the eyebrow "An edition, not a catalog", a stripped-down
description, and two cards floating in a four-column grid — no price above the
fold on a phone, and no way to buy without loading another page.

So the landing now does what the converting product page does: names the piece,
shows the price, and offers a button, before the house explains itself.

### The two landings

`collection.in-her-purse.json` leads with the Brownstone Tote.
`collection.purse-scent.json` is the same page leading with A Woman Remembered.
Both then show the whole edition, and only then the letter.

Assign the first one in Shopify under **Products → Collections → In Her Purse →
Theme template → in-her-purse**. The second needs no assignment — it is reached
with `?view=purse-scent`.

### Pointing each ad at its own landing

Give every creative a destination whose first screen is the thing in the
photograph:

| The ad shows | Send it to |
|---|---|
| The Brownstone Tote | `/products/the-brownstone-tote` — or `/collections/in-her-purse` |
| A Woman Remembered | `/products/a-woman-remembered` — or `/collections/in-her-purse?view=purse-scent` |
| Both, or the edition itself | `/collections/in-her-purse` |

The product page is the proven destination; the `?view=` landings exist so a
collection URL can be tested against it without rewriting the creative. Keep
the ad's own photograph, product name, and offer wording in the section's
**Image**, **Heading**, and **Offer line** settings so the page the visitor
reaches looks like the ad they tapped.

### Matching the promise — check these before spending again

- **"Suede" vs faux suede.** The product type in Shopify reads `Suede tote`, and
  the theme's older copy said "brown suede". The piece is **Café Noir faux
  suede** — the product description and SEO title say so. Landing copy here has
  been corrected to "faux suede". If an ad promises suede, the landing now
  contradicts it; fix the ad, not the page.
- **Stock language.** The tote and the scent both sell on a *continue* inventory
  policy with negative quantities, so nothing here claims "in stock". The copy
  uses the house line — made when you claim it, 3–5 days before shipping.
- **A second piece exists.** A Woman Remembered is No. 2 in In Her Purse and
  draws real ad traffic of its own. It now appears on the landing; it used to be
  absent entirely while the page cross-sold The Chaperone from another line.

### Shopping clarity, section by section

- `purse-hero` resolves a featured product and prints its price under the
  subheading. `[price]` in the button label is replaced with that price, and the
  button links to the product. A second, quieter link jumps to the full edition.
- `purse-lead` is a product page's first screen as a section: image, name,
  price, variant picker, add-to-cart, promise, and four facts. It resolves its
  product from the setting, then the handle, then the first available product in
  the collection being viewed, so it is safe to drop on any collection template.
- `purse-shop` lists the collection with prices and an add-to-cart on each card,
  and states the count and price range above the grid. It reads the collection
  being viewed on a collection template, or `in-her-purse` elsewhere. It shows
  up to the 50 products Shopify loads without pagination — ample for an edition.
- The homepage and `page.in-her-purse` now run **hero → tote → shop → marquee →
  ritual → letter → newsletter**. The marquee and the house's opinions moved
  below the shopping; nothing was deleted.

### Still true

The Brownstone Tote lives at `/products/the-brownstone-tote` with the
**brownstone** product template. The Chaperone preorder stays at
`/products/the-chaperone`. No price is invented in the theme — every figure on
these pages is read from the variant.

## Preorder: The Chaperone at $79

The Chaperone — a coat for the paperback, No. 1 in the first edition — can be preordered at **$79**. The customer is charged today; the piece is cut when the edition opens and ships with it.

1. In Shopify admin, go to **Products → Import** and upload [`the-chaperone.csv`](the-chaperone.csv). That file is catalog data, not a theme asset — import it; don't rely on a theme zip to create the product. It publishes:
   - Handle `the-chaperone`
   - Price **$79.00**
   - Tag `preorder`
   - Template suffix `preorder` (uses `templates/product.preorder.json`)
   - Inventory left untracked, with policy **continue**, so the preorder stays open before any are made
2. Add **The Chaperone** to the **First Edition** collection and pick that collection in the homepage edition grid.
3. Leave the variant price at **$79.00**. The product page, homepage preorder, and announcement all sell that price. The charged amount is the variant price; the homepage shows `$79` only until the product exists.

A product sells as a preorder when any of these are true: template suffix `preorder`, tag `preorder`, handle `the-chaperone`, or metafield `custom.preorder` is true. Adding it to the parcel writes line-item properties `Preorder: Yes` and `Ships: With the first edition`, which follow the order into checkout.

To close the preorder, track inventory, set the policy to **deny**, and set quantity to 0. The button then reads "Preorder closed."

## After upload

1. Import **The Chaperone** (above), then create the **First Edition** collection with the four products (The Chaperone, The Good Lines, One More Chapter, The Good Glass) and pick it in the homepage "Edition grid" section.
2. Create a page with handle `the-letter` using the **page.the-letter** template for the full About letter.
3. Set the `main-menu` and `footer` navigation menus.
4. Add the metafields above for per-product CTAs and edition numbers.
