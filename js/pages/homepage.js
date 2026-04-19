/**
 * Homepage: theme picker UI (default mode only; RGB/HSV reserved).
 */
(function () {
  "use strict";

  var MODE_STORAGE_KEY = "clw_theme_mode";
  var WHEEL_COLOR_STORAGE_KEY = "clw_theme_wheel_color";
  var HOME_GAME_PICK_INDEX_KEY = "clw_home_game_pick_index";
  var HOME_TEST_PICK_INDEX_KEY = "clw_home_test_pick_index";
  var HOME_LEARN_PICK_INDEX_KEY = "clw_home_learn_pick_index";
  var HOME_COMMUNITY_PICK_INDEX_KEY = "clw_home_community_pick_index";

  function syncThemeSelection(section) {
    if (!window.CLWTheme) return;
    var current = window.CLWTheme.getCurrentId();
    section.querySelectorAll("[data-theme-option]").forEach(function (btn) {
      var id = btn.getAttribute("data-theme-option");
      btn.classList.toggle("theme-picker__theme-option--selected", id === current);
      btn.setAttribute("aria-checked", id === current ? "true" : "false");
    });
  }

  function clearThemeSelection(section) {
    section.querySelectorAll("[data-theme-option]").forEach(function (btn) {
      btn.classList.remove("theme-picker__theme-option--selected");
      btn.setAttribute("aria-checked", "false");
    });
  }

  function readStoredValue(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeStoredValue(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
  }

  function readSessionValue(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeSessionValue(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
  }

  function pickStableSessionIndex(key, maxCount) {
    if (!(maxCount > 0)) return -1;
    var raw = readSessionValue(key);
    if (/^\d+$/.test(raw || "")) {
      var stored = Number(raw);
      if (stored >= 0 && stored < maxCount) return stored;
    }
    var picked = Math.floor(Math.random() * maxCount);
    writeSessionValue(key, String(picked));
    return picked;
  }

  function toPlainText(html) {
    var holder = document.createElement("div");
    holder.innerHTML = String(html || "");
    return (holder.textContent || holder.innerText || "").replace(/\s+/g, " ").trim();
  }

  function clipWithEllipsis(text, maxLength) {
    var source = String(text || "").trim();
    if (!source) return "";
    if (source.length <= maxLength) return source;
    return source.slice(0, maxLength).trimEnd() + "...";
  }

  function parseLearnContentData(source) {
    var normalized = String(source || "").replace(/^\s*export\s+const\s+contentData\s*=\s*/, "return ");
    if (!/^return\s+/.test(normalized)) throw new Error("Missing contentData export");
    return new Function(normalized)();
  }

  function readStoredJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (e) {
      return fallback;
    }
  }

  function getLearnSectionLocation(sectionKey, sectionTitle) {
    var key = String(sectionKey || "");
    var branch = "Learning";
    if (key === "overview") branch = "Overview";
    else if (key.indexOf("basic-") === 0) branch = "Learning Module · Basic";
    else if (key.indexOf("encoding-") === 0) branch = "Learning Module · Encoding Concepts";
    else if (key.indexOf("advance-") === 0) branch = "Learning Module · Advance Topics";
    else if (key.indexOf("interaction-") === 0) branch = "Interaction";
    else if (key === "relative-information") branch = "Relative Information";
    return branch + " · " + String(sectionTitle || "Section");
  }

  function loadLearnTopicCatalog() {
    return fetch("js/pages/learn/learning-content.js")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load learning content");
        return res.text();
      })
      .then(function (source) {
        var catalog = [];
        var data = parseLearnContentData(source);
        Object.keys(data || {}).forEach(function (sectionKey) {
          var section = data[sectionKey];
          if (!section || !Array.isArray(section.sections)) return;
          var sectionTitle = section.title ? String(section.title) : "Section";
          var sectionLocation = getLearnSectionLocation(sectionKey, sectionTitle);
          section.sections.forEach(function (entry) {
            var heading = String(entry && entry.heading ? entry.heading : "").trim();
            var preview = clipWithEllipsis(toPlainText(entry && entry.content ? entry.content : ""), 185);
            if (!heading || !preview) return;
            catalog.push({
              sectionKey: sectionKey,
              sectionTitle: sectionTitle,
              location: sectionLocation,
              heading: heading,
              preview: preview
            });
          });
        });
        return catalog;
      });
  }

  function setupHomeLearnSpotlight() {
    var linkEl = document.querySelector("[data-home-learn-link]");
    var titleEl = document.querySelector("[data-home-learn-title]");
    var topicEl = document.querySelector("[data-home-learn-topic]");
    var snippetEl = document.querySelector("[data-home-learn-snippet]");
    var metaEl = document.querySelector("[data-home-learn-meta]");
    if (!linkEl || !titleEl || !topicEl || !snippetEl || !metaEl) return;

    titleEl.textContent = "Learn Colors the Smart Way";
    loadLearnTopicCatalog()
      .then(function (catalog) {
        if (!Array.isArray(catalog) || !catalog.length) throw new Error("Empty learn catalog");
        var picked = catalog[pickStableSessionIndex(HOME_LEARN_PICK_INDEX_KEY, catalog.length)];
        if (!picked || !picked.heading || !picked.preview) throw new Error("Invalid learn item");
        topicEl.textContent = picked.heading;
        snippetEl.textContent = picked.preview;
        metaEl.textContent = picked.location;
        linkEl.href = "learning.html#" + encodeURIComponent(String(picked.sectionKey || "overview"));
        linkEl.setAttribute("aria-label", "Open Learn module topic: " + picked.heading);
      })
      .catch(function () {
        topicEl.textContent = "What is Colour Encoding?";
        snippetEl.textContent = "Explore how color information is represented and used across devices and media...";
        metaEl.textContent = "Overview · Colour Encoding Overview";
        linkEl.href = "learning.html#overview";
      });
  }

  function extractCommunitySeedPosts(source) {
    var markerMatch = source.match(/var\s+seedPosts\s*=\s*/);
    if (!markerMatch) return [];
    var markerIndex = markerMatch.index + markerMatch[0].length;
    var expressionStart = source.indexOf("[", markerIndex);
    if (expressionStart < 0) return [];
    var depth = 0;
    var expressionEnd = -1;
    for (var i = expressionStart; i < source.length; i += 1) {
      var ch = source[i];
      if (ch === "[") depth += 1;
      if (ch === "]") {
        depth -= 1;
        if (depth === 0) {
          expressionEnd = i + 1;
          break;
        }
      }
    }
    if (expressionEnd < 0) return [];
    var expression = source.slice(expressionStart, expressionEnd).trim();
    try {
      var parsed = new Function("return " + expression + ";")();
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function normalizeCommunityPost(post) {
    if (!post || typeof post !== "object") return null;
    var content = clipWithEllipsis(toPlainText(post.content || ""), 190);
    if (!content) return null;
    var author = post.author ? String(post.author).trim() : "Guest";
    var tag = post.tag ? String(post.tag).trim() : "#Community";
    return {
      author: author || "Guest",
      tag: tag || "#Community",
      content: content
    };
  }

  function loadCommunityPostCatalog() {
    var saved = readStoredJson("clw_posts_v3", null);
    if (!Array.isArray(saved) || !saved.length) saved = readStoredJson("clw_posts_v2", null);
    if (!Array.isArray(saved) || !saved.length) saved = readStoredJson("clw_posts_v1", null);
    if (Array.isArray(saved) && saved.length) {
      return Promise.resolve(
        saved
          .map(normalizeCommunityPost)
          .filter(function (item) { return !!item; })
      );
    }
    return fetch("js/pages/community.js")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load community module");
        return res.text();
      })
      .then(function (source) {
        return extractCommunitySeedPosts(source)
          .map(normalizeCommunityPost)
          .filter(function (item) { return !!item; });
      });
  }

  function setupHomeCommunitySpotlight() {
    var noticeLinkEl = document.querySelector("[data-home-community-notice-link]");
    var postLinkEl = document.querySelector("[data-home-community-post-link]");
    var titleEl = document.querySelector("[data-home-community-title]");
    var avatarEl = document.querySelector("[data-home-community-avatar]");
    var authorEl = document.querySelector("[data-home-community-author]");
    var tagEl = document.querySelector("[data-home-community-tag]");
    var postEl = document.querySelector("[data-home-community-post]");
    if (!noticeLinkEl || !postLinkEl || !titleEl || !avatarEl || !authorEl || !tagEl || !postEl) return;

    titleEl.textContent = "👥 Join the Color Community";
    noticeLinkEl.href = "community.html";
    loadCommunityPostCatalog()
      .then(function (catalog) {
        if (!Array.isArray(catalog) || !catalog.length) throw new Error("Empty community catalog");
        var picked = catalog[pickStableSessionIndex(HOME_COMMUNITY_PICK_INDEX_KEY, catalog.length)];
        if (!picked || !picked.content) throw new Error("Invalid community item");
        var initial = picked.author && picked.author.charAt(0) ? picked.author.charAt(0).toUpperCase() : "U";
        avatarEl.textContent = initial;
        authorEl.textContent = "@" + picked.author;
        tagEl.textContent = picked.tag || "#Community";
        postEl.textContent = picked.content;
        postLinkEl.href = "community-posts.html";
        postLinkEl.setAttribute("aria-label", "Open community post list, highlighted from @" + picked.author);
      })
      .catch(function () {
        avatarEl.textContent = "C";
        authorEl.textContent = "@colorLearner";
        tagEl.textContent = "#Community";
        postEl.textContent = "Share one color insight, palette, or learning takeaway with peers in the community.";
        postLinkEl.href = "community-posts.html";
      });
  }

  function parseHexColor(hex) {
    if (!hex || typeof hex !== "string") return null;
    var normalized = hex.trim().toLowerCase();
    var match = /^#([a-f0-9]{6})$/.exec(normalized);
    if (!match) return null;
    var value = match[1];
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    function toHexChannel(value) {
      var bounded = Math.max(0, Math.min(255, Math.round(value)));
      return bounded.toString(16).padStart(2, "0");
    }
    return "#" + toHexChannel(r) + toHexChannel(g) + toHexChannel(b);
  }

  function hslToRgb(h, s, l) {
    var hue = ((h % 360) + 360) % 360;
    var sat = Math.max(0, Math.min(100, s)) / 100;
    var light = Math.max(0, Math.min(100, l)) / 100;

    var c = (1 - Math.abs(2 * light - 1)) * sat;
    var x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    var m = light - c / 2;
    var r = 0;
    var g = 0;
    var b = 0;

    if (hue < 60) {
      r = c;
      g = x;
    } else if (hue < 120) {
      r = x;
      g = c;
    } else if (hue < 180) {
      g = c;
      b = x;
    } else if (hue < 240) {
      g = x;
      b = c;
    } else if (hue < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    return {
      r: (r + m) * 255,
      g: (g + m) * 255,
      b: (b + m) * 255
    };
  }

  function rgbToHue(rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
    if (delta === 0) return 0;

    var hue = 0;
    if (max === r) {
      hue = (g - b) / delta;
      if (g < b) hue += 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    return Math.round(hue * 60) % 360;
  }

  function wrapHue(value) {
    var hue = value % 360;
    return hue < 0 ? hue + 360 : hue;
  }

  function createWheelPalette(hex) {
    var rgb = parseHexColor(hex);
    var hue = rgb ? rgbToHue(rgb) : 196;
    return {
      stops: [
        "hsl(" + wrapHue(hue - 30) + " 90% 28%)",
        "hsl(" + wrapHue(hue - 10) + " 92% 40%)",
        "hsl(" + wrapHue(hue) + " 95% 50%)",
        "hsl(" + wrapHue(hue + 18) + " 88% 66%)",
        "hsl(" + wrapHue(hue + 36) + " 85% 80%)"
      ],
      primaryHover: "hsl(" + wrapHue(hue - 12) + " 85% 36%)"
    };
  }

  function applyWheelTheme(hex) {
    var palette = createWheelPalette(hex);
    var root = document.documentElement;
    root.style.setProperty("--theme-stop-1", palette.stops[0]);
    root.style.setProperty("--theme-stop-2", palette.stops[1]);
    root.style.setProperty("--theme-stop-3", palette.stops[2]);
    root.style.setProperty("--theme-stop-4", palette.stops[3]);
    root.style.setProperty("--theme-stop-5", palette.stops[4]);
    root.style.setProperty("--color-primary-hover", palette.primaryHover);
  }

  function setThemeMode(section, mode) {
    var modeSelect = section.querySelector("[data-theme-mode]");
    var wheelWrap = section.querySelector("[data-theme-wheel-wrap]");
    var swatchWrap = section.querySelector(".theme-picker__swatches");
    var pickerCard = section.closest(".theme-picker");
    var isWheel = mode === "wheel";

    if (modeSelect && modeSelect.value !== mode) modeSelect.value = mode;
    if (wheelWrap) wheelWrap.hidden = !isWheel;
    if (swatchWrap) swatchWrap.hidden = isWheel;
    if (pickerCard) pickerCard.classList.toggle("theme-picker--wheel", isWheel);
    if (isWheel) {
      clearThemeSelection(section);
    } else {
      syncThemeSelection(section);
    }

    writeStoredValue(MODE_STORAGE_KEY, mode);
  }

  function setupWheelPicker(wheelCanvas, wheelInput, onColorChange) {
    if (!wheelCanvas || !wheelInput || typeof onColorChange !== "function") return;
    var wheelCtx = wheelCanvas.getContext("2d");
    if (!wheelCtx) return;

    function getHueFromInput() {
      return rgbToHue(parseHexColor(wheelInput.value) || { r: 0, g: 180, b: 216 });
    }

    function renderWheel() {
      var size = Math.min(wheelCanvas.width, wheelCanvas.height);
      var center = size / 2;
      var outerRadius = center - 3;
      var innerRadius = outerRadius * 0.58;
      var hue = getHueFromInput();

      wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
      var gradient = wheelCtx.createConicGradient(-Math.PI / 2, center, center);
      gradient.addColorStop(0, "#ff0044");
      gradient.addColorStop(1 / 6, "#ff8c00");
      gradient.addColorStop(2 / 6, "#ffd500");
      gradient.addColorStop(3 / 6, "#27c93f");
      gradient.addColorStop(4 / 6, "#00a5ff");
      gradient.addColorStop(5 / 6, "#7a35ff");
      gradient.addColorStop(1, "#ff0044");

      wheelCtx.fillStyle = gradient;
      wheelCtx.beginPath();
      wheelCtx.arc(center, center, outerRadius, 0, Math.PI * 2);
      wheelCtx.arc(center, center, innerRadius, 0, Math.PI * 2, true);
      wheelCtx.fill("evenodd");

      wheelCtx.strokeStyle = "rgba(15, 23, 42, 0.2)";
      wheelCtx.lineWidth = 2;
      wheelCtx.beginPath();
      wheelCtx.arc(center, center, outerRadius + 1, 0, Math.PI * 2);
      wheelCtx.stroke();

      var markerAngle = (hue * Math.PI) / 180 - Math.PI / 2;
      var markerRadius = (outerRadius + innerRadius) / 2;
      var markerX = center + Math.cos(markerAngle) * markerRadius;
      var markerY = center + Math.sin(markerAngle) * markerRadius;
      wheelCtx.beginPath();
      wheelCtx.fillStyle = "#ffffff";
      wheelCtx.strokeStyle = "rgba(15, 23, 42, 0.85)";
      wheelCtx.lineWidth = 2;
      wheelCtx.arc(markerX, markerY, 6, 0, Math.PI * 2);
      wheelCtx.fill();
      wheelCtx.stroke();
    }

    function updateFromPointer(clientX, clientY) {
      var rect = wheelCanvas.getBoundingClientRect();
      var scaleX = wheelCanvas.width / rect.width;
      var scaleY = wheelCanvas.height / rect.height;
      var x = (clientX - rect.left) * scaleX;
      var y = (clientY - rect.top) * scaleY;
      var centerX = wheelCanvas.width / 2;
      var centerY = wheelCanvas.height / 2;
      var dx = x - centerX;
      var dy = y - centerY;
      var distance = Math.sqrt(dx * dx + dy * dy);
      var outerRadius = centerX - 3;
      var innerRadius = outerRadius * 0.58;
      if (distance < innerRadius || distance > outerRadius) return;

      var angle = Math.atan2(dy, dx);
      var hue = ((angle * 180) / Math.PI + 90 + 360) % 360;
      var rgb = hslToRgb(hue, 95, 50);
      var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      wheelInput.value = hex;
      onColorChange(hex);
      renderWheel();
    }

    var dragging = false;
    wheelCanvas.addEventListener("pointerdown", function (event) {
      dragging = true;
      wheelCanvas.setPointerCapture(event.pointerId);
      updateFromPointer(event.clientX, event.clientY);
    });
    wheelCanvas.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      updateFromPointer(event.clientX, event.clientY);
    });
    wheelCanvas.addEventListener("pointerup", function (event) {
      dragging = false;
      wheelCanvas.releasePointerCapture(event.pointerId);
    });
    wheelCanvas.addEventListener("pointercancel", function () {
      dragging = false;
    });

    wheelInput.addEventListener("input", renderWheel);
    renderWheel();
  }

  function clearTaglineEffect(letters) {
    letters.forEach(function (letter) {
      letter.classList.remove("is-active");
    });
  }

  function setSketchStyle(ctx, scale) {
    var ratio = typeof scale === "number" ? scale : 1;
    ctx.lineWidth = Math.max(4 * ratio, 1);
    ctx.strokeStyle = "#000";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function loadGameDrawingsLibrary() {
    return fetch("js/pages/game.js")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load game library");
        return res.text();
      })
      .then(function (source) {
        var markerMatch = source.match(/const\s+drawings\s*=\s*/);
        if (!markerMatch) throw new Error("Could not find drawings declaration");
        var markerIndex = markerMatch.index + markerMatch[0].length;
        var expressionStart = source.indexOf("[", markerIndex);
        if (expressionStart < 0) throw new Error("Could not find drawings array start");
        var depth = 0;
        var expressionEnd = -1;
        for (var i = expressionStart; i < source.length; i += 1) {
          var ch = source[i];
          if (ch === "[") depth += 1;
          if (ch === "]") {
            depth -= 1;
            if (depth === 0) {
              expressionEnd = i + 1;
              break;
            }
          }
        }
        if (expressionEnd < 0) throw new Error("Could not parse drawings array");
        var expression = source.slice(expressionStart, expressionEnd).trim();
        if (expression.endsWith(";")) expression = expression.slice(0, -1);
        return new Function("return " + expression + ";")();
      });
  }

  function setupHomeGameSpotlight() {
    var previewCanvas = document.querySelector("[data-home-game-preview]");
    var previewLink = document.querySelector("[data-home-game-link]");
    var previewTitle = document.querySelector(".home-card__text--game");
    if (!previewCanvas || !previewLink) return;

    var ctx = previewCanvas.getContext("2d");
    if (!ctx) return;

    loadGameDrawingsLibrary()
      .then(function (drawings) {
        if (!Array.isArray(drawings) || !drawings.length) return;
        var validDrawings = drawings
          .map(function (drawing, index) {
            return { drawing: drawing, index: index };
          })
          .filter(function (item) {
            return item.drawing && typeof item.drawing.draw === "function";
          });
        if (!validDrawings.length) return;
        var picked = validDrawings[pickStableSessionIndex(HOME_GAME_PICK_INDEX_KEY, validDrawings.length)];
        var drawing = picked.drawing;
        var randomIndex = picked.index;
        var drawingName = drawing.name ? String(drawing.name) : "a random drawing";

        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
        setSketchStyle(ctx, 0.5);
        drawing.draw(ctx, previewCanvas.width, previewCanvas.height);

        previewLink.href = "game.html?openDrawing=" + String(randomIndex);
        previewLink.setAttribute("aria-label", "Start your color challenge with " + drawingName);
        if (previewTitle) previewTitle.textContent = "Start your color challenge: " + drawingName + "!";
      })
      .catch(function () {
        previewLink.href = "game.html";
        if (previewTitle) previewTitle.textContent = "Start your color challenge!";
      });
  }

  function extractFunctionSource(source, functionName) {
    var marker = "function " + functionName + "(";
    var startIndex = source.indexOf(marker);
    if (startIndex < 0) throw new Error("Missing function: " + functionName);
    var bodyStart = source.indexOf("{", startIndex);
    if (bodyStart < 0) throw new Error("Malformed function: " + functionName);

    var depth = 0;
    var inSingle = false;
    var inDouble = false;
    var inTemplate = false;
    var escaped = false;

    for (var i = bodyStart; i < source.length; i += 1) {
      var ch = source[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (!inDouble && !inTemplate && ch === "'" && source[i - 1] !== "\\") inSingle = !inSingle;
      else if (!inSingle && !inTemplate && ch === '"' && source[i - 1] !== "\\") inDouble = !inDouble;
      else if (!inSingle && !inDouble && ch === "`" && source[i - 1] !== "\\") inTemplate = !inTemplate;
      if (inSingle || inDouble || inTemplate) continue;

      if (ch === "{") depth += 1;
      else if (ch === "}") {
        depth -= 1;
        if (depth === 0) return source.slice(startIndex, i + 1);
      }
    }
    throw new Error("Unclosed function: " + functionName);
  }

  function extractVarSource(source, varName) {
    var marker = "var " + varName + " =";
    var startIndex = source.indexOf(marker);
    if (startIndex < 0) throw new Error("Missing var: " + varName);

    var depthCurly = 0;
    var depthSquare = 0;
    var depthRound = 0;
    var inSingle = false;
    var inDouble = false;
    var inTemplate = false;
    var escaped = false;

    for (var i = startIndex; i < source.length; i += 1) {
      var ch = source[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (!inDouble && !inTemplate && ch === "'" && source[i - 1] !== "\\") inSingle = !inSingle;
      else if (!inSingle && !inTemplate && ch === '"' && source[i - 1] !== "\\") inDouble = !inDouble;
      else if (!inSingle && !inDouble && ch === "`" && source[i - 1] !== "\\") inTemplate = !inTemplate;
      if (inSingle || inDouble || inTemplate) continue;

      if (ch === "{") depthCurly += 1;
      else if (ch === "}") depthCurly -= 1;
      else if (ch === "[") depthSquare += 1;
      else if (ch === "]") depthSquare -= 1;
      else if (ch === "(") depthRound += 1;
      else if (ch === ")") depthRound -= 1;
      else if (ch === ";" && depthCurly === 0 && depthSquare === 0 && depthRound === 0) {
        return source.slice(startIndex, i + 1);
      }
    }
    throw new Error("Unclosed var: " + varName);
  }

  function loadTestQuestionCatalog() {
    return fetch("js/pages/test.js")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load test module");
        return res.text();
      })
      .then(function (source) {
        var parts = [
          '"use strict";',
          extractVarSource(source, "CHAPTERS"),
          extractVarSource(source, "UNIT_TEMPLATES"),
          extractFunctionSource(source, "clone"),
          extractFunctionSource(source, "getChapter"),
          extractFunctionSource(source, "getUnitFocus"),
          extractFunctionSource(source, "makeSet"),
          extractFunctionSource(source, "previewText"),
          extractFunctionSource(source, "previewBg"),
          extractFunctionSource(source, "previewImage"),
          extractFunctionSource(source, "buildQuestionData"),
          extractFunctionSource(source, "makeQuestion"),
          extractFunctionSource(source, "getUnitQuestions"),
          "var QUESTION_DATA = buildQuestionData();",
          "var levels = Object.keys(UNIT_TEMPLATES);",
          "function getOptionTexts(question) {",
          "  var opts = Array.isArray(question && question.options) ? question.options : [];",
          "  if (!opts.length) return [];",
          "  if (question.type === 'image') {",
          "    return opts.map(function (item) { return item && item.label ? String(item.label) : String(item && item.id ? item.id : 'Option'); });",
          "  }",
          "  return opts.map(function (item) { return String(item); });",
          "}",
          "var catalog = [];",
          "CHAPTERS.forEach(function (chapter) {",
          "  levels.forEach(function (levelId) {",
          "    (UNIT_TEMPLATES[levelId] || []).forEach(function (unit) {",
          "      var unitId = unit.id;",
          "      var questions = getUnitQuestions(chapter.id, levelId, unitId) || [];",
          "      questions.forEach(function (question, qIndex) {",
          "        catalog.push({",
          "          chapterId: chapter.id,",
          "          chapterName: chapter.name,",
          "          levelId: levelId,",
          "          unitId: unitId,",
          "          questionIndex: qIndex,",
          "          prompt: question.prompt || '',",
          "          topic: question.topic || '',",
          "          id: question.id || '',",
          "          optionTexts: getOptionTexts(question)",
          "        });",
          "      });",
          "    });",
          "  });",
          "});",
          "return catalog;"
        ];
        return new Function(parts.join("\n"))();
      });
  }

  function escapeHtmlText(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function toTitleCase(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function setupHomeTestSpotlight() {
    var linkEl = document.querySelector("[data-home-test-link]");
    var promptEl = document.querySelector("[data-home-test-prompt]");
    var optionsEl = document.querySelector("[data-home-test-options]");
    var metaEl = document.querySelector("[data-home-test-meta]");
    if (!linkEl || !promptEl || !metaEl || !optionsEl) return;

    loadTestQuestionCatalog()
      .then(function (catalog) {
        if (!Array.isArray(catalog) || !catalog.length) throw new Error("Empty question catalog");
        var picked = catalog[pickStableSessionIndex(HOME_TEST_PICK_INDEX_KEY, catalog.length)];
        if (!picked || !picked.prompt) throw new Error("Invalid question item");

        promptEl.textContent = picked.prompt;
        var optionRows = Array.isArray(picked.optionTexts) ? picked.optionTexts : [];
        if (optionRows.length) {
          optionsEl.innerHTML = optionRows
            .map(function (text, index) {
              return (
                '<p class="home-test__option">' +
                '<span class="home-test__option-key">' + String.fromCharCode(65 + (index % 26)) + "</span>" +
                "<span>" + escapeHtmlText(text) + "</span>" +
                "</p>"
              );
            })
            .join("");
        } else {
          optionsEl.innerHTML = '<p class="home-test__option"><span class="home-test__option-key">i</span><span>Open to view options</span></p>';
        }
        metaEl.textContent =
          picked.chapterName + " · " + toTitleCase(picked.levelId) + " · " + picked.unitId.replace("unit-", "Unit ");

        linkEl.href =
          "test-quiz.html?chapter=" + encodeURIComponent(picked.chapterId) +
          "&level=" + encodeURIComponent(picked.levelId) +
          "&unit=" + encodeURIComponent(picked.unitId) +
          "&fresh=1&hq=" + encodeURIComponent(String(picked.questionIndex));
        linkEl.setAttribute("aria-label", "Open test question: " + picked.prompt);
      })
      .catch(function () {
        promptEl.textContent = "Tap to jump into a random color challenge question.";
        optionsEl.innerHTML = '<p class="home-test__option"><span class="home-test__option-key">i</span><span>Options will appear after loading.</span></p>';
        metaEl.textContent = "Test module";
        linkEl.href = "test-quiz.html?fresh=1";
      });
  }

  function setupHeroTagline() {
    var tagline = document.querySelector(".home-hero__tagline");
    if (!tagline) return;

    var rawText = tagline.textContent || "";
    if (!rawText.trim()) return;
    tagline.setAttribute("aria-label", rawText.trim());

    var letters = [];
    var fragment = document.createDocumentFragment();
    rawText.split(/(\s+)/).forEach(function (token) {
      if (!token) return;

      if (/^\s+$/.test(token)) {
        fragment.appendChild(document.createTextNode(token));
        return;
      }

      var word = document.createElement("span");
      word.className = "home-hero__word";

      Array.from(token).forEach(function (char) {
        var span = document.createElement("span");
        span.className = "home-hero__letter";
        span.textContent = char;
        word.appendChild(span);
        letters.push(span);
      });

      fragment.appendChild(word);
    });

    tagline.textContent = "";
    tagline.appendChild(fragment);

    function syncBandMetrics() {
      letters.forEach(function (letter) {
        letter.style.setProperty("--letter-x", letter.offsetLeft + "px");
      });
    }

    var animationId = 0;
    var speedPxPerSec = 100;
    var hueSpreadPx = 16;

    function animateBand(timestamp) {
      var flow = (timestamp / 1000) * speedPxPerSec;
      letters.forEach(function (letter) {
        var x = parseFloat(letter.style.getPropertyValue("--letter-x")) || 0;
        var hue = (flow / hueSpreadPx + x / hueSpreadPx) % 360;
        letter.style.setProperty("--letter-hue", String(hue));
      });
      animationId = window.requestAnimationFrame(animateBand);
    }

    syncBandMetrics();
    window.addEventListener("resize", syncBandMetrics);
    animationId = window.requestAnimationFrame(animateBand);

    tagline.addEventListener("pointermove", function (event) {
      var target = event.target.closest(".home-hero__letter");
      if (!target || !tagline.contains(target)) return;

      clearTaglineEffect(letters);
      target.classList.add("is-active");
    });

    tagline.addEventListener("pointerleave", function () {
      clearTaglineEffect(letters);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeroTagline();
    setupHomeLearnSpotlight();
    setupHomeGameSpotlight();
    setupHomeTestSpotlight();
    setupHomeCommunitySpotlight();

    var section = document.querySelector("[data-theme-picker]");
    if (!section || !window.CLWTheme) return;
    var modeSelect = section.querySelector("[data-theme-mode]");
    var wheelInput = section.querySelector("[data-theme-wheel]");
    var wheelCanvas = section.querySelector("[data-theme-wheel-canvas]");

    section.querySelectorAll("[data-theme-option]").forEach(function (btn) {
      btn.setAttribute("role", "radio");
    });

    var storedWheelColor = readStoredValue(WHEEL_COLOR_STORAGE_KEY, "#00b4d8");
    if (wheelInput && /^#([a-f0-9]{6})$/i.test(storedWheelColor)) {
      wheelInput.value = storedWheelColor;
    }

    var storedMode = readStoredValue(MODE_STORAGE_KEY, "default");
    setupWheelPicker(wheelCanvas, wheelInput, function (hex) {
      writeStoredValue(WHEEL_COLOR_STORAGE_KEY, hex);
      if (modeSelect && modeSelect.value === "wheel") {
        applyWheelTheme(hex);
      }
    });

    if (storedMode === "wheel") {
      setThemeMode(section, "wheel");
      applyWheelTheme(wheelInput ? wheelInput.value : "#00b4d8");
    } else {
      setThemeMode(section, "default");
      syncThemeSelection(section);
    }

    section.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-theme-option]");
      if (!btn) return;
      var id = btn.getAttribute("data-theme-option");
      if (!id) return;
      setThemeMode(section, "default");
      window.CLWTheme.applyTheme(id);
      syncThemeSelection(section);
    });

    if (modeSelect) {
      modeSelect.addEventListener("change", function () {
        if (modeSelect.value === "wheel") {
          setThemeMode(section, "wheel");
          applyWheelTheme(wheelInput ? wheelInput.value : "#00b4d8");
          return;
        }
        setThemeMode(section, "default");
        window.CLWTheme.applyTheme(window.CLWTheme.getCurrentId());
        syncThemeSelection(section);
      });
    }

    if (wheelInput) {
      wheelInput.addEventListener("input", function () {
        writeStoredValue(WHEEL_COLOR_STORAGE_KEY, wheelInput.value);
        if (modeSelect && modeSelect.value === "wheel") {
          applyWheelTheme(wheelInput.value);
        }
      });
    }
  });
})();
