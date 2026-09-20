/*
 * BH Locksmith Metro Detroit: temporary Yom Kippur 2026 closure notice.
 * Loaded by the homepage (/index.html) only, inside the HOLIDAY-NOTICE marker block.
 * It inserts itself only after React has finished hydrating, so it never causes a
 * hydration mismatch, and it stops showing at 2026-09-22 09:00 Eastern.
 * Remove this file and the HOLIDAY-NOTICE block in /index.html after the holiday.
 */
(function () {
  'use strict';

  var END = Date.parse('2026-09-22T09:00:00-04:00');
  var ID = 'bh-holiday-notice';
  var ARTICLE = '/blog/yom-kippur-2026/';

  if (!(Date.now() < END)) return;

  var loadedAt = document.readyState === 'complete' ? Date.now() : 0;
  var timer = null;

  function onHome() {
    var p = window.location.pathname;
    return p === '/' || p === '/index.html';
  }

  // True once React has committed the hydrated tree (or its client re-render).
  function reactSettled() {
    var keys = Object.keys(document);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf('__reactContainer$') === 0) {
        try {
          var root = document[keys[i]].stateNode;
          var state = root && root.current && root.current.memoizedState;
          return !!state && state.isDehydrated === false;
        } catch (e) {
          return false;
        }
      }
    }
    return false;
  }

  function build() {
    var box = document.createElement('aside');
    box.id = ID;
    box.setAttribute('aria-label', 'Yom Kippur holiday hours');
    box.style.cssText = [
      'display:block', 'box-sizing:border-box', 'width:100%', 'margin:0',
      'border-bottom:1px solid rgba(184,134,43,0.35)',
      'background:linear-gradient(90deg,rgba(184,134,43,0.18),rgba(184,134,43,0.08)),rgb(11,14,18)',
      'color:rgb(229,231,234)'
    ].join(';');

    var inner = document.createElement('p');
    inner.style.cssText = [
      'box-sizing:border-box', 'max-width:80rem', 'margin:0 auto', 'padding:12px 16px',
      'font-size:14px', 'line-height:1.55', 'text-align:center', 'overflow-wrap:break-word'
    ].join(';');

    var strong = document.createElement('strong');
    strong.style.cssText = 'color:rgb(217,174,74);font-weight:700';
    strong.textContent = 'Closed for Yom Kippur.';
    inner.appendChild(strong);

    inner.appendChild(document.createTextNode(
      ' We are closed Sunday, September 20 and Monday, September 21, and reopen Tuesday, September 22 at 9:00 AM. Wishing an easy and meaningful fast. '
    ));

    var link = document.createElement('a');
    link.href = ARTICLE;
    link.textContent = 'Holiday hours';
    link.style.cssText = 'color:rgb(232,203,126);font-weight:600;text-decoration:underline;text-underline-offset:4px;white-space:nowrap';
    inner.appendChild(link);

    box.appendChild(inner);
    return box;
  }

  function place() {
    var existing = document.getElementById(ID);
    if (!(Date.now() < END)) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      if (timer) clearInterval(timer);
      return;
    }
    if (existing) {
      existing.style.display = onHome() ? 'block' : 'none';
      return;
    }
    if (!onHome()) return;
    var waitedOut = loadedAt && Date.now() - loadedAt > 6000;
    if (!reactSettled() && !waitedOut) return;
    var node = build();
    var main = document.querySelector('main');
    if (main) {
      main.insertBefore(node, main.firstChild);
    } else if (document.body) {
      document.body.insertBefore(node, document.body.firstChild);
    }
  }

  function start() {
    place();
    if (!timer) timer = setInterval(place, 400);
  }

  window.addEventListener('load', function () {
    loadedAt = Date.now();
    place();
  });
  window.addEventListener('popstate', place);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
