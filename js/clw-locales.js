/**
 * Site locale (en | zh): per-user preference in localStorage, synced on auth.
 * Test module strings use translateTest() against window.CLW_TEST_ZH (plain en → zh map).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "clw_locale_by_user_v1";

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
    all[userKey] = locale;
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

  function emitChanged() {
    document.dispatchEvent(
      new CustomEvent("clw:locale-changed", {
        detail: { locale: locale, userKey: currentUserKey }
      })
    );
    applySiteChromeLabels();
  }

  function getLocale() {
    return locale === "zh" ? "zh" : "en";
  }

  function setLocale(next) {
    var v = next === "zh" ? "zh" : "en";
    locale = v;
    writeForUserKey(currentUserKey, v);
    emitChanged();
  }

  function getTestZhTable() {
    if (window.CLW_TEST_ZH && typeof window.CLW_TEST_ZH === "object") return window.CLW_TEST_ZH;
    return null;
  }

  function applySiteChromeLabels() {
    var loc = getLocale();
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
      if (key) a.textContent = loc === "zh" ? translateTest(key) : key;
    }
    var toggle = document.querySelector("[data-nav-toggle]");
    if (toggle) {
      if (!Object.prototype.hasOwnProperty.call(toggle.dataset, "clwMenuEn")) {
        toggle.dataset.clwMenuEn = toggle.textContent.trim();
      }
      toggle.textContent = loc === "zh" ? translateTest("Menu") : toggle.dataset.clwMenuEn;
    }
    var footerInner = document.querySelector(".site-footer__inner");
    if (footerInner) {
      var yearEl = document.getElementById("footer-year");
      var y = yearEl && yearEl.textContent ? yearEl.textContent : String(new Date().getFullYear());
      if (loc === "zh") {
        footerInner.innerHTML =
          "<p>" +
          translateTest("Color Learning · Course project · ") +
          '<span id="footer-year">' +
          y +
          "</span></p>";
      } else {
        footerInner.innerHTML =
          '<p>Color Learning · Course project · <span id="footer-year">' + y + "</span></p>";
      }
    }
    var profileBtn = document.querySelector("[data-profile-settings-trigger]");
    if (profileBtn) {
      if (!profileBtn.dataset.clwAriaEn) profileBtn.dataset.clwAriaEn = profileBtn.getAttribute("aria-label") || "";
      if (!profileBtn.dataset.clwTitleEn) profileBtn.dataset.clwTitleEn = profileBtn.getAttribute("title") || "";
      if (loc === "zh") {
        profileBtn.setAttribute("aria-label", translateTest("Open Profile and Settings"));
        profileBtn.setAttribute("title", translateTest("Profile & Settings"));
      } else {
        profileBtn.setAttribute("aria-label", profileBtn.dataset.clwAriaEn);
        profileBtn.setAttribute("title", profileBtn.dataset.clwTitleEn);
      }
    }
  }

  /**
   * @param {string} english
   * @returns {string}
   */
  function translateTest(english) {
    if (english == null) return "";
    var s = String(english);
    if (locale !== "zh") return s;
    var t = getTestZhTable();
    if (!t) return s;
    var out = t[s];
    return typeof out === "string" && out.length ? out : s;
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
    translateTest: translateTest,
    applySiteChromeLabels: applySiteChromeLabels
  };

  loadForCurrentUser();
  document.addEventListener("DOMContentLoaded", onReadySync);
  document.addEventListener("site:components-ready", onReadySync);
  document.addEventListener("clw:auth-changed", onAuthChanged);
})();
