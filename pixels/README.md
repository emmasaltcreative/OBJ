# Add-to-cart and purchase events, across every sales channel

Nothing in this folder is a theme asset. `shopify theme push` ignores it. These
are the two pieces that live in Shopify admin, plus the notes for setting them
up.

| File | Where it goes |
|---|---|
| `customer-events.js` | Settings → Customer events → Add custom pixel |
| `flow-offline-purchase.liquid` | The body of a Shopify Flow **Send HTTP request** action |

## The problem this solves

Every sales-channel pixel on the online store — Meta, Pinterest, Snapchat, and
any custom pixel — reads its add-to-cart from one place: Shopify's
`product_added_to_cart` customer event. Shopify publishes that event from the
Cart Ajax API. The theme used to add to the parcel with a plain form POST,
which publishes nothing, so the parcel filled up and **no channel ever heard
about it**. `assets/theme.js` now posts to `cart/add.js` instead, which is the
fix; everything below is the fan-out from there.

Purchases were never broken in the same way, but they were incomplete. See
[Which channels are covered](#which-channels-are-covered).

## 1. The custom pixel

Shopify admin → **Settings → Customer events → Add custom pixel**. Name it
`Oh Betty Jaletti — events`. Paste `customer-events.js`, fill in the `CONFIG`
block at the top, **Save**, then **Connect**.

| Setting | Where to find it |
|---|---|
| `gtm.containerId` | GTM → container ID, `GTM-XXXXXXX` |
| `ga4.measurementId` | GA4 → Admin → Data streams → `G-XXXXXXXXXX` |
| `ga4.apiSecret` | GA4 → Admin → Data streams → Measurement Protocol API secrets → Create |
| `klaviyo.companyId` | Klaviyo → Settings → API keys → Public API key / Site ID |

Leave `meta`, `pinterest`, and `snapchat` empty. Their sales channel apps
already fire AddToCart and Purchase. Filling one in here without switching
tracking off in that app will count every event **twice**. The code is there so
that if an app stops reporting you can switch its tag on without writing
anything new — read the caution above those functions first.

Two things to know about the pixel's sandbox, because they are not obvious:

- A custom pixel gets **no `settings` object**, so configuration has to be
  constants in the file. Anyone who views source can read them, including the
  GA4 API secret. It is a write-only ingestion key, but rotate it if that
  bothers you.
- The sandbox is an **opaque origin**, so tags loaded inside it cannot read or
  write their own first-party cookies. That is the real reason to prefer the
  channel apps over the tag functions at the bottom of the file. GA4 is
  unaffected: the pixel reads the storefront's `_ga` cookie through
  `browser.cookie.get()` and sends the genuine client ID, so these events
  stitch onto the same user and session as the rest of GA4.

### Klaviyo

`Added to Cart` is **on**. Klaviyo's Shopify integration does not track it, so
this fills a real gap — it is what an abandoned-cart flow triggers on.

`Placed Order` is **off**. Klaviyo's integration already creates it from order
webhooks, for every channel, which is strictly better than a browser pixel.
Only turn it on if you have turned that integration off.

## 2. Shopify Flow — the orders no pixel can see

Install **Shopify Flow** from the App Store if it isn't already (it's free).
Flow workflows cannot be created through the API, so this part is built by hand
in the Flow editor. It's four steps.

1. **Create workflow** → trigger **Order created**.
2. Add a **Condition**:
   - `Order → App → Name` **is not equal to** `Online Store`
   - **AND** `Order → App → Name` **is not equal to** `Shop`
3. On the **then** branch, add the action **Send HTTP request**:
   - **Method** — `POST`
   - **URL** —
     `https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXXXX&api_secret=YOUR_SECRET`
     (the same two values as the pixel)
   - **Headers** — `Content-Type` / `application/json`
   - **Body** — the contents of `flow-offline-purchase.liquid`
4. **Turn on workflow.**

Why the condition: the two channels it excludes are the two where the custom
pixel's `checkout_completed` already fires, so letting them through would
double-count. Everything else — Point of Sale, and checkout that happens inside
Facebook, Instagram, Pinterest, or Snapchat — never touches a browser on the
online store, and this is the only thing that will report it. The store already
has such an order: **#1002** came through Facebook & Instagram.

Anything in the condition is a judgement call about where the pixel fires, so
verify it once (below) rather than trusting it.

Two honest limits on this workflow:

- An offline order has no browser and so no GA client ID. These events land in
  GA4 as a new user with no campaign attribution; the `affiliation` parameter
  carries the channel name so you can split them out. Revenue and items are
  accurate. Attribution for an in-person sale isn't a thing a pixel can
  recover.
- Flow sends to GA4 only. Klaviyo already covers every channel natively, and
  GTM is a browser container with nothing to run server-side.

## Which channels are covered

| Channel | Add to cart | Purchase |
|---|---|---|
| Online Store | Custom pixel + channel apps | Custom pixel + channel apps |
| Shop | Custom pixel + channel apps | Custom pixel + channel apps |
| Point of Sale | Not applicable — no cart | Flow → GA4 · Klaviyo native |
| Facebook & Instagram | Channel app, on-platform | Flow → GA4 · Klaviyo native |
| Pinterest | Channel app, on-platform | Flow → GA4 · Klaviyo native |
| Snapchat Ads | Channel app, on-platform | Flow → GA4 · Klaviyo native |

Point of Sale has no add-to-cart event to report: a staff member ringing up a
sale is not a shopper adding to a cart, and no ad platform wants it.

On the three ad channels, browsing and adding to cart happen inside that
platform's own app, so its pixel sees them directly and Shopify never does.

## Verifying it

Do these in order; each one checks the layer below it.

1. **The theme fires the event.** Open a product page, add to the parcel. You
   should get the "Added to your parcel" line and the header count should move
   without a page reload. In Shopify admin → **Settings → Customer events**,
   the pixel's activity should show `product_added_to_cart`.
2. **GA4.** GA4 → Reports → Realtime. `add_to_cart` and `purchase` should
   appear within a minute or two. If events arrive but attach to no session,
   the `_ga` cookie read failed — check the browser console inside the pixel's
   sandbox frame.
3. **GTM.** GTM Preview mode will not attach to a sandboxed iframe. Confirm
   the container instead by having it fire a tag to an endpoint you can see, or
   read the sandbox frame's `dataLayer` in the console.
4. **Klaviyo.** Klaviyo → Analytics → Metrics → **Added to Cart**. A test add
   should appear within a few minutes. An anonymous add attaches to a profile
   keyed on Shopify's client ID and merges into the person once they identify
   themselves.
5. **Flow.** Take a test order through POS (or any non-online channel), then
   Flow → the workflow → **Run history**. A 2xx on the HTTP step means GA4
   accepted it. GA4 → Realtime should show the purchase with `affiliation` set
   to that channel.
6. **Check for double-counting.** After a day, compare GA4's purchase count
   against Shopify's order count for the same window. They should match. If
   GA4 is high, something is firing twice — the most likely cause is a channel
   app and a tag in `CONFIG` both reporting, or `Shop` orders not actually
   reaching the pixel, in which case drop that clause from the Flow condition.
