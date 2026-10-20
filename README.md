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
| `sections/edition-grid.liquid` | "The First Edition" numbered product grid (No. 1–4) |
| `sections/the-letter.liquid` | Letter-from-the-maison excerpt with drop cap & signature |
| `sections/ritual.liquid` | I / II / III made-to-order value props |
| `sections/marquee.liquid` | Scrolling ribbon of house phrases |
| `sections/main-product.liquid` | Product page with edition number, custom CTA, preorder panel, accordions |
| `sections/collection-hero.liquid` | Editorial hero for a collection landing page |
| `sections/collection-grid.liquid` | Landing-page product grid, with a "more coming" card |
| `sections/house-notes.liquid` | Numbered house rules, typographic (no image needed) |
| `templates/page.the-letter.json` | Full About / "Our Why" letter page |
| `templates/collection.in-her-purse.json` | "In Her Purse" collection landing page |

## Product metafields (optional but recommended)

Create these under **Settings → Custom data → Products**:

| Namespace & key | Type | Example |
|---|---|---|
| `custom.edition_number` | Integer | `1` → renders "No. 1" |
| `custom.cta_label` | Single line text | `Escort my paperback →` |
| `custom.preorder` | Boolean | `true` → preorder badge, panel, and cart line |
| `custom.preorder_ship_window` | Single line text | `Ships by 15 December 2026` |
| `custom.preorder_note` | Multi-line text | The terms shown in the preorder panel |

Without them the theme falls back to grid position for numbering and "Add to my parcel →" for the button.

### Preorder

Switch `custom.preorder` on and the product page swaps the house fulfillment promise
for a preorder panel (badge, ship window, terms), repeats the ship window under the
buy button, tags the line item with a `Preorder` property so it is visible on the
order, and replaces "Made to order · allow 3–5 days" with the ship window in the cart.
Product cards show a preorder badge in place of "Between editions".

For the variant to stay buyable at zero stock, set **Inventory → when sold out →
continue selling** (or leave inventory untracked).

## Getting it onto Shopify

```bash
# from this directory
shopify theme dev    # live preview against your store
shopify theme push --unpublished --theme "Oh Betty Jaletti"
```

Or zip the folder and upload via **Online Store → Themes → Add theme → Upload zip file**.

## After upload

1. Create the **First Edition** collection with the four products (The Chaperone, The Good Lines, One More Chapter, The Good Glass) and pick it in the homepage "Edition grid" section.
2. Create a page with handle `the-letter` using the **page.the-letter** template for the full About letter.
3. Set the **In Her Purse** collection's theme template to `in-her-purse` (Collection → Online store → Theme template) so it uses the landing page.
4. Set the `main-menu` and `footer` navigation menus.
5. Add the metafields above for per-product CTAs, edition numbers, and preorders.
