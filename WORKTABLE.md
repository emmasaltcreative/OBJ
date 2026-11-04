# The Worktable

Concept studies for ideas the house has not made yet. One page per idea.
Live at `/pages/the-worktable`, with each study at `/pages/worktable-<slug>`.

## What it is, and what it is not

Every word, swatch, label, status and control is **live HTML and CSS**. No
composed PNG page is deployed anywhere. Images are photographic slots only,
and every slot is captioned `Concept study / Reference image` with the
footer line `Concept only — not a product photograph.`

Nothing on The Worktable is for sale, priced or promised.

## Files

| Where | What |
|---|---|
| `sections/worktable-study.liquid` | One study. All content is theme-editor settings. |
| `sections/worktable-index.liquid` | The wall of studies, grouped into chapters. |
| `snippets/worktable-actions.liquid` | The three actions, and the two panels they open. |
| `assets/worktable.css` | Styles. Uses the house tokens from `base.css`; adds no new ones. |
| `assets/worktable.js` | Keep-toggle, panels, GA4 events. |
| `templates/page.worktable.json` | The index. |
| `templates/page.worktable-<slug>.json` | One per study. 14 of them. |

## Setting it up in Shopify

1. **Pages → Add page.** Title `At the Worktable`, handle **`the-worktable`**,
   template **`page.worktable`**.
2. For each study, add a page with handle **`worktable-<slug>`** and template
   **`page.worktable-<slug>`**. The slugs are:
   `butta-balm`, `leather-keychain`, `obj-cap`, `commonplace-book`,
   `focus-notebook`, `wrapping-paper`, `house-catalogue`, `correspondence`,
   `marginalia`, `lending`, `paper-trail`, `bag-tray`, `holiday-stationery`,
   `wax-seal`.
3. Add `At the Worktable` to the main menu if it should be found that way. It
   is reachable from the corner note regardless.
4. Edit any word, swatch or status in **Customize** on that page. No code.

## The three actions

| Action | What happens today | What it needs |
|---|---|---|
| **I'd keep this** | Held in the visitor's own browser; fires `back_room_concept_interest` to GA4 with the concept id. Reversible. | An interest store, for unique counts and collection roll-ups. |
| **Tell me if it happens** | Real Shopify customer form. Tagged `worktable,concept-<slug>`. Marketing consent is a **separate, unticked** box — nothing joins the general letter without it. | Nothing. It works. |
| **Leave a thought** | Shopify contact form carrying the concept id, so replies land in admin attached to the right idea. | Nothing. It works. |

**Read the keep counts as directional only.** `localStorage` plus GA4 counts
browsers, not people. It cannot tell you unique interested visitors per
chapter, and it cannot be deduplicated across devices. Verified email
requests are the honest number until the interest store is in. The dashboard
must keep those two figures in separate columns and label them.

## Status

`A little thought` is the default and the honest one for everything here.
Move a study up the ladder only when the work has actually reached that
stage — `Taking shape` means a sample exists, `Nearly here` means a credible
release plan exists. Do not invent manufacturing progress.

## Images

Concept and reference imagery only, per the founder's production rules:

- No logos, no lettering, no invented house mark in any generated image.
- The quatrefoil, the script wordmark and all type come from the theme.
- Replace generated references with photographs of samples before launch.

## Deliberately not included

**The Brownstone Tote.** It appears in `worktable_concept_manifest.json`, but
it is a live, active, purchasable product at $86 (Edition I, No. 1). Showing
it as an unmade concept would contradict the shop. If the intent was to study
a *next* version, it needs its own slug and wording that says so.

## Still to come

Anonymous interest storage, unique-visitor roll-ups, the founder dashboard,
and CSV export. Those need the backend described in the Phase 1 proposal.
