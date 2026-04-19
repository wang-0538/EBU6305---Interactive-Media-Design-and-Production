/**
 * Navbar: highlight current page, mobile menu toggle.
 */
(function () {
  "use strict";

  function setActiveNav() {
    const path = window.location.pathname.replace(/\\/g, "/");
    const file = path.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".site-nav__link[data-nav]");
    links.forEach(function (a) {
      const target = a.getAttribute("data-nav");
      if (!target) return;
      const testSubpage =
        target === "test.html" &&
        /^test(?:-[a-z]+)?\.html$/i.test(file);
      const communitySubpage =
        target === "community.html" &&
        /^community(?:-[a-z]+)?\.html$/i.test(file);
      const match =
        target === file ||
        testSubpage ||
        communitySubpage ||
        (file === "" && target === "index.html");
      a.classList.toggle("is-active", match);
    });
  }

  function bindMobileToggle() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      const open = nav.classList.contains("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function init() {
    setActiveNav();
    bindMobileToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("site:components-ready", function () {
    setActiveNav();
    bindMobileToggle();
  });
})();
