# Oh Betty Jaletti — Custom Shopify Theme

A bespoke Online Store 2.0 theme for **Maison Betty Jaletti** · *petits plaisirs, faits exprès*.

Store: [ohbettyjaletti.com](https://ohbettyjaletti.com) · USD · ships within the United States.

> **This repo trails the live store.** The published theme is further along than what is committed
> here — see [Drift from the live theme](#drift-from-the-live-theme) before you push anything.

## Design language

- **Palette** — cream paper (`#F6F1E7`), warm ink (`#26221B`), bordeaux accent (`#7E2F2A`), ticking-stripe blue (`#3D4E6E`). All editable under **Theme settings → Colors**.
- **Type** — Cormorant Garamond (display serif), Lora (body), Jost (letterspaced small caps for eyebrows & buttons). The live theme has since moved to self-hosted Fraunces, Literata and Work Sans.
- **Voice baked in** — "Your parcel" instead of cart, "Between editions" instead of sold out, the fulfillment promise on every product page, the letter on the homepage.

## Structure

| Where | What |
|---|---|
| `sections/hero.liquid` | Editorial homepage hero |
| `sections/purse-hero.liquid` | In Her Purse debut landing hero |
| `sections/purse-tote.liquid` | The Brownstone Tote, No. 1 of Edition I |
| `templates/page.in-her-purse.json` | Landing page template for Edition I |
| `sections/edition-grid.liquid` | Numbered product grid |
| `sections/the-letter.liquid` | Letter-from-the-maison excerpt with drop cap & signature |
| `sections/ritual.liquid` | I / II / III made-to-order value props |
| `sections/marquee.liquid` | Scrolling ribbon of house phrases |
| `sections/preorder-chaperone.liquid` | The Chaperone preorder block |
| `sections/main-product.liquid` | Product page with edition number, custom CTA, accordions |
| `templates/product.preorder.json` | Preorder product template |
| `templates/product.brownstone.json` | Product template carrying the suede, scarf and shipping notes |
| `templates/page.the-letter.json` | Full About / "Our Why" letter page |
| `templates/agents.md.liquid` | The agent-facing knowledge base served at `/agents.md` |

## The editions

The house sells in numbered editions. As of **2 November 2026**:

### Edition I — In Her Purse · `/collections/in-her-purse`

| Piece | Handle | Price | State |
|---|---|---|---|
| The Brownstone Tote | `the-brownstone-tote` | $86.00 | Published, in stock. Café Noir faux suede, silk scarf at the handle |
| A Woman Remembered | `a-woman-remembered` | $43.00 | Published, **preorder** — ships mid-November 2026. 10 mL travel Eau de Parfum |

### Edition II — The Reading Hour · `/collections/the-reading-hour`

| Piece | Handle | Price | State |
|---|---|---|---|
| The Chaperone | `the-chaperone` | $103.00 | Published, **preorder** — ships by 15 December 2026 |
| The Good Lines | `the-good-lines` | $34.00 | Draft — announced, not purchasable |
| One More Chapter | `one-more-chapter` | $42.00 | Draft — announced, not purchasable |
| The Good Glass | `the-good-glass` | $28.00 | Draft — announced, not purchasable |
| The Complete First Edition | `the-complete-first-edition` | $128.00 | Draft — the set, not purchasable |

Earlier copy in this repo called Edition II "the First Edition" and priced The Chaperone at $79.
Both are wrong; the names and prices above are what the store actually carries.

## Product metafields

Set under **Settings → Custom data → Products**. The live products use all of these:

| Namespace & key | Type | What it does |
|---|---|---|
| `custom.edition_number` | Integer | `1` → renders "No. 1". Falls back to grid position |
| `custom.cta_label` | Single line text | Button copy, e.g. `Escort my paperback →`. Falls back to "Add to my parcel →" |
| `custom.preorder` | Boolean | `true` → sell as a preorder |
| `custom.preorder_ship_window` | Single line text | Short window shown on the button area, e.g. `Ships by 15 December 2026` |
| `custom.preorder_note` | Multi-line text | The full preorder terms shown on the product page |
| `custom.object_copy` | Multi-line text | One-paragraph description of the object |
| `custom.materials` | Multi-line text | What it is made of |
| `custom.fit_dimensions` | Multi-line text | Size, weight, drop |
| `custom.care` | Multi-line text | How to keep it |
| `custom.ritual_intro` | Multi-line text | The use, in the house's voice |
| `custom.making_note` | Multi-line text | How it was made |
| `custom.suitability` | Multi-line text | "It is for you if… It is not for you if…" |

## Getting it onto Shopify

```bash
# from this directory
shopify theme dev    # live preview against your store
shopify theme push --unpublished --theme "Oh Betty Jaletti"
```

Or zip the folder and upload via **Online Store → Themes → Add theme → Upload zip file**.

## Preorders

A product sells as a preorder when any of these are true: metafield `custom.preorder` is true, tag
`preorder`, template suffix `preorder`, or handle `the-chaperone`. Adding one to the parcel writes
line-item properties `Preorder: Yes` and `Ships: With the edition`, which follow the order into
checkout.

The house terms, published in the refund policy and repeated on each listing: the buyer is charged
on the day they order, may cancel any time before it ships for a full refund, and is refunded in
full without asking if the edition cannot be made.

To close a preorder, track inventory, set the policy to **deny**, and set quantity to 0. The button
then reads "Preorder closed."

### The Chaperone import file

[`the-chaperone.csv`](the-chaperone.csv) mirrors the live product: handle `the-chaperone`, price
**$103.00**, tag `preorder`, no template suffix, inventory untracked with policy **continue**. It is
catalog data, not a theme asset — import it under **Products → Import**; don't rely on a theme zip
to create it. Re-importing it today is a no-op rather than a price change.

Metafields are not in the CSV. Set `custom.preorder`, `custom.preorder_ship_window` and
`custom.preorder_note` in admin after import, or the product page loses its preorder terms.

## Agentic knowledge base: `/agents.md`

`templates/agents.md.liquid` is the house's agent-facing knowledge base. Shopify serves it at
`/agents.md`, and — unless separate `llms.txt.liquid` / `llms-full.txt.liquid` templates are added —
the same content at `/llms.txt` and `/llms-full.txt`. It replaces Shopify's generic managed file,
which carries UCP and MCP discovery but nothing about the house, the editions, or the policies.

It holds: how to transact (Shop skill, UCP/MCP, WebMCP), the house story and vocabulary, every
purchasable piece with price, materials and dimensions, the pieces that are announced but not yet
published, preorder terms, shipping and returns, the policy and page map, and rules for answering
questions about the house.

Two things to keep in mind when editing it:

- **The Liquid context is restricted.** Only `request` and `agents` are available. `shop`,
  `collections`, `product`, `pages` and the rest render blank. Pull UCP and MCP values from the
  `agents` object so they stay in sync; everything else is hardcoded, which is why the file carries
  a review date.
- **Re-review it whenever the catalog or a policy moves** — a new edition, a published draft, a
  price change, a ship window, a shipping rate. Prices and availability are labelled as
  point-in-time, with the MCP endpoint and `/products/{handle}.json` named as authoritative, but
  stale copy in this file still misleads an agent.

Deploy it the same way as the rest of the theme:

```bash
shopify theme push --only templates/agents.md.liquid
```

Or paste it into **Online Store → Themes → … → Edit code → templates → Add a new template**.
Check it afterwards at `https://ohbettyjaletti.com/agents.md`.

## Shipping and returns, as published

The theme's promises should match the policies, which currently say:

- **United States only.** One active market, one currency.
- Standard $8.00, free Standard at $70.00 and over, Express $15.00.
- In-stock orders ship in 3–5 business days; processing is separate from transit.
- Fragrance ships by ground only, no APO/FPO/DPO.
- 30 days to return anything unworn and unused in its original packaging; fragrance unopened only;
  14 days to report damage with a photograph; no exchanges.

## Drift from the live theme

The live theme is **OBJ v5.20 · Numbering and ship note**, and **OBJ v5.21 · Agent knowledge
base** — v5.20 plus `templates/agents.md.liquid` — is staged unpublished, waiting to be published.
Both carry work that was done in the admin code editor and never came back here, including:

- `sections/` — `collection-grid`, `collection-hero`, `collectors-ledger`, `edition-bundle`,
  `edition-closed`, `hero-atelier`, `house-notes`, `house-rules`, `main-contact`, `product-film`,
  `sealed-confirmation`, `service-strip`, `waitlist-home`
- `snippets/` — `cart-drawer`, `icon-floral`, `icon-obj-monogram`, `product-notes`
- `templates/` — `collection.in-her-purse.json`, `collection.the-reading-hour.json`,
  `page.contact.json`, `page.edition-closed.json`, `page.ledger.json`, `page.sealed.json`,
  `page.waitlist.json`, `product.perfume.json`
- `assets/` — self-hosted Fraunces, Literata and Work Sans woff2 files, the house marks and
  monograms as SVG, `purse-preorder.css`, and a much larger `base.css` and `theme.js`

Pull it down before making any theme change here, or a push from this repo will undo months of
admin edits:

```bash
shopify theme pull --theme 189421060149
```
