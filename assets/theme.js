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
})();
