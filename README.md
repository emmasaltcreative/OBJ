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
| `sections/advent-calendar.liquid` | The Advent — twelve numbered doors, sold as one box |
| `templates/page.advent.json` | Landing page for The Advent |
| `snippets/gift-note.liquid` | Gift fold — "this is a gift", To, From, the card |

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

## Christmas: The Advent

**The Advent** is a boxed calendar of twelve numbered doors — one small thing behind each, opening 13–24 December — sold as a single product. It sits on the homepage between the tote and the ritual, and has its own page at `/pages/advent`.

The product (`the-advent`) and the page both exist in the store already, **both unpublished**, because two things are still yours to decide:

1. **Set a price on the variant.** It is $0.00 today. The section refuses to show a buy button until the price is above zero — it shows the letter invitation instead — so a free box cannot leave the house by accident. The theme editor says so in red.
2. **Add a photograph** of the box, then set the product Active and publish the page.

Then, in the editor:

- The twelve doors are blocks on the **Advent calendar** section. Each has a number, a date label and a hint. The hints tease; they do not list. Add or remove doors and the heading counts them — `[count]` in "The [count] doors" is replaced with however many blocks there are.
- **Order by** is a date on the section (default 8 December) with the note beside it. Once the date passes the note disappears on its own.

Boxes are packed by hand, so track inventory on the variant and set the policy to **deny**. The section then reads "The Advent is spoken for" and sends people to the letter instead of 404ing on a sold-out box.

## Gifts

Every product page and the Advent carry a **gift fold**: a checkbox for "this one is a gift", To, From, and the card. These write line-item properties (`Gift`, `To`, `From`, `Message`) that follow the order into checkout and onto the packing slip, and the parcel reads them back so the buyer can check the card before paying.

Shopify discards line-item properties whose value is blank, and a browser never submits an unchecked box, so an ordinary order carries none of this and the fold costs nothing when it is ignored. No JavaScript is involved. Turn it off per template with **Gift fields** on the Product section.

The announcement bar has the same **Christmas ordering cutoff**: a last order date, the deadline shown beside the message, and a quieter message that takes over by itself once the date has passed.

## After upload

1. Import **The Chaperone** (above), then create the **First Edition** collection with the four products (The Chaperone, The Good Lines, One More Chapter, The Good Glass) and pick it in the homepage "Edition grid" section.
2. Create a page with handle `the-letter` using the **page.the-letter** template for the full About letter.
3. Set the `main-menu` and `footer` navigation menus.
4. Add the metafields above for per-product CTAs and edition numbers.
