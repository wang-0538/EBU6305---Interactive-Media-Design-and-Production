/**
 * Global UI sound: pooled Audio, per-user soundEffects preference, gated play().
 * Modules register track URLs with registerTracks(); playback goes through play().
 */
(function () {
  "use strict";

  var STORAGE_KEY = "clw_sound_effects_by_user_v1";
  var POOL_SIZE = 4;

  var registry = [];
  var registrySet = Object.create(null);
  var sfxPoolMap = Object.create(null);
  var sfxPoolCursor = Object.create(null);
  var sfxUnlocked = false;
  var soundEnabled = true;
  var currentUserKey = "__guest__";
  var documentUnlockBound = false;

  function getUserKey() {
    if (window.CLWAuth && typeof CLWAuth.isLoggedIn === "function" && CLWAuth.isLoggedIn()) {
      var u = CLWAuth.getCurrentUsername && CLWAuth.getCurrentUsername();
      if (u && u !== "Guest") return String(u);
    }
    return "__guest__";
  }

  function readAllPrefs() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : {};
    } catch (e) {
      return {};
    }
  }

  function writePrefForUserKey(key, enabled) {
    var all = readAllPrefs();
    all[key] = !!enabled;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {}
  }

  function loadEnabledForCurrentUser() {
    currentUserKey = getUserKey();
    var all = readAllPrefs();
    if (Object.prototype.hasOwnProperty.call(all, currentUserKey)) {
      soundEnabled = !!all[currentUserKey];
    } else {
      soundEnabled = true;
    }
  }

  function emitPrefsChanged() {
    document.dispatchEvent(
      new CustomEvent("clw:sound-prefs-changed", {
        detail: { soundEffects: soundEnabled, userKey: currentUserKey }
      })
    );
  }

  function ensurePoolForSrc(src) {
    if (!src) return;
    if (sfxPoolMap[src] && sfxPoolMap[src].length) return;
    var pool = [];
    var j;
    for (j = 0; j < POOL_SIZE; j++) {
      try {
        var a = new Audio(src);
        a.preload = "auto";
        pool.push(a);
      } catch (e) {}
    }
    if (pool.length) {
      sfxPoolMap[src] = pool;
      sfxPoolCursor[src] = 0;
    }
  }

  function buildPoolsForRegistry() {
    var i;
    for (i = 0; i < registry.length; i++) {
      ensurePoolForSrc(registry[i]);
    }
  }

  function registerTracks(urls) {
    if (!urls || !urls.length) return;
    var i;
    for (i = 0; i < urls.length; i++) {
      var s = urls[i];
      if (!s || registrySet[s]) continue;
      registrySet[s] = true;
      registry.push(s);
      if (soundEnabled) ensurePoolForSrc(s);
    }
  }

  function getPooledSfxAudio(src) {
    var pool = sfxPoolMap[src];
    if (!pool || !pool.length) return null;
    var cursor = Number(sfxPoolCursor[src]) || 0;
    var audio = pool[cursor % pool.length];
    sfxPoolCursor[src] = (cursor + 1) % pool.length;
    return audio;
  }

  function pickUnlockSrc() {
    var i;
    for (i = 0; i < registry.length; i++) {
      if (registry[i].indexOf("hint") !== -1) return registry[i];
    }
    return registry.length ? registry[0] : null;
  }

  function silentUnlock() {
    if (sfxUnlocked) return;
    sfxUnlocked = true;
    try {
      var hintSrc = pickUnlockSrc();
      if (!hintSrc) return;
      var a = getPooledSfxAudio(hintSrc) || new Audio(hintSrc);
      a.volume = 0;
      try {
        a.currentTime = 0;
      } catch (resetError) {}
      var p = a.play();
      if (p && typeof p.then === "function") {
        p.then(function () {
          try {
            a.pause();
            a.currentTime = 0;
          } catch (e) {}
        }).catch(function () {});
      }
    } catch (e) {}
  }

  function ensureReadyForPlayback() {
    if (!soundEnabled) return;
    buildPoolsForRegistry();
    silentUnlock();
  }

  function play(src, opts) {
    if (!soundEnabled) return;
    try {
      ensurePoolForSrc(src);
      var conf = opts || {};
      var layers = Math.max(1, Number(conf.layers) || 1);
      var staggerMs = Math.max(0, Number(conf.staggerMs) || 0);
      var baseVol = typeof conf.volume === "number" ? conf.volume : 1;
      var i;
      for (i = 0; i < layers; i++) {
        (function (idx) {
          setTimeout(function () {
            try {
              var a = getPooledSfxAudio(src);
              if (!a) a = new Audio(src);
              a.volume = Math.max(0, Math.min(1, baseVol));
              try {
                a.currentTime = 0;
              } catch (resetError) {}
              var p = a.play();
              if (p && typeof p.catch === "function") p.catch(function () {});
            } catch (e) {}
          }, idx * staggerMs);
        })(i);
      }
    } catch (e) {}
  }

  function setSoundEffectsEnabled(on) {
    soundEnabled = !!on;
    writePrefForUserKey(currentUserKey, soundEnabled);
    emitPrefsChanged();
    if (soundEnabled) ensureReadyForPlayback();
  }

  function isSoundEffectsEnabled() {
    return soundEnabled;
  }

  function bindDocumentUnlockOnce() {
    if (documentUnlockBound) return;
    documentUnlockBound = true;
    function once() {
      if (soundEnabled) ensureReadyForPlayback();
    }
    document.addEventListener("pointerdown", once, { once: true, passive: true });
    document.addEventListener("touchstart", once, { once: true, passive: true });
    document.addEventListener("click", once, { once: true });
  }

  function onAuthChanged() {
    loadEnabledForCurrentUser();
    if (soundEnabled && registry.length) buildPoolsForRegistry();
    emitPrefsChanged();
  }

  function onReadySync() {
    loadEnabledForCurrentUser();
    emitPrefsChanged();
  }

  window.CLWSound = {
    registerTracks: registerTracks,
    play: play,
    setSoundEffectsEnabled: setSoundEffectsEnabled,
    isSoundEffectsEnabled: isSoundEffectsEnabled,
    ensureReadyForPlayback: ensureReadyForPlayback,
    bindDocumentUnlockOnce: bindDocumentUnlockOnce
  };

  loadEnabledForCurrentUser();
  bindDocumentUnlockOnce();
  document.addEventListener("DOMContentLoaded", onReadySync);
  document.addEventListener("site:components-ready", onReadySync);
  document.addEventListener("clw:auth-changed", onAuthChanged);
})();
