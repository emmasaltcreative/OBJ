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
| `sections/christmas-countdown.liquid` | Countdown-to-Christmas hero with a live clock |
| `sections/christmas-favour.liquid` | The Letter Tray — the Christmas favour |
| `sections/christmas-post.liquid` | "The last post" — order-by dates for Christmas |
| `templates/page.countdown-to-christmas.json` | Landing page template for the countdown |

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

## Landing page: Countdown to Christmas

Create a page titled **Countdown to Christmas** (handle `countdown-to-christmas`) and give it the **page.countdown-to-christmas** template. The page runs: the clock, the ribbon, the Letter Tray, the Christmas edition grid, the last post dates, a December letter, and the list sign-up.

### The clock

`sections/christmas-countdown.liquid` counts down in days, hours, minutes and seconds.

- **It finds Christmas on its own.** Leave **Count to this date** empty and it counts to 25 December, rolling to next year on Boxing Day. Set a date (`yyyy-mm-dd`) and a time (`hh:mm`) to count to something else — the last post, say.
- **It reads in the visitor's own time**, so Christmas morning is their morning, not the shop's.
- The first numbers are rendered by Liquid, so the clock is never blank before the script runs, and a mistyped date falls back to Christmas rather than to 1970.
- When it runs out the clock is replaced by **When the clock runs out** — by default, *It is Christmas morning. Put the kettle on and use the good glass.*

### The Letter Tray — the favour

`sections/christmas-favour.liquid` is the house's answer to a spin wheel: a tray of wax-sealed envelopes. The visitor chooses one, the seal breaks, the letter comes out, and the tray then says what the other envelopes held.

- **One envelope per favour block**, shuffled in the browser, so every favour is equally likely. To make one favour rarer, add the common favour twice — four blocks, three of them the same, is one-in-four odds.
- **Each favour takes a discount code.** Create the matching code under **Discounts** first; the theme only hands it over. The apply button sends the visitor to `/discount/CODE?redirect=…`, which applies the code to their parcel and lands them where **Apply button sends them to** points.
- **A favour may have no code at all** — leave the code empty for something like a hand-written note, and say in the note how to ask for it. The code box and apply button disappear on their own.
- **One draw, remembered.** The choice is kept in the visitor's browser, so a refresh shows the same envelope and the same code rather than a second roll. Editing the favours or their codes opens the tray again.
- **The odds are shown afterwards.** *The tray also held: the good wrapping and shipping on the house.* A wheel hides the segments it skipped; this one doesn't.
- **Optionally ask for an address first.** Turn on **Ask for an address before the tray appears** and the tray arrives only after the visitor subscribes — they are tagged `newsletter, christmas-favour`.

### The last post

`sections/christmas-post.liquid` lists the order-by dates — domestic, international, made-to-order, preorders. Set the real dates for your carrier before the page goes live; the defaults are placeholders, and the whole point of the section is that the house tells people rather than hurrying them.

### The Christmas edition

The grid is the usual `edition-grid` section. Make a **Christmas Edition** collection and pick it, or the grid shows placeholders. It also takes an anchor (`the-christmas-edition`) so the hero's second link reaches it.

To put the countdown in front of everyone, point the announcement bar at `/pages/countdown-to-christmas`.

## After upload

1. Import **The Chaperone** (above), then create the **First Edition** collection with the four products (The Chaperone, The Good Lines, One More Chapter, The Good Glass) and pick it in the homepage "Edition grid" section.
2. Create a page with handle `the-letter` using the **page.the-letter** template for the full About letter.
3. Set the `main-menu` and `footer` navigation menus.
4. Add the metafields above for per-product CTAs and edition numbers.
