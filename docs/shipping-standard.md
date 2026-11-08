# Shipping standard — Oh Betty Jaletti

Set 7 November 2026. This is the single source of truth for what the house
promises about time. If any surface disagrees with this file, the surface is
wrong.

## The standard

Two numbers make the wait, and the house states both: the days spent packing
by hand, and the days spent with the carrier.

| Method | Packed | In the post | **Arrives** | Price |
|---|---|---|---|---|
| Standard | 3–5 business days | 2–5 business days | **5–10 business days** | $8.00, free over $70 |
| Express | **1 business day**, packed first | 1–3 business days | **2–4 business days** | $15.00 |
| The Scented Letter (free sample) | 3–5 business days | up to a week, ordinary post | **1–2 weeks** | free |
| Preorder | — | — | the date published on the listing | — |

Business days exclude weekends and federal US holidays. Fragrance ships by
ground service only, US addresses only.

### Rules

1. **Never state a packing time without a transit time.** "Ships in 3–5 days"
   is the question nobody asked; "arrives in 5–10 business days" is the answer.
2. **Express is packed first, within one business day.** That is what the $15
   buys: 2–4 days against 5–10. An Express order jumps the bench — honour that,
   or drop the rate.
3. **A preorder with no published date is not a preorder, it is a loan.** Either
   publish a date or take the listing down. Shopify's own Terms of Service for
   this store already promises that "preorder listings will identify the
   estimated shipping date or fulfillment window."
4. **Processing starts the next business day.** An order placed Friday night
   begins its count Monday.
5. **A product metafield beats everything in the theme.** `custom.dispatch_note`
   overrides a card's window, and `custom.preorder_ship_window` and
   `custom.preorder_note` print under the buy button regardless of what any
   template says. Changing theme copy and stopping there leaves the metafield
   contradicting it, which is exactly what happened on 7 Nov: every template
   said no date while The Chaperone's metafield still read "Sent by 15
   December." Check the product's metafields whenever a date changes.

## Christmas 2026 cutoffs

Christmas Eve is **Thursday 24 December 2026**. Worked back from the windows
above, excluding weekends and federal holidays:

| Method | Worst case | Latest safe order date |
|---|---|---|
| Standard | 10 business days | **Thursday 10 December** |
| Express | 4 business days | **Friday 18 December** |

### The banner says 17 December, which only holds for Express

The announcement bar reads "Place Order by December 17th for Christmas Eve
Delivery." Order on Thursday 17 December and:

- **Express** arrives Mon 21 – Wed 23 December. In time.
- **Standard** arrives Thu 24 December *at best* and **Mon 4 January at worst** —
  eleven days late, because Standard's window runs to 10 business days.

Standard is the default and the free option over $70, so most orders take it.
As written, the banner promises Christmas Eve on the one method that cannot
reliably hit it. Three ways to square it, in order of how little they cost:

1. Say the method: "Place Order by December 17th with Express for Christmas
   Eve Delivery."
2. Move the date to the honest Standard cutoff: "Place Order by December 10th
   for Christmas Eve Delivery."
3. Carry both: "Christmas Eve delivery — Standard by Dec 10, Express by Dec 18."

Whichever is chosen, the banner is one field: Theme editor → Header group →
Announcement bar → Text.

**This is all moot until something ships.** The store has never fulfilled an
order, so no Christmas cutoff is real yet.

## Where the standard is stated

| Surface | What it says | Where to change it |
|---|---|---|
| Checkout, Express rate | "Express — arrives in 2–4 business days" | Settings → Shipping and delivery |
| Checkout, Standard rate | *see Outstanding — not yet changed* | Settings → Shipping and delivery |
| Checkout, sample rate | "Posted — free (allow 1–2 weeks)" | Settings → Shipping and delivery |
| Every product page | theme setting `fulfillment_line` | Theme settings → Brand |
| A Woman Remembered | service strip + "Shipping & returns" accordion | `templates/product.perfume.json` |
| The Brownstone Tote | service strip + "Shipping & returns" accordion | `templates/product.brownstone.json` |
| Default product page | service strip promise 2 | `templates/product.json` |
| Preorder product page | both accordions | `templates/product.preorder.json` |
| Cart page | line meta + footer note | `sections/main-cart.liquid` |
| Cart drawer | footer note | `snippets/cart-drawer.liquid` |
| Shipping policy | "How Long It Takes" section | Settings → Policies |
| Agent-facing doc | Shipping section | `templates/agents.md.liquid` (live theme) |
| Every product card (grids, related, collections) | `In stock — at your door in 5–10 business days` / `Preorder — paid today, ship date to be confirmed` | `snippets/product-card.liquid` |
| The `Ships` property saved on an order | `Date to be confirmed` | `snippets/preorder-properties.liquid`, plus `preorder_ships` per template |
| Preorder terms & "If it isn't right" accordions | set per template, not left to the section default | `preorder_terms` / `preorder_shipping` / `shipping_text` in `templates/product*.json` |
| The Chaperone, under the buy button | `custom.preorder_ship_window` metafield | Shopify admin → the product → Metafields |

## Outstanding

Ordered by how much it costs to leave alone.

1. **Nothing has ever shipped.** As of 7 Nov 2026 the store has 12 orders and
   zero fulfilments; the oldest (#1003, 27 Oct) is 11 days old. Every promise in
   this file is already broken for every order on the books. Fulfil or write to
   those twelve buyers before advertising any window.
2. **The Standard rate still reads "Standard" at checkout**, with no time. It
   carries a price-range condition (free over $70) that the Admin API refuses to
   update, so it must be renamed by hand in Settings → Shipping and delivery:
   - Name: `Standard — arrives in 5–10 business days`
   - Description: `Packed by hand at the house in 3–5 business days, then 2–5 business days in the post. Free on orders over $70.`
3. **The shipping policy needs pasting.** This connection lacks the
   `write_legal_policies` scope. Paste `docs/shipping-policy.html` into
   Settings → Policies → Shipping policy.
4. **The Chaperone has no ship date** and sells at $169. Publish a date or
   unpublish it. Existing preorder buyers must be written to either way.
5. **International shipping is switched on but the policy says US-only.** The
   General profile has an International zone with 27 countries on
   carrier-calculated USPS/DHL rates, while the shipping policy and
   `agents.md` both say the United States only. A non-US buyer can check out
   today and the house owes them a parcel it says it does not send. Turn the
   zone off, or change what the house claims.
6. **Four preorder buyers were promised a date that is now withdrawn.** Orders
   #1003–#1005 recorded `Ships: With the first edition`, #1007 recorded
   `Mid-November`, and #1008–#1011 recorded nothing — three promises for one
   product in ten days, and the page separately said "Sent by 15 December."
   The theme now writes `Date to be confirmed`, but those orders keep what they
   were sold. The house's own terms require writing to them with a revised date
   and the option to cancel for a full refund. That letter is still unsent.
7. **`sections/main-product.liquid` still holds stale schema defaults** for
   `preorder_ships`, `preorder_terms`, `preorder_shipping` and `shipping_text`
   — the last still claims the store "has no published refund or shipping
   policy yet," which is no longer true. Every live template now overrides all
   four, so nothing stale renders today, but a new product template would
   inherit them. Fix the defaults when that file is next touched.
8. **Two stale facts on The Chaperone's page**, neither a date: the theme's
   design-mode check still asserts "The Chaperone preorder is $79" against a
   $169 variant, and the eyebrow reads "The First Edition" while the metafields
   and `agents.md` both place it in Edition II.
9. **International rates show as `usps` and `dhl_express`** — raw carrier
   slugs, lowercase, in front of customers.

## Note on this repository

This repo is **not** what ohbettyjaletti.com runs. The live theme is
`OBJ v5.26 · The Worktable (preview)`; this snapshot predates it and lacks
`templates/product.perfume.json`, `snippets/cart-drawer.liquid`,
`sections/service-strip.liquid` and much else. Copy changes made here do not
reach the storefront. The live changes for this standard were made in the
duplicated theme `OBJ v5.27 · Shipping times`, which is unpublished and awaiting
preview.
