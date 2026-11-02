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
     Countdown to Christmas — a calm clock, ticking once a second
     ------------------------------------------------------------------ */
  function initCountdowns(scope) {
    scope.querySelectorAll('[data-countdown]').forEach(function (root) {
      if (root.dataset.ready === 'true') return;
      root.dataset.ready = 'true';

      var target = new Date(root.dataset.target);
      if (isNaN(target.getTime())) return;

      var clock = root.querySelector('[data-countdown-clock]');
      var arrived = root.querySelector('[data-countdown-arrived]');
      var summary = root.querySelector('[data-countdown-summary]');
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var units = {};
      var timer = null;

      root.querySelectorAll('[data-countdown-unit]').forEach(function (el) {
        units[el.dataset.countdownUnit] = el;
      });

      function pad(n) { return (n < 10 ? '0' : '') + n; }

      function set(name, value) {
        var el = units[name];
        if (!el) return;
        var text = pad(value);
        if (el.textContent.trim() === text) return;
        el.textContent = text;
        if (reduce) return;
        el.classList.remove('is-ticking');
        void el.offsetWidth;
        el.classList.add('is-ticking');
      }

      function finish() {
        if (timer) clearInterval(timer);
        if (clock) clock.hidden = true;
        if (arrived) arrived.hidden = false;
        root.classList.add('is-arrived');
        if (summary) summary.textContent = root.dataset.arrivedText || '';
      }

      function tick() {
        if (!root.isConnected) { if (timer) clearInterval(timer); return; }
        var remaining = Math.floor((target.getTime() - Date.now()) / 1000);
        if (remaining <= 0) { finish(); return; }
        set('days', Math.floor(remaining / 86400));
        set('hours', Math.floor((remaining % 86400) / 3600));
        set('minutes', Math.floor((remaining % 3600) / 60));
        set('seconds', remaining % 60);
      }

      tick();
      timer = setInterval(tick, 1000);
    });
  }

  /* ------------------------------------------------------------------
     Under the Tree — one ribbon pulled, once, and remembered
     ------------------------------------------------------------------ */
  function initFavours(scope) {
    scope.querySelectorAll('[data-favour]').forEach(function (root) {
      if (root.dataset.ready === 'true') return;
      root.dataset.ready = 'true';

      var poolEl = root.querySelector('[data-favour-pool]');
      if (!poolEl) return;

      var pool;
      try { pool = JSON.parse(poolEl.textContent); } catch (err) { return; }
      if (!pool || !pool.length) return;

      var tray = root.querySelector('[data-favour-parcels]');
      var parcels = Array.prototype.slice.call(root.querySelectorAll('[data-favour-parcel]'));
      var note = root.querySelector('[data-favour-note]');
      var hint = root.querySelector('[data-favour-hint]');
      var storageKey = root.dataset.storageKey || 'obj-favour';
      if (!tray || !note || !parcels.length) return;

      var el = {
        chosen: root.querySelector('[data-favour-chosen]'),
        label: root.querySelector('[data-favour-label]'),
        text: root.querySelector('[data-favour-text]'),
        codeWrap: root.querySelector('[data-favour-code-wrap]'),
        code: root.querySelector('[data-favour-code]'),
        copy: root.querySelector('[data-favour-copy]'),
        apply: root.querySelector('[data-favour-apply]'),
        others: root.querySelector('[data-favour-others]'),
        repeat: root.querySelector('[data-favour-repeat]')
      };

      function readRecord() {
        try { return JSON.parse(window.localStorage.getItem(storageKey)); } catch (err) { return null; }
      }

      function writeRecord(record) {
        try { window.localStorage.setItem(storageKey, JSON.stringify(record)); } catch (err) { /* private browsing */ }
      }

      function shuffle() {
        var order = pool.map(function (favour, i) { return i; });
        for (var i = order.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var held = order[i];
          order[i] = order[j];
          order[j] = held;
        }
        return order;
      }

      function joinNicely(items) {
        if (items.length < 2) return items.join('');
        return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
      }

      function reveal(order, picked, returning) {
        var favour = pool[order[picked]];
        if (!favour) return;

        parcels.forEach(function (parcel, i) {
          parcel.disabled = true;
          if (i === picked) parcel.classList.add('is-open');
        });
        tray.classList.add('is-drawn');
        if (hint) hint.hidden = true;

        if (el.chosen) {
          el.chosen.textContent = (root.dataset.chosenLabel || '').replace('[n]', String(picked + 1));
        }
        if (el.label) el.label.textContent = favour.label || '';
        if (el.text) el.text.textContent = favour.note || '';

        var code = (favour.code || '').trim();
        if (code && el.code && el.codeWrap) {
          el.code.textContent = code;
          el.codeWrap.hidden = false;
          if (el.apply) {
            var redirect = root.dataset.applyRedirect || '/collections/all';
            el.apply.href = '/discount/' + encodeURIComponent(code) + '?redirect=' + encodeURIComponent(redirect);
            el.apply.hidden = false;
          }
        } else {
          if (el.codeWrap) el.codeWrap.hidden = true;
          if (el.apply) el.apply.hidden = true;
        }

        if (el.others) {
          var others = [];
          order.forEach(function (favourIndex, parcelIndex) {
            if (parcelIndex === picked) return;
            var left = pool[favourIndex];
            if (left) others.push(left.aside || left.label || '');
          });
          others = others.filter(function (name) { return name !== ''; });
          if (others.length) {
            el.others.textContent = (root.dataset.othersLabel || '[list]').replace('[list]', joinNicely(others));
            el.others.hidden = false;
          } else {
            el.others.hidden = true;
          }
        }

        if (el.repeat) {
          if (returning && root.dataset.repeatText) {
            el.repeat.textContent = root.dataset.repeatText;
            el.repeat.hidden = false;
          } else {
            el.repeat.hidden = true;
          }
        }

        note.hidden = false;
      }

      var record = readRecord();
      var remembered = record
        && record.key === storageKey
        && Array.isArray(record.order)
        && record.order.length === pool.length
        && typeof record.chosen === 'number'
        && record.chosen >= 0
        && record.chosen < parcels.length;

      if (remembered) {
        reveal(record.order, record.chosen, true);
      } else {
        var order = shuffle();
        parcels.forEach(function (parcel, index) {
          parcel.addEventListener('click', function () {
            if (tray.classList.contains('is-drawn')) return;
            writeRecord({ key: storageKey, order: order, chosen: index, at: Date.now() });
            reveal(order, index, false);
          });
        });
      }

      if (el.copy && el.code) {
        el.copy.addEventListener('click', function () {
          var value = el.code.textContent.trim();
          if (!value) return;

          if (!el.copy.dataset.original) el.copy.dataset.original = el.copy.textContent.trim();

          function done() {
            el.copy.textContent = el.copy.dataset.copied || 'Copied';
            setTimeout(function () {
              el.copy.textContent = el.copy.dataset.original;
            }, 1800);
          }

          function fallback() {
            var field = document.createElement('textarea');
            field.value = value;
            field.setAttribute('readonly', '');
            field.style.position = 'absolute';
            field.style.left = '-9999px';
            document.body.appendChild(field);
            field.select();
            try { document.execCommand('copy'); done(); } catch (err) { /* nothing to be done */ }
            document.body.removeChild(field);
          }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(done, fallback);
          } else {
            fallback();
          }
        });
      }
    });
  }

  initCountdowns(document);
  initFavours(document);

  document.addEventListener('shopify:section:load', function (event) {
    var scope = event.target;
    if (!scope || !scope.querySelectorAll) return;
    initCountdowns(scope);
    initFavours(scope);
  });
})();
