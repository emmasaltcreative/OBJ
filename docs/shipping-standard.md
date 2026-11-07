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
| Express | 3–5 business days | 1–3 business days | **4–8 business days** | $15.00 |
| The Scented Letter (free sample) | 3–5 business days | up to a week, ordinary post | **1–2 weeks** | free |
| Preorder | — | — | the date published on the listing | — |

Business days exclude weekends and federal US holidays. Fragrance ships by
ground service only, US addresses only.

### Rules

1. **Never state a packing time without a transit time.** "Ships in 3–5 days"
   is the question nobody asked; "arrives in 5–10 business days" is the answer.
2. **Express buys a faster carrier, not a faster bench.** It is 4–8 against
   5–10. Do not imply more. See *Outstanding* below.
3. **A preorder with no published date is not a preorder, it is a loan.** Either
   publish a date or take the listing down. Shopify's own Terms of Service for
   this store already promises that "preorder listings will identify the
   estimated shipping date or fulfillment window."
4. **Processing starts the next business day.** An order placed Friday night
   begins its count Monday.

## Where the standard is stated

| Surface | What it says | Where to change it |
|---|---|---|
| Checkout, Express rate | "Express — arrives in 4–8 business days" | Settings → Shipping and delivery |
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
6. **Express is barely worth $15.** 4–8 against 5–10 is two days for fifteen
   dollars, because packing dominates. If Express is to mean anything, give it
   one-business-day packing, then it becomes 2–4 days and the price makes sense.
7. **Preorder ship notes were inconsistent on live orders.** Orders #1003–#1005
   recorded `Ships: With the first edition`, #1007 recorded `Mid-November`, and
   #1008–#1011 recorded nothing at all — three promises for one product in ten
   days. The templates now write `Date to be confirmed` until a date exists.
8. **International rates show as `usps` and `dhl_express`** — raw carrier
   slugs, lowercase, in front of customers.

## Note on this repository

This repo is **not** what ohbettyjaletti.com runs. The live theme is
`OBJ v5.26 · The Worktable (preview)`; this snapshot predates it and lacks
`templates/product.perfume.json`, `snippets/cart-drawer.liquid`,
`sections/service-strip.liquid` and much else. Copy changes made here do not
reach the storefront. The live changes for this standard were made in the
duplicated theme `OBJ v5.27 · Shipping times`, which is unpublished and awaiting
preview.
