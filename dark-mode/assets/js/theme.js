/* Theme toggle — three-way cycle, Nov 28 2026.
   Light -> Dark brown -> Dark graphite -> Light.
   The choice persists in localStorage ('playground-theme'); with no
   stored choice the pre-paint script in each page's <head> follows
   prefers-color-scheme (dark -> brown, the default dark theme).
   The button shows the icon of the NEXT theme, and its label names
   the current and next theme. Only pages that share css/style.css
   load this file. PEERSPECT and Form to Function have their own
   themes and are left alone. */
(function () {
  var KEY = 'playground-theme';
  var ORDER = ['light', 'brown', 'graphite'];
  var NAMES = { light: 'Light', brown: 'Dark brown', graphite: 'Dark graphite' };
  function current() { return document.documentElement.getAttribute('data-theme') || 'light'; }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = (theme === 'light') ? 'light' : 'dark';
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      var next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
      btn.setAttribute('aria-label', 'Theme: ' + NAMES[theme] + '. Switch to ' + NAMES[next] + ' theme.');
      btn.setAttribute('title', 'Theme: ' + NAMES[theme] + ' — switch to ' + NAMES[next]);
    }
  }
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  apply(current());
  btn.addEventListener('click', function () {
    var next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  });
})();
