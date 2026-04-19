/**
 * Injects shared HTML (navbar / footer).
 * Over HTTP: loads from components/*.html via fetch.
 * file://: uses EMBEDDED_* below (must match components — see scripts/sync-fragments.mjs).
 *
 * After editing components/navbar.html or components/footer.html, run:
 *   node scripts/sync-fragments.mjs
 */
(function () {
  "use strict";
  // --- BEGIN AUTO-GENERATED (node scripts/sync-fragments.mjs) ---
  var EMBEDDED_NAVBAR = "<div class=\"site-header__inner\">\r\n  <div class=\"site-header__end\">\r\n    <button type=\"button\" class=\"site-nav__toggle\" data-nav-toggle aria-expanded=\"false\" aria-controls=\"primary-nav\">\r\n      Menu\r\n    </button>\r\n    <nav class=\"site-nav\" id=\"primary-nav\" aria-label=\"Primary\">\r\n      <ul class=\"site-nav__list\">\r\n        <li><a class=\"site-nav__link\" href=\"index.html\" data-nav=\"index.html\">Home</a></li>\r\n        <li><a class=\"site-nav__link\" href=\"learning.html\" data-nav=\"learning.html\">Learn</a></li>\r\n        <li><a class=\"site-nav__link\" href=\"game.html\" data-nav=\"game.html\">Game</a></li>\r\n        <li><a class=\"site-nav__link\" href=\"test.html\" data-nav=\"test.html\">Test</a></li>\r\n        <li><a class=\"site-nav__link\" href=\"community.html\" data-nav=\"community.html\">Community</a></li>\r\n      </ul>\r\n    </nav>\r\n    <div class=\"user-menu\" data-user-menu>\r\n      <button\r\n        type=\"button\"\r\n        class=\"user-menu-trigger\"\r\n        aria-label=\"Account\"\r\n        title=\"Log in\"\r\n        data-auth-trigger\r\n        aria-haspopup=\"true\"\r\n        aria-expanded=\"false\"\r\n      >\r\n        <span class=\"user-avatar user-avatar--placeholder\" data-user-avatar aria-hidden=\"true\"></span>\r\n      </button>\r\n      <div class=\"user-menu__dropdown\" data-user-dropdown hidden>\r\n        <button type=\"button\" class=\"user-menu__logout\" data-auth-logout>Log out</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>";
  var EMBEDDED_FOOTER = "<div class=\"site-footer__inner\">\r\n  <p>Color Learning · Course project · <span id=\"footer-year\"></span></p>\r\n</div>";
  // --- END AUTO-GENERATED ---




  async function loadFragment(targetSelector, url, embeddedHtml) {
    var el = document.querySelector(targetSelector);
    if (!el) return;
    try {
      var res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn("[main.js] fetch failed, using embedded fragment:", url, e);
      if (embeddedHtml) {
        el.innerHTML = embeddedHtml;
      } else {
        el.innerHTML =
          '<p class="load-error" style="padding:1rem;background:#fef2f2;color:#991b1b;font-size:0.875rem;">Could not load this component.</p>';
      }
    }
  }

  function ensureFluidCanvas() {
    if (!document.body) return null;

    var canvas = document.getElementById("fluid-canvas");
    if (canvas) return canvas;

    canvas = document.createElement("canvas");
    canvas.id = "fluid-canvas";
    canvas.className = "fluid-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.insertBefore(canvas, document.body.firstChild);
    return canvas;
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      var script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.addEventListener("load", function () {
        script.dataset.loaded = "true";
        resolve();
      }, { once: true });
      script.addEventListener("error", function () {
        reject(new Error("Failed to load " + src));
      }, { once: true });
      document.head.appendChild(script);
    });
  }

  function initFluidBackground() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return Promise.resolve();
    }

    ensureFluidCanvas();
    return loadScriptOnce("js/fluid-background.js").catch(function (error) {
      console.warn("[main.js] fluid background init failed:", error);
    });
  }

  document.addEventListener("DOMContentLoaded", async function () {
    initFluidBackground();
    await loadFragment("#site-navbar", "components/navbar.html", EMBEDDED_NAVBAR);
    await loadFragment("#site-footer", "components/footer.html", EMBEDDED_FOOTER);

    var yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    var pageName = window.location.pathname.split("/").pop();
    if (pageName === "game.html") {
      var openDrawing = new URLSearchParams(window.location.search).get("openDrawing");
      if (/^\d+$/.test(openDrawing || "")) {
        var drawingBtn = document.querySelector('[data-open-drawing="' + openDrawing + '"]');
        if (drawingBtn) drawingBtn.click();
      }
    }
    if (pageName === "test-quiz.html") {
      var hq = new URLSearchParams(window.location.search).get("hq");
      if (/^\d+$/.test(hq || "")) {
        var questionIndex = Number(hq);
        var attempts = 0;
        var timer = setInterval(function () {
          attempts += 1;
          var jumpBtn = document.querySelector('[data-quiz-jump="' + questionIndex + '"]');
          if (jumpBtn) {
            jumpBtn.click();
            clearInterval(timer);
            if (window.history && window.history.replaceState) {
              var nextParams = new URLSearchParams(window.location.search);
              nextParams.delete("hq");
              var nextQuery = nextParams.toString();
              window.history.replaceState(null, "", window.location.pathname + (nextQuery ? "?" + nextQuery : ""));
            }
            return;
          }
          if (attempts >= 50) clearInterval(timer);
        }, 80);
      }
    }

    document.dispatchEvent(new CustomEvent("site:components-ready"));
  });
})();
