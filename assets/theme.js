/* Oh Betty Jaletti — theme.js
   Small, calm, and unhurried — like the house itself. */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var header = btn.closest('.site-header');
      var open = header.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ------------------------------------------------------------------
     Quantity steppers
     ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty-change]');
    if (!btn) return;
    var input = btn.parentElement.querySelector('input[type="number"]');
    if (!input) return;
    var step = parseInt(btn.dataset.qtyChange, 10);
    var next = Math.max(parseInt(input.min || '1', 10), (parseInt(input.value, 10) || 1) + step);
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ------------------------------------------------------------------
     Variant picker — updates price, availability, and hidden variant id
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-product-form]').forEach(function (wrapper) {
    var jsonEl = wrapper.querySelector('[data-variants-json]');
    if (!jsonEl) return;

    var variants;
    try { variants = JSON.parse(jsonEl.textContent); } catch (err) { return; }

    var selects = wrapper.querySelectorAll('[data-option-select]');
    var idInput = wrapper.querySelector('input[name="id"]');
    var priceEl = wrapper.querySelector('[data-price]');
    var compareEl = wrapper.querySelector('[data-compare-price]');
    var buyBtn = wrapper.querySelector('[data-buy-button]');
    var defaultLabel = buyBtn ? buyBtn.dataset.labelDefault : '';
    var soldOutLabel = buyBtn ? (buyBtn.dataset.labelSoldOut || 'Sold out') : '';

    function formatMoney(cents) {
      var fmt = wrapper.dataset.moneyFormat || '${{amount}}';
      var amount = (cents / 100).toFixed(2);
      return fmt.replace(/\{\{\s*amount\s*\}\}/, amount);
    }

    function currentVariant() {
      var chosen = Array.prototype.map.call(selects, function (s) { return s.value; });
      return variants.find(function (v) {
        return v.options.every(function (opt, i) { return opt === chosen[i]; });
      });
    }

    function update() {
      var variant = currentVariant();
      if (!variant) {
        if (buyBtn) { buyBtn.disabled = true; buyBtn.textContent = 'Unavailable'; }
        return;
      }
      if (idInput) idInput.value = variant.id;
      if (priceEl) priceEl.textContent = formatMoney(variant.price);
      if (compareEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          compareEl.textContent = formatMoney(variant.compare_at_price);
          compareEl.hidden = false;
        } else {
          compareEl.hidden = true;
        }
      }
      if (buyBtn) {
        buyBtn.disabled = !variant.available;
        buyBtn.textContent = variant.available ? defaultLabel : soldOutLabel;
      }
      var url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    }

    selects.forEach(function (s) { s.addEventListener('change', update); });
  });

  /* ------------------------------------------------------------------
     Add to parcel
     ------------------------------------------------------------------
     Posts through the Cart Ajax API instead of letting the form reload
     the page. Shopify publishes the product_added_to_cart customer
     event from that endpoint, and every sales-channel pixel — Meta,
     Pinterest, Snapchat, and our own custom pixel — reads its
     add-to-cart from there. A plain form POST publishes nothing, so
     the parcel filled up and no channel ever heard about it.
     ------------------------------------------------------------------ */
  var cartRoot = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';

  function activeCurrency() {
    return (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'USD';
  }

  function setStatus(form, message, isError) {
    var el = form.querySelector('[data-cart-status]');
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
    el.classList.toggle('cart-status--error', !!isError);
  }

  /* Built from nodes rather than a markup string, because the error path
     puts text straight from Shopify into this same element. */
  function setAddedStatus(form) {
    var el = form.querySelector('[data-cart-status]');
    if (!el) return;
    setStatus(form, 'Added to your parcel. ');
    var link = document.createElement('a');
    link.href = cartRoot + 'cart';
    link.textContent = 'View the parcel →';
    el.appendChild(link);
  }

  function paintCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = '(' + count + ')';
      el.hidden = count === 0;
    });
  }

  function refreshCartCount() {
    return fetch(cartRoot + 'cart.js', {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin'
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) { paintCartCount(cart.item_count); })
      .catch(function () { /* the count is decoration; never block the add on it */ });
  }

  /* Only fires when Google Tag Manager is installed in the theme itself.
     The custom pixel carries its own container, so guarding on an
     existing dataLayer keeps add_to_cart from being counted twice. */
  function pushDataLayerAddToCart(line) {
    if (!window.dataLayer) return;
    var price = (line.price || 0) / 100;
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: activeCurrency(),
        value: price * (line.quantity || 1),
        items: [{
          item_id: String(line.product_id || ''),
          item_name: line.product_title || line.title || '',
          item_variant: line.variant_title || '',
          item_brand: line.vendor || '',
          price: price,
          quantity: line.quantity || 1
        }]
      }
    });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[action*="/cart/add"]');
    if (!form) return;

    e.preventDefault();

    var button = form.querySelector('button[name="add"]');
    var restoreLabel = button ? button.textContent : '';

    setStatus(form, '');
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding…';
    }

    fetch(cartRoot + 'cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
      credentials: 'same-origin'
    })
      .then(function (res) {
        return res.json().then(function (body) {
          if (res.ok) return body;
          // Shopify's own wording — "Between editions", a quantity limit —
          // is better than anything we could write here.
          var rejection = new Error(body.description || body.message || '');
          rejection.fromShopify = !!rejection.message;
          throw rejection;
        });
      })
      .then(function (body) {
        var line = body.items ? body.items[0] : body;
        pushDataLayerAddToCart(line);
        setAddedStatus(form);
        return refreshCartCount();
      })
      .catch(function (err) {
        // Anything else — a dropped connection, a thrown TypeError — carries a
        // developer's message. Don't show the customer "offline".
        var message = (err && err.fromShopify && err.message) ||
          'That could not be added just now. Please try again.';
        setStatus(form, message, true);
      })
      .then(function () {
        if (button) {
          button.disabled = false;
          button.textContent = restoreLabel;
        }
      });
  });
})();
