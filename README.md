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
| `sections/purse-hero.liquid` | In Her Purse debut landing hero |
| `sections/purse-tote.liquid` | The Brownstone Tote, No. 1 of the debut |
| `templates/page.in-her-purse.json` | Landing page template for the debut |
| `sections/edition-grid.liquid` | "The First Edition" numbered product grid (No. 1–4) |
| `sections/the-letter.liquid` | Letter-from-the-maison excerpt with drop cap & signature |
| `sections/ritual.liquid` | I / II / III made-to-order value props |
| `sections/marquee.liquid` | Scrolling ribbon of house phrases |
| `sections/main-product.liquid` | Product page with edition number, custom CTA, accordions |
| `templates/page.the-letter.json` | Full About / "Our Why" letter page |
| `templates/product.perfume.json` | Product page for the house fragrance (scent, shipping) |
| `sections/product-film.liquid` | A product's videos; renders nothing when there are none |

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

## In Her Purse, No. 2: A Woman Remembered

The house fragrance, **A Woman Remembered**, is an Eau de Parfum sold as a **10 mL travel size** — one amber-and-gold bottle with an atomised spray at one end and a rollerball at the other. It lives at `/products/a-woman-remembered` at **$43.00**, tagged `in-her-purse`, and sits in the **In Her Purse** collection as No. 2 behind the tote.

It ships from the catalog, not the theme: the product, its photograph, and its PDP video are already on the store. The theme carries the page it renders on.

> **Do not `shopify theme push` this repo over the live theme.** The published theme has drifted well past this repo — it carries `collection.in-her-purse.json`, `page.waitlist.json`, `page.sealed.json`, `page.ledger.json`, `page.contact.json`, a `service-strip` section, and the `edition_state` gate, none of which exist here. A wholesale push deletes them. Copy individual files across instead.

**Why the template matters.** The live `main-product` section sells a product only when one of three things is true:

```liquid
if settings.edition_state == 'open' or is_preorder or section.settings.sell_in_preproduction
```

The doors are shut store-wide, and the fragrance is not a preorder — so without a template of its own it falls to the default `product` template, whose settings are empty, and the page shows the preproduction note and the guest book button instead of a price and a buy button. `templates/product.perfume.json` carries `"sell_in_preproduction": true` for exactly that reason, the same way `product.brownstone.json` does for the tote.

The template is already on the store, staged on an unpublished theme:

1. **`OBJ v5.12 · A Woman Remembered`** is a duplicate of the published `v5.11.3`, identical to it but for one added file — `templates/product.perfume.json`. Publishing it is the step that opens the fragrance.
2. The product already has its theme template set to **perfume**, so it picks the template up the moment that theme is published.
3. **Order matters.** Publish the theme first, then set the product to Active. Reversed, there is a window where the fragrance falls back to the default `product` template and shows the guest book gate instead of a price.
4. The button reads **Claim the perfume →**; the `custom.cta_label` metafield renders as an italic line beneath it, and `custom.edition_number` is `2`.
5. Inventory is untracked with policy **continue**, so it sells before any are filled — the same arrangement as the tote.

## The house mark, and product video

**One mark everywhere.** The house quatrefoil — four circles with a punched centre — was already the header lockup (`snippets/icon-floral.liquid`) and the favicon (`assets/obj-floral-mark.svg`). Three other places still carried older marks: the footer rendered `icon-obj-monogram`, the cart drawer's empty state used `obj-monogram-obj.svg`, and `obj-seal.svg` appeared on product pages, the sealed-confirmation page, the collector's ledger and the edition-closed page.

Rather than edit six call sites, the artwork inside those three files was replaced with the quatrefoil. Every call site keeps its own sizing, alt text and CSS class and simply renders the new mark. `obj-seal.svg` and `obj-monogram-obj.svg` are square (`viewBox="0 0 100 100"`), so where they are drawn into a non-square box — 96×64, 120×80, 84×124 — the mark letterboxes and centres rather than stretching.

**Product video.** `sections/main-product.liquid` builds its gallery from `product.media` but only emits `media_type == 'image'`, so a video attached to any product never reached the page. `sections/product-film.liquid` renders a product's videos (and external videos), and is wired into every product template. It returns nothing at all when a product has no video, so it is safe to leave on all of them.

The gallery itself is unchanged. Fixing it there would mean rewriting a 27 KB section through an API that only does whole-file writes, with no way to preview the result from this environment — a bad trade against a section that cannot break a page it doesn't render on. If you want the video sitting inside the gallery rather than below the product block, that is the edit to make, deliberately, with a preview open.

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
