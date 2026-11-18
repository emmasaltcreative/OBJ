# Oh Betty Jaletti — Custom Shopify Theme

> ## Sync status
>
> The live theme is **OBJ v5.32 · CTA, top, Instagram (preview)**
> (`gid://shopify/OnlineStoreTheme/189811097653`), published after v5.31.
>
> Checked file-by-file against the Admin API on **2026-11-18**: of 139 files,
> **134 match byte-for-byte**. Five do not, and the direction matters:
>
> | File | Which way |
> |---|---|
> | `sections/instagram-follow.liquid` | **Repo is ahead.** The repo dropped the duplicate @handle under the follow button; the live theme still shows it. Never deployed. |
> | `templates/index.json` | Live is ahead — three app sections (Instafeed and friends) and homepage copy edits made in the theme editor. |
> | `config/settings_data.json` | Live is ahead — app embed blocks (Lucky Orange, Klaviyo, Bloom, Socialwidget). |
> | `locales/en.default.json` | Live is ahead — search placeholder is now "Search the house", was "Search the maison". |
> | `templates/agents.md.liquid` | **Repo is ahead** — corrected on 2026-11-18, see below. Not yet on the live theme. |
>
> The four auto-generated JSON files **cannot be recovered byte-exactly through
> the Files API** — it pretty-prints them and prepends a header, so what the API
> returns is not what is stored. Use `shopify theme pull` or the admin download
> for those. The procedure is below.

## Keeping this repo in sync

### Verifying

With the Shopify CLI, pull over the working tree and read `git status`. A clean
tree means the repo matches the theme; anything listed is drift:

```bash
shopify theme pull --store ohbettyjaletti.com --theme 189807820853
```

```bash
git status --short
```

### Re-syncing without the CLI

1. Shopify admin → **Online Store → Themes**
2. **⋯** on the live theme → **Download theme file**
3. Shopify emails a `.zip`. Unzip it over this repository, replacing files.
4. Review `git status`, then commit.

Both routes are byte-exact and include the fonts and images. Those cannot be
transferred correctly through the Files API, so this is the only reliable way.

### Making it automatic

Connect the theme to this repository with Shopify's GitHub integration:
**Online Store → Themes → Add theme → Connect from GitHub**, then authorise the
Shopify app for `emmasaltcreative/OBJ` and pick a branch.

Once connected, the branch *is* the theme: edits made in the Shopify theme
editor commit back to the branch automatically, and commits pushed to the branch
deploy to the theme. Drift stops being possible rather than being something
anyone has to remember.

Three things to know before connecting:

- **Connect a dedicated branch**, not `main`. Shopify writes to it directly.
- **A connected branch deploys on push.** Connect an *unpublished* theme if you
  want a review step before anything reaches the storefront, and publish by hand.
- **`config/settings_data.json` will churn.** Every theme-editor tweak commits to
  it. That is normal, not a mistake.

### Working with Claude Code in this repo

- **Check the sync status first.** The theme editor rewrites `.json` templates in
  place, so this repo goes stale on its own. Verify before relying on it.
- **Do not publish theme changes by pushing this repo.** Until the GitHub
  integration is connected, pushing here changes nothing on the store, and
  `shopify theme push` would overwrite the live theme wholesale. Make theme
  changes on an unpublished theme and publish from admin after a look.
- **Product copy is not theme code.** Descriptions, SEO, variants, SKUs and
  barcodes are product data. They go live the moment they are saved, do not wait
  on a theme deploy, and are not captured in this repo at all.

## Design language

- **Palette** — cream paper (`#F6F1E7`), warm ink (`#26221B`), bordeaux accent (`#7E2F2A`), ticking-stripe blue (`#3D4E6E`). All editable under **Theme settings → Colors**.
- **Type** — Cormorant Garamond (display serif), Lora (body), Jost (letterspaced small caps for eyebrows & buttons).
- **Voice baked in** — "Your parcel" instead of cart, "Between editions" instead of sold out, the fulfillment promise on every product page, the letter on the homepage.

## Attribution

Every product carries the presenter signature **"… by Betty Jaletti"** on the first line of its description. It means the house *presents* the piece. It does not mean the house made it.

What the house actually did is stated separately, exactly once, in the body copy
of the product description — which is product data and lives in Shopify, not in
this repo.

| The house | Example | Where it says so |
|---|---|---|
| Made it | A Woman Remembered — blended and bottled by hand, small batches | Description, "The Making" |
| Chose and paired it | The Brownstone Tote — bag and scarf chosen separately, then paired | Description, "The Pairing" |
| Chose it | The Out-the-Door Gloves — made in France by Glove Story | Description, "The Maker" |

Product templates may also carry a matching accordion, but the description is
what guarantees the credit appears. The gloves have no dedicated template; they
render on the default `product.json`, which is correct and needs no change.

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
| `templates/page.the-letter.json` | Full About / "Our Why" letter page |
| `templates/page.the-house.json` | The trust page — who we are, what we do, what we promise |
| `sections/house-intro.liquid` | Trust page opening: the house in a breath, plus the four facts a first-time buyer wants |
| `sections/house-attribution.liquid` | What "by Betty Jaletti" means — made it / paired it / chose it, and where to verify each |
| `sections/house-promises.liquid` | "Plain terms": the promises written out, each linked to its policy, plus the candid caveats |

## The trust page: /pages/the-house

A landing page whose only job is to earn belief before anything is asked of the
buyer: who the house is, why it exists, how a piece comes to exist, what the
signature does and does not claim, and exactly what the house promises.

To put it live:

1. **Online Store → Pages → Add page.** Title it whatever reads best — *The
   House*, *About*, *Why we do this*. The handle is up to you; the template is
   independent of it.
2. Under **Theme template**, pick **the-house**.
3. Add it to the `main-menu` and `footer` menus. It is worth a place in both:
   this is the page people open before a first order.

What it is made of, in order:

| Section | Does |
|---|---|
| House intro | The house in two paragraphs, two calls to action, and four facts: where we are, who answers, when a parcel moves, what happens if they change their mind |
| The letter | The *why* — the two Bettys — excerpted, linking to the full letter |
| House notes | *How a piece comes to exist* — four numbered steps |
| House attribution | What "by Betty Jaletti" means, and what it does not |
| House promises | "Plain terms" — shipping, returns, damage, refunds, preorders, privacy — then the candid caveats |
| Newsletter | The closing invitation |

### Rules for editing it

Every word is a theme setting, which is the point: these are the first facts to
go stale, and a stale promise is worse than no promise.

- **The figures must match the policies.** Shipping windows, the 30 days, the
  14 days, the 5–10 business days and the preorder terms are all repeated from
  the policy pages. If a policy changes, change this page the same day.
- **Move the review date** at the foot of "Plain terms" whenever you touch a
  figure. A dated page is a trusted page.
- **Leave the closing line in.** It says the policy pages govern where the two
  disagree. That is what makes writing the terms out on the page safe.
- **Keep the attribution section honest.** Its third column tells the buyer
  where to go and check for themselves. If a product page stops carrying that
  accordion, fix the product page rather than softening the claim here.
- **Claim nothing the house cannot show.** No invented response times, no
  invented certifications, no counts of happy customers. The page is persuasive
  because every line on it is checkable.

### Where the facts came from

Checked on **2026-11-18** against the live store, not against this repo:

| On the page | Source | Verified |
|---|---|---|
| Packed in 3–5 business days; Standard arrives 5–10, Express 2–4; $8.00 free over $70.00, Express $15.00 | Shipping policy, updated 2026-11-07 | ✅ |
| 30 days, unworn, in original packaging | Refund policy | ✅ |
| Damaged or wrong: 14 days with a photograph, house pays return postage | Refund policy | ✅ |
| Refunds in 5–10 business days to the original method | Refund policy | ✅ |
| Preorder charged on the day, cancel any time before it ships | Refund + shipping policies | ✅ |
| No exchanges; opened fragrance cannot come back | Refund policy | ✅ |
| Virginia, United States; `hello@ohbettyjaletti.com` | Legal notice, contact policy | ✅ |
| "The Making" on A Woman Remembered | Product description | ✅ |
| "The Pairing" on The Brownstone Tote | Product description | ✅ |
| "The Maker" on the Out-the-Door Gloves, `vendor` = `Glove Story` | Product description + vendor field | ✅ |

> ### ⚠️ One conflict to resolve in admin
>
> **Theme setting → Brand → `fulfillment_line`** reads *"Packed by hand at the
> house in 2–3 business days."* The **published shipping policy** (updated
> 7 November 2026) says in-stock orders ship in **3–5 business days**.
>
> Those cannot both be true, and `fulfillment_line` renders on every product
> page. The trust page follows the policy, because the policy governs. Fix the
> setting in **Theme settings → Brand**, or change the policy — but make them
> agree. `agents.md` carried the same stale 2–3 figure and has been corrected.

## Product metafields (optional but recommended)

Create these under **Settings → Custom data → Products**:

| Namespace & key | Type | Example |
|---|---|---|
| `custom.edition_number` | Integer | `1` → renders "No. 1" |
| `custom.cta_label` | Single line text | `Escort my paperback →` |
| `custom.preorder` | Boolean | `true` → sell as a preorder |

Without them the theme falls back to grid position for numbering and "Add to my parcel →" for the button.

## Getting it onto Shopify

> Check **Sync status** above first. A push sends whatever is in this directory,
> so pushing a stale tree deletes every file the tree is missing. Always push to
> an **unpublished** theme and publish from admin after looking at it.

```bash
# from this directory
shopify theme dev    # live preview against your store
```

```bash
shopify theme push --unpublished --theme "Oh Betty Jaletti"
```

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
3. Create the trust page on the **the-house** template (see above) and put it in both menus.
4. Set the `main-menu` and `footer` navigation menus.
5. Add the metafields above for per-product CTAs and edition numbers.
