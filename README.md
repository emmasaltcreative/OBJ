# Oh Betty Jaletti — Custom Shopify Theme

A bespoke Online Store 2.0 theme for **Maison Betty Jaletti** · *petits plaisirs, faits exprès*.

This repository mirrors the published theme, **OBJ v5.24**. See
[Keeping this repository and the store in step](#keeping-this-repository-and-the-store-in-step)
before you change anything here — the store, not this repository, has been the
working copy, and it is easy to overwrite a day's work in the theme editor.

## Design language

- **Palette** — cream paper (`#F6F1E7`), warm ink (`#2A2320`), a deep green accent
  (`#3A544A`), ticking-stripe blue (`#3D4E6E`). Editable under **Theme settings → Colors**.
  `base.css` adds three tokens the settings don't expose: `--gold` (`#A5834B`),
  `--wax-dark` (`#273B33`) and `--on-accent` (`#F3E6D2`), used for seals and solid buttons.
- **Type** — Fraunces (display), Literata (body), Work Sans (letterspaced small caps for
  eyebrows and buttons). All three are self-hosted `woff2` theme assets declared with
  `@font-face` in `base.css` and preloaded in the layout — nothing waits on Google Fonts.
- **The quatrefoil** — the house mark, used only behind the place a shopper commits: the buy
  box, the drawer checkout, the cart totals. `assets/obj-pattern.css` explains the restraint.
- **Voice baked in** — "Your parcel" instead of cart, "Between editions" instead of sold out,
  the fulfillment promise on every product page, the letter on the homepage.

## The edition gate

**Theme settings → Edition → Purchasing state** governs whether the house is selling:

| State | What happens |
|---|---|
| `pre_launch` | Buy buttons are replaced by the pre-launch note and the guest-book CTA |
| `open` | Everything sells normally; product descriptions take over from the house copy |
| `retired` | Buy buttons are replaced by the retired note; quick add disappears |

Two things cross the gate anyway: a preorder, and any product page whose Product section has
**Sell during preproduction** ticked (`product.perfume.json` does). The store is currently in
`pre_launch`.

## Structure

| Where | What |
|---|---|
| `layout/theme.liquid` | Head, meta/OG/JSON-LD, font preloads, parcel drawer, toast |
| `sections/hero-atelier.liquid` | Homepage hero with the guest-book claim |
| `sections/collection-hero.liquid` | Editorial collection hero with a live lineup line |
| `sections/collection-grid.liquid` | Collection products with a "more coming" card |
| `sections/main-product.liquid` | Product page: gallery, notes board, buy box, accordions |
| `sections/sticky-buy.liquid` | Sticky buy bar |
| `sections/edition-bundle.liquid` | Buy-the-edition bundle |
| `sections/edition-closed.liquid` · `waitlist-home.liquid` | Doors-shut states and the waitlist |
| `sections/collectors-ledger.liquid` | The ledger |
| `sections/house-notes.liquid` · `house-rules.liquid` · `service-strip.liquid` | House copy blocks |
| `sections/sealed-confirmation.liquid` | Post-signup confirmation |
| `snippets/cart-drawer.liquid` | The parcel drawer |
| `snippets/product-card.liquid` | Product card: edition number, quick add, dispatch note, sample seal |
| `snippets/product-notes.liquid` | The fragrance notes board |
| `snippets/sample-form.liquid` · `has-sample.liquid` | Free samples (below) |
| `assets/free-sample.css` | Free-sample styles, kept out of `base.css` |
| `templates/agents.md.liquid` | The house knowledge base, served at `/agents.md` |

## Product metafields

All optional; each falls back to house copy. Create them under **Settings → Custom data → Products**.

| Namespace & key | Type | Effect |
|---|---|---|
| `custom.edition_number` | Integer | `1` → renders "No. 1" |
| `custom.cta_label` | Single line text | Microcopy under the buy button |
| `custom.preorder` | Boolean | `true` → sell as a preorder |
| `custom.free_sample` | Boolean | `true` → offer a free sample; `false` → never |
| `custom.dispatch_note` | Single line text | Per-piece availability line on the card |
| `custom.preorder_ship_window` | Single line text | Ship window under a preorder button |
| `custom.preorder_note` | Rich text | Replaces the house preorder terms |
| `custom.materials` · `fit_dimensions` · `care` | Rich text | Product accordions |
| `custom.ritual_intro` · `object_copy` · `making_note` · `suitability` | Rich text | Product page copy |

## Free samples: smell it before you buy

Scented products carry a free-sample offer: a card scented by hand, folded into a house
envelope and closed with a wax seal. Nothing is charged.

- **On the product page** — a disclosure under the buy box, "Grab a sample — free". It opens a
  form that requires a physical address (street, city, postal code, country), because the card
  goes by post. It is shown whether or not the piece is sellable today: while the doors are
  shut, the scented card is the only way to meet the perfume at all.
- **On a collection page** — a wax seal on the product's photograph reading *Free sample ·
  Smell it before you buy*, linking to the form at `/products/<handle>#sample`. The seal sits
  top-right; quick add owns the bottom of the card, so the two never meet.

A product offers a sample when any of these are true: metafield `custom.free_sample` is true,
tagged `sample` or `free-sample`, tagged `fragrance`, handle `a-woman-remembered`, or the
product type reads parfum / perfume / fragrance / cologne / scent. It is withheld when
`custom.free_sample` is false, the product is tagged `no-sample`, or samples are switched off
in theme settings. **A Woman Remembered** is tagged `fragrance`, so it qualifies as it stands.

The form is a Shopify **contact** form, so no app and no metafield plumbing is needed. Every
field — name, email, street address, apartment, city, state, postal code, country and an
optional note — arrives in the store's contact notification, ready to address an envelope
from, along with the product title and URL and an optional "write to me when a new edition
opens" checkbox. **Requests land wherever Settings → Notifications → Contact is sent.** The
form does not create a customer or apply a tag; contact forms cannot, so the letters checkbox
is a note to the house, not an automatic subscribe.

Copy lives under **Theme settings → Free samples**. A single product page can hide the offer
with the Product section's **Offer a free sample** checkbox.

## Keeping this repository and the store in step

The published theme has been the working copy: versions v5.12 through v5.25 exist as theme
copies in the Shopify admin, and this repository sat at v1.0.0 until it was resynced from the
live theme through the Admin GraphQL API. 103 of the 105 files here are byte-identical to
`OBJ v5.24`, verified against the API's own MD5 per file.

Two files are not byte-identical, and never will be: `config/settings_data.json` and
`sections/header-group.json`. Shopify rewrites those minified whenever someone saves in the
theme editor. What is here is exactly what the Admin API returns for them; the difference is
whitespace and key order. `settings_data.json` is also marked auto-generated by Shopify and
will be overwritten by the editor — treat it as a record of the current settings, not a source
of truth.

Before pushing this repository over a live theme, pull the live theme first and diff it.
Someone may have edited it in the admin since the last sync.

## Getting it onto Shopify

```bash
shopify theme dev
```

```bash
shopify theme push --unpublished --theme "Oh Betty Jaletti"
```

Or zip the folder and upload via **Online Store → Themes → Add theme → Upload zip file**.

## Preorder: The Chaperone

The Chaperone — a coat for the paperback — is sold as a preorder: charged today, cut when the
edition opens, shipped with it. [`the-chaperone.csv`](the-chaperone.csv) is catalog data, not a
theme asset; import it under **Products → Import** rather than relying on a theme zip.

A product sells as a preorder when any of these are true: template suffix `preorder`, tag
`preorder`, handle `the-chaperone`, or metafield `custom.preorder` is true. Adding it to the
parcel writes line-item properties `Preorder: Yes` and `Ships: With the first edition`, which
follow the order into checkout. To close the preorder, track inventory, set the policy to
**deny**, and set quantity to 0 — the button then reads "Preorder closed."
