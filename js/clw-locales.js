/**
 * Site locale (en | zh): per-user preference in localStorage, synced on auth.
 * Translations are split by scope: global chrome and page-owned dictionaries.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "clw_locale_by_user_v1";
  var FOOTER_PREFIX = "Color Learning · Course project · ";

  function getUserKey() {
    if (window.CLWAuth && typeof CLWAuth.isLoggedIn === "function" && CLWAuth.isLoggedIn()) {
      var u = CLWAuth.getCurrentUsername && CLWAuth.getCurrentUsername();
      if (u && u !== "Guest") return String(u);
    }
    return "__guest__";
  }

  function readAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : {};
    } catch (e) {
      return {};
    }
  }

  function writeForUserKey(userKey, locale) {
    var all = readAll();
    all[userKey] = !!locale && locale === "zh" ? "zh" : "en";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {}
  }

  var currentUserKey = "__guest__";
  var locale = "en";

  function loadForCurrentUser() {
    currentUserKey = getUserKey();
    var all = readAll();
    if (Object.prototype.hasOwnProperty.call(all, currentUserKey)) {
      var v = all[currentUserKey];
      locale = v === "zh" ? "zh" : "en";
    } else {
      locale = "en";
    }
  }

  function getLocale() {
    return locale === "zh" ? "zh" : "en";
  }

  function getZhTable(scope) {
    if (scope === "test" && window.CLW_TEST_ZH && typeof window.CLW_TEST_ZH === "object") {
      return window.CLW_TEST_ZH;
    }
    if (window.CLW_GLOBAL_ZH && typeof window.CLW_GLOBAL_ZH === "object") {
      return window.CLW_GLOBAL_ZH;
    }
    return {};
  }

  /**
   * @param {string} english
   * @param {'global'|'test'} [scope]
   * @returns {string}
   */
  function translate(english, scope) {
    if (english == null) return "";
    var s = String(english);
    if (getLocale() !== "zh") return s;
    var primary = getZhTable(scope || "global");
    var out = primary[s];
    if (typeof out === "string" && out.length) return out;
    if (scope === "test") {
      var globalOut = getZhTable("global")[s];
      if (typeof globalOut === "string" && globalOut.length) return globalOut;
    }
    return s;
  }

  function applySiteChromeLabels() {
    var links = document.querySelectorAll(".site-nav__link[data-nav]");
    var hrefToKey = {
      "index.html": "Home",
      "learning.html": "Learn",
      "game.html": "Game",
      "test.html": "Test",
      "community.html": "Community"
    };
    var i;
    for (i = 0; i < links.length; i++) {
      var a = links[i];
      var key = hrefToKey[a.getAttribute("data-nav") || ""];
      if (key) a.textContent = translate(key, "global");
    }

    var toggle = document.querySelector("[data-nav-toggle]");
    if (toggle) {
      toggle.textContent = translate("Menu", "global");
    }

    var footerInner = document.querySelector(".site-footer__inner");
    if (footerInner) {
      var yearEl = document.getElementById("footer-year");
      var y = yearEl && yearEl.textContent ? yearEl.textContent : String(new Date().getFullYear());
      footerInner.innerHTML = "<p>" + translate(FOOTER_PREFIX, "global") + '<span id="footer-year">' + y + "</span></p>";
    }

    var profileBtn = document.querySelector("[data-profile-settings-trigger]");
    if (profileBtn) {
      profileBtn.setAttribute("aria-label", translate("Open Profile and Settings", "global"));
      profileBtn.setAttribute("title", translate("Profile & Settings", "global"));
    }
  }

  function emitChanged() {
    document.dispatchEvent(
      new CustomEvent("clw:locale-changed", {
        detail: { locale: locale, userKey: currentUserKey }
      })
    );
    applySiteChromeLabels();
  }

  function setLocale(next) {
    locale = next === "zh" ? "zh" : "en";
    writeForUserKey(currentUserKey, locale);
    emitChanged();
  }

  function onAuthChanged() {
    loadForCurrentUser();
    emitChanged();
  }

  function onReadySync() {
    loadForCurrentUser();
    emitChanged();
  }

  window.CLWLocale = {
    getLocale: getLocale,
    setLocale: setLocale,
    translate: translate,
    applySiteChromeLabels: applySiteChromeLabels
  };

  loadForCurrentUser();
  document.addEventListener("DOMContentLoaded", onReadySync);
  document.addEventListener("site:components-ready", onReadySync);
  document.addEventListener("clw:auth-changed", onAuthChanged);
})();
