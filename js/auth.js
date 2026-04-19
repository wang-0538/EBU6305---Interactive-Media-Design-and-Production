/**
 * Local auth + local user data management (Scheme 1).
 * - Account system stays in localStorage (no backend)
 * - Supports log in + create account
 * - Exposes CLWAuth API for other pages
 */
(function () {
  "use strict";

  var STORAGE = {
    currentUser: "clw_current_user",
    accounts: "clw_accounts_v1",
    activityLog: "clw_activity_log_v1"
  };
  var DEMO_ACCOUNTS = {
    studentA: { password: "StudentA123!", displayName: "Student A" },
    studentB: { password: "StudentB123!", displayName: "Student B" },
    studentC: { password: "StudentC123!", displayName: "Student C" }
  };

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      console.warn("[auth.js] readJSON failed:", key, error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("[auth.js] writeJSON failed:", key, error);
    }
  }

  function normalizeUsername(input) {
    return String(input || "").trim();
  }

  function isValidUsername(username) {
    return /^[A-Za-z0-9_]{3,20}$/.test(username);
  }

  function isValidPassword(password) {
    return typeof password === "string" && password.length >= 6;
  }

  function buildDefaultStats() {
    return {
      points: 0,
      postCount: 0,
      streakDays: 0,
      lastActiveDate: ""
    };
  }

  function readAccounts() {
    var data = readJSON(STORAGE.accounts, { users: {} });
    if (!data || typeof data !== "object" || !data.users || typeof data.users !== "object") {
      return { users: {} };
    }
    return data;
  }

  function writeAccounts(data) {
    writeJSON(STORAGE.accounts, data);
  }

  function appendActivityLog(entry) {
    if (!entry || typeof entry !== "object") return;
    var raw = readJSON(STORAGE.activityLog, []);
    var list = Array.isArray(raw) ? raw : [];
    list.unshift(entry);
    writeJSON(STORAGE.activityLog, list.slice(0, 500));
  }

  function ensureSeedAccounts() {
    var store = readAccounts();
    var changed = false;
    Object.keys(DEMO_ACCOUNTS).forEach(function (username) {
      if (store.users[username]) return;
      var demo = DEMO_ACCOUNTS[username];
      store.users[username] = {
        username: username,
        password: demo.password,
        profile: {
          displayName: demo.displayName,
          avatarColor: "#2b78e4"
        },
        stats: buildDefaultStats(),
        createdAt: new Date().toISOString()
      };
      changed = true;
    });
    if (changed) writeAccounts(store);
  }

  function getCurrentUser() {
    var user = readJSON(STORAGE.currentUser, null);
    if (user && typeof user.username === "string" && user.username.trim()) {
      return user.username.trim();
    }
    return null;
  }

  function setCurrentUser(username) {
    writeJSON(STORAGE.currentUser, { username: username });
    document.dispatchEvent(
      new CustomEvent("clw:auth-changed", {
        detail: { username: username, isLoggedIn: true }
      })
    );
  }

  function clearCurrentUser() {
    var username = getCurrentUser();
    localStorage.removeItem(STORAGE.currentUser);
    document.dispatchEvent(
      new CustomEvent("clw:auth-changed", {
        detail: { username: username, isLoggedIn: false }
      })
    );
  }

  function getInitial(username) {
    return username ? username.charAt(0).toUpperCase() : "?";
  }

  function getUserRecord(username) {
    var name = normalizeUsername(username);
    if (!name) return null;
    var store = readAccounts();
    return store.users[name] || null;
  }

  function getUserStats(username) {
    var record = getUserRecord(username);
    return record && record.stats ? Object.assign({}, record.stats) : buildDefaultStats();
  }

  function ensureUser(username) {
    var name = normalizeUsername(username);
    if (!name) return null;
    var store = readAccounts();
    if (!store.users[name]) {
      store.users[name] = {
        username: name,
        password: "",
        profile: {
          displayName: name,
          avatarColor: "#2b78e4"
        },
        stats: buildDefaultStats(),
        createdAt: new Date().toISOString()
      };
      writeAccounts(store);
    } else if (!store.users[name].stats) {
      store.users[name].stats = buildDefaultStats();
      writeAccounts(store);
    }
    return store.users[name];
  }

  function updateUserStats(username, patch) {
    var name = normalizeUsername(username);
    if (!name) return buildDefaultStats();
    var store = readAccounts();
    if (!store.users[name]) return buildDefaultStats();
    var prev = store.users[name].stats || buildDefaultStats();
    store.users[name].stats = Object.assign({}, prev, patch || {});
    writeAccounts(store);
    document.dispatchEvent(
      new CustomEvent("clw:user-data-updated", {
        detail: { username: name, stats: Object.assign({}, store.users[name].stats) }
      })
    );
    return Object.assign({}, store.users[name].stats);
  }

  function recordActivity(username, payload) {
    var name = normalizeUsername(username);
    if (!name) return buildDefaultStats();
    ensureUser(name);

    var stats = getUserStats(name);
    var pointsDelta = Number(payload && payload.pointsDelta ? payload.pointsDelta : 0);
    var postDelta = Number(payload && payload.postDelta ? payload.postDelta : 0);
    var now = new Date();
    var today = now.toISOString().slice(0, 10);
    var prevDate = stats.lastActiveDate;

    if (prevDate !== today) {
      if (!prevDate) {
        stats.streakDays = 1;
      } else {
        var prev = new Date(prevDate + "T00:00:00.000Z");
        var diffDays = Math.floor((Date.parse(today + "T00:00:00.000Z") - prev.getTime()) / 86400000);
        if (diffDays === 1) {
          stats.streakDays += 1;
        } else if (diffDays > 1) {
          stats.streakDays = 1;
        }
      }
    }

    stats.points = Math.max(0, Number(stats.points || 0) + pointsDelta);
    stats.postCount = Math.max(0, Number(stats.postCount || 0) + postDelta);
    stats.lastActiveDate = today;

    var nextStats = updateUserStats(name, stats);
    var detail = {
      source: payload && payload.source ? String(payload.source) : "community",
      username: name,
      pointsDelta: pointsDelta,
      type: payload && payload.type ? String(payload.type) : "post",
      refId: payload && payload.refId ? String(payload.refId) : "",
      createdAt: new Date().toISOString()
    };
    appendActivityLog(detail);
    document.dispatchEvent(new CustomEvent("clw:activity-recorded", { detail: detail }));
    return nextStats;
  }

  function createAccount(usernameInput, passwordInput, displayNameInput) {
    var username = normalizeUsername(usernameInput);
    var password = String(passwordInput || "");
    var displayName = String(displayNameInput || "").trim();
    if (!isValidUsername(username)) {
      return { ok: false, message: "Username must be 3-20 chars (letters, numbers, underscore)." };
    }
    if (!isValidPassword(password)) {
      return { ok: false, message: "Password must be at least 6 characters." };
    }

    var store = readAccounts();
    if (store.users[username]) {
      return { ok: false, message: "Username already exists." };
    }

    store.users[username] = {
      username: username,
      password: password,
      profile: {
        displayName: displayName || username,
        avatarColor: "#2b78e4"
      },
      stats: buildDefaultStats(),
      createdAt: new Date().toISOString()
    };
    writeAccounts(store);
    return { ok: true, username: username };
  }

  function verifyCredentials(usernameInput, passwordInput) {
    var username = normalizeUsername(usernameInput);
    var password = String(passwordInput || "");
    var user = getUserRecord(username);
    if (!user || user.password !== password) {
      return { ok: false, message: "Invalid username or password." };
    }
    return { ok: true, username: username };
  }

  function updateAvatarUI() {
    var trigger = document.querySelector("[data-auth-trigger]");
    var avatar = document.querySelector("[data-user-avatar]");
    var menu = document.querySelector("[data-user-menu]");
    var dropdown = document.querySelector("[data-user-dropdown]");
    var currentUser = getCurrentUser();
    if (!trigger || !avatar) return;

    if (currentUser) {
      if (menu) menu.classList.add("is-logged-in");
      if (dropdown) dropdown.hidden = false;
      avatar.classList.remove("user-avatar--placeholder");
      avatar.classList.add("user-avatar--active");
      avatar.textContent = getInitial(currentUser);
      trigger.setAttribute("title", "Logged in as " + currentUser + " - hover for Log out");
      trigger.setAttribute("aria-label", "Account: " + currentUser);
      trigger.setAttribute("aria-expanded", "false");
      return;
    }

    if (menu) menu.classList.remove("is-logged-in");
    if (dropdown) dropdown.hidden = true;
    avatar.classList.add("user-avatar--placeholder");
    avatar.classList.remove("user-avatar--active");
    avatar.textContent = "";
    trigger.setAttribute("title", "Log in or create account");
    trigger.setAttribute("aria-label", "Account");
    trigger.setAttribute("aria-expanded", "false");
  }

  function closeModal(backdrop) {
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }

  function createLoginModal() {
    var backdrop = document.createElement("div");
    backdrop.className = "auth-modal-backdrop";
    backdrop.innerHTML = [
      '<div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">',
      '  <button type="button" class="auth-modal__close" data-auth-cancel aria-label="Close account dialog">x</button>',
      '  <div class="auth-modal__hero">',
      '    <p class="auth-modal__eyebrow">Color Learning</p>',
      '    <h2 class="auth-modal__title" id="auth-title">Log in</h2>',
      '    <p class="auth-modal__desc" data-auth-desc>Access your saved progress, posts, and activity in this browser.</p>',
      "  </div>",
      '  <div class="auth-mode-switch" role="tablist" aria-label="Auth mode">',
      '    <button type="button" class="auth-mode-switch__btn is-active" data-auth-mode-btn="signin">Log in</button>',
      '    <button type="button" class="auth-mode-switch__btn" data-auth-mode-btn="signup">Create account</button>',
      "  </div>",
      '  <form data-auth-form>',
      '    <div class="auth-modal__field">',
      '      <label class="auth-modal__label" for="auth-username">Username</label>',
      '      <input class="auth-modal__input" id="auth-username" name="username" placeholder="Enter your username" autocomplete="username" required />',
      "    </div>",
      '    <div class="auth-modal__field">',
      '      <label class="auth-modal__label" for="auth-password">Password</label>',
      '      <input class="auth-modal__input" id="auth-password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required />',
      "    </div>",
      '    <div class="auth-modal__field auth-modal__field--signup" hidden>',
      '      <label class="auth-modal__label" for="auth-password-confirm">Confirm Password</label>',
      '      <input class="auth-modal__input" id="auth-password-confirm" name="passwordConfirm" type="password" placeholder="Re-enter your password" autocomplete="new-password" />',
      "    </div>",
      '    <div class="auth-modal__field auth-modal__field--signup" hidden>',
      '      <label class="auth-modal__label" for="auth-display-name">Display Name (optional)</label>',
      '      <input class="auth-modal__input" id="auth-display-name" name="displayName" placeholder="How should others see your name?" autocomplete="nickname" />',
      "    </div>",
      '    <p class="auth-help" data-auth-help>Demo accounts: studentA / studentB / studentC</p>',
      '    <p class="auth-message" data-auth-message></p>',
      '    <div class="auth-modal__actions">',
      '      <button type="button" class="auth-modal__btn auth-modal__btn--ghost" data-auth-cancel>Cancel</button>',
      '      <button type="submit" class="auth-modal__btn auth-modal__btn--primary" data-auth-submit>Log in</button>',
      "    </div>",
      "  </form>",
      "</div>"
    ].join("");

    var mode = "signin";
    var form = backdrop.querySelector("[data-auth-form]");
    var message = backdrop.querySelector("[data-auth-message]");
    var desc = backdrop.querySelector("[data-auth-desc]");
    var help = backdrop.querySelector("[data-auth-help]");
    var submitBtn = backdrop.querySelector("[data-auth-submit]");
    var cancelBtn = backdrop.querySelector("[data-auth-cancel]");
    var usernameInput = backdrop.querySelector("#auth-username");
    var passwordInput = backdrop.querySelector("#auth-password");
    var confirmInput = backdrop.querySelector("#auth-password-confirm");
    var displayNameInput = backdrop.querySelector("#auth-display-name");
    var modeButtons = backdrop.querySelectorAll("[data-auth-mode-btn]");
    var signupFields = backdrop.querySelectorAll(".auth-modal__field--signup");
    var title = backdrop.querySelector("#auth-title");

    function applyMode(nextMode) {
      mode = nextMode === "signup" ? "signup" : "signin";
      modeButtons.forEach(function (btn) {
        var active = btn.getAttribute("data-auth-mode-btn") === mode;
        btn.classList.toggle("is-active", active);
      });
      var signup = mode === "signup";
      signupFields.forEach(function (el) {
        el.hidden = !signup;
      });
      if (title) title.textContent = signup ? "Create account" : "Log in";
      if (desc) {
        desc.textContent = signup
          ? "Create a local account to save progress, palettes, and community activity in this browser."
          : "Access your saved progress, posts, and activity in this browser.";
      }
      if (help) {
        help.textContent = signup
          ? "Tip: username can use letters, numbers, underscore."
          : "Demo accounts: studentA / studentB / studentC";
      }
      submitBtn.textContent = signup ? "Create account" : "Log in";
      message.textContent = "";
    }

    cancelBtn.addEventListener("click", function () {
      closeModal(backdrop);
    });

    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) {
        closeModal(backdrop);
      }
    });

    modeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyMode(btn.getAttribute("data-auth-mode-btn"));
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var username = usernameInput.value;
      var password = passwordInput.value;
      var result;

      if (mode === "signup") {
        if (password !== confirmInput.value) {
          message.textContent = "Password confirmation does not match.";
          return;
        }
        result = createAccount(username, password, displayNameInput.value);
        if (!result.ok) {
          message.textContent = result.message;
          return;
        }
        setCurrentUser(result.username);
        ensureUser(result.username);
        updateAvatarUI();
        closeModal(backdrop);
        alert("Account created and logged in as " + result.username + ".");
        return;
      }

      result = verifyCredentials(username, password);
      if (!result.ok) {
        message.textContent = result.message;
        return;
      }
      setCurrentUser(result.username);
      ensureUser(result.username);
      updateAvatarUI();
      closeModal(backdrop);
      alert("Logged in as " + result.username + ".");
    });

    document.body.appendChild(backdrop);
    applyMode("signin");
    usernameInput.focus();
  }

  function onAvatarClick() {
    if (getCurrentUser()) return;
    createLoginModal();
  }

  function onLogoutClick(event) {
    event.preventDefault();
    event.stopPropagation();
    var currentUser = getCurrentUser();
    if (!currentUser) return;
    var ok = window.confirm("Are you sure you want to sign out?");
    if (!ok) return;
    clearCurrentUser();
    updateAvatarUI();
  }

  function bind() {
    var trigger = document.querySelector("[data-auth-trigger]");
    if (!trigger || trigger.dataset.boundAuth === "1") return;
    trigger.dataset.boundAuth = "1";
    trigger.addEventListener("click", onAvatarClick);
  }

  function initAuthAPI() {
    window.CLWAuth = {
      getCurrentUsername: function () {
        return getCurrentUser() || "Guest";
      },
      isLoggedIn: function () {
        return !!getCurrentUser();
      },
      getUserRecord: function (username) {
        return getUserRecord(username);
      },
      getUserStats: function (username) {
        return getUserStats(username || getCurrentUser());
      },
      updateUserStats: function (username, patch) {
        return updateUserStats(username || getCurrentUser(), patch);
      },
      recordActivity: function (username, payload) {
        return recordActivity(username || getCurrentUser(), payload || {});
      }
    };
  }

  if (!document.documentElement.dataset.authDelegationBound) {
    document.documentElement.dataset.authDelegationBound = "1";
    document.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-auth-logout]");
      if (!btn) return;
      onLogoutClick(event);
    });
  }

  function init() {
    ensureSeedAccounts();
    initAuthAPI();
    bind();
    updateAvatarUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.addEventListener("site:components-ready", init);
})();
