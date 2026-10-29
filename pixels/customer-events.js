/* Oh Betty Jaletti — add-to-cart and purchase events
   ---------------------------------------------------------------------------
   This is NOT a theme asset. Paste it into Shopify admin:
   Settings → Customer events → Add custom pixel. See pixels/README.md.

   It listens to two Shopify customer events — product_added_to_cart and
   checkout_completed — and forwards them to Google Tag Manager, GA4, and
   Klaviyo.

   Meta, Pinterest, and Snapchat are deliberately left to their own sales
   channel apps, which already fire AddToCart and Purchase themselves. The
   code for firing them from here is at the bottom, switched off. Turn one on
   only if you have confirmed its app is not reporting, and switch tracking
   off inside that app first, or you will count every event twice.

   Custom pixels run in a "lax sandbox": an iframe that cannot reach the
   storefront's window and gets no `settings` object. So configuration lives
   in the CONFIG block below, and anything in it is visible to anyone who
   views the page source. Keep secrets that matter out of it.
   --------------------------------------------------------------------------- */

var CONFIG = {
  // Google Tag Manager. The container loads inside this sandbox and gets a
  // dataLayer push per event, so you can add tags without touching the theme.
  gtm: {
    containerId: '' // 'GTM-XXXXXXX'
  },

  // GA4 via the Measurement Protocol. Both values are required or GA4 is
  // skipped. The api_secret is readable by visitors; rotate it in GA4 under
  // Admin → Data streams → Measurement Protocol API secrets if that matters.
  ga4: {
    measurementId: '', // 'G-XXXXXXXXXX'
    apiSecret: ''
  },

  // Klaviyo. companyId is the public API key (also called the site ID).
  // Added to Cart is not tracked by Klaviyo's Shopify integration, so we send
  // it. Placed Order IS tracked natively from order webhooks — leave
  // placedOrder off unless you have turned that integration off.
  klaviyo: {
    companyId: '', // 'XXXXXX'
    addedToCart: true,
    placedOrder: false
  },

  // Left to the sales channel apps. See the note at the top of this file.
  meta: { pixelId: '' },
  pinterest: { tagId: '' },
  snapchat: { pixelId: '' }
};

/* ---------------------------------------------------------------------------
   Consent

   Shopify already gates this pixel on the permissions you give it in admin.
   We check again so that a store which later enables granular consent does
   not start leaking events: analytics destinations need analytics consent,
   advertising destinations need marketing consent.
   --------------------------------------------------------------------------- */
var consent = {
  analyticsProcessingAllowed: true,
  marketingAllowed: true
};

try {
  if (init && init.customerPrivacy) {
    consent = init.customerPrivacy;
  }
  api.customerPrivacy.subscribe('visitorConsentCollected', function (event) {
    consent = event.customerPrivacy;
  });
} catch (err) {
  // No privacy API on this storefront. Shopify's own gating still applies.
}

function analyticsAllowed() {
  return consent.analyticsProcessingAllowed !== false;
}

function marketingAllowed() {
  return consent.marketingAllowed !== false;
}

/* ---------------------------------------------------------------------------
   Shaping the events

   Both destinations want GA4's `items` shape, so we build it once.
   --------------------------------------------------------------------------- */
function num(value) {
  var parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/* Shopify sometimes hands these back as a global ID
   (gid://shopify/Product/7). Product catalogs on every channel key on the
   bare numeric ID, so strip the prefix or nothing will match. */
function idOf(value) {
  return String(value == null ? '' : value).replace(/^gid:\/\/shopify\/\w+\//, '');
}

function itemFromCartLine(line) {
  var merchandise = line.merchandise || {};
  var product = merchandise.product || {};

  return {
    item_id: idOf(product.id),
    item_name: product.title || '',
    item_variant: merchandise.title || '',
    item_brand: product.vendor || '',
    price: num(merchandise.price && merchandise.price.amount),
    quantity: line.quantity || 1
  };
}

function itemsFromCheckout(checkout) {
  return (checkout.lineItems || []).map(function (line) {
    var variant = line.variant || {};
    var product = variant.product || {};

    return {
      item_id: idOf(product.id),
      item_name: product.title || line.title || '',
      item_variant: variant.title || '',
      item_brand: product.vendor || '',
      price: num(variant.price && variant.price.amount),
      quantity: line.quantity || 1
    };
  });
}

/* ---------------------------------------------------------------------------
   Google Tag Manager — loaded inside the sandbox
   --------------------------------------------------------------------------- */
var gtmReady = false;

function startGtm() {
  if (!CONFIG.gtm.containerId || gtmReady) return;
  if (typeof document === 'undefined') return;

  gtmReady = true;
  self.dataLayer = self.dataLayer || [];
  self.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + CONFIG.gtm.containerId;
  document.head.appendChild(script);
}

function pushToDataLayer(payload) {
  if (!CONFIG.gtm.containerId) return;
  startGtm();
  if (!self.dataLayer) return;
  // Clear the previous ecommerce object so values never bleed between events.
  self.dataLayer.push({ ecommerce: null });
  self.dataLayer.push(payload);
}

/* ---------------------------------------------------------------------------
   GA4 — Measurement Protocol

   We send the real GA client_id read from the storefront's _ga cookie, so
   these events stitch onto the same user and session as the rest of GA4.
   Without it GA4 would invent a new user for every event.

   The request deliberately sets no Content-Type. That keeps it a "simple"
   CORS request with no preflight, which google-analytics.com does not answer.
   --------------------------------------------------------------------------- */
function ga4ClientId(fallback) {
  try {
    return browser.cookie.get('_ga').then(function (raw) {
      // _ga looks like GA1.1.1234567890.1699999999
      var match = raw && raw.match(/^GA\d+\.\d+\.(.+)$/);
      return match ? match[1] : fallback;
    }).catch(function () {
      return fallback;
    });
  } catch (err) {
    return Promise.resolve(fallback);
  }
}

function sendGa4(eventName, params, fallbackClientId) {
  if (!CONFIG.ga4.measurementId || !CONFIG.ga4.apiSecret) return;
  if (!analyticsAllowed()) return;

  ga4ClientId(fallbackClientId).then(function (clientId) {
    if (!clientId) return;

    fetch(
      'https://www.google-analytics.com/mp/collect' +
        '?measurement_id=' + encodeURIComponent(CONFIG.ga4.measurementId) +
        '&api_secret=' + encodeURIComponent(CONFIG.ga4.apiSecret),
      {
        method: 'POST',
        keepalive: true,
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: eventName, params: params }]
        })
      }
    ).catch(function () {
      // A dropped analytics beacon must never break the page.
    });
  });
}

/* ---------------------------------------------------------------------------
   Klaviyo — client-side Events API

   Profiles are keyed on email when we have one and on Shopify's clientId
   otherwise, so an anonymous add-to-cart still stitches to the person once
   they identify themselves.
   --------------------------------------------------------------------------- */
function sendKlaviyo(metricName, properties, value, identity, uniqueId) {
  if (!CONFIG.klaviyo.companyId) return;
  if (!marketingAllowed()) return;

  var profile = {};
  if (identity.email) profile.email = identity.email;
  if (identity.phone) profile.phone_number = identity.phone;
  if (identity.clientId) profile.anonymous_id = identity.clientId;
  if (!profile.email && !profile.phone_number && !profile.anonymous_id) return;

  fetch('https://a.klaviyo.com/client/events/?company_id=' + encodeURIComponent(CONFIG.klaviyo.companyId), {
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      revision: '2024-10-15'
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          unique_id: uniqueId,
          value: value,
          properties: properties,
          metric: { data: { type: 'metric', attributes: { name: metricName } } },
          profile: { data: { type: 'profile', attributes: profile } }
        }
      }
    })
  }).catch(function () {
    // Same as above: never let a beacon surface as a customer-facing error.
  });
}

/* ---------------------------------------------------------------------------
   Add to cart
   --------------------------------------------------------------------------- */
analytics.subscribe('product_added_to_cart', function (event) {
  var line = event.data && event.data.cartLine;
  if (!line) return;

  var item = itemFromCartLine(line);
  var cost = line.cost && line.cost.totalAmount;
  var currency = (cost && cost.currencyCode) || 'USD';
  var value = num(cost && cost.amount);
  var customer = (init && init.data && init.data.customer) || {};

  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: { currency: currency, value: value, items: [item] }
  });

  sendGa4('add_to_cart', {
    currency: currency,
    value: value,
    items: [item]
  }, event.clientId);

  if (CONFIG.klaviyo.addedToCart) {
    sendKlaviyo(
      'Added to Cart',
      {
        ProductName: item.item_name,
        VariantName: item.item_variant,
        ProductID: item.item_id,
        VariantID: idOf(line.merchandise && line.merchandise.id),
        SKU: (line.merchandise && line.merchandise.sku) || '',
        Vendor: item.item_brand,
        Quantity: item.quantity,
        Price: item.price,
        Currency: currency,
        URL: (line.merchandise && line.merchandise.product && line.merchandise.product.url) || ''
      },
      value,
      { email: customer.email, phone: customer.phone, clientId: event.clientId },
      event.id
    );
  }

  trackMeta('AddToCart', {
    content_ids: [item.item_id],
    content_name: item.item_name,
    content_type: 'product',
    value: value,
    currency: currency
  });
  trackPinterest('addtocart', {
    value: value,
    order_quantity: item.quantity,
    currency: currency
  });
  trackSnapchat('ADD_CART', {
    price: value,
    currency: currency,
    item_ids: [item.item_id]
  });
});

/* ---------------------------------------------------------------------------
   Purchase

   checkout_completed covers everything that goes through Shopify checkout:
   the online store, and the Shop app. Point of Sale never reaches a browser
   pixel — those orders are handled server-side by the Shopify Flow workflow
   described in pixels/README.md.
   --------------------------------------------------------------------------- */
analytics.subscribe('checkout_completed', function (event) {
  var checkout = event.data && event.data.checkout;
  if (!checkout) return;

  var items = itemsFromCheckout(checkout);
  var currency = checkout.currencyCode || 'USD';
  var value = num(checkout.totalPrice && checkout.totalPrice.amount);
  var transactionId = idOf((checkout.order && checkout.order.id) || checkout.token);

  var params = {
    transaction_id: transactionId,
    currency: currency,
    value: value,
    tax: num(checkout.totalTax && checkout.totalTax.amount),
    shipping: num(checkout.shippingLine && checkout.shippingLine.price && checkout.shippingLine.price.amount),
    items: items
  };

  pushToDataLayer({ event: 'purchase', ecommerce: params });
  sendGa4('purchase', params, event.clientId);

  if (CONFIG.klaviyo.placedOrder) {
    sendKlaviyo(
      'Placed Order',
      {
        OrderId: transactionId,
        Currency: currency,
        Value: value,
        Items: items.map(function (item) {
          return {
            ProductName: item.item_name,
            VariantName: item.item_variant,
            ProductID: item.item_id,
            Quantity: item.quantity,
            Price: item.price
          };
        })
      },
      value,
      { email: checkout.email, phone: checkout.phone, clientId: event.clientId },
      transactionId
    );
  }

  trackMeta('Purchase', {
    content_ids: items.map(function (item) { return item.item_id; }),
    content_type: 'product',
    value: value,
    currency: currency
  });
  trackPinterest('checkout', {
    value: value,
    order_id: transactionId,
    order_quantity: items.reduce(function (sum, item) { return sum + item.quantity; }, 0),
    currency: currency
  });
  trackSnapchat('PURCHASE', {
    price: value,
    currency: currency,
    transaction_id: transactionId,
    item_ids: items.map(function (item) { return item.item_id; })
  });
});

/* ---------------------------------------------------------------------------
   Meta, Pinterest, Snapchat — off unless you fill in an ID above

   Each one's sales channel app already fires these events. These functions
   exist so that if an app stops reporting you can switch its tag on here
   without writing anything new. Two cautions:

   1. Turn tracking off in the channel app first, or events double-count.
   2. The sandbox is an opaque origin, so these tags cannot read or write
      their own first-party cookies (_fbp, _pin_unauth, _scid). Matching will
      be weaker than the channel app's. Prefer the app.
   --------------------------------------------------------------------------- */
function loadScript(src) {
  if (typeof document === 'undefined') return;
  var script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

var metaReady = false;
function trackMeta(eventName, payload) {
  if (!CONFIG.meta.pixelId || !marketingAllowed()) return;

  if (!metaReady) {
    metaReady = true;
    self.fbq = function () {
      self.fbq.callMethod
        ? self.fbq.callMethod.apply(self.fbq, arguments)
        : self.fbq.queue.push(arguments);
    };
    self.fbq.queue = [];
    self.fbq.loaded = true;
    self.fbq.version = '2.0';
    self._fbq = self.fbq;
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    self.fbq('init', CONFIG.meta.pixelId);
  }

  self.fbq('track', eventName, payload);
}

var pinterestReady = false;
function trackPinterest(eventName, payload) {
  if (!CONFIG.pinterest.tagId || !marketingAllowed()) return;

  if (!pinterestReady) {
    pinterestReady = true;
    self.pintrk = function () {
      self.pintrk.queue.push(Array.prototype.slice.call(arguments));
    };
    self.pintrk.queue = [];
    loadScript('https://s.pinimg.com/ct/core.js');
    self.pintrk('load', CONFIG.pinterest.tagId);
    self.pintrk('page');
  }

  self.pintrk('track', eventName, payload);
}

var snapchatReady = false;
function trackSnapchat(eventName, payload) {
  if (!CONFIG.snapchat.pixelId || !marketingAllowed()) return;

  if (!snapchatReady) {
    snapchatReady = true;
    self.snaptr = function () {
      self.snaptr.handleRequest
        ? self.snaptr.handleRequest.apply(self.snaptr, arguments)
        : self.snaptr.queue.push(arguments);
    };
    self.snaptr.queue = [];
    loadScript('https://sc-static.net/scevent.min.js');
    self.snaptr('init', CONFIG.snapchat.pixelId);
  }

  self.snaptr('track', eventName, payload);
}
