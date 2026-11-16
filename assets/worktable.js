/* Oh Betty Jaletti — The Worktable
   Keeping, following and saying something, on a storefront with no backend yet.

   "I'd keep this" is held in the visitor's own browser and reported to GA4.
   That is a directional signal only: it counts browsers, not people, and it
   cannot be rolled up into unique interest across a collection. Those numbers
   come when the interest store is in. Nothing here pretends otherwise. */

(function () {
  'use strict';

  var STORE = 'objWorktableKept';

  function read() {
    try {
      var raw = window.localStorage.getItem(STORE);
      var parsed = raw ? JSON.parse(raw) : [];
      return Object.prototype.toString.call(parsed) === '[object Array]' ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function write(list) {
    try { window.localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) {}
  }

  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', name, params); } catch (e) {}
  }

  /* The house acknowledges, it does not congratulate. */
  var KEPT_LINES = [
    'Well, that’s lovely to know.',
    'Consider your opinion tucked away.',
    'Noted, and not forgotten.'
  ];

  function lineFor(id) {
    var h = 0;
    for (var i = 0; i < id.length; i++) { h = (h * 31 + id.charCodeAt(i)) >>> 0; }
    return KEPT_LINES[h % KEPT_LINES.length];
  }

  document.addEventListener('DOMContentLoaded', function () {
    var kept = read();

    /* ----------------------------------------------------------------
       I'd keep this
       ---------------------------------------------------------------- */
    document.querySelectorAll('[data-wt-keep]').forEach(function (btn) {
      var id = btn.dataset.wtKeep;
      var name = btn.dataset.wtName || id;
      var label = btn.querySelector('[data-wt-keep-label]');
      var said = document.querySelector('[data-wt-said="' + id + '"]');

      function paint(on, announce) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (label) label.textContent = on ? 'Kept' : 'I’d keep this';
        if (said) {
          if (on && announce) {
            said.textContent = lineFor(id);
            said.hidden = false;
          } else if (!on) {
            said.hidden = true;
          }
        }
      }

      paint(kept.indexOf(id) !== -1, false);

      btn.addEventListener('click', function () {
        kept = read();
        var at = kept.indexOf(id);
        var on;
        if (at === -1) { kept.push(id); on = true; } else { kept.splice(at, 1); on = false; }
        write(kept);
        paint(on, true);
        /* Mirror every button for the same concept on this page. */
        document.querySelectorAll('[data-wt-keep="' + id + '"]').forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-pressed', on ? 'true' : 'false');
          var l = other.querySelector('[data-wt-keep-label]');
          if (l) l.textContent = on ? 'Kept' : 'I’d keep this';
        });
        track(on ? 'back_room_concept_interest' : 'back_room_interest_removed', {
          concept_id: id,
          concept_name: name
        });
      });
    });

    /* ----------------------------------------------------------------
       The two panels
       ---------------------------------------------------------------- */
    document.querySelectorAll('[data-wt-open]').forEach(function (btn) {
      var panel = document.getElementById(btn.dataset.wtOpen);
      if (!panel) return;
      btn.addEventListener('click', function () {
        var open = panel.hidden;
        panel.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          var field = panel.querySelector('input[type="email"], textarea');
          if (field) field.focus({ preventScroll: true });
          track(panel.id.indexOf('notify-') === 0
            ? 'back_room_notify_opened'
            : 'back_room_feedback_opened', { panel: panel.id });
        }
      });
    });

    /* A signup that has just come back from Shopify reopens its own panel. */
    var noted = new URLSearchParams(window.location.search).get('noted');
    if (noted) {
      var back = document.querySelector('[data-wt-open^="notify-' + noted + '"]');
      if (back) back.click();
      track('back_room_notify_requested', { concept_id: noted });
    }

    /* One view event per concept per page, fired once. */
    var study = document.querySelector('[data-wt-study]');
    if (study) {
      track('back_room_concept_view', {
        concept_id: study.dataset.wtStudy,
        concept_collection: study.dataset.wtCollection || ''
      });
    }
  });
})();
