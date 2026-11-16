# Oh Betty Jaletti — Custom Shopify Theme

> ## ⚠️ This repository is NOT the live theme. Do not push it.
>
> The live theme is **OBJ v5.30 · Accord photography**, and it is far ahead of this
> repository. Checked 2026-11-16:
>
> | | This repo | Live theme |
> |---|---|---|
> | Files | 62 | ~137 |
> | `sections/main-product.liquid` | 11 KB | 38 KB |
> | `assets/base.css` | 26 KB | 50 KB |
> | `assets/theme.js` | 3.7 KB | 19 KB |
>
> The live theme has roughly thirty sections this repo does not, including
> `service-strip`, `sticky-buy`, `scent-accords`, `product-particulars`,
> `product-story`, `house-notes`, `collection-hero` and the `worktable-*` set,
> plus `product.perfume.json`, the collection templates, and the house fonts.
>
> **`shopify theme push` from this directory would delete all of it.** The
> "Getting it onto Shopify" section below predates the drift and must not be run
> as written.
>
> The `.liquid` sections that do exist here still match live (`purse-tote.liquid`
> is byte-identical). The `.json` templates have drifted, because the Shopify
> theme editor rewrites them in place — those files carry an auto-generated
> header live.
>
> Treat this repo as a copy-and-reference source until someone pulls the live
> theme down over it.


A bespoke Online Store 2.0 theme for **Maison Betty Jaletti** · *petits plaisirs, faits exprès*.

## Design language

- **Palette** — cream paper (`#F6F1E7`), warm ink (`#26221B`), bordeaux accent (`#7E2F2A`), ticking-stripe blue (`#3D4E6E`). All editable under **Theme settings → Colors**.
- **Type** — Cormorant Garamond (display serif), Lora (body), Jost (letterspaced small caps for eyebrows & buttons).
- **Voice baked in** — "Your parcel" instead of cart, "Between editions" instead of sold out, the fulfillment promise on every product page, the letter on the homepage.

## Attribution

Every product carries the presenter signature **"… by Betty Jaletti"** on the first line of its description. It means the house *presents* the piece. It does not mean the house made it.

What the house actually did is stated separately, exactly once, in the body copy and in a template accordion:

| The house | Accordion | Example |
|---|---|---|
| Made it | `The making` | A Woman Remembered — blended and bottled by hand at the house, in small batches |
| Chose and paired it | `The pairing` | The Brownstone Tote — bag and scarf chosen separately, then paired |
| Chose it | `The maker` | The Out-the-Door Gloves — made in France by Glove Story |

Two rules keep this honest:

1. **Keep the signature on every piece.** Dropping it only on sourced pieces turns it back into a maker claim by implication.
2. **Never let a template imply manufacture the house does not do.** The default `product.json` says "Made to order … printed, bound, or poured when you claim it." That is true of the Reading Hour pieces and false of anything sourced, so sourced products get their own template.

For a sourced piece, set the Shopify `vendor` field to the real maker. The theme does not render `vendor`, so this is structured credit that costs the page nothing.


## Structure

| Where | What |
|---|---|
| `sections/hero.liquid` | Editorial homepage hero |
| `sections/purse-hero.liquid` | In Her Purse debut landing hero |
| `sections/purse-tote.liquid` | The Brownstone Tote, No. 1 of the debut |
| `templates/page.in-her-purse.json` | Landing page template for the debut |
| `sections/edition-grid.liquid` | "The First Edition" numbered product grid (No. 1–4) |
| `sections/the-letter.liquid` | Letter-from-the-maison excerpt with drop cap & signature |
| `sections/ritual.liquid` | I / II / III made-to-order value props |
| `sections/marquee.liquid` | Scrolling ribbon of house phrases |
| `sections/main-product.liquid` | Product page with edition number, custom CTA, accordions |
| `templates/product.gloves.json` | Product page for sourced gloves — leather, fit, care, shipping accordions |
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

## Landing page: In Her Purse

The homepage is the debut landing for **In Her Purse**. The first piece is **The Brownstone Tote by Betty** — brown suede, a flowered scarf knotted at the handle, No. 1. The photograph ships with the theme at `assets/brownstone-tote.jpg`.

The same landing is the `page.in-her-purse` template. Create a page with handle `in-her-purse` and assign that template if you want the debut at its own address as well.

Until a product with handle `the-brownstone-tote` exists, the page asks for an address and tags the customer `in-her-purse`. Once that product is published, the landing sells it at the variant price and the button reads "Claim the tote →". Assign the **brownstone** product template so the product page carries the suede, scarf, and shipping notes. No price is invented here — set it on the variant.

The Chaperone preorder stays at `/products/the-chaperone`, and the landing links to it.

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
