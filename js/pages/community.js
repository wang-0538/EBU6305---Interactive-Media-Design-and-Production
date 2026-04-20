/**
 * Community page v2:
 * - Learning-oriented filters and cross-page draft integration
 * - Weekly leaderboard from global activity events
 * - Lightweight moderation actions (hide/report/feature simulation)
 */
(function () {
  "use strict";

  var STORAGE = {
    currentUser: "clw_current_user",
    accounts: "clw_accounts_v1",
    activityLog: "clw_activity_log_v1",
    posts: "clw_posts_v3",
    legacyPostsV2: "clw_posts_v2",
    legacyPostsV1: "clw_posts_v1",
    draft: "clw_community_draft_v1",
    reports: "clw_community_reports_v1",
    hiddenPosts: "clw_community_hidden_posts_v1",
    rankSnapshot: "clw_community_rank_snapshot_v1"
  };

  var POINTS_PER_POST = 5;
  var DEFAULT_FILTER = "latest";
  var DEFAULT_TAG = "#Accessibility";
  var DEFAULT_COLOR = "#2b78e4";
  var MIN_POST_LENGTH = 8;
  var MAX_POST_LENGTH = 500;
  var SUBMIT_COOLDOWN_MS = 2500;
  var LIKE_COOLDOWN_MS = 600;

  var seedPosts = [
    {
      id: "seed_1",
      author: "studentA",
      content: "Low contrast text can fail accessibility quickly. I now test pairs before publishing.",
      tag: "#Accessibility",
      colorHex: "#2b78e4",
      likes: 12,
      likedBy: [],
      pointsAwarded: 5,
      createdAt: "2026-04-09T06:00:00.000Z",
      origin: "learning",
      originMeta: { section: "Color accessibility primer" },
      featured: true
    },
    {
      id: "seed_2",
      author: "studentB",
      content: "HSV helped me quickly compare hue families before locking export values in RGB.",
      tag: "#RGB_HSV",
      colorHex: "#1e4fb0",
      likes: 8,
      likedBy: [],
      pointsAwarded: 5,
      createdAt: "2026-04-09T03:30:00.000Z",
      origin: "test",
      originMeta: { chapter: "Color Models", score: 22, accuracy: 0.78 },
      featured: false
    }
  ];

  var baseLeaderboard = {
    studentA: 120,
    studentB: 95,
    studentC: 82
  };

  var state = {
    posts: [],
    filter: DEFAULT_FILTER,
    selectedTag: DEFAULT_TAG,
    selectedPostId: "",
    submitLockUntil: 0,
    likeLocks: {},
    toastTimer: 0
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      console.warn("[community.js] readJSON failed:", key, error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("[community.js] writeJSON failed:", key, error);
    }
  }

  function getAuthApi() {
    return window.CLWAuth || null;
  }

  function isLoggedIn() {
    return !!(getAuthApi() && getAuthApi().isLoggedIn && getAuthApi().isLoggedIn());
  }

  function getCurrentUsername() {
    var auth = getAuthApi();
    if (auth && auth.getCurrentUsername) return auth.getCurrentUsername();
    var user = readJSON(STORAGE.currentUser, null);
    if (user && typeof user.username === "string" && user.username.trim()) return user.username.trim();
    return "Guest";
  }

  function getAccountsStore() {
    var raw = readJSON(STORAGE.accounts, { users: {} });
    if (!raw || typeof raw !== "object" || !raw.users || typeof raw.users !== "object") {
      return { users: {} };
    }
    return raw;
  }

  function normalizeHex(value) {
    if (!value) return DEFAULT_COLOR;
    var hex = String(value).trim().toLowerCase();
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (!/^#[0-9a-f]{6}$/.test(hex)) return DEFAULT_COLOR;
    return hex;
  }

  function normalizePaletteList(list, fallbackHex) {
    var rows = Array.isArray(list) ? list : [];
    var normalized = [];
    rows.forEach(function (item) {
      if (item == null) return;
      var text = String(item).trim().toLowerCase();
      if (!text) return;
      if (!text.startsWith("#")) text = "#" + text;
      if (!/^#[0-9a-f]{6}$/.test(text)) return;
      normalized.push(text);
    });
    if (!normalized.length) normalized.push(normalizeHex(fallbackHex || DEFAULT_COLOR));
    return normalized.slice(0, 24);
  }

  function sanitizeImageDataUrl(value) {
    if (!value) return "";
    var text = String(value);
    return text.indexOf("data:image/") === 0 ? text : "";
  }

  function parsePaletteInput(text, fallbackHex) {
    if (!text) return normalizePaletteList([], fallbackHex);
    var raw = String(text).trim().toLowerCase();
    if (!raw) return normalizePaletteList([], fallbackHex);

    var source = raw;
    var palettePathMatch = source.match(/coolors\.co\/palette\/([0-9a-f\-]+)/i);
    if (palettePathMatch && palettePathMatch[1]) {
      source = palettePathMatch[1];
    } else if (source.indexOf("coolors.co/") >= 0) {
      var fromCoolors = source.split("coolors.co/")[1] || "";
      source = fromCoolors.split("?")[0].split("#")[0];
    }
    source = source.split("?")[0].split("#")[0];

    var parts;
    if (source.indexOf("-") >= 0 && source.indexOf(",") < 0) {
      parts = source.split("-");
    } else {
      parts = source.split(/[,\s]+/);
    }
    return normalizePaletteList(parts, fallbackHex);
  }

  function paletteToInputText(list) {
    return normalizePaletteList(list, DEFAULT_COLOR)
      .map(function (hex) { return hex.replace("#", ""); })
      .join("-");
  }

  function readPaletteFromHiddenInput() {
    var input = document.querySelector("[data-palette-input]");
    if (!input) return [DEFAULT_COLOR];
    return parsePaletteInput(input.value, DEFAULT_COLOR);
  }

  function writePaletteToHiddenInput(colors) {
    var input = document.querySelector("[data-palette-input]");
    if (!input) return;
    input.value = paletteToInputText(colors);
  }

  function syncPrimaryColorInputs(colors) {
    var palette = normalizePaletteList(colors, DEFAULT_COLOR);
    var first = palette[0] || DEFAULT_COLOR;
    var colorPicker = document.querySelector("[data-color-picker]");
    var hexInput = document.querySelector("[data-color-hex]");
    if (colorPicker) colorPicker.value = first;
    if (hexInput) hexInput.value = first;
  }

  function setComposerPalette(colors, persist) {
    var palette = normalizePaletteList(colors, DEFAULT_COLOR);
    writePaletteToHiddenInput(palette);
    syncPrimaryColorInputs(palette);
    renderPaletteBuilder(palette);
    if (persist) persistComposerDraft();
  }

  function renderPaletteBuilder(colors) {
    var row = document.querySelector("[data-palette-row]");
    if (!row) return;
    var palette = normalizePaletteList(colors, DEFAULT_COLOR);
    row.innerHTML =
      '<div class="palette-strip" role="list" aria-label="Palette colors">' +
      palette
        .map(function (hex, index) {
          var displayHex = normalizeHex(hex).replace("#", "").toUpperCase();
          var textColor = getContrastText(hex);
          return (
            '<div class="palette-strip__cell" role="listitem" data-palette-cell="' + index + '">' +
              '<button type="button" class="palette-strip__block" data-palette-block="' + index + '" style="background:' + hex + ';color:' + textColor + '" aria-label="Edit color ' + hex + '">' +
                '<span class="palette-strip__hex">' + displayHex + "</span>" +
              "</button>" +
              '<div class="palette-strip__actions" style="color:' + textColor + '">' +
                '<button type="button" class="palette-strip__action palette-strip__action--danger" data-palette-delete="' + index + '" aria-label="Delete color ' + hex + '">Delete</button>' +
              "</div>" +
            "</div>"
          );
        })
        .join("") +
      '<button type="button" class="palette-strip__add" role="listitem" data-palette-add aria-label="Add palette color">+</button>' +
      "</div>";
  }

  function copyText(text) {
    var content = String(text || "");
    if (!content) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(content).then(function () { return true; }).catch(function () { return false; });
    }
    var input = document.createElement("textarea");
    input.value = content;
    input.setAttribute("readonly", "readonly");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(input);
    return Promise.resolve(ok);
  }

  function openNativeColorPicker(initialHex, onChange) {
    var picker = document.createElement("input");
    picker.type = "color";
    picker.value = normalizeHex(initialHex || DEFAULT_COLOR);
    picker.style.position = "fixed";
    picker.style.width = "1px";
    picker.style.height = "1px";
    picker.style.opacity = "0";
    picker.style.pointerEvents = "none";
    picker.style.left = "-9999px";
    picker.style.top = "-9999px";

    var cleaned = false;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      if (picker.parentNode) picker.parentNode.removeChild(picker);
    }

    picker.addEventListener("input", function () {
      onChange(normalizeHex(picker.value));
    });
    picker.addEventListener("change", cleanup, { once: true });
    picker.addEventListener("blur", cleanup, { once: true });

    document.body.appendChild(picker);
    picker.click();
  }

  function extractPaletteFromImageDataUrl(dataUrl, count) {
    return new Promise(function (resolve) {
      var safe = sanitizeImageDataUrl(dataUrl);
      if (!safe) {
        resolve([]);
        return;
      }
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var size = 56;
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve([]);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        var pixels = ctx.getImageData(0, 0, size, size).data;
        var buckets = {};
        for (var i = 0; i < pixels.length; i += 4) {
          var r = pixels[i];
          var g = pixels[i + 1];
          var b = pixels[i + 2];
          var a = pixels[i + 3];
          if (a < 24) continue;
          var qr = Math.round(r / 32) * 32;
          var qg = Math.round(g / 32) * 32;
          var qb = Math.round(b / 32) * 32;
          var key = toHex(Math.min(255, qr)) + toHex(Math.min(255, qg)) + toHex(Math.min(255, qb));
          buckets[key] = (buckets[key] || 0) + 1;
        }
        var sorted = Object.keys(buckets)
          .sort(function (a, b) { return buckets[b] - buckets[a]; })
          .slice(0, count || 5)
          .map(function (key) { return normalizeHex(key); });
        resolve(normalizePaletteList(sorted, DEFAULT_COLOR));
      };
      img.onerror = function () {
        resolve([]);
      };
      img.src = safe;
    });
  }

  function normalizePost(post) {
    var colorHex = normalizeHex(post && post.colorHex ? post.colorHex : DEFAULT_COLOR);
    var paletteHexes = normalizePaletteList(
      post && post.paletteHexes ? post.paletteHexes : [colorHex],
      colorHex
    );
    return {
      id: String(post && post.id ? post.id : createId()),
      author: String(post && post.author ? post.author : "Guest"),
      content: String(post && post.content ? post.content : "").trim().slice(0, MAX_POST_LENGTH),
      tag: String(post && post.tag ? post.tag : DEFAULT_TAG),
      colorHex: colorHex,
      paletteHexes: paletteHexes,
      imageDataUrl: sanitizeImageDataUrl(post && post.imageDataUrl ? post.imageDataUrl : ""),
      likes: Math.max(0, Number(post && post.likes ? post.likes : 0)),
      likedBy: Array.isArray(post && post.likedBy)
        ? Array.from(new Set(post.likedBy.map(function (item) { return typeof item === "string" ? item.trim() : ""; }).filter(Boolean)))
        : [],
      pointsAwarded: Math.max(0, Number(post && post.pointsAwarded ? post.pointsAwarded : POINTS_PER_POST)),
      createdAt: post && post.createdAt ? post.createdAt : new Date().toISOString(),
      origin: post && post.origin ? String(post.origin) : "community",
      originMeta: post && post.originMeta && typeof post.originMeta === "object" ? post.originMeta : {},
      featured: !!(post && post.featured)
    };
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function createId() {
    return "post_" + Date.now() + "_" + Math.random().toString(16).slice(2, 8);
  }

  function timeAgo(isoString) {
    var ts = Date.parse(isoString);
    if (Number.isNaN(ts)) return "just now";
    var diffMs = Date.now() - ts;
    var mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    var hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h ago";
    return Math.floor(hours / 24) + "d ago";
  }

  function toRgb(hex) {
    var value = normalizeHex(hex).replace("#", "");
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function toHex(value) {
    return Number(value).toString(16).padStart(2, "0");
  }

  function getContrastText(hex) {
    var rgb = toRgb(hex);
    var luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    return luminance > 0.62 ? "#0f172a" : "#ffffff";
  }

  function getCommunityView() {
    return document.body && document.body.getAttribute("data-community-view") === "all" ? "all" : "preview";
  }

  function isMobileViewport() {
    return !!(window.matchMedia && window.matchMedia("(max-width: 48rem)").matches);
  }

  function updateOverlayScrollLock() {
    var body = document.body;
    if (!body) return;
    var hasGuidelinesOpen = false;
    var hasLightboxOpen = false;
    var guidelines = document.querySelector("[data-guidelines-modal]");
    var lightbox = document.querySelector("[data-image-lightbox]");
    if (guidelines && !guidelines.hidden) hasGuidelinesOpen = true;
    if (lightbox && !lightbox.hidden) hasLightboxOpen = true;
    body.classList.toggle("is-scroll-locked", hasGuidelinesOpen || hasLightboxOpen);
  }

  function readPosts() {
    var saved = readJSON(STORAGE.posts, null);
    if (!Array.isArray(saved)) saved = readJSON(STORAGE.legacyPostsV2, null);
    if (!Array.isArray(saved)) saved = readJSON(STORAGE.legacyPostsV1, null);
    if (!Array.isArray(saved) || !saved.length) saved = seedPosts.slice();
    saved = saved.map(normalizePost).filter(function (post) { return !!post.content; });
    writeJSON(STORAGE.posts, saved);
    return saved;
  }

  function writePosts(posts) {
    state.posts = posts.map(normalizePost);
    writeJSON(STORAGE.posts, state.posts);
  }

  function readHiddenMap() {
    var raw = readJSON(STORAGE.hiddenPosts, {});
    return raw && typeof raw === "object" ? raw : {};
  }

  function writeHiddenMap(map) {
    writeJSON(STORAGE.hiddenPosts, map || {});
  }

  function isPostHiddenForUser(postId, username) {
    if (!postId || !username || username === "Guest") return false;
    var map = readHiddenMap();
    var list = Array.isArray(map[username]) ? map[username] : [];
    return list.indexOf(postId) >= 0;
  }

  function toggleHidePost(postId) {
    var username = getCurrentUsername();
    if (!username || username === "Guest") return;
    var map = readHiddenMap();
    var list = Array.isArray(map[username]) ? map[username].slice() : [];
    var idx = list.indexOf(postId);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(postId);
    map[username] = list;
    writeHiddenMap(map);
  }
  function reportPost(postId) {
    var reporter = getCurrentUsername();
    if (!reporter || reporter === "Guest") return false;
    var rows = readJSON(STORAGE.reports, []);
    rows = Array.isArray(rows) ? rows : [];
    for (var i = 0; i < rows.length; i += 1) {
      if (rows[i].postId === postId && rows[i].reporter === reporter) return false;
    }
    rows.unshift({
      id: "report_" + Date.now() + "_" + Math.random().toString(16).slice(2, 6),
      postId: postId,
      reporter: reporter,
      createdAt: new Date().toISOString()
    });
    writeJSON(STORAGE.reports, rows.slice(0, 400));
    return true;
  }

  function readDraft() {
    var raw = readJSON(STORAGE.draft, null);
    if (!raw || typeof raw !== "object") return null;
    var colorHex = normalizeHex(raw.colorHex || DEFAULT_COLOR);
    return {
      content: String(raw.content || ""),
      tag: String(raw.tag || DEFAULT_TAG),
      colorHex: colorHex,
      paletteHexes: normalizePaletteList(raw.paletteHexes || [colorHex], colorHex),
      imageDataUrl: sanitizeImageDataUrl(raw.imageDataUrl || ""),
      origin: raw.origin ? String(raw.origin) : "",
      originMeta: raw.originMeta && typeof raw.originMeta === "object" ? raw.originMeta : {},
      updatedAt: raw.updatedAt || ""
    };
  }

  function writeDraft(draft) {
    if (!draft || typeof draft !== "object") {
      localStorage.removeItem(STORAGE.draft);
      return;
    }
    writeJSON(STORAGE.draft, {
      content: String(draft.content || "").slice(0, MAX_POST_LENGTH),
      tag: String(draft.tag || DEFAULT_TAG),
      colorHex: normalizeHex(draft.colorHex || DEFAULT_COLOR),
      paletteHexes: normalizePaletteList(draft.paletteHexes || [draft.colorHex || DEFAULT_COLOR], draft.colorHex || DEFAULT_COLOR),
      imageDataUrl: sanitizeImageDataUrl(draft.imageDataUrl || ""),
      origin: draft.origin ? String(draft.origin) : "community",
      originMeta: draft.originMeta && typeof draft.originMeta === "object" ? draft.originMeta : {},
      updatedAt: new Date().toISOString()
    });
  }

  function getUserTagSet(username) {
    var set = {};
    state.posts.forEach(function (post) {
      if (post.author !== username) return;
      set[post.tag] = true;
    });
    return Object.keys(set);
  }

  function getHelpfulScore(post) {
    var likes = Number(post.likes || 0);
    var featuredBoost = post.featured ? 8 : 0;
    var originBoost = post.origin && post.origin !== "community" ? 2 : 0;
    return likes * 2 + featuredBoost + originBoost;
  }

  function sortPosts(posts) {
    var rows = posts.slice();
    var user = getCurrentUsername();
    if (state.filter === "my-tags") {
      var myTags = getUserTagSet(user);
      if (!myTags.length) return [];
      rows = rows.filter(function (post) { return myTags.indexOf(post.tag) >= 0; });
    } else if (state.filter.charAt(0) === "#") {
      rows = rows.filter(function (post) { return post.tag === state.filter; });
    }

    rows.sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      if (state.filter === "helpful") {
        var helpfulDelta = getHelpfulScore(b) - getHelpfulScore(a);
        if (helpfulDelta !== 0) return helpfulDelta;
      }
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
    return rows;
  }

  function getActivityLog() {
    var rows = readJSON(STORAGE.activityLog, []);
    return Array.isArray(rows) ? rows : [];
  }

  function getWeeklyPointsMap() {
    var cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    var map = {};
    getActivityLog().forEach(function (item) {
      if (!item || !item.username) return;
      var ts = Date.parse(item.createdAt || "");
      if (Number.isNaN(ts) || ts < cutoff) return;
      var delta = Number(item.pointsDelta || 0);
      if (Number.isNaN(delta)) return;
      map[item.username] = Number(map[item.username] || 0) + delta;
    });
    return map;
  }

  function getTotalPointsMap() {
    var map = {};
    var accounts = getAccountsStore();
    Object.keys(baseLeaderboard).forEach(function (username) {
      map[username] = Number(baseLeaderboard[username] || 0);
    });
    Object.keys(accounts.users).forEach(function (username) {
      var points = Number(accounts.users[username] && accounts.users[username].stats ? accounts.users[username].stats.points || 0 : 0);
      map[username] = Number(map[username] || 0) + (Number.isNaN(points) ? 0 : points);
    });
    state.posts.forEach(function (post) {
      if (!post || !post.author) return;
      if (!map[post.author]) map[post.author] = Number(baseLeaderboard[post.author] || 0);
    });
    return map;
  }

  function toSortedRows(pointsMap, limit) {
    var rows = Object.keys(pointsMap).map(function (username) {
      return { username: username, points: Number(pointsMap[username] || 0) };
    });
    rows.sort(function (a, b) {
      if (b.points !== a.points) return b.points - a.points;
      return a.username.localeCompare(b.username);
    });
    return typeof limit === "number" ? rows.slice(0, limit) : rows;
  }

  function setFeedback(message, kind) {
    var el = document.querySelector("[data-community-feedback]");
    if (!el) return;
    el.classList.remove("is-error", "is-success");
    el.textContent = message || "";
    if (kind === "error" || kind === "success") el.classList.add("is-" + kind);
    showToast(message, kind);
  }

  function hideToast() {
    var toast = document.querySelector("[data-community-toast]");
    if (!toast) return;
    if (state.toastTimer) {
      clearTimeout(state.toastTimer);
      state.toastTimer = 0;
    }
    toast.hidden = true;
    toast.classList.remove("is-error", "is-success");
  }

  function showToast(message, kind) {
    var toast = document.querySelector("[data-community-toast]");
    var text = document.querySelector("[data-community-toast-message]");
    if (!toast || !text) return;

    if (!message) {
      hideToast();
      return;
    }

    if (state.toastTimer) clearTimeout(state.toastTimer);
    toast.classList.remove("is-error", "is-success");
    if (kind === "error" || kind === "success") toast.classList.add("is-" + kind);
    text.textContent = message;
    toast.hidden = false;
    state.toastTimer = setTimeout(function () {
      hideToast();
    }, 3000);
  }

  function updateCharCounter() {
    var input = document.querySelector("[data-post-content]");
    var counter = document.querySelector("[data-char-counter]");
    if (!input || !counter) return;
    counter.textContent = input.value.length + " / " + MAX_POST_LENGTH;
  }

  function updateDraftOriginLabel(draft) {
    var el = document.querySelector("[data-draft-origin]");
    if (!el) return;
    if (!draft || !draft.origin || draft.origin === "community") {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    var title = draft.origin.charAt(0).toUpperCase() + draft.origin.slice(1);
    el.hidden = false;
    el.textContent = "Draft imported from " + title + ".";
  }

  function setComposerImagePreview(imageDataUrl) {
    var wrap = document.querySelector("[data-image-preview-wrap]");
    var img = document.querySelector("[data-image-preview]");
    if (!wrap || !img) return;
    var safe = sanitizeImageDataUrl(imageDataUrl);
    if (!safe) {
      wrap.hidden = true;
      img.src = "";
      return;
    }
    img.src = safe;
    wrap.hidden = false;
  }

  function updateComposerState() {
    var button = document.querySelector(".btn-post");
    if (!button) return;
    button.disabled = !isLoggedIn();
    button.textContent = isLoggedIn() ? "Post and Earn 5 points" : "Log in to Post";
  }

  function getActorId() {
    return isLoggedIn() ? getCurrentUsername() : "";
  }

  function hasLiked(post) {
    var actor = getActorId();
    if (!actor || !post || !Array.isArray(post.likedBy)) return false;
    return post.likedBy.indexOf(actor) >= 0;
  }

  function formatOrigin(post) {
    var source = post.origin || "community";
    var label = source.charAt(0).toUpperCase() + source.slice(1);
    var extra = "";
    if (source === "test" && post.originMeta && typeof post.originMeta.score === "number") {
      extra = "score " + post.originMeta.score;
    } else if (source === "game" && post.originMeta && post.originMeta.drawingName) {
      extra = post.originMeta.drawingName;
    } else if (source === "learning" && post.originMeta && post.originMeta.section) {
      extra = post.originMeta.section;
    }
    return extra ? label + " · " + extra : label;
  }

  function renderOriginMetaHtml(post) {
    if (!post || !post.originMeta) return "";
    if (post.origin === "test") {
      var chapter = post.originMeta.chapter ? escapeHtml(String(post.originMeta.chapter)) : "Test";
      var score = Number(post.originMeta.score || 0);
      var maxScore = Number(post.originMeta.maxScore || 0);
      var accuracy = Number(post.originMeta.accuracy || 0);
      return '<div class="post-origin-meta"><strong>Test Result:</strong> ' + chapter + " · Score " + score + "/" + maxScore + " · Accuracy " + accuracy + "%</div>";
    }
    if (post.origin === "game" && post.originMeta.drawingName) {
      return '<div class="post-origin-meta"><strong>Game Artwork:</strong> ' + escapeHtml(String(post.originMeta.drawingName)) + "</div>";
    }
    return "";
  }

  function renderPaletteHtml(post) {
    var palette = normalizePaletteList(post && post.paletteHexes ? post.paletteHexes : [post.colorHex], post.colorHex);
    return (
      '<div class="post-palette" role="list" aria-label="Post palette colors">' +
      palette.map(function (hex, index) {
        var displayHex = normalizeHex(hex).replace("#", "").toUpperCase();
        var textColor = getContrastText(hex);
        return (
          '<div class="post-palette__cell" role="listitem" data-post-palette-cell="' + index + '">' +
            '<div class="post-palette__block" style="background:' + hex + ';color:' + textColor + '" title="' + hex + '">' +
              '<span class="post-palette__hex">' + displayHex + "</span>" +
            "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderImageHtml(post) {
    var image = sanitizeImageDataUrl(post && post.imageDataUrl ? post.imageDataUrl : "");
    if (!image) return "";
    return (
      '<figure class="post-image">' +
      '<button type="button" class="post-image__zoom" data-image-zoom="' + image + '">' +
      '<img src="' + image + '" alt="Shared attachment for this post">' +
      "</button>" +
      "</figure>"
    );
  }

  function buildPostCardsHtml(rows, currentUser, options) {
    var opts = options || {};
    var selectable = !!opts.selectable;
    var selectedId = opts.selectedPostId || "";
    return rows
      .map(function (post) {
        var content = escapeHtml(post.content);
        var username = escapeHtml(post.author);
        var tag = escapeHtml(post.tag || "#General");
        var hex = normalizeHex(post.colorHex);
        var likes = Number(post.likes || 0);
        var points = Number(post.pointsAwarded || POINTS_PER_POST);
        var liked = hasLiked(post);
        var hidden = isPostHiddenForUser(post.id, currentUser);
        var originText = escapeHtml(formatOrigin(post));
        var initial = escapeHtml((post.author || "?").slice(0, 1).toUpperCase());
        var paletteHtml = renderPaletteHtml(post);
        var imageHtml = renderImageHtml(post);
        var originMetaHtml = renderOriginMetaHtml(post);
        var selected = selectable && selectedId === post.id;
        return (
          '<article class="post-card' + (post.featured ? ' is-featured' : '') + (hidden ? ' is-hidden' : '') + (selected ? ' is-selected' : '') + '"' + (selectable ? ' data-post-select="' + post.id + '"' : "") + ">" +
          '<header class="post-header">' +
          '<div class="post-user">' +
          '<span class="post-user__avatar" aria-hidden="true">' + initial + '</span>' +
          '<div>' +
          '<p class="post-user__name">' + username + '</p>' +
          '<div class="post-meta">' +
          '<button type="button" class="post-tag post-tag--button" data-filter-tag="' + tag + '">' + tag + '</button>' +
          '<span class="post-origin"><strong>From:</strong> ' + originText + '</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<span class="post-time">' + timeAgo(post.createdAt) + '</span>' +
          '</header>' +
          '<p class="post-content">' + (hidden ? 'This post is hidden for your account.' : content) + '</p>' +
          originMetaHtml +
          imageHtml +
          paletteHtml +
          '<footer class="post-footer">' +
          '<button type="button" class="like-btn' + (liked ? ' is-liked' : '') + '" data-like-id="' + post.id + '" aria-pressed="' + (liked ? 'true' : 'false') + '">' + (liked ? 'Liked ' : 'Like ') + likes + '</button>' +
          '<span class="post-points">Rewarded +' + points + ' pts</span>' +
          '<div class="post-actions">' +
          '<button type="button" class="post-action-btn' + (post.featured ? ' is-active' : '') + '" data-post-action="feature" data-post-id="' + post.id + '">' + (post.featured ? 'Featured' : 'Feature') + '</button>' +
          '<button type="button" class="post-action-btn" data-post-action="hide" data-post-id="' + post.id + '">' + (hidden ? 'Unhide' : 'Hide') + '</button>' +
          '<button type="button" class="post-action-btn" data-post-action="report" data-post-id="' + post.id + '">Report</button>' +
          '</div>' +
          '</footer>' +
          '</article>'
        );
      })
      .join("");
  }

  function renderPostDetail(post, currentUser) {
    var panel = document.querySelector("[data-post-detail]");
    if (!panel) return;
    if (!post) {
      panel.innerHTML = "<h2>Select a post</h2><p>Choose a post on the left to preview full details here.</p>";
      return;
    }
    panel.innerHTML = buildPostCardsHtml([post], currentUser, { selectable: false });
  }

  function renderPosts() {
    var container = document.querySelector("[data-post-list]");
    if (!container) return;
    var view = getCommunityView();
    var rows = sortPosts(state.posts);
    var currentUser = getCurrentUsername();

    if (!rows.length) {
      var emptyHtml =
        '<article class="post-card post-empty">' +
        '<h3>Start the first learning thread</h3>' +
        '<p>Share one insight from Learning, a result from Test, or a palette from Game.</p>' +
        '<button type="button" class="community-hero__cta" data-scroll-composer>Use this template</button>' +
        '</article>';
      container.innerHTML = emptyHtml;
      renderPostDetail(null, currentUser);
      return;
    }

    if (view === "all") {
      if (!state.selectedPostId || !rows.some(function (item) { return item.id === state.selectedPostId; })) {
        state.selectedPostId = rows[0].id;
      }
      container.innerHTML = buildPostCardsHtml(rows, currentUser, { selectable: true, selectedPostId: state.selectedPostId });
      var selectedPost = null;
      for (var i = 0; i < rows.length; i += 1) {
        if (rows[i].id === state.selectedPostId) {
          selectedPost = rows[i];
          break;
        }
      }
      renderPostDetail(selectedPost || rows[0], currentUser);
      return;
    }

    container.innerHTML = buildPostCardsHtml(rows.slice(0, 3), currentUser, { selectable: false });
  }

  function readRankSnapshot() {
    var raw = readJSON(STORAGE.rankSnapshot, { weeklyRanks: {} });
    return raw && typeof raw === "object" ? raw : { weeklyRanks: {} };
  }

  function writeRankSnapshot(snapshot) {
    writeJSON(STORAGE.rankSnapshot, snapshot || { weeklyRanks: {} });
  }

  function renderStats(weeklyRows) {
    var user = getCurrentUsername();
    var auth = getAuthApi();
    var authStats = auth && auth.getUserStats ? auth.getUserStats(user) : null;
    var postsMine = state.posts.filter(function (post) { return post.author === user; });
    var pointsEl = document.querySelector("[data-user-points]");
    var postsEl = document.querySelector("[data-user-posts]");
    var streakEl = document.querySelector("[data-user-streak]");
    var goalEl = document.querySelector("[data-user-goal]");
    var rankEl = document.querySelector("[data-rank-trend]");
    if (!pointsEl || !postsEl || !streakEl || !goalEl || !rankEl) return;

    var points = Number(authStats && authStats.points ? authStats.points : 0);
    var postCount = Number(authStats && authStats.postCount ? authStats.postCount : postsMine.length);
    var streak = Number(authStats && authStats.streakDays ? authStats.streakDays : 0);

    pointsEl.textContent = String(points);
    postsEl.textContent = String(postCount);

    if (!isLoggedIn()) {
      streakEl.textContent = "Log in to sync your progress across pages.";
      goalEl.textContent = "Today goal: log in and post one learning insight.";
      rankEl.textContent = "Weekly rank change: --";
      return;
    }

    streakEl.textContent = streak ? "Keep it up: " + streak + "-day streak active." : "Post today to start your streak.";

    var today = new Date().toISOString().slice(0, 10);
    var postedToday = postsMine.some(function (post) { return String(post.createdAt || "").slice(0, 10) === today; });
    goalEl.textContent = postedToday ? "Today goal completed. Great work!" : "Today goal: publish one post to keep momentum.";

    var currentWeeklyRank = 0;
    for (var i = 0; i < weeklyRows.length; i += 1) {
      if (weeklyRows[i].username === user) {
        currentWeeklyRank = i + 1;
        break;
      }
    }
    var snapshot = readRankSnapshot();
    var prevRank = Number(snapshot.weeklyRanks && snapshot.weeklyRanks[user] ? snapshot.weeklyRanks[user] : 0);
    if (!currentWeeklyRank) {
      rankEl.textContent = "Weekly rank change: --";
    } else if (!prevRank || prevRank === currentWeeklyRank) {
      rankEl.textContent = "Weekly rank: #" + currentWeeklyRank + " (stable)";
    } else if (currentWeeklyRank < prevRank) {
      rankEl.textContent = "Weekly rank change: ↑ " + (prevRank - currentWeeklyRank) + " (now #" + currentWeeklyRank + ")";
    } else {
      rankEl.textContent = "Weekly rank change: ↓ " + (currentWeeklyRank - prevRank) + " (now #" + currentWeeklyRank + ")";
    }

    var nextSnapshot = { weeklyRanks: Object.assign({}, snapshot.weeklyRanks || {}), updatedAt: new Date().toISOString() };
    weeklyRows.forEach(function (row, idx) { nextSnapshot.weeklyRanks[row.username] = idx + 1; });
    writeRankSnapshot(nextSnapshot);
  }

  function renderLeaderboards() {
    var weeklyEl = document.querySelector("[data-weekly-leaderboard-list]");
    var totalEl = document.querySelector("[data-total-leaderboard-list]");
    if (!weeklyEl || !totalEl) return;

    var weeklyRows = toSortedRows(getWeeklyPointsMap(), 6);
    var totalRows = toSortedRows(getTotalPointsMap(), 6);

    weeklyEl.innerHTML = weeklyRows.length
      ? weeklyRows.map(function (row) { return "<li><span>" + escapeHtml(row.username) + "</span><strong>" + row.points + " pts</strong></li>"; }).join("")
      : "<li><span>No activity yet</span><strong>0 pts</strong></li>";

    totalEl.innerHTML = totalRows.length
      ? totalRows.map(function (row) { return "<li><span>" + escapeHtml(row.username) + "</span><strong>" + row.points + " pts</strong></li>"; }).join("")
      : "<li><span>No users yet</span><strong>0 pts</strong></li>";

    renderStats(weeklyRows);
  }

  function refreshAll() {
    renderPosts();
    renderLeaderboards();
    updateComposerState();
    updateCharCounter();
  }

  function setFilter(filterValue) {
    state.filter = filterValue || DEFAULT_FILTER;
    document.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-filter") === state.filter);
    });
    renderPosts();
  }

  function getTagButtons() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-tag]"));
  }

  function setActiveTag(tagValue) {
    state.selectedTag = tagValue || DEFAULT_TAG;
    getTagButtons().forEach(function (btn) {
      var active = btn.getAttribute("data-tag") === state.selectedTag;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function syncHexInputs(fromPicker) {
    var colorPicker = document.querySelector("[data-color-picker]");
    var hexInput = document.querySelector("[data-color-hex]");
    if (!colorPicker || !hexInput) return;
    var palette = readPaletteFromHiddenInput();
    if (fromPicker) {
      var picked = normalizeHex(colorPicker.value);
      hexInput.value = picked;
      palette[0] = picked;
      setComposerPalette(palette, false);
      return;
    }
    var normalized = normalizeHex(hexInput.value);
    hexInput.value = normalized;
    colorPicker.value = normalized;
    palette[0] = normalized;
    setComposerPalette(palette, false);
  }

  function persistComposerDraft() {
    var input = document.querySelector("[data-post-content]");
    var colorPicker = document.querySelector("[data-color-picker]");
    var paletteInput = document.querySelector("[data-palette-input]");
    if (!input || !colorPicker || !paletteInput) return;
    var existing = readDraft();
    var keepImported = existing && existing.origin && existing.origin !== "community";
    var paletteHexes = parsePaletteInput(paletteInput.value, colorPicker.value);
    writeDraft({
      content: input.value,
      tag: state.selectedTag,
      colorHex: colorPicker.value,
      paletteHexes: paletteHexes,
      imageDataUrl: existing && existing.imageDataUrl ? existing.imageDataUrl : "",
      origin: keepImported ? existing.origin : "community",
      originMeta: keepImported ? (existing.originMeta || {}) : {}
    });
  }

  function applyDraftToComposer() {
    var draft = readDraft();
    if (!draft) return;
    var input = document.querySelector("[data-post-content]");
    var draftContent = String(draft.content || "").slice(0, MAX_POST_LENGTH);
    if (input) input.value = draftContent;
    var hasMeaningfulDraft = !!(draftContent.trim() || draft.imageDataUrl);
    if (hasMeaningfulDraft) setComposerPalette(draft.paletteHexes || [draft.colorHex], false);
    else setComposerPalette([normalizeHex(draft.colorHex || DEFAULT_COLOR)], false);
    setComposerImagePreview(draft.imageDataUrl || "");
    setActiveTag(draft.tag || DEFAULT_TAG);
    updateDraftOriginLabel(draft);
    updateCharCounter();
  }

  function buildPostFromForm(text, colorHex, paletteHexes, imageDataUrl) {
    var draft = readDraft();
    var origin = draft && draft.origin ? draft.origin : "community";
    var originMeta = draft && draft.originMeta ? draft.originMeta : {};
    return normalizePost({
      id: createId(),
      author: getCurrentUsername(),
      content: text,
      tag: state.selectedTag,
      colorHex: colorHex,
      paletteHexes: paletteHexes,
      imageDataUrl: imageDataUrl,
      likes: 0,
      likedBy: [],
      pointsAwarded: POINTS_PER_POST,
      createdAt: new Date().toISOString(),
      origin: origin,
      originMeta: originMeta,
      featured: false
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    var now = Date.now();
    if (now < state.submitLockUntil) {
      setFeedback("Please wait a moment before publishing another post.", "error");
      return;
    }
    if (!isLoggedIn()) {
      setFeedback("Log in from the avatar menu before posting.", "error");
      return;
    }

    var form = event.currentTarget;
    var input = form.querySelector("[data-post-content]");
    var colorPicker = form.querySelector("[data-color-picker]");
    var paletteInput = form.querySelector("[data-palette-input]");
    if (!input || !colorPicker || !paletteInput) return;
    var text = input.value.trim();
    if (text.length < MIN_POST_LENGTH) {
      setFeedback("Write at least " + MIN_POST_LENGTH + " characters so each post has real learning value.", "error");
      input.focus();
      return;
    }

    var colorHex = normalizeHex(colorPicker.value);
    var paletteHexes = parsePaletteInput(paletteInput.value, colorHex);
    var draft = readDraft();
    var imageDataUrl = draft && draft.imageDataUrl ? sanitizeImageDataUrl(draft.imageDataUrl) : "";
    var post = buildPostFromForm(text, colorHex, paletteHexes, imageDataUrl);
    state.posts.unshift(post);
    writePosts(state.posts);
    writeDraft(null);
    state.submitLockUntil = now + SUBMIT_COOLDOWN_MS;

    var auth = getAuthApi();
    if (auth && auth.recordActivity) {
      auth.recordActivity(post.author, {
        pointsDelta: POINTS_PER_POST,
        postDelta: 1,
        source: "community",
        type: "post",
        refId: post.id
      });
    }

    input.value = "";
    setComposerPalette([DEFAULT_COLOR], false);
    var imageInput = form.querySelector("[data-image-input]");
    if (imageInput) imageInput.value = "";
    setComposerImagePreview("");
    updateDraftOriginLabel(null);
    setFeedback("Post published. You earned 5 points.", "success");
    refreshAll();
    document.dispatchEvent(new CustomEvent("clw:post-created", { detail: { post: post } }));
  }

  function handleLikeClick(event) {
    var btn = event.target.closest("[data-like-id]");
    if (!btn) return false;
    if (!isLoggedIn()) {
      setFeedback("Log in to like posts and save your reaction.", "error");
      return true;
    }

    var postId = btn.getAttribute("data-like-id");
    var actorId = getActorId();
    if (!postId || !actorId) return true;

    var now = Date.now();
    if (state.likeLocks[postId] && now - state.likeLocks[postId] < LIKE_COOLDOWN_MS) return true;
    state.likeLocks[postId] = now;

    var addedLike = false;
    state.posts = state.posts.map(function (post) {
      if (post.id !== postId) return post;
      var likedBy = Array.isArray(post.likedBy) ? post.likedBy.slice() : [];
      var idx = likedBy.indexOf(actorId);
      var likes = Number(post.likes || 0);
      if (idx >= 0) {
        likedBy.splice(idx, 1);
        likes = Math.max(0, likes - 1);
      } else {
        likedBy.push(actorId);
        likes += 1;
        addedLike = true;
      }
      return Object.assign({}, post, { likes: likes, likedBy: likedBy });
    });
    writePosts(state.posts);

    if (addedLike) {
      var auth = getAuthApi();
      if (auth && auth.recordActivity) {
        auth.recordActivity(actorId, { pointsDelta: 0, postDelta: 0, source: "community", type: "like", refId: postId });
      }
    }

    setFeedback("", "");
    refreshAll();
    return true;
  }

  function toggleFeature(postId) {
    state.posts = state.posts.map(function (post) {
      if (post.id !== postId) return post;
      return Object.assign({}, post, { featured: !post.featured });
    });
    writePosts(state.posts);
    setFeedback("Feature flag updated for demo showcase.", "success");
    refreshAll();
  }

  function handlePostAction(event) {
    var actionBtn = event.target.closest("[data-post-action]");
    if (!actionBtn) return false;
    var action = actionBtn.getAttribute("data-post-action");
    var postId = actionBtn.getAttribute("data-post-id");
    if (!postId) return true;
    if (!isLoggedIn()) {
      setFeedback("Log in to use moderation actions.", "error");
      return true;
    }

    if (action === "feature") {
      toggleFeature(postId);
      return true;
    }
    if (action === "hide") {
      toggleHidePost(postId);
      setFeedback("Visibility preference updated.", "success");
      refreshAll();
      return true;
    }
    if (action === "report") {
      var saved = reportPost(postId);
      setFeedback(saved ? "Thanks. The post was flagged for review." : "You already reported this post.", saved ? "success" : "error");
      return true;
    }
    return true;
  }

  function openGuidelines() {
    var modal = document.querySelector("[data-guidelines-modal]");
    if (modal) {
      modal.hidden = false;
      updateOverlayScrollLock();
    }
  }

  function closeGuidelines() {
    var modal = document.querySelector("[data-guidelines-modal]");
    if (modal) {
      modal.hidden = true;
      updateOverlayScrollLock();
    }
  }

  function openImageLightbox(src) {
    var modal = document.querySelector("[data-image-lightbox]");
    var img = document.querySelector("[data-lightbox-image]");
    if (!modal || !img) return;
    var safe = sanitizeImageDataUrl(src);
    if (!safe) return;
    img.src = safe;
    modal.hidden = false;
    updateOverlayScrollLock();
  }

  function closeImageLightbox() {
    var modal = document.querySelector("[data-image-lightbox]");
    var img = document.querySelector("[data-lightbox-image]");
    if (img) img.src = "";
    if (modal) modal.hidden = true;
    updateOverlayScrollLock();
  }

  function scrollDetailIntoViewOnMobile() {
    if (getCommunityView() !== "all" || !isMobileViewport()) return;
    var detail = document.querySelector("[data-post-detail]");
    if (!detail) return;
    window.requestAnimationFrame(function () {
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function bindTagKeyboardNavigation() {
    var tags = getTagButtons();
    tags.forEach(function (btn, index) {
      btn.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          tags[(index + 1) % tags.length].focus();
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          tags[(index - 1 + tags.length) % tags.length].focus();
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActiveTag(btn.getAttribute("data-tag"));
          persistComposerDraft();
        }
      });
    });
  }

  function bindEvents() {
    var scrollBtn = document.querySelector("[data-scroll-composer]");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", function () {
        var composer = document.getElementById("composer");
        if (!composer) return;
        composer.scrollIntoView({ behavior: "smooth", block: "start" });
        var input = document.querySelector("[data-post-content]");
        if (input) input.focus();
      });
    }

    var form = document.querySelector("[data-post-form]");
    if (form) form.addEventListener("submit", handleSubmit);

    document.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setFilter(btn.getAttribute("data-filter"));
      });
    });

    document.querySelectorAll("[data-tag]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActiveTag(btn.getAttribute("data-tag"));
        persistComposerDraft();
      });
    });
    bindTagKeyboardNavigation();

    var colorPicker = document.querySelector("[data-color-picker]");
    var hexInput = document.querySelector("[data-color-hex]");
    var contentInput = document.querySelector("[data-post-content]");
    var paletteInput = document.querySelector("[data-palette-input]");
    var imageInput = document.querySelector("[data-image-input]");
    var imageClearBtn = document.querySelector("[data-image-clear]");
    var paletteRow = document.querySelector("[data-palette-row]");
    var paletteFromImageBtn = document.querySelector("[data-palette-from-image]");

    if (colorPicker) {
      colorPicker.addEventListener("input", function () {
        syncHexInputs(true);
        persistComposerDraft();
      });
    }
    if (hexInput) {
      hexInput.addEventListener("blur", function () {
        syncHexInputs(false);
        persistComposerDraft();
      });
      hexInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          syncHexInputs(false);
          persistComposerDraft();
        }
      });
    }
    if (contentInput) {
      contentInput.addEventListener("input", function () {
        updateCharCounter();
        persistComposerDraft();
      });
    }
    if (paletteInput) paletteInput.addEventListener("change", persistComposerDraft);
    if (paletteFromImageBtn) {
      paletteFromImageBtn.addEventListener("click", function () {
        var draft = readDraft();
        var image = draft && draft.imageDataUrl ? draft.imageDataUrl : "";
        if (!image) {
          setFeedback("Please attach an image first, then extract palette.", "error");
          return;
        }
        extractPaletteFromImageDataUrl(image, 6).then(function (colors) {
          if (!colors.length) {
            setFeedback("Could not extract palette from this image.", "error");
            return;
          }
          var merged = readPaletteFromHiddenInput().concat(colors);
          setComposerPalette(merged, true);
          setFeedback("Palette extracted from image.", "success");
        });
      });
    }
    if (paletteRow) {
      paletteRow.addEventListener("click", function (event) {
        var addBtn = event.target.closest("[data-palette-add]");
        if (addBtn) {
          var nextPalette = readPaletteFromHiddenInput();
          var seed = nextPalette.length ? nextPalette[nextPalette.length - 1] : DEFAULT_COLOR;
          nextPalette.push(seed);
          setComposerPalette(nextPalette, true);
          return;
        }
        var deleteBtn = event.target.closest("[data-palette-delete]");
        if (deleteBtn) {
          var deleteIdx = Number(deleteBtn.getAttribute("data-palette-delete"));
          if (!Number.isFinite(deleteIdx)) return;
          var deletePalette = readPaletteFromHiddenInput();
          if (deletePalette.length <= 1) {
            setFeedback("At least one color is required.", "error");
            return;
          }
          deletePalette.splice(deleteIdx, 1);
          setComposerPalette(deletePalette, true);
          setFeedback("Color removed.", "success");
          return;
        }
        var blockBtn = event.target.closest("[data-palette-block]");
        if (!blockBtn) return;
        var idx = Number(blockBtn.getAttribute("data-palette-block"));
        if (!Number.isFinite(idx)) return;
        var palette = readPaletteFromHiddenInput();
        openNativeColorPicker(palette[idx], function (nextHex) {
          palette[idx] = nextHex;
          setComposerPalette(palette, true);
        });
      });
    }
    if (imageInput) {
      imageInput.addEventListener("change", function (event) {
        var file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
        if (!file) return;
        if (!/^image\//.test(file.type)) {
          setFeedback("Please select a valid image file.", "error");
          return;
        }
        var reader = new FileReader();
        reader.onload = function () {
          var dataUrl = sanitizeImageDataUrl(reader.result);
          if (!dataUrl) {
            setFeedback("Could not read this image.", "error");
            return;
          }
          var draft = readDraft() || {};
          writeDraft({
            content: document.querySelector("[data-post-content]") ? document.querySelector("[data-post-content]").value : "",
            tag: state.selectedTag,
            colorHex: document.querySelector("[data-color-picker]") ? document.querySelector("[data-color-picker]").value : DEFAULT_COLOR,
            paletteHexes: parsePaletteInput(document.querySelector("[data-palette-input]") ? document.querySelector("[data-palette-input]").value : "", DEFAULT_COLOR),
            imageDataUrl: dataUrl,
            origin: draft.origin || "community",
            originMeta: draft.originMeta || {}
          });
          setComposerImagePreview(dataUrl);
          setFeedback("Image attached to your post.", "success");
        };
        reader.readAsDataURL(file);
      });
    }
    if (imageClearBtn) {
      imageClearBtn.addEventListener("click", function () {
        if (imageInput) imageInput.value = "";
        var draft = readDraft() || {};
        writeDraft({
          content: document.querySelector("[data-post-content]") ? document.querySelector("[data-post-content]").value : "",
          tag: state.selectedTag,
          colorHex: document.querySelector("[data-color-picker]") ? document.querySelector("[data-color-picker]").value : DEFAULT_COLOR,
          paletteHexes: parsePaletteInput(document.querySelector("[data-palette-input]") ? document.querySelector("[data-palette-input]").value : "", DEFAULT_COLOR),
          imageDataUrl: "",
          origin: draft.origin || "community",
          originMeta: draft.originMeta || {}
        });
        setComposerImagePreview("");
      });
    }

    function bindPostListClicks(node) {
      if (!node) return;
      node.addEventListener("click", function (event) {
        if (handleLikeClick(event)) return;
        if (handlePostAction(event)) return;
        var tagFilterBtn = event.target.closest("[data-filter-tag]");
        if (tagFilterBtn) {
          setFilter(tagFilterBtn.getAttribute("data-filter-tag"));
          return;
        }
        var zoomBtn = event.target.closest("[data-image-zoom]");
        if (zoomBtn) {
          openImageLightbox(zoomBtn.getAttribute("data-image-zoom"));
          return;
        }
        var selectBtn = event.target.closest("[data-post-select]");
        if (selectBtn) {
          state.selectedPostId = selectBtn.getAttribute("data-post-select") || "";
          renderPosts();
          scrollDetailIntoViewOnMobile();
        }
      });
    }
    bindPostListClicks(document.querySelector("[data-post-list]"));
    bindPostListClicks(document.querySelector("[data-post-detail]"));

    var openGuideBtn = document.querySelector("[data-open-guidelines]");
    if (openGuideBtn) openGuideBtn.addEventListener("click", openGuidelines);
    var toastCloseBtn = document.querySelector("[data-community-toast-close]");
    if (toastCloseBtn) toastCloseBtn.addEventListener("click", hideToast);
    document.querySelectorAll("[data-close-guidelines]").forEach(function (btn) {
      btn.addEventListener("click", closeGuidelines);
    });
    document.querySelectorAll("[data-close-image-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", closeImageLightbox);
    });
    var modal = document.querySelector("[data-guidelines-modal]");
    if (modal) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) closeGuidelines();
      });
    }
    var lightbox = document.querySelector("[data-image-lightbox]");
    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) closeImageLightbox();
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeGuidelines();
        closeImageLightbox();
      }
    });

    document.addEventListener("clw:auth-changed", function () {
      setFeedback("", "");
      refreshAll();
    });
    document.addEventListener("clw:user-data-updated", refreshAll);
    document.addEventListener("clw:activity-recorded", refreshAll);
    document.addEventListener("clw:community-draft-updated", function () {
      applyDraftToComposer();
      setFeedback("Draft imported from another page. You can edit and publish it here.", "success");
      var composer = document.getElementById("composer");
      if (composer) composer.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function init() {
    if (document.body.dataset.communityReady === "1") return;
    document.body.dataset.communityReady = "1";
    state.posts = readPosts();
    setActiveTag(DEFAULT_TAG);
    setFilter(DEFAULT_FILTER);
    setComposerPalette([DEFAULT_COLOR], false);
    bindEvents();
    applyDraftToComposer();
    refreshAll();
    updateOverlayScrollLock();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
