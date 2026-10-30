# A Woman Remembered — conversion work, Oct 2026

Ads for **A Woman Remembered** ($43, 10 mL travel Eau de Parfum, Edition II of
In Her Purse) are earning clicks. The page and the email program were not
converting them. This is what was found and what was changed.

> **Repo drift — read this first.** This repository is far behind the live
> theme. The published theme is `OBJ v5.18 · Note photographs`, which has files
> this repo does not (`templates/product.perfume.json`, `snippets/product-notes.liquid`,
> `snippets/cart-drawer.liquid`, `sections/service-strip.liquid`, `sections/product-film.liquid`
> and more). **Do not push this repo to Shopify** — it would roll the store back
> several versions. Theme edits belong in the live theme or a duplicate of it.

## The funnel, 14 days to 2026-10-29

| Step | Sessions |
|---|---|
| Sessions | 644 |
| Added to cart | 20 |
| Reached checkout | 10 |
| Completed checkout | 5 |

0.78% conversion. 97% of visitors never added to cart, so the loss was
concentrated on the product page, not in the ads and not at checkout.

Revenue to date: A Woman Remembered $215 / 5 orders; The Brownstone Tote
$172 / 2 orders.

## Two bugs that were discarding brand copy

1. **The buy button ignored its own label.** `templates/product.perfume.json`
   set `default_cta: "Claim the perfume →"`, but `sections/main-product.liquid`
   routes preorders to `section.settings.preorder_cta`:

   ```liquid
   if is_preorder and product.handle == 'the-chaperone'
     assign cta = section.settings.chaperone_cta
   elsif is_preorder
     assign cta = section.settings.preorder_cta   # perfume lands here
   else
     assign cta = section.settings.default_cta    # "Claim the perfume →" lived here
   ```

   The perfume is a preorder (`custom.preorder = true`) and the perfume template
   never set `preorder_cta`, so it fell through to the schema default and the
   live button read **"Preorder →"**.

2. **The best line on the product never rendered.** The metafield
   `custom.cta_label` holds *"Small enough to forget you packed it. Never quite
   forgotten by anyone else."* The template gated it on
   `{% if cta_note != blank and is_preorder == false %}`, so it was suppressed
   on every preorder. Nobody had ever seen it.

## "Preorder" appeared five times on one page

Eyebrow, price kicker, button, an auto-opened "The preorder" accordion, and the
fulfillment line — on a $43 impulse buy that ships in about two weeks, when
normal processing is already 3–5 business days.

## What was changed

All changes were made on a duplicate theme, **`OBJ v5.19 · Perfume conversion`**
(`gid://shopify/OnlineStoreTheme/189359882293`), not on the live theme. Preview:

```
https://ohbettyjaletti.com/products/a-woman-remembered?preview_theme_id=189359882293
```

In `templates/product.perfume.json`:

- `preorder_cta` → `"Claim the perfume →"` (fixes bug 1)
- `share_note` → the `custom.cta_label` line, `share_label` → `"Send it to her →"`
  (recovers bug 2's copy *and* turns on the share link, which had been blank —
  the right lever for a product about being remembered by other people)
- `preorder_eyebrow` → `"Edition II · In Her Purse"` (drops one "Preorder")
- `preorder_fulfillment` → leads with the ship date rather than the word
  "preorder": *"Yours today at [price], and it ships in mid-November…"*
- Added a `service-strip` section: "Thirty days, unopened" / "Ships
  mid-November — cancel any time before it does" / "Here if you need us".
  All three are true per the published refund policy.
- Added a `newsletter` section anchored `#perfume-list`, tagging
  `newsletter, in-her-purse, fragrance`. The page previously had no email
  capture at all; the only form was on the homepage, reachable through a small
  text link at the very bottom.
- `more_text` link retargeted from `/#purse-list` to the on-page `#perfume-list`.

Verified on the preview: button renders `CLAIM THE PERFUME →`, eyebrow renders
`EDITION II · IN HER PURSE`, the recovered line and share link render beneath
the button, trust strip and capture form render. "Preorder" is down from five
mentions to two.

## Email program

Before this work the account had **19 subscribers, one flow ("Welcome — Consider
it sealed"), and zero campaigns ever sent.** The perfume launched 2026-10-23 and
the list had never been told it exists. There was no cart, checkout, browse or
post-purchase recovery, despite Shopify already feeding Klaviyo the needed
metrics (`Added to Cart` `SbGcfQ`, `Checkout Started` `R4LLY5`, `Viewed Product`
`SebBRV`, `Placed Order` `RFMPAG`).

Created, **all in draft — nothing sends until switched live**:

| Flow | Trigger | Delay | Suppressed if | ID |
|---|---|---|---|---|
| Abandoned checkout | Checkout Started | 1 h | ordered since flow start | `UDKwrA` |
| Abandoned cart | Added to Cart | 4 h | ordered or reached checkout | `X3bsqb` |
| Browse abandonment | Viewed Product | 6 h | added to cart or ordered | `Ux7fVF` |
| Post-purchase | Placed Order | 2 h | — | `WsLDYr` |

Templates: `W8uSCi` checkout, `SsZRfW` cart, `YnFi4C` browse, `W4sSjg`
post-purchase, `Ye23qc` launch. House palette (`#F6F1E7` paper, `#2A2320` ink,
`#3A544A` accent), Georgia serif, `petits plaisirs, faits exprès` sign-off,
unsubscribe tag in every one.

Draft campaign `01M6564HQ8X8TC02AYMBQDS7ZK` — "She has a scent now", to the
Email List (`UGQ4eg`), unscheduled, template attached.

## Homepage — the In Her Purse debut

The homepage had been entirely the Brownstone Tote; the best-selling product was
invisible to anyone landing on the root. `templates/index.json` on the duplicate
theme now reads:

```
purse-hero → marquee → collection → tote → ritual → letter → newsletter
```

- Added a `collection-grid` section keyed `collection`, anchored `#in-her-purse`,
  pointed at the **In Her Purse** collection (`in-her-purse`, manual sort), three
  columns. It renders No. 1 The Brownstone Tote ($86), No. 2 A Woman Remembered
  ($43, Preorder badge), and a "More is being made" card linking to
  `/#purse-list`. Three cards fill one row exactly.
- Hero button relabelled **"See the collection →"** pointing at
  `/#in-her-purse`, so the hero opens into a collection rather than one product.
- The tote section's cross-sell was *"Also from the house — The Chaperone is open
  for preorder"*; now **"No. 2 — A Woman Remembered, the house fragrance"**
  linking to the perfume. The Chaperone belongs to a different edition.
- The letter gained a line about scent, and closes on both pieces rather than
  the tote alone.
- Newsletter heading was *"When you may carry it"* (tote-specific); now
  "Letters from the maison", with copy about the collection.

Verified on the preview: grid present, heading "In Her Purse, so far", three
cards rendering with correct edition numbers, prices and the preorder badge.

## Metafield corrections — done, and live

Both were applied with `metafieldsSet` and are live on the published theme now.

- `custom.preorder_note` → the longer, on-voice copy about being charged today,
  cancelling for a full refund, and considered quantities.
- `custom.preorder_ship_window` → **"Ships mid-November. Charged today, cancel
  any time before it does."**

  This is deliberately *not* the shorter "Charged today, cancel any time before
  it ships" proposed earlier. That wording assumed the v5.19 fulfillment line,
  which carries the ship date. The **currently published** theme (v5.18) has the
  old fulfillment line with no date in it, so dropping the date from this
  metafield would have removed mid-November from the live page entirely.
  The wording above is correct on both themes. Once v5.19 is published the
  sentence may be shortened, since the fulfillment line and the trust strip
  both carry the date by then.

## UTMs — URLs ready to paste

Ads cannot be tagged from here; UTMs live in the destination URL inside each ad
platform's manager, which is outside this environment. The scheme and the exact
strings are below. Verified that a tagged URL returns HTTP 200 with every
parameter intact and no redirect stripping.

Scheme — keep `utm_campaign` stable at `awr-launch` so the whole push reports as
one campaign:

| Parameter | Value |
|---|---|
| `utm_source` | `facebook` / `instagram` / `snapchat` / `pinterest` |
| `utm_medium` | `paid_social` |
| `utm_campaign` | `awr-launch` |
| `utm_content` | the creative, e.g. `gloved-hand-tote` |
| `utm_term` | the ad set / audience |

**Meta (Facebook + Instagram).** Paste into the ad's *URL parameters* field, with
no leading `?`. The macros fill themselves in, so this one string covers every
ad and tells Facebook placements from Instagram ones:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=awr-launch&utm_term={{adset.name}}&utm_content={{ad.name}}
```

**Snapchat.** Macro support is inconsistent, so tag the attachment URL per
creative and change `utm_content` each time:

```
https://ohbettyjaletti.com/products/a-woman-remembered?utm_source=snapchat&utm_medium=paid_social&utm_campaign=awr-launch&utm_content=REPLACE-WITH-CREATIVE-NAME
```

**Pinterest:**

```
https://ohbettyjaletti.com/products/a-woman-remembered?utm_source=pinterest&utm_medium=paid_social&utm_campaign=awr-launch&utm_content=REPLACE-WITH-CREATIVE-NAME
```

For an ad pointing at the collection debut rather than the product, swap the
path for `/` (the homepage) or `/collections/in-her-purse`.

Results appear under Shopify **Analytics → Reports → Sessions by UTM campaign**,
and the "direct" bucket should shrink from its current 542 of 644 sessions. Do
not add UTMs to the Klaviyo links by hand — the launch campaign already has
`is_add_utm` enabled.

## Still open

- **Two "Preorder" mentions remain** and need a `sections/main-product.liquid`
  edit, because both strings are hardcoded. Backwards-compatible fix — give
  each a setting with the current text as the schema default, so The Chaperone
  is unaffected:

  ```liquid
  {% if is_preorder and section.settings.price_kicker != blank %}
    <div class="product__price-kicker">{{ section.settings.price_kicker }}</div>
  {% endif %}
  ```
  ```liquid
  <summary>{{ section.settings.preorder_summary | default: 'The preorder' }}</summary>
  ```

- **Klaviyo's AI brand-voice profile is stale.** It was generated from the old
  "Opening soon" placeholder page and describes the brand as "Minimalist and
  Direct", one that "avoids elaborate storytelling" — the opposite of the house
  voice. Regenerate it before relying on AI-assisted copy in Klaviyo.
- **v5.19 is not published.** Everything on the theme side is staged there.
- **The flows and the launch campaign are drafts.** Nothing sends until they are
  switched live in Klaviyo.

## Checked and fine

Policies are published and well written (refund, shipping with a
fragrance-specific clause, preorder cancellation, terms, legal) — not the
blocker. The theme setting `shipping_text` still carries a stale warning that
policies are unpublished; that text is simply out of date. `/pages/sealed`
exists and is published, so the newsletter `return_to` works. Inventory is
untracked with policy `continue`, so the `-5` quantity is harmless and the
variant stays purchasable.
