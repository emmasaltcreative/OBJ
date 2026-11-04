/* Oh Betty Jaletti — theme.js
   Small, calm, and unhurried — like the house itself.
   v4: the atelier look with a proper parcel drawer. */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var routes = window.BettyRoutes || { cart: '/cart', cartAdd: '/cart/add', cartChange: '/cart/change' };
    var drawer = document.querySelector('[data-cart-drawer]');
    var drawerLines = document.querySelector('[data-cart-lines]');
    var drawerEmpty = document.querySelector('[data-cart-empty]');
    var drawerFooter = document.querySelector('[data-cart-footer]');
    var drawerSubtotal = document.querySelector('[data-cart-subtotal]');
    var overlay = document.querySelector('[data-overlay]');
    var toast = document.querySelector('[data-toast]');
    var toastTimer;

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>'"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c];
      });
    }

    function formatMoney(cents, currency) {
      try {
        return new Intl.NumberFormat(document.documentElement.lang || 'en-US', {
          style: 'currency',
          currency: currency || window.BettyCurrency || 'USD',
          maximumFractionDigits: 2
        }).format(cents / 100);
      } catch (e) {
        return '$' + (cents / 100).toFixed(2);
      }
    }

    function showToast(message) {
      if (!toast) return;
      window.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('is-visible');
      toastTimer = window.setTimeout(function () { toast.classList.remove('is-visible'); }, 2800);
    }

    /* ------------------------------------------------------------------
       Parcel drawer
       ------------------------------------------------------------------ */
    function openDrawer() {
      if (!drawer) return;
      drawer.hidden = false;
      if (overlay) overlay.hidden = false;
      document.body.classList.add('is-locked');
      var close = drawer.querySelector('[data-close-cart]');
      if (close) close.focus();
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.hidden = true;
      if (overlay) overlay.hidden = true;
      document.body.classList.remove('is-locked');
    }

    function renderCart(cart) {
      document.querySelectorAll('[data-cart-count]').forEach(function (el) {
        el.textContent = '(' + cart.item_count + ')';
      });
      if (!drawer) return;
      if (drawerEmpty) drawerEmpty.hidden = cart.items.length > 0;
      if (drawerFooter) drawerFooter.hidden = cart.items.length === 0;
      if (drawerSubtotal) drawerSubtotal.textContent = formatMoney(cart.total_price, cart.currency);
      if (drawerLines) {
        drawerLines.innerHTML = cart.items.map(function (item) {
          return '<article class="drawer-line">' +
            '<a href="' + escapeHtml(item.url) + '">' +
            (item.image ? '<img src="' + escapeHtml(item.image) + '&width=184" alt="' + escapeHtml(item.product_title) + '" width="92" height="110" loading="lazy">' : '') +
            '</a>' +
            '<div class="drawer-line__body">' +
            '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.product_title) + '</a></h3>' +
            '<span class="drawer-line__price">' + formatMoney(item.final_line_price, cart.currency) + '</span>' +
            '<div class="drawer-line__qty" aria-label="Quantity for ' + escapeHtml(item.product_title) + '">' +
            '<button type="button" data-cart-quantity="' + (item.quantity - 1) + '" data-line-key="' + escapeHtml(item.key) + '" aria-label="Decrease quantity">&minus;</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button type="button" data-cart-quantity="' + (item.quantity + 1) + '" data-line-key="' + escapeHtml(item.key) + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '</div>' +
            '<button class="drawer-line__remove" type="button" data-cart-quantity="0" data-line-key="' + escapeHtml(item.key) + '">Remove</button>' +
            '</article>';
        }).join('');
      }
    }

    var suggestionEl = document.querySelector('[data-cart-suggestion]');
    var editionConfig = null;
    var configEl = document.querySelector('[data-edition-config]');
    if (configEl) { try { editionConfig = JSON.parse(configEl.textContent); } catch (e) {} }

    function renderSuggestion(cart) {
      if (!suggestionEl) return;
      suggestionEl.hidden = true;
      suggestionEl.innerHTML = '';
      if (!editionConfig || !editionConfig.purchasable || !cart.items.length) return;
      var handles = cart.items.map(function (i) { return i.handle; });
      var bundle = editionConfig.bundle;
      if (bundle && handles.indexOf(bundle.handle) !== -1) return;
      var singles = editionConfig.singles || [];
      var inCart = singles.filter(function (s) { return handles.indexOf(s.handle) !== -1; });
      var missing = singles.filter(function (s) { return handles.indexOf(s.handle) === -1; });
      var html = '';
      if (bundle && inCart.length >= 2 && singles.length >= 4) {
        var setTotal = singles.reduce(function (t, s) { return t + s.price; }, 0);
        var spared = setTotal - bundle.price;
        html = '<p class="cart-drawer__suggestion-note">' + inCart.length + ' of ' + singles.length +
          ' is a fine start. The set, spoken for, would spare you ' + formatMoney(spared, cart.currency) + '.</p>' +
          '<button type="button" class="btn btn--full" data-suggest-add="' + bundle.variantId + '">Complete the edition · ' + formatMoney(bundle.price, cart.currency) + '</button>';
      } else if (inCart.length === 1 && missing.length) {
        var next = missing[0];
        html = '<p class="cart-drawer__suggestion-note">May we suggest <em>' + escapeHtml(next.title) + '</em>? It keeps good company.</p>' +
          '<button type="button" class="btn btn--full" data-suggest-add="' + next.variantId + '">Add ' + escapeHtml(next.title) + ' · ' + formatMoney(next.price, cart.currency) + '</button>';
      }
      if (html) { suggestionEl.innerHTML = html; suggestionEl.hidden = false; }
    }

    function fetchCart() {
      return fetch(routes.cart + '.js', { headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Your parcel could not be reached.');
          return r.json();
        })
        .then(function (cart) { renderCart(cart); renderSuggestion(cart); return cart; });
    }

    function changeCart(key, quantity) {
      return fetch(routes.cartChange + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      }).then(function (r) {
        if (!r.ok) throw new Error('Your parcel could not be updated.');
        return r.json();
      }).then(function (cart) { renderCart(cart); renderSuggestion(cart); });
    }

    /* AJAX add-to-cart on every product form (buy box, quick add,
       bundle, related, preorder). Falls back to a normal submit
       when the drawer is not present. */
    if (drawer) {
      document.querySelectorAll('form[action*="/cart/add"]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var button = form.querySelector('[type="submit"]');
          var originalHtml = button ? button.innerHTML : '';
          if (button) { button.disabled = true; button.textContent = 'Adding…'; }
          fetch(routes.cartAdd + '.js', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: new FormData(form)
          }).then(function (r) {
            return r.json().then(function (result) {
              if (!r.ok) throw new Error(result.description || 'This piece could not be added.');
              return result;
            });
          }).then(function (result) {
            return fetchCart().then(function () {
              showToast((result.product_title || 'Your piece') + ' is now in your parcel.');
              openDrawer();
            });
          }).catch(function (error) {
            showToast(error.message);
          }).then(function () {
            if (button) { button.disabled = false; button.innerHTML = originalHtml; }
          });
        });
      });

      if (drawerLines) {
        drawerLines.addEventListener('click', function (event) {
          var button = event.target.closest('[data-cart-quantity]');
          if (!button) return;
          button.disabled = true;
          changeCart(button.dataset.lineKey, Number(button.dataset.cartQuantity)).catch(function (error) {
            showToast(error.message);
            button.disabled = false;
          });
        });
      }

      if (suggestionEl) {
        suggestionEl.addEventListener('click', function (event) {
          var btn = event.target.closest('[data-suggest-add]');
          if (!btn) return;
          btn.disabled = true;
          var fd = new FormData();
          fd.append('id', btn.dataset.suggestAdd);
          fd.append('quantity', '1');
          fetch(routes.cartAdd + '.js', { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
            .then(function (r) { if (!r.ok) throw new Error('This piece could not be added.'); return fetchCart(); })
            .then(function () { showToast('Kept together, as it should be.'); })
            .catch(function (e) { showToast(e.message); btn.disabled = false; });
        });
      }

      document.querySelectorAll('[data-cart-button]').forEach(function (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          fetchCart().catch(function (error) { showToast(error.message); });
          openDrawer();
        });
      });
      document.querySelectorAll('[data-close-cart]').forEach(function (button) {
        button.addEventListener('click', closeDrawer);
      });
      if (overlay) overlay.addEventListener('click', closeDrawer);
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !drawer.hidden) closeDrawer();
      });

      fetchCart().catch(function () {});
    }

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

      function formatVariantMoney(cents) {
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
        if (priceEl) priceEl.textContent = formatVariantMoney(variant.price);
        if (compareEl) {
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            compareEl.textContent = formatVariantMoney(variant.compare_at_price);
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
       Gentle reveals
       ------------------------------------------------------------------ */
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    }
  });
})();


/* Waitlist page-body form (raw /pages/waitlist view; the homepage hero owns
   its own form). Guards keep it inert elsewhere. */
(function(){
  var f=document.querySelector('.obj-form');
  if(f){f.addEventListener('submit',function(){
    var b=f.querySelector('button[type=submit]');
    if(b){b.disabled=true;b.textContent='Sealing…';}
  });}
  if(window.location.search.indexOf('customer_posted=true')>-1){
    var w=document.getElementById('objFormWrap');
    if(w){w.classList.add('obj-posted');w.scrollIntoView({block:'center'});}
  }
})();

/* v5.7 hero — quiet the button while the claim is being sealed. */
(function () {
  document.querySelectorAll('.hero-atelier__form').forEach(function (form) {
    form.addEventListener('submit', function () {
      var b = form.querySelector('[data-waitlist-submit]');
      if (b) { b.disabled = true; b.textContent = 'Signing…'; }
    });
  });
})();

/* Letters of Introduction — referral plumbing.
   ?intro=<code> marks the visitor as introduced; the code rides along as an
   intro-by-<code> tag on any waitlist signup. The code is FNV-1a/base36 of the
   introducer's email, so the ledger can map codes back without storing PII.
   Self-introductions are quietly dropped at submit time. */
(function () {
  function objCode(e) {
    e = String(e).trim().toLowerCase();
    var h = 0x811c9dc5;
    for (var i = 0; i < e.length; i++) { h ^= e.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36);
  }
  window.objIntroCode = objCode;
  try {
    var param = new URLSearchParams(window.location.search).get('intro');
    if (param && /^[a-z0-9]{4,8}$/.test(param)) localStorage.setItem('objIntroCode', param);
    var code = localStorage.getItem('objIntroCode');
    document.querySelectorAll('form').forEach(function (form) {
      var tags = form.querySelector('input[name="contact[tags]"]');
      var email = form.querySelector('input[name="contact[email]"]');
      if (!tags || tags.value.indexOf('waitlist') === -1) return;
      if (code && tags.value.indexOf('intro-by-') === -1) tags.value += ',intro-by-' + code;
      form.addEventListener('submit', function () {
        if (email) {
          try { sessionStorage.setItem('objEmail', email.value); } catch (e) {}
          if (code && objCode(email.value) === code) {
            tags.value = tags.value.replace(',intro-by-' + code, '');
          }
        }
      });
    });
  } catch (e) {}
})();

/* Guest book beckon — any "Enter the guest book" link lands on the hero
   form with the email field focused and a soft ring around it, so the next
   step (type your email) is unmistakable. Links on pages without the hero
   are sent home to it. */
(function () {
  function beckon() {
    var cta = document.getElementById('claim');
    if (!cta) return;
    var row = cta.querySelector('.hero-atelier__row');
    var input = cta.querySelector('input[type="email"]');
    if (row) {
      row.classList.remove('is-beckoned');
      void row.offsetWidth;
      row.classList.add('is-beckoned');
    }
    if (input) input.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href="#claim"], a[href="/#claim"]');
    if (!link) return;
    var cta = document.getElementById('claim');
    if (!cta) {
      if (link.getAttribute('href') === '#claim') {
        e.preventDefault();
        window.location.href = '/#claim';
      }
      return;
    }
    e.preventDefault();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    cta.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    if (history.replaceState) history.replaceState(null, '', '#claim');
    window.setTimeout(beckon, reduce ? 50 : 450);
  });
  if (window.location.hash === '#claim') {
    window.addEventListener('load', function () { window.setTimeout(beckon, 250); });
  }
})();
