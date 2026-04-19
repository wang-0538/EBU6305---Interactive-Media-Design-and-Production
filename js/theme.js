/**
 * Site color themes: each theme is five gradient stops (deepest → lightest).
 * Persists choice in localStorage; applied on every page load.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "clw_theme_id";

  /**
   * @typedef {{ id: string, swatch: string, stops: string[], primaryHover: string }} ThemeGroup
   */
  var THEME_REGISTRY = {
    blue: {
      id: "blue",
      swatch: "#00b4d8",
      stops: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"],
      primaryHover: "#006199"
    },
    teal: {
      id: "teal",
      swatch: "#68d8d6",
      stops: ["#07beb8", "#3dccc7", "#68d8d6", "#9ceaef", "#c4fff9"],
      primaryHover: "#049688"
    },
    rose: {
      id: "rose",
      swatch: "#ffb3c6",
      stops: ["#fb6f92", "#ff8fab", "#ffb3c6", "#ffc2d1", "#ffe5ec"],
      primaryHover: "#d94d72"
    },
    pastel: {
      id: "pastel",
      swatch: "#bbd0ff",
      stops: ["#bbd0ff", "#b8c0ff", "#c8b6ff", "#e7c6ff", "#ffd6ff"],
      primaryHover: "#9fabe8"
    },
    amber: {
      id: "amber",
      swatch: "#ff9505",
      stops: ["#cc5803", "#e2711d", "#ff9505", "#ffb627", "#ffc971"],
      primaryHover: "#d67a04"
    }
  };

  var currentId = "blue";

  function normalizeHex(hex) {
    return hex.trim().toLowerCase();
  }

  function resolveThemeId(id) {
    if (id && THEME_REGISTRY[id]) return id;
    return "blue";
  }

  function readStoredThemeId() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw && THEME_REGISTRY[raw]) return raw;
    } catch (e) {
      /* ignore */
    }
    return "";
  }

  function applyTheme(themeId) {
    var id = resolveThemeId(themeId);
    var t = THEME_REGISTRY[id];
    currentId = id;
    var root = document.documentElement;
    root.style.setProperty("--theme-stop-1", normalizeHex(t.stops[0]));
    root.style.setProperty("--theme-stop-2", normalizeHex(t.stops[1]));
    root.style.setProperty("--theme-stop-3", normalizeHex(t.stops[2]));
    root.style.setProperty("--theme-stop-4", normalizeHex(t.stops[3]));
    root.style.setProperty("--theme-stop-5", normalizeHex(t.stops[4]));
    root.style.setProperty("--color-primary-hover", normalizeHex(t.primaryHover));
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (err) {
      /* ignore */
    }
  }

  function pickRandomThemeId() {
    var ids = Object.keys(THEME_REGISTRY);
    if (!ids.length) return "blue";
    if (ids.length === 1) return ids[0];
    var nextId = currentId;
    while (nextId === currentId) {
      nextId = ids[Math.floor(Math.random() * ids.length)];
    }
    return nextId;
  }

  var storedThemeId = readStoredThemeId();
  currentId = storedThemeId || pickRandomThemeId();
  applyTheme(currentId);

  window.CLWTheme = {
    /** @param {string} themeId */
    applyTheme: function (themeId) {
      applyTheme(themeId);
    },
    getCurrentId: function () {
      return currentId;
    },
    getRegistry: function () {
      return THEME_REGISTRY;
    },
    applyRandomTheme: function () {
      applyTheme(currentId);
    }
  };
})();
