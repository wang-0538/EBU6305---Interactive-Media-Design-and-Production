(function () {
  "use strict";

  function tx(str) {
    if (str == null) return "";
    if (window.CLWLocale && typeof CLWLocale.translateTest === "function") {
      return CLWLocale.translateTest(String(str));
    }
    return String(str);
  }

  /** Hint text rebuilt for display so reviewTopic can be translated. */
  function displayHintForQuestion(q) {
    if (!q) return "";
    if (q.type === "image") {
      return tx("Focus on contrast, clarity, and context before visual excitement.");
    }
    var topic = q.reviewTopic ? tx(q.reviewTopic) : "";
    return tx("Pause and match the answer to the core idea in {topic}.").replace("{topic}", topic);
  }

  function txAnswerTrail(s) {
    if (s == null || s === "") return "";
    if (typeof s !== "string") return tx(s);
    if (s.indexOf(" -> ") === -1) return tx(s);
    return s.split(" -> ").map(function (p) { return tx(p.trim()); }).join(" → ");
  }

  var STORAGE_KEY = "clw_test_module_state_v2";
  var LEVEL_ORDER = ["easy", "medium", "hard"];
  var LEVEL_POINTS = { easy: 4, medium: 6, hard: 8 };
  var SFX_BASE = "assets/sound%20effects/";
  var SFX_STAR = SFX_BASE + "star.mp3";
  var SFX_CONFETTI = SFX_BASE + "confetti.mp3";
  var SFX_TADA = SFX_BASE + "tada.mp3";
  var SFX_HINT = SFX_BASE + "hint.mp3";
  var SFX_CORRECT = SFX_BASE + "correct_answer.mp3";
  var SFX_WRONG = SFX_BASE + "wrong_answer.mp3";
  var resultCelebrationState = Object.create(null);
  var EXTERNAL_QUESTION_BANK = window.CLWTestQuestionBank || null;
  var LEARN_SECTION_MAP = {
    basics: {
      chapterTopics: [
        { label: "Overview", href: "learning.html#overview" },
        { label: "Color Models", href: "learning.html#basic-color-models" },
        { label: "Color Spaces", href: "learning.html#basic-color-spaces" },
        { label: "Color Attributes & Perception", href: "learning.html#basic-color-attributes" }
      ],
      unitTopics: {
        "unit-1": [{ label: "Overview", href: "learning.html#overview" }],
        "unit-2": [{ label: "Color Models", href: "learning.html#basic-color-models" }],
        "unit-3": [{ label: "Color Spaces", href: "learning.html#basic-color-spaces" }],
        "unit-4": [{ label: "Color Attributes & Perception", href: "learning.html#basic-color-attributes" }]
      }
    },
    models: {
      chapterTopics: [
        { label: "Bit Depth", href: "learning.html#encoding-bit-depth" },
        { label: "Color Profiles", href: "learning.html#encoding-color-profiles" },
        { label: "Gamma Correction", href: "learning.html#encoding-gamma-correction" }
      ],
      unitTopics: {
        "unit-1": [{ label: "Bit Depth", href: "learning.html#encoding-bit-depth" }],
        "unit-2": [{ label: "Color Profiles", href: "learning.html#encoding-color-profiles" }],
        "unit-3": [{ label: "Gamma Correction", href: "learning.html#encoding-gamma-correction" }],
        "unit-4": [
          { label: "Bit Depth", href: "learning.html#encoding-bit-depth" },
          { label: "Color Profiles", href: "learning.html#encoding-color-profiles" },
          { label: "Gamma Correction", href: "learning.html#encoding-gamma-correction" }
        ]
      }
    },
    meaning: {
      chapterTopics: [
        { label: "HDR Color", href: "learning.html#advance-hdr-color" },
        { label: "Wide Color Gamut", href: "learning.html#advance-wide-gamut" }
      ],
      unitTopics: {
        "unit-1": [{ label: "HDR Color", href: "learning.html#advance-hdr-color" }],
        "unit-2": [{ label: "HDR Color", href: "learning.html#advance-hdr-color" }],
        "unit-3": [{ label: "Wide Color Gamut", href: "learning.html#advance-wide-gamut" }],
        "unit-4": [
          { label: "HDR Color", href: "learning.html#advance-hdr-color" },
          { label: "Wide Color Gamut", href: "learning.html#advance-wide-gamut" }
        ]
      }
    },
    workflow: {
      chapterTopics: [
        { label: "Color Management", href: "learning.html#advance-color-management" }
      ],
      unitTopics: {
        "unit-1": [{ label: "Color Management", href: "learning.html#advance-color-management" }],
        "unit-2": [{ label: "Color Management", href: "learning.html#advance-color-management" }],
        "unit-3": [{ label: "Color Management", href: "learning.html#advance-color-management" }],
        "unit-4": [{ label: "Color Management", href: "learning.html#advance-color-management" }]
      }
    },
    practice: {
      chapterTopics: [
        { label: "Color Picker", href: "learning.html#interaction-color-picker" },
        { label: "Visual Example", href: "learning.html#interaction-visual-example" },
        { label: "Interactive Tools", href: "learning.html#interaction-interactive-tools" }
      ],
      unitTopics: {
        "unit-1": [{ label: "Color Picker", href: "learning.html#interaction-color-picker" }],
        "unit-2": [{ label: "Visual Example", href: "learning.html#interaction-visual-example" }],
        "unit-3": [{ label: "Interactive Tools", href: "learning.html#interaction-interactive-tools" }],
        "unit-4": [
          { label: "Color Picker", href: "learning.html#interaction-color-picker" },
          { label: "Visual Example", href: "learning.html#interaction-visual-example" },
          { label: "Interactive Tools", href: "learning.html#interaction-interactive-tools" }
        ]
      }
    }
  };
  var NO_STRENGTH_CANONICAL =
    "No clear strength yet. Revisit the linked Learn topic before trying this quiz again.";
  function getNoWeaknessMessageKey(levelId) {
    return levelId === "hard"
      ? "No clear weak area yet. You have this down really well!"
      : "No clear weak area yet. Try the next difficulty and see what happens!";
  }

  var CHAPTERS = [
    {
      id: "basics",
      name: "Foundations",
      eyebrow: "Chapter 1",
      intro: "Follow the learn page from overview into models, spaces, and perception.",
      colors: { primary: "#f97316", secondary: "#fb923c", border: "#fed7aa" },
      focuses: {
        easy: ["Overview & Core Concepts", "Color Models", "Color Spaces", "Attributes & Perception"],
        medium: ["Overview & Core Concepts", "Color Models", "Color Spaces", "Attributes & Perception"],
        hard: ["Overview & Core Concepts", "Color Models", "Color Spaces", "Attributes & Perception"]
      }
    },
    {
      id: "models",
      name: "Encoding Fundamentals",
      eyebrow: "Chapter 2",
      intro: "Follow the learn page into bit depth, ICC profiles, gamma, and practical encoding choices.",
      colors: { primary: "#2563eb", secondary: "#38bdf8", border: "#bfdbfe" },
      focuses: {
        easy: ["Bit Depth Basics", "ICC Profiles", "Gamma Correction", "Encoding Decisions"],
        medium: ["Bit Depth Basics", "ICC Profiles", "Gamma Correction", "Encoding Decisions"],
        hard: ["Bit Depth Basics", "ICC Profiles", "Gamma Correction", "Encoding Decisions"]
      }
    },
    {
      id: "meaning",
      name: "Advanced Display Technologies",
      eyebrow: "Chapter 3",
      intro: "Move from core encoding concepts into HDR, wider gamut, and display-oriented production choices.",
      colors: { primary: "#db2777", secondary: "#f472b6", border: "#fbcfe8" },
      focuses: {
        easy: ["HDR Fundamentals", "HDR Standards", "Wide Color Gamut", "HDR & WCG in Practice"],
        medium: ["HDR Fundamentals", "HDR Standards", "Wide Color Gamut", "HDR & WCG in Practice"],
        hard: ["HDR Fundamentals", "HDR Standards", "Wide Color Gamut", "HDR & WCG in Practice"]
      }
    },
    {
      id: "workflow",
      name: "Color Management Workflow",
      eyebrow: "Chapter 4",
      intro: "Connect profiles, rendering intents, and practical review steps into one controlled workflow.",
      colors: { primary: "#0f9f69", secondary: "#34d399", border: "#a7f3d0" },
      focuses: {
        easy: ["Introduction to Color Management", "CMS Architecture", "Rendering Intents", "Practical Workflow"],
        medium: ["Introduction to Color Management", "CMS Architecture", "Rendering Intents", "Practical Workflow"],
        hard: ["Introduction to Color Management", "CMS Architecture", "Rendering Intents", "Practical Workflow"]
      }
    },
    {
      id: "practice",
      name: "Tool Use & Applied Practice",
      eyebrow: "Chapter 5",
      intro: "Use pickers, examples, and interactive tools to make practical colour decisions with more confidence.",
      colors: { primary: "#7c3aed", secondary: "#c084fc", border: "#ddd6fe" },
      focuses: {
        easy: ["Color Picker", "Visual Examples", "Interactive Tools", "Applied Decision Making"],
        medium: ["Color Picker", "Visual Examples", "Interactive Tools", "Applied Decision Making"],
        hard: ["Color Picker", "Visual Examples", "Interactive Tools", "Applied Decision Making"]
      }
    }
  ];

  var LEVELS = [
    { id: "easy", name: "Easy", label: "Starter Path", duration: "5-7 min" },
    { id: "medium", name: "Medium", label: "Applied Path", duration: "7-9 min" },
    { id: "hard", name: "Hard", label: "Critique Path", duration: "9-12 min" }
  ];

  var UNIT_TEMPLATES = {
    easy: [
      { id: "unit-1", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-2", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-3", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-4", kind: "question", label: "", short: "", taskLabel: "Quiz" }
    ],
    medium: [
      { id: "unit-1", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-2", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-3", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-4", kind: "question", label: "", short: "", taskLabel: "Quiz" }
    ],
    hard: [
      { id: "unit-1", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-2", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-3", kind: "question", label: "", short: "", taskLabel: "Quiz" },
      { id: "unit-4", kind: "question", label: "", short: "", taskLabel: "Quiz" }
    ]
  };

  var QUESTION_DATA = buildQuestionData();
  var DEFAULT_STATE = createDefaultState();
  var state = loadState();
  var mainEl = document.querySelector("[data-test-page]");
  var rootEl = document.querySelector("[data-test-root]");
  /** Transient UI while quiz page is active: { kind: "hint" } | { kind: "exit", exitHref: string } */
  var quizDialog = null;
  /** setInterval id for live Time / Score labels on the quiz page */
  var quizLiveTimerId = null;
  /* Solo-practice workbench state (transient, also reflected in URL ?solo=type:id) */
  var soloState = null; // { type, itemId, draft, submitted, isCorrect, filterSheet? }
  var IC = {
    prev: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z"/></svg>',
    hint: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>',
    submit: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    finish: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>',
    correct: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    wrong: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>',
    correctMini: '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.8 8.2l2.6 2.6 6-6"/></svg>',
    wrongMini: '<svg viewBox="0 0 16 16" width="12" height="10" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" aria-hidden="true"><path d="M3.2 3.2l9.6 9.6M12.8 3.2L3.2 12.8"/></svg>',
    overview: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"/></svg>',
    analysis: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    flagFilled: '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    snapshotTitle: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="3" y="13" width="4" height="8" rx="1.5" fill="#818cf8"/><rect x="10" y="8" width="4" height="13" rx="1.5" fill="#6366f1"/><rect x="17" y="3" width="4" height="18" rx="1.5" fill="#4338ca"/></svg>',
    folderTitle: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#fb923c" d="M20 6h-8l-2-2H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>',
    rewardsTitle: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="8.5" r="6" fill="#fbbf24"/><circle cx="12" cy="8.5" r="3.5" fill="#d97706"/><circle cx="12" cy="8.5" r="1.8" fill="#fef9c3"/><path fill="#f59e0b" d="M8.5 14.5l-2 6.5 5.5-3 5.5 3-2-6.5"/></svg>',
    bookTitle: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="#2563eb" d="M4 6.5A1.5 1.5 0 015.5 5H11v14l-3.5-2L4 19V6.5z"/><path fill="#1e40af" d="M20 6.5A1.5 1.5 0 0018.5 5H13v14l3.5-2 3.5 2V6.5z"/><path stroke="#bfdbfe" stroke-width="1.2" stroke-linecap="round" fill="none" d="M6.5 8.5h3.5M6.5 11h3.5M6.5 13.5h2"/><path stroke="#93c5fd" stroke-width="1.2" stroke-linecap="round" fill="none" d="M13.5 8.5h3.5M13.5 11h3.5M13.5 13.5h2"/></svg>',
    strengthTitle: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none"><rect x="1.25" y="7.75" width="4.25" height="8.5" rx="1.1" fill="#c2410c"/><rect x="5.25" y="6.25" width="3.2" height="11.5" rx="0.65" fill="#ea580c"/><rect x="8.35" y="10.35" width="7.3" height="3.3" rx="1.65" fill="#7c2d12"/><rect x="15.55" y="6.25" width="3.2" height="11.5" rx="0.65" fill="#ea580c"/><rect x="18.5" y="7.75" width="4.25" height="8.5" rx="1.1" fill="#c2410c"/><rect x="4.1" y="11.35" width="15.8" height="1.3" rx="0.5" fill="#fb923c"/></svg>',
    weakTitle: '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#14b8a6" stroke-width="1.9"/><circle cx="12" cy="12" r="4.8" fill="none" stroke="#14b8a6" stroke-width="1.9"/><circle cx="12" cy="12" r="2.1" fill="#14b8a6"/></svg>',
    correctStat: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#16a34a"/><path fill="none" stroke="#fff" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" d="M7.2 12.5l2.9 2.9 6.7-6.7"/></svg>',
    wrongStat: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#dc2626"/><path fill="none" stroke="#fff" stroke-width="2.35" stroke-linecap="round" d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8"/></svg>',
    scoreStat: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="#6d28d9"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H9v2h6v-2h-2v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v2.83C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>',
    timeClock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.1.8-1.3-4.5-2.7V7z"/></svg>'
  };

  if (!mainEl || !rootEl) return;

  syncSelectionFromQuery();
  applyChapterTheme(resolveChapterId());
  if (window.CLWSound && typeof CLWSound.registerTracks === "function") {
    CLWSound.registerTracks([SFX_STAR, SFX_CONFETTI, SFX_TADA, SFX_HINT, SFX_CORRECT, SFX_WRONG]);
  }
  initSoloState();
  bindEvents();
  bindAuthStateSync();
  renderPage();
  document.addEventListener("clw:locale-changed", function () {
    renderPage();
  });

  function buildQuestionData() {
    return {
      basics: {
        easy: makeSet(
          ["Color relationships", "Warm and cool color groups", "Readability and contrast", "Lightness and value", "Saturation"],
          "Which pair is complementary on a simple color wheel?",
          ["Blue and orange", "Blue and green", "Yellow and orange", "Red and purple"],
          "Blue and orange",
          "Warm colors usually feel more energetic than cool colors in introductory visual design.",
          true,
          "Pick the sample that gives the clearest text contrast for a quick information card.",
          [
            { id: "a", label: "Cream card with dark navy text", preview: previewText("#fef3c7", "#0f172a", "Dark navy text", "Cream card sample") },
            { id: "b", label: "Mint card with pale lime text", preview: previewText("#a7f3d0", "#d9f99d", "Pale lime text", "Mint card sample") },
            { id: "c", label: "Light pink card with peach text", preview: previewText("#fbcfe8", "#fdba74", "Peach text", "Light pink card sample") }
          ],
          "a",
          "Arrange these swatches from lightest to darkest.",
          ["Pale yellow", "Soft orange", "Brick orange", "Deep brown"],
          "Which description best matches a desaturated color?",
          ["Bright and intense", "Closer to gray and softer", "Always darker than black", "Only used in print"],
          "Closer to gray and softer",
          ["Complementary color pairs", "Warm and cool emotional cues", "Readable contrast for basic interfaces", "Value order and hierarchy", "Saturation basics"]
        ),
        medium: makeSet(
          ["Harmony choices", "Visual hierarchy", "Interface readability", "Palette repair", "Audience fit"],
          "You want calm variety without sharp tension. Which palette is usually the safer first choice?",
          ["Analogous colors", "Complementary colors", "Pure black and white only", "Random vivid colors"],
          "Analogous colors",
          "A single saturated accent can help guide attention when the surrounding colors are quieter.",
          true,
          "Which palette would make secondary information recede while keeping the primary action clear?",
          [
            { id: "a", label: "Muted blue layout with one vivid coral button", preview: previewImage("Muted blue layout with one vivid coral button", "UI preview", "#dbeafe") },
            { id: "b", label: "Every element in strong neon colors", preview: previewImage("Every element in strong neon colors", "UI preview", "#22d3ee") },
            { id: "c", label: "All elements in the same medium gray", preview: previewBg("#94a3b8") }
          ],
          "a",
          "Place these actions in a sensible order when repairing a low-contrast interface.",
          ["Identify the weak text pair", "Increase value contrast", "Retest readability", "Document the approved choice"],
          "A youth event poster needs energy but still readable details. Which direction is strongest?",
          ["Use several vivid accents plus one dark anchor color", "Use pale gray text everywhere", "Remove all contrast for softness", "Use one flat beige tone"],
          "Use several vivid accents plus one dark anchor color",
          ["Choosing analogous palettes", "Saturation and hierarchy", "Value and emphasis balance", "Repairing weak contrast", "Balancing energy with readability"]
        ),
        hard: makeSet(
          ["Strategy trade-offs", "Accessibility trade-offs", "Design critique", "Color review workflow", "Recovering weak layouts"],
          "A health dashboard must feel calm, but an urgent alert still needs fast attention. Which approach is strongest?",
          ["Neutral base with one high-contrast alert accent", "Use all urgent colors throughout", "Avoid contrast so the screen feels soft", "Make alerts smaller than other content"],
          "Neutral base with one high-contrast alert accent",
          "A visually harmonious palette is acceptable even if key labels fall below readable contrast expectations.",
          false,
          "Which redesign best improves both hierarchy and focus for a busy product card?",
          [
            { id: "a", label: "Soft background, dark text, single vivid price tag", preview: previewImage("Soft background, dark text, single vivid price tag", "Card preview", "#f8fafc") },
            { id: "b", label: "Multiple bright badges competing equally", preview: previewImage("Multiple bright badges competing equally", "Card preview", "#22d3ee") },
            { id: "c", label: "Low-contrast neutral card with no clear emphasis", preview: previewImage("Low-contrast neutral card with no clear emphasis", "Card preview", "#e2e8f0") }
          ],
          "a",
          "Order this critique workflow from first review to final approval.",
          ["Check readability", "Check emotional fit", "Test with audience context", "Approve final palette system"],
          "If harmony and readability conflict, what should guide the final color decision on an instructional page?",
          ["Readable communication for the target users", "Only the designer's favorite palette", "The most decorative option", "Whichever uses the most colors"],
          "Readable communication for the target users",
          ["Balancing harmony and emphasis", "Accessibility over decorative harmony", "Critiquing palette hierarchy", "Structured palette critique", "User-centered color decisions"]
        )
      },
      models: {
        easy: makeSet(
          ["Screen color models", "Print versus screen", "Choosing the right model", "Additive color", "HSV use"],
          "Which color model is used most directly by digital displays?",
          ["RGB", "CMYK", "Pantone only", "Charcoal scale"],
          "RGB",
          "CMYK is the color model most closely linked to print production workflows.",
          true,
          "Select the option that best matches a social media banner workflow.",
          [
            { id: "a", label: "RGB export for screens", preview: previewImage("RGB export for screens", "Screen preview", "#2563eb") },
            { id: "b", label: "CMYK ink layout for brochure stock", preview: previewImage("CMYK ink layout for brochure stock", "Print preview", "#ec4899") },
            { id: "c", label: "Single gray proof sheet", preview: previewBg("#64748b") }
          ],
          "a",
          "Arrange the additive mixing sequence from no light to full white light.",
          ["No light", "One channel active", "Two channels active", "All three channels active"],
          "Which HSV control changes how bright or dark a color appears?",
          ["Value", "Hue", "Saturation", "Resolution"],
          "Value",
          ["RGB for digital displays", "CMYK for print", "Matching model to output", "Additive color sequence", "HSV brightness control"]
        ),
        medium: makeSet(
          ["Cross-device output", "Channel interpretation", "Export planning", "Conversion workflow", "HSV as a design tool"],
          "A designer is preparing both a website banner and a printed poster. What is the most reliable starting approach?",
          ["Prepare screen assets in RGB and print assets in CMYK", "Use CMYK for both", "Use RGB for both with no review", "Avoid color conversion entirely"],
          "Prepare screen assets in RGB and print assets in CMYK",
          "Increasing RGB channels usually pushes the image toward darkness.",
          false,
          "Which export note is most suitable for a print handout that must stay consistent on paper?",
          [
            { id: "a", label: "CMYK proof with black text anchor", preview: previewImage("CMYK proof with black text anchor", "Print preview", "#111827") },
            { id: "b", label: "RGB neon gradient for mobile splash", preview: previewImage("RGB neon gradient for mobile splash", "Screen preview", "#0ea5e9") },
            { id: "c", label: "HSV picker screenshot only", preview: previewImage("HSV picker screenshot only", "Tool preview", "#f97316") }
          ],
          "a",
          "Put these actions in a sensible order when a print color looks wrong.",
          ["Identify the original color space", "Check conversion settings", "Proof the result", "Adjust and export again"],
          "When would HSV be most useful during early interface color exploration?",
          ["When quickly testing hue families and brightness variations", "When calibrating a commercial printer", "When replacing all brand guidelines", "When removing accessibility checks"],
          "When quickly testing hue families and brightness variations",
          ["Choosing models for mixed outputs", "Understanding additive color", "Print-ready output decisions", "Fixing wrong color conversions", "When HSV is useful"]
        ),
        hard: makeSet(
          ["Production strategy", "Color management pitfalls", "Interpreting channel data", "Recovery workflow", "System critique"],
          "A campaign must look consistent across app screens, event posters, and social media templates. What should lead the workflow?",
          ["Plan separate output-ready versions with model-aware review", "Keep one RGB file and never test print", "Convert everything at the very end without checking", "Use HSV only for final production"],
          "Plan separate output-ready versions with model-aware review",
          "If a color looks vivid on screen, it will reproduce with the same intensity in every print workflow.",
          false,
          "Which interface note best shows a model-aware decision for a high-stakes report dashboard?",
          [
            { id: "a", label: "Screen-first RGB dashboard with tested alert contrast", preview: previewImage("Screen-first RGB dashboard with tested alert contrast", "Dashboard preview", "#2563eb") },
            { id: "b", label: "Unmanaged neon gradient for every deliverable", preview: previewImage("Unmanaged neon gradient for every deliverable", "Campaign preview", "#7c3aed") },
            { id: "c", label: "Muted grayscale with no signal hierarchy", preview: previewBg("#94a3b8") }
          ],
          "a",
          "Order the recovery workflow after a brand blue shifts badly between screen comps and print proofs.",
          ["Review source color model", "Check profile and conversion intent", "Compare proof to target use", "Approve the adjusted production file"],
          "What is the most responsible message to give a teammate when a screen color cannot print exactly?",
          ["Explain the gamut limit and offer the closest tested alternative", "Promise the same result anyway", "Ignore the difference because most users will not notice", "Remove all color from the design"],
          "Explain the gamut limit and offer the closest tested alternative",
          ["Model-aware production planning", "Screen gamut versus print gamut", "Model-aware interface decisions", "Recovering from conversion issues", "Communicating color model limits"]
        )
      },
      meaning: {
        easy: makeSet(
          ["Mood and emotion", "Inclusive meaning", "Accessible call-to-action", "Audience fit", "Cultural awareness"],
          "A calm wellbeing screen is more likely to start with which color direction?",
          ["Soft blues and greens", "Flashing red on every panel", "Only black warning stripes", "Random intense contrasts"],
          "Soft blues and greens",
          "A warning should not rely on red alone if you want more inclusive communication.",
          true,
          "Which call-to-action sample feels both clear and accessible for a general audience?",
          [
            { id: "a", label: "Dark navy text on pale sky button with clear label", preview: previewText("#dbeafe", "#0f172a", "Continue", "Clear label on pale sky") },
            { id: "b", label: "Pale yellow text on white button", preview: previewText("#ffffff", "#fef9c3", "Continue", "Pale yellow label") },
            { id: "c", label: "Red-only icon with no label", preview: previewImage("Red-only icon with no label", "Button preview", "#fecaca") }
          ],
          "a",
          "Arrange these design goals from most supportive to most alarming for a beginner learning page.",
          ["Clear and calm", "Warm and encouraging", "Focused and urgent", "High-alert emergency tone"],
          "What is the safest assumption about color meaning across cultures?",
          ["Meanings can vary and should be checked", "Every culture reads colors the same way", "Only designers understand color meaning", "Red always means celebration"],
          "Meanings can vary and should be checked",
          ["Mood-setting with color", "Inclusive warning design", "Accessible calls to action", "Matching color tone to learning context", "Checking color meaning across audiences"]
        ),
        medium: makeSet(
          ["Audience and tone", "Ethical feedback visuals", "Signal repair", "Decision process", "Bias reduction"],
          "A global community campaign needs a palette for trust and openness. Which approach is strongest?",
          ["Test color choices with audience context instead of assuming one universal meaning", "Use one symbolic color and never question it", "Choose the brightest colors available", "Avoid all contrast"],
          "Test color choices with audience context instead of assuming one universal meaning",
          "Formative feedback should help users understand what to improve, not only display failure signals.",
          true,
          "Which interface treatment best balances encouragement with clear caution?",
          [
            { id: "a", label: "Neutral surface with one amber warning bar and plain-language label", preview: previewImage("Neutral surface with one amber warning bar and plain-language label", "Status preview", "#f8fafc") },
            { id: "b", label: "Multiple clashing colors on every status label", preview: previewImage("Multiple clashing colors on every status label", "Status preview", "#22d3ee") },
            { id: "c", label: "Muted gray message with no visual distinction", preview: previewBg("#94a3b8") }
          ],
          "a",
          "Put these review steps in a sensible order for an audience-sensitive color decision.",
          ["Clarify communication goal", "Check cultural assumptions", "Test accessibility and contrast", "Approve the final message style"],
          "Which feedback color strategy is best for a learning product?",
          ["Use supportive labels and icons with color, not color alone", "Use harsh red screens for every wrong answer", "Hide all mistakes to avoid emotion", "Use one gray tone for every state"],
          "Use supportive labels and icons with color, not color alone",
          ["Testing meaning with context", "Formative feedback tone", "Balancing caution with support", "Reviewing color meaning responsibly", "Designing supportive feedback states"]
        ),
        hard: makeSet(
          ["Conflicting audience expectations", "Bias-aware design", "Accessible persuasion design", "Ethical evaluation", "Recovering biased signals"],
          "A public information page needs urgency without panic. Which approach is strongest?",
          ["Use a restrained base with a focused warning accent and explicit labels", "Turn the entire page bright red", "Remove contrast to appear calm", "Use multiple unrelated status colors"],
          "Use a restrained base with a focused warning accent and explicit labels",
          "It is safe to assume a single emotional meaning for a color across all ages, contexts, and cultures.",
          false,
          "Which campaign component best encourages action while staying inclusive and readable?",
          [
            { id: "a", label: "High-contrast navy card with one warm action button and direct wording", preview: previewImage("High-contrast navy card with one warm action button and direct wording", "Card preview", "#0f172a") },
            { id: "b", label: "Low-contrast pastel card with hidden action cue", preview: previewImage("Low-contrast pastel card with hidden action cue", "Card preview", "#fce7f3") },
            { id: "c", label: "Flashing red and yellow danger-style panel", preview: previewImage("Flashing red and yellow danger-style panel", "Panel preview", "#ef4444") }
          ],
          "a",
          "Order this ethical review from initial framing to final sign-off.",
          ["Define the message goal", "Check for bias or cultural assumptions", "Test accessibility and emotional tone", "Approve the final communication pattern"],
          "A palette unintentionally stigmatizes a user group. What should the team do first?",
          ["Pause rollout, review the signal with affected context, and revise", "Keep it because the visuals look polished", "Only adjust the font size", "Ignore feedback until launch ends"],
          "Pause rollout, review the signal with affected context, and revise",
          ["Urgency without panic", "Avoiding universal color claims", "Inclusive persuasive design", "Ethical review workflow", "Responding to harmful color signals"]
        )
      }
    };
  }

  function makeSet(topics, mcqPrompt, mcqOptions, mcqCorrect, tfPrompt, tfCorrect, imagePrompt, imageOptions, imageCorrect, sortPrompt, sortItems, bonusPrompt, bonusOptions, bonusCorrect, reviewTopics) {
    return {
      topics: topics,
      mcqPrompt: mcqPrompt,
      mcqOptions: mcqOptions,
      mcqCorrect: mcqCorrect,
      tfPrompt: tfPrompt,
      tfCorrect: tfCorrect,
      imagePrompt: imagePrompt,
      imageOptions: imageOptions,
      imageCorrect: imageCorrect,
      sortPrompt: sortPrompt,
      sortItems: sortItems,
      bonusPrompt: bonusPrompt,
      bonusOptions: bonusOptions,
      bonusCorrect: bonusCorrect,
      reviewTopics: reviewTopics
    };
  }

  function previewText(background, color, text, subtext) {
    return { type: "text-on-bg", background: background, color: color, text: text, subtext: subtext || "Read this sample" };
  }

  function previewBg(background) {
    return { type: "bg", background: background };
  }

  function previewImage(alt, eyebrow, background) {
    return { type: "image", src: "", alt: alt, eyebrow: eyebrow || "Preview pending", background: background || "#e2e8f0" };
  }

  function createDefaultState() {
    var defaultState = {
      version: 2,
      selection: { chapter: "basics", level: "easy" },
      ui: {},
      progress: {
        basics: {
          easy: makeProgress([], "unit-1", 0, 0, ""),
          medium: makeProgress([], "unit-1", 0, 0, ""),
          hard: makeProgress([], "unit-1", 0, 0, "")
        },
        models: {
          easy: makeProgress([], "unit-1", 0, 0, ""),
          medium: makeProgress([], "unit-1", 0, 0, ""),
          hard: makeProgress([], "unit-1", 0, 0, "")
        },
        meaning: {
          easy: makeProgress([], "unit-1", 0, 0, ""),
          medium: makeProgress([], "unit-1", 0, 0, ""),
          hard: makeProgress([], "unit-1", 0, 0, "")
        },
        workflow: {
          easy: makeProgress([], "unit-1", 0, 0, ""),
          medium: makeProgress([], "unit-1", 0, 0, ""),
          hard: makeProgress([], "unit-1", 0, 0, "")
        },
        practice: {
          easy: makeProgress([], "unit-1", 0, 0, ""),
          medium: makeProgress([], "unit-1", 0, 0, ""),
          hard: makeProgress([], "unit-1", 0, 0, "")
        }
      },
      history: [],
      mistakes: [],
      rewards: { lifetimePoints: 0, badges: [], streak: 0, currentStreak: 0, shownBadgeAnimations: [] },
      flagged: [],
      currentQuiz: null,
      lastResult: null,
      lastQuizSubmit: null
    };
    assignGlobalPathStreak(defaultState);
    return defaultState;
  }

  function makeProgress(completedUnits, currentUnit, lastScore, accuracy, lastPlayed) {
    return {
      completedUnits: completedUnits,
      currentUnit: currentUnit,
      lastScore: lastScore,
      accuracy: accuracy,
      lastPlayed: lastPlayed
    };
  }

  function loadState() {
    var raw = readStorage();
    if (!raw || raw.version !== DEFAULT_STATE.version) return clone(DEFAULT_STATE);

    var next = clone(DEFAULT_STATE);
    next.selection = assign(next.selection, raw.selection || {});
    next.ui = assign(next.ui, raw.ui || {});
    next.progress = raw.progress || next.progress;
    next.history = Array.isArray(raw.history) && raw.history.length ? raw.history : next.history;
    next.mistakes = Array.isArray(raw.mistakes) ? raw.mistakes : next.mistakes;
    next.flagged = Array.isArray(raw.flagged) ? raw.flagged : [];
    next.rewards = assign(next.rewards, raw.rewards || {});
    if (!raw.rewards || !Object.prototype.hasOwnProperty.call(raw.rewards, "lifetimePoints")) {
      next.rewards.lifetimePoints = (next.history || []).reduce(function (s, r) {
        return s + (typeof r.score === "number" ? r.score : 0);
      }, 0);
    }
    next.currentQuiz = raw.currentQuiz || null;
    next.lastResult = raw.lastResult || next.lastResult;
    if (raw.lastQuizSubmit && raw.lastQuizSubmit.at && raw.lastQuizSubmit.chapterId && raw.lastQuizSubmit.levelId && raw.lastQuizSubmit.unitId && raw.lastQuizSubmit.mode !== "review") {
      next.lastQuizSubmit = {
        at: raw.lastQuizSubmit.at,
        chapterId: raw.lastQuizSubmit.chapterId,
        levelId: raw.lastQuizSubmit.levelId,
        unitId: raw.lastQuizSubmit.unitId,
        mode: "path",
        reviewIds: []
      };
    } else {
      next.lastQuizSubmit = null;
    }
    normalizeStateForUnitTemplates(next);
    assignGlobalPathStreak(next);
    next.rewards.badges = getBadgeInventoryFromHistory(next.history);
    return next;
  }

  function normalizeStateForUnitTemplates(targetState) {
    CHAPTERS.forEach(function (chapter) {
      LEVEL_ORDER.forEach(function (levelId) {
        var validIds = UNIT_TEMPLATES[levelId].map(function (item) { return item.id; });
        var progress = targetState.progress && targetState.progress[chapter.id] ? targetState.progress[chapter.id][levelId] : null;
        if (!targetState.progress[chapter.id]) targetState.progress[chapter.id] = {};
        if (!progress) {
          targetState.progress[chapter.id][levelId] = makeProgress([], "unit-1", 0, 0, "");
          progress = targetState.progress[chapter.id][levelId];
        }
        if (progress) {
          progress.completedUnits = Array.isArray(progress.completedUnits)
            ? progress.completedUnits.filter(function (id) { return validIds.indexOf(id) !== -1; })
            : [];
          if (validIds.indexOf(progress.currentUnit) === -1) {
            progress.currentUnit = validIds[progress.completedUnits.length] || validIds[validIds.length - 1] || "unit-1";
          }
        }
      });
    });

    if (targetState.currentQuiz) {
      var currentValid = UNIT_TEMPLATES[targetState.currentQuiz.levelId] || [];
      var currentIds = currentValid.map(function (item) { return item.id; });
      if (currentIds.indexOf(targetState.currentQuiz.unitId) === -1) {
        targetState.currentQuiz = null;
      }
    }

    if (targetState.lastQuizSubmit) {
      var submitValid = UNIT_TEMPLATES[targetState.lastQuizSubmit.levelId] || [];
      var submitIds = submitValid.map(function (item) { return item.id; });
      if (submitIds.indexOf(targetState.lastQuizSubmit.unitId) === -1) {
        targetState.lastQuizSubmit = null;
      }
    }

    if (Array.isArray(targetState.history)) {
      targetState.history = targetState.history.filter(function (item) {
        var valid = UNIT_TEMPLATES[item.level] || [];
        var ids = valid.map(function (template) { return template.id; });
        return ids.indexOf(item.unit) !== -1;
      });
    }
  }

  function assignGlobalPathStreak(targetState) {
    var streakState = getGlobalPathStreakState((targetState && targetState.history) || []);
    if (!targetState.rewards) targetState.rewards = {};
    targetState.rewards.currentStreak = streakState.current;
    targetState.rewards.streak = streakState.max;
  }

  function getGlobalPathStreakState(history) {
    var current = 0;
    var max = 0;
    var ordered = Array.isArray(history) ? history.slice().sort(function (a, b) {
      return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
    }) : [];
    ordered.forEach(function (result) {
      if (!result || result.mode !== "path" || !Array.isArray(result.questionResults)) return;
      result.questionResults.forEach(function (item) {
        if (item && item.isCorrect) {
          current += 1;
          max = Math.max(max, current);
        } else {
          current = 0;
        }
      });
    });
    return { current: current, max: max };
  }

  function readStorage() {
    try {
      var raw = localStorage.getItem(getStorageKey());
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  function getStorageKey() {
    var username = getCurrentUsername();
    var scope = username ? username : "guest";
    return STORAGE_KEY + "__" + scope;
  }

  function bindAuthStateSync() {
    document.addEventListener("clw:auth-changed", function () {
      state = loadState();
      syncSelectionFromQuery();
      applyChapterTheme(resolveChapterId());
      renderPage();
    });
  }

  function assign(target, source) {
    var copy = clone(target);
    Object.keys(source).forEach(function (key) {
      copy[key] = source[key];
    });
    return copy;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getAuthApi() {
    return window.CLWAuth || null;
  }

  function getCurrentUsername() {
    var auth = getAuthApi();
    return auth && auth.getCurrentUsername ? auth.getCurrentUsername() : "";
  }

  function drawWrappedCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = String(text || "").split(/\s+/);
    var line = "";
    for (var i = 0; i < words.length; i += 1) {
      var testLine = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = words[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, y);
    return y;
  }

  function drawRoundedRectPath(ctx, x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function buildResultShareImage(result) {
    if (!result) return "";
    var canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 520;
    var ctx = canvas.getContext("2d");
    if (!ctx) return "";
    var chapter = getChapter(result.chapter) || CHAPTERS[0];
    var primary = chapter.colors && chapter.colors.primary ? chapter.colors.primary : "#2563eb";
    var accent = chapter.colors && chapter.colors.secondary ? chapter.colors.secondary : "#f59e0b";
    var accuracyPercent = Math.round(Number(result.accuracy || 0) * 100);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f6f9ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, canvas.width, 18);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 18, canvas.width * Math.max(0.04, accuracyPercent / 100), 10);

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 44px sans-serif";
    ctx.fillText(tx("Color Learning Test Result"), 56, 88);
    ctx.font = "600 25px sans-serif";
    ctx.fillStyle = "#334155";
    drawWrappedCanvasText(ctx, tx(result.chapterName) + " - " + tx(result.levelName), 56, 132, 720, 32);

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#dbe7f7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundedRectPath(ctx, 56, 174, 788, 210, 24);
    ctx.fill();
    ctx.stroke();

    var stats = [
      { label: tx("Score"), value: result.score + " / " + result.maxScore },
      { label: tx("Accuracy"), value: accuracyPercent === 0 ? "00%" : accuracyPercent + "%" },
      { label: tx("Correct"), value: result.correctCount + " / " + result.totalQuestions }
    ];
    stats.forEach(function (item, index) {
      var left = 92 + index * 250;
      ctx.fillStyle = index === 1 && accuracyPercent === 0 ? "#be123c" : primary;
      ctx.font = "800 46px sans-serif";
      ctx.fillText(item.value, left, 262);
      ctx.fillStyle = "#64748b";
      ctx.font = "700 20px sans-serif";
      ctx.fillText(item.label, left, 302);
    });

    if (accuracyPercent === 0) {
      ctx.fillStyle = "#fff1f2";
      ctx.strokeStyle = "#fecaca";
      ctx.beginPath();
      drawRoundedRectPath(ctx, 92, 330, 284, 38, 19);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#9f1239";
      ctx.font = "800 18px sans-serif";
      ctx.fillText(tx("Needs full review"), 116, 355);
    }

    ctx.fillStyle = "#334155";
    ctx.font = "600 20px sans-serif";
    var focus = result.reviewTopics && result.reviewTopics.length ? tx(result.reviewTopics[0]) : tx("Keep practicing this unit.");
    drawWrappedCanvasText(ctx, tx("Next focus: ") + focus, 56, 438, 788, 30);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 16px sans-serif";
    ctx.fillText(tx("Shared from Test"), 56, 482);
    return canvas.toDataURL("image/png");
  }

  function shareResultToCommunity(resultId) {
    if (!resultId) return;
    var result = null;
    for (var i = 0; i < state.history.length; i += 1) {
      if (state.history[i].id === resultId) {
        result = state.history[i];
        break;
      }
    }
    if (!result) return;
    var accuracyPercent = Math.round(Number(result.accuracy || 0) * 100);
    var imageDataUrl = buildResultShareImage(result);
    var draft = {
      content: "Reflection from Test: I scored " + result.score + "/" + result.maxScore + " in " + result.chapterName + " (" + result.levelName + "). My next focus is " + (result.reviewTopics && result.reviewTopics.length ? result.reviewTopics[0] : "reviewing weak topics") + ".",
      tag: "#Theory",
      colorHex: "#2b78e4",
      paletteHexes: [],
      includePalette: false,
      includeImage: !!imageDataUrl,
      imageDataUrl: imageDataUrl,
      origin: "test",
      originMeta: {
        chapter: result.chapterName,
        level: result.levelName,
        score: Number(result.score || 0),
        maxScore: Number(result.maxScore || 0),
        accuracy: accuracyPercent,
        zeroAccuracy: accuracyPercent === 0
      },
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem("clw_community_draft_v1", JSON.stringify(draft));
    } catch (_error) {
      return;
    }
    document.dispatchEvent(new CustomEvent("clw:community-draft-updated", { detail: { origin: "test", resultId: resultId } }));
    window.location.href = "community.html";
  }

  function bindEvents() {
    rootEl.addEventListener("click", handleClick);
    rootEl.addEventListener("change", handleChange);
    document.addEventListener("visibilitychange", handleDocumentVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
  }

  function handleClick(event) {
    var target = event.target;
    var chapterButton = target.closest("[data-chapter-select]");
    var levelButton = target.closest("[data-level-select]");
    var answerButton = target.closest("[data-answer-value]");
    var sortAddButton = target.closest("[data-sort-add]");
    var sortRemoveButton = target.closest("[data-sort-remove]");
    var sortResetButton = target.closest("[data-sort-reset]");
    var quizAction = target.closest("[data-quiz-action]");
    var masteredButton = target.closest("[data-mark-mastered]");
    var explanationButton = target.closest("[data-toggle-explanation]");
    var jumpButton = target.closest("[data-quiz-jump]");
    var flagBtn = target.closest("[data-flag-question]");
    var unflagBtn = target.closest("[data-unflag-question]");
    var shareCommunityBtn = target.closest("[data-share-community]");

    if (chapterButton) {
      state.selection.chapter = chapterButton.getAttribute("data-chapter-select");
      saveState();
      applyChapterTheme(state.selection.chapter);
      renderPage();
      return;
    }
    if (levelButton) {
      state.selection.level = levelButton.getAttribute("data-level-select");
      saveState();
      renderPage();
      return;
    }
    if (answerButton) {
      setDraftAnswer(answerButton.getAttribute("data-answer-value"));
      return;
    }
    if (sortAddButton) {
      addSortItem(sortAddButton.getAttribute("data-sort-add"));
      return;
    }
    if (sortRemoveButton) {
      removeSortItem(Number(sortRemoveButton.getAttribute("data-sort-remove")));
      return;
    }
    if (sortResetButton) {
      resetSortDraft();
      return;
    }
    if (quizAction) {
      handleQuizAction(quizAction.getAttribute("data-quiz-action"));
      return;
    }
    var dialogBackdrop = target.closest("[data-quiz-dialog-backdrop]");
    if (dialogBackdrop && target === dialogBackdrop) {
      quizDialog = null;
      renderPage();
      return;
    }
    var dialogAction = target.closest("[data-quiz-dialog-action]");
    if (dialogAction) {
      var dact = dialogAction.getAttribute("data-quiz-dialog-action");
      if (dact === "cancel") {
        quizDialog = null;
        renderPage();
        return;
      }
      if (dact === "confirm" && quizDialog) {
        if (quizDialog.kind === "hint") {
          quizDialog = null;
          handleQuizAction("hint-confirm");
          return;
        }
        if (quizDialog.kind === "exit" && quizDialog.exitHref) {
          var go = quizDialog.exitHref;
          pauseActiveQuizTimer();
          quizDialog = null;
          window.location.href = go;
          return;
        }
      }
      return;
    }
    var exitQuizBtn = target.closest("[data-quiz-exit]");
    if (exitQuizBtn) {
      event.preventDefault();
      quizDialog = {
        kind: "exit",
        exitHref: exitQuizBtn.getAttribute("data-quiz-exit-href") || "test.html"
      };
      renderPage();
      return;
    }
    if (jumpButton) {
      jumpToQuizQuestion(Number(jumpButton.getAttribute("data-quiz-jump")));
      return;
    }
    if (masteredButton) {
      event.preventDefault();
      toggleMastered(masteredButton.getAttribute("data-mark-mastered"));
      return;
    }
    if (explanationButton) {
      event.preventDefault();
      toggleMistakeExplanation(explanationButton.getAttribute("data-toggle-explanation"));
      return;
    }
    if (flagBtn) {
      event.preventDefault();
      toggleFlag(flagBtn.getAttribute("data-flag-question"));
      return;
    }
    if (unflagBtn) {
      event.preventDefault();
      unflagQuestion(unflagBtn.getAttribute("data-unflag-question"));
      return;
    }
    if (shareCommunityBtn) {
      event.preventDefault();
      shareResultToCommunity(shareCommunityBtn.getAttribute("data-share-community"));
      return;
    }
    var badgeReplayBtn = target.closest("[data-badge-replay]");
    if (badgeReplayBtn) {
      event.preventDefault();
      var replayBadgeName = badgeReplayBtn.getAttribute("data-badge-replay");
      var replayChapterId = getBadgeChapterId(replayBadgeName);
      var replayChapter = getChapter(replayChapterId) || CHAPTERS[0];
      showBadgeRevealAnimation(replayBadgeName, replayChapter.colors.primary, replayChapter.colors.secondary, { originEl: badgeReplayBtn });
      return;
    }
    var practiceBtn = target.closest("[data-practice-question]");
    if (practiceBtn) {
      event.preventDefault();
      enterSoloPractice(practiceBtn.getAttribute("data-practice-type"), practiceBtn.getAttribute("data-practice-question"));
      return;
    }
    var soloFilterToggle = target.closest("[data-solo-toggle-filter]");
    if (soloFilterToggle) {
      event.preventDefault();
      if (soloState) {
        soloState.filterSheet = !soloState.filterSheet;
        renderPage();
      }
      return;
    }
    var soloAction = target.closest("[data-solo-action]");
    if (soloAction) {
      event.preventDefault();
      var act = soloAction.getAttribute("data-solo-action");
      if (act === "submit") { submitSoloPractice(); return; }
      if (act === "exit") { exitSoloPractice(); return; }
      return;
    }
    var soloAnswer = target.closest("[data-solo-answer]");
    if (soloAnswer) {
      setSoloDraft(soloAnswer.getAttribute("data-solo-answer"));
      return;
    }
    var soloSortAdd = target.closest("[data-solo-sort-add]");
    if (soloSortAdd) { addSoloSortItem(soloSortAdd.getAttribute("data-solo-sort-add")); return; }
    var soloSortRemove = target.closest("[data-solo-sort-remove]");
    if (soloSortRemove) { removeSoloSortItem(Number(soloSortRemove.getAttribute("data-solo-sort-remove"))); return; }
    var soloSortReset = target.closest("[data-solo-sort-reset]");
    if (soloSortReset) { resetSoloSortDraft(); return; }
    var soloSelect = target.closest("[data-solo-select]");
    if (soloSelect) {
      event.preventDefault();
      var selId = soloSelect.getAttribute("data-solo-select");
      var selType = soloSelect.getAttribute("data-solo-select-type");
      enterSoloPractice(selType, selId);
      return;
    }
    var attemptNavBtn = target.closest("[data-attempt-nav]");
    if (attemptNavBtn) {
      event.preventDefault();
      var nextResultId = attemptNavBtn.getAttribute("data-attempt-nav");
      var dir = attemptNavBtn.getAttribute("data-slide-dir") || "";
      var found = null;
      for (var hi = 0; hi < state.history.length; hi++) {
        if (state.history[hi].id === nextResultId) { found = state.history[hi]; break; }
      }
      if (found) {
        window.location.href = buildUrl("test-results.html", { chapter: found.chapter, level: found.level, resultId: nextResultId, slideDir: dir });
      }
      return;
    }
    var quizWsDock = target.closest("[data-quiz-workspace-dock]");
    var quizWsDockTab = target.closest("[data-quiz-workspace-dock-tab]");
    if (quizWsDockTab && quizWsDock) {
      event.preventDefault();
      var qTab = quizWsDockTab.getAttribute("data-quiz-workspace-dock-tab");
      var qCur = quizWsDock.getAttribute("data-active") || "";
      if (quizWsDock.classList.contains("is-open") && qCur === qTab) {
        syncQuizWorkspaceDock(quizWsDock, null);
      } else {
        syncQuizWorkspaceDock(quizWsDock, qTab);
      }
      return;
    }
    var openQuizWsDock = rootEl.querySelector("[data-quiz-workspace-dock].is-open");
    if (openQuizWsDock) {
      var qInWsDock = target.closest("[data-quiz-workspace-dock]");
      if (!qInWsDock) {
        syncQuizWorkspaceDock(openQuizWsDock, null);
      }
    }
    var mapDock = target.closest("[data-map-dock]");
    var mapDockTab = target.closest("[data-map-dock-tab]");
    var mapDockScrim = target.closest("[data-map-dock-scrim]");
    if (mapDockTab && mapDock) {
      event.preventDefault();
      var tabId = mapDockTab.getAttribute("data-map-dock-tab");
      var cur = mapDock.getAttribute("data-active") || "";
      if (mapDock.classList.contains("is-open") && cur === tabId) {
        syncMapDockPanel(mapDock, null);
      } else {
        syncMapDockPanel(mapDock, tabId);
      }
      return;
    }
    if (mapDockScrim && mapDock) {
      event.preventDefault();
      syncMapDockPanel(mapDock, null);
      return;
    }
    var openMapDock = rootEl.querySelector("[data-map-dock].is-open");
    if (openMapDock) {
      var inDockSheet = target.closest(".test-map-dock__sheet-wrap");
      var inDockBar = target.closest(".test-map-dock__bar");
      var inDockScrimHit = target.closest("[data-map-dock-scrim]");
      if (!inDockSheet && !inDockBar && !inDockScrimHit) {
        syncMapDockPanel(openMapDock, null);
      }
    }
  }

  function handleChange(event) {
    var target = event.target;
    if (target.matches("[data-map-select='chapter']")) {
      if (getChapter(target.value)) {
        state.selection.chapter = target.value;
        saveState();
        applyChapterTheme(state.selection.chapter);
        renderPage();
      }
      return;
    }
    if (target.matches("[data-map-select='level']")) {
      if (getLevel(target.value)) {
        state.selection.level = target.value;
        saveState();
        renderPage();
      }
      return;
    }
    if (target.matches("[data-mistake-filter='chapter']")) {
      var cTab = getMistakeTab();
      var cSolo = soloState ? soloState.type + ":" + soloState.itemId : "";
      window.location.href = buildUrl("test-mistakes.html", { chapter: target.value === "all" ? "" : target.value, level: getMistakeLevelFilter() === "all" ? "" : getMistakeLevelFilter(), status: getMistakeStatusFilter() === "all" ? "" : getMistakeStatusFilter(), tab: cTab === "mistakes" ? "" : cTab, solo: cSolo });
      return;
    }
    if (target.matches("[data-mistake-filter='level']")) {
      var lTab = getMistakeTab();
      var lSolo = soloState ? soloState.type + ":" + soloState.itemId : "";
      window.location.href = buildUrl("test-mistakes.html", { chapter: getMistakeChapterFilter() === "all" ? "" : getMistakeChapterFilter(), level: target.value === "all" ? "" : target.value, status: getMistakeStatusFilter() === "all" ? "" : getMistakeStatusFilter(), tab: lTab === "mistakes" ? "" : lTab, solo: lSolo });
      return;
    }
    if (target.matches("[data-mistake-filter='status']")) {
      var sTab = getMistakeTab();
      var sSolo = soloState ? soloState.type + ":" + soloState.itemId : "";
      window.location.href = buildUrl("test-mistakes.html", { chapter: getMistakeChapterFilter() === "all" ? "" : getMistakeChapterFilter(), level: getMistakeLevelFilter() === "all" ? "" : getMistakeLevelFilter(), status: target.value === "all" ? "" : target.value, tab: sTab === "mistakes" ? "" : sTab, solo: sSolo });
    }
  }

  function renderPage() {
    try {
      var page = mainEl.getAttribute("data-test-page");
      if (page !== "quiz") stopQuizLiveTimer();
      if (page !== "map") setTestMapDockOpenOnBody(false);
      if (page !== "quiz") quizDialog = null;
      if (page !== "quiz") pauseActiveQuizTimer();
      if (page === "map") return renderMapPage();
      if (page === "quiz") return renderQuizPage();
      if (page === "results") {
        var renderedResult = renderResultsPage();
        runResultCelebrationOnce(renderedResult);
        return;
      }
      return renderMistakesPage();
    } catch (error) {
      var errText = error && error.message ? error.message : String(error || tx("Unknown error"));
      rootEl.innerHTML =
        '<section class="test-hero"><div class="test-kicker">' + tx("Render error") + '</div><h1 class="test-title">' + tx("This page failed to render.") + '</h1><p class="test-subtitle">' + tx("Please refresh once. If it keeps happening, restart this quiz unit from the map.") + '</p><p class="test-subtitle"><strong>' + tx("Error detail:") + '</strong> ' + errText + '</p><div class="test-quick-actions">' +
        renderLinkButton(tx("Back to map"), "test.html", "test-link-btn--primary") +
        "</div></section>";
      if (window && window.console && console.error) console.error("[test-module] renderPage failed:", error);
      setTestMapDockOpenOnBody(false);
    }
  }

  function setTestMapDockOpenOnBody(isOpen) {
    if (typeof document === "undefined" || !document.body) return;
    if (isOpen) document.body.classList.add("test-map-dock-open");
    else document.body.classList.remove("test-map-dock-open");
  }

  function getMapRewardsAnchorEl() {
    var dock = document.querySelector(".test-map-page > .test-map-dock");
    try {
      if (dock && typeof window.getComputedStyle === "function" && window.getComputedStyle(dock).display !== "none") {
        var inDock = dock.querySelector("[data-rewards-card]");
        if (inDock) return inDock;
      }
    } catch (e) {}
    return document.querySelector(".test-sidebar--map [data-rewards-card]");
  }

  function syncMapDockPanel(dockRoot, panelId) {
    if (!dockRoot) return;
    var tabs = dockRoot.querySelectorAll("[data-map-dock-tab]");
    var panels = dockRoot.querySelectorAll("[data-map-dock-panel]");
    var i;
    var tid;
    var pid;
    if (!panelId) {
      dockRoot.classList.remove("is-open");
      dockRoot.removeAttribute("data-active");
      for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("is-active");
        tabs[i].setAttribute("aria-expanded", "false");
      }
      for (i = 0; i < panels.length; i++) {
        panels[i].classList.remove("is-dock-active");
      }
      setTestMapDockOpenOnBody(false);
      return;
    }
    dockRoot.classList.add("is-open");
    dockRoot.setAttribute("data-active", panelId);
    for (i = 0; i < tabs.length; i++) {
      tid = tabs[i].getAttribute("data-map-dock-tab");
      tabs[i].classList.toggle("is-active", tid === panelId);
      tabs[i].setAttribute("aria-expanded", tid === panelId ? "true" : "false");
    }
    for (i = 0; i < panels.length; i++) {
      pid = panels[i].getAttribute("data-map-dock-panel");
      panels[i].classList.toggle("is-dock-active", pid === panelId);
    }
    setTestMapDockOpenOnBody(true);
  }

  function renderMapDockBar() {
    function tab(panel, label) {
      return (
        '<button type="button" class="test-map-dock__tab" data-map-dock-tab="' +
        panel +
        '" aria-expanded="false" aria-controls="map-dock-panel-' +
        panel +
        '">' +
        '<span class="test-map-dock__tab-ic" aria-hidden="true">' +
        (panel === "snapshot"
          ? IC.snapshotTitle
          : panel === "review"
            ? IC.bookTitle
            : panel === "folder"
              ? IC.folderTitle
              : IC.rewardsTitle) +
        "</span>" +
        '<span class="visually-hidden">' +
        label +
        "</span>" +
        "</button>"
      );
    }
    return (
      '<nav class="test-map-dock__bar" aria-label="' + escapeAttr(tx("Map summary panels")) + '">' +
        tab("snapshot", tx("Progress Snapshot")) +
        tab("review", tx("Recommended Review")) +
        tab("folder", tx("Question Folder")) +
        tab("rewards", tx("Rewards")) +
      "</nav>"
    );
  }

  function renderMapPage() {
    var chapter = getChapter(state.selection.chapter) || CHAPTERS[0];
    var level = getLevel(state.selection.level) || LEVELS[0];
    var units = getUnits(chapter.id, level.id);
    var snapshot = getProgressSnapshot(chapter.id, level.id);
    var recommended = getLearnTopicsForChapter(chapter.id);
    var mistakeCount = getVisibleMistakes(chapter.id, level.id).length;
    var totalScore = typeof state.rewards.lifetimePoints === "number" ? state.rewards.lifetimePoints : 0;
    var resumeText = state.lastQuizSubmit && state.lastQuizSubmit.at
      ? formatResumeShortcut(state.lastQuizSubmit.chapterId, state.lastQuizSubmit.levelId, state.lastQuizSubmit.unitId)
      : "\u2014";
    var resumeHref = buildLastSubmitResumeHref(state.lastQuizSubmit);

    applyChapterTheme(chapter.id);
    setTestMapDockOpenOnBody(false);

    var snapshotInner =
      '<div class="test-stat-grid">' +
      renderStat(tx("Whole Chapter"), snapshot.chapterUnits, tx("Finished units in this chapter, all difficulties added together.")) +
      renderStat(tx("Average Accuracy"), snapshot.overallAccuracy, tx("Average accuracy across completed quizzes for the chapter and difficulty you are viewing (every full run counts).")) +
      renderStatLink(tx("Last working on"), resumeText, resumeHref, tx("The map unit (chapter, unit, difficulty) where you last pressed Submit in a normal path quiz - not mistakes review or bookmark practice."), "test-stat--full-row") +
      "</div>";
    var recommendedInner = renderLearnTopicList(recommended);
    var mapAsideCards =
      renderSidebarCard(tx("Progress Snapshot"), snapshotInner, IC.snapshotTitle) +
      renderSidebarCard(tx("Recommended Review"), recommendedInner, IC.bookTitle) +
      renderReviewCard(chapter.id, level.id) +
      renderRewardsCard(totalScore);
    var mapShellDock =
      '<div class="test-map-dock" data-map-dock>' +
      '<button type="button" class="test-map-dock__scrim" data-map-dock-scrim aria-label="' + escapeAttr(tx("Close panel")) + '"></button>' +
      '<div class="test-map-dock__sheet-wrap">' +
      renderSidebarCard(tx("Progress Snapshot"), snapshotInner, IC.snapshotTitle, "snapshot") +
      renderSidebarCard(tx("Recommended Review"), recommendedInner, IC.bookTitle, "review") +
      renderReviewCard(chapter.id, level.id, "folder") +
      renderRewardsCard(totalScore, "rewards") +
      "</div>" +
      renderMapDockBar() +
      "</div>";

    rootEl.innerHTML =
      '<div class="test-map-page">' +
        '<div class="test-map-layout">' +
          '<div class="test-map-main">' +
            '<section class="test-panel test-map-header-card">' +
              '<div class="test-map-hcard__meta">' +
                '<div class="test-kicker">' + tx(chapter.eyebrow) + '</div>' +
                '<h2 class="test-map-heading">' + tx(chapter.name) + '</h2>' +
                '<p class="test-map-intro">' + tx(chapter.intro) + '</p>' +
              '</div>' +
              '<div class="test-map-filters">' +
                '<label class="test-map-topbar__field"><span>' + tx("Chapter") + '</span>' + renderMapChapterSelect(chapter.id) + '</label>' +
                '<label class="test-map-topbar__field"><span>' + tx("Difficulty") + '</span>' + renderMapLevelSelect(level.id) + '</label>' +
              '</div>' +
            '</section>' +
            '<div class="test-grid test-grid--map">' +
              '<section class="test-panel test-map-shell">' +
                '<div class="test-map-list">' + units.map(renderMapNode).join("") + "</div>" +
              "</section>" +
            "</div>" +
          "</div>" +
          '<aside class="test-sidebar test-sidebar--map">' +
            mapAsideCards +
          "</aside>" +
        "</div>" +
        mapShellDock +
      "</div>";

    checkAndShowBadgeReveal();
  }

  function checkAndShowBadgeReveal() {
    var result = state.lastResult;
    if (!result || !result.badgeAwarded) return;
    var badgeName = result.badgeAwarded;
    var shown = Array.isArray(state.rewards.shownBadgeAnimations) ? state.rewards.shownBadgeAnimations : [];
    if (shown.indexOf(badgeName) !== -1) return;
    /* Mark immediately so re-renders do not re-trigger */
    state.rewards.shownBadgeAnimations = shown.concat([badgeName]);
    saveState();
    var chapter = getChapter(result.chapter) || CHAPTERS[0];
    showBadgeRevealAnimation(badgeName, chapter.colors.primary, chapter.colors.secondary);
  }

  function showBadgeRevealAnimation(badgeName, colorPrimary, colorSecondary, opts) {
    opts = opts || {};
    var originEl = opts.originEl || null;

    var rgb = hexToRgb(colorPrimary);
    var c18 = 'rgb(' +
      Math.round(rgb.r * 0.18 + 255 * 0.82) + ',' +
      Math.round(rgb.g * 0.18 + 255 * 0.82) + ',' +
      Math.round(rgb.b * 0.18 + 255 * 0.82) + ')';
    var c12 = 'rgb(' +
      Math.round(rgb.r * 0.12 + 255 * 0.88) + ',' +
      Math.round(rgb.g * 0.12 + 255 * 0.88) + ',' +
      Math.round(rgb.b * 0.12 + 255 * 0.88) + ')';

    var badgeSvg =
      '<svg viewBox="0 0 48 48" aria-hidden="true" width="92" height="92">' +
        '<path d="M11.5 32.5L9 44.5L22 38.8L24 45L26 38.8L39 44.5L36.5 32.5L24 34.2Z" fill="' + colorPrimary + '" opacity="0.93"/>' +
        '<circle cx="24" cy="18" r="13" fill="' + c18 + '" stroke="' + colorPrimary + '" stroke-width="2.5"/>' +
        '<circle cx="24" cy="18" r="8.5" fill="' + c12 + '"/>' +
        '<path d="M24 11.5l2.1 4.25h4.7L27.35 18.9l1.45 4.65L24 20.35l-4.8 3.2 1.45-4.65-3.45-2.15h4.7z" fill="' + colorPrimary + '"/>' +
      '</svg>';

    var chapterId = getBadgeChapterId(badgeName);
    var earnDesc = buildBadgeEarnDescription(chapterId);

    var closeBtnHtml =
      '<button type="button" class="badge-reveal__close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">' +
          '<path d="M6 6l12 12M18 6L6 18"/>' +
        '</svg>' +
      '</button>';

    var overlay = document.createElement('div');
    overlay.className = 'badge-reveal-ol badge-reveal-ol--replay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="badge-reveal__card">' +
        closeBtnHtml +
        '<div class="badge-reveal__content">' +
          '<p class="badge-reveal__kicker" style="color:' + colorPrimary + '">' +
            tx("Your Badge") +
          '</p>' +
          '<h2 class="badge-reveal__title">' + tx("Congratulations!") + '</h2>' +
          '<div class="badge-reveal__stage">' +
            '<div class="badge-reveal__sparkles"></div>' +
            '<div class="badge-reveal__badge">' +
              badgeSvg +
              '<span class="badge-reveal__name" style="color:' + colorPrimary + '">' + tx(badgeName) + '</span>' +
              (earnDesc ? '<span class="badge-reveal__desc">' + earnDesc + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    /* Sparkles */
    var sparkleWrap = overlay.querySelector('.badge-reveal__sparkles');
    var sparkleColors = [colorPrimary, colorSecondary, '#fbbf24', '#ffffff'];
    for (var i = 0; i < 14; i++) {
      var angle = (i / 14) * 360;
      var radius = 66 + (i % 3) * 16;
      var sx = Math.cos(angle * Math.PI / 180) * radius;
      var sy = Math.sin(angle * Math.PI / 180) * radius;
      var size = 5 + (i % 5) * 2.5;
      var delay = Math.round((i * 97) % 750);
      var sp = document.createElement('div');
      sp.className = 'badge-reveal__sparkle';
      sp.style.cssText =
        'left:calc(50% + ' + sx.toFixed(1) + 'px);' +
        'top:calc(50% + ' + sy.toFixed(1) + 'px);' +
        'width:' + size.toFixed(1) + 'px;' +
        'height:' + size.toFixed(1) + 'px;' +
        'background:' + sparkleColors[i % sparkleColors.length] + ';' +
        'animation-delay:' + delay + 'ms;';
      sparkleWrap.appendChild(sp);
    }

    playSfx(SFX_TADA);

    var badgeEl = overlay.querySelector('.badge-reveal__badge');

    /* Phase 2 — wiggle */
    var tWiggle = setTimeout(function () {
      badgeEl.classList.add('is-wiggling');
    }, 920);

    var genieTarget =
      originEl ||
      getMapRewardsAnchorEl() ||
      document.querySelector(".reward-badges");
    var closeBtn = overlay.querySelector('.badge-reveal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        clearTimeout(tWiggle);
        dismissBadgeReveal(overlay, genieTarget);
      });
    }
  }

  function dismissBadgeReveal(overlay, targetEl) {
    var cardEl = overlay.querySelector('.badge-reveal__card');
    if (!cardEl) return;

    var cardRect = cardEl.getBoundingClientRect();
    var cx = cardRect.left + cardRect.width / 2;
    var cy = cardRect.top + cardRect.height / 2;

    var dx = 0;
    var dy = 0;
    if (targetEl) {
      var targetRect = targetEl.getBoundingClientRect();
      dx = (targetRect.left + targetRect.width / 2) - cx;
      dy = (targetRect.top + targetRect.height / 2) - cy;
    }

    var sparkleWrap = overlay.querySelector('.badge-reveal__sparkles');
    if (sparkleWrap) {
      sparkleWrap.style.transition = 'opacity 0.2s ease';
      sparkleWrap.style.opacity = '0';
    }

    /* Stop nested CSS animations so brBadgePop does not restart from opacity:0 when is-wiggling is cleared */
    var badgeEl = overlay.querySelector('.badge-reveal__badge');
    if (badgeEl) {
      badgeEl.classList.remove('is-wiggling');
      badgeEl.style.animation = 'none';
      badgeEl.style.opacity = '1';
      badgeEl.style.transform = 'none';
    }
    var contentEl = overlay.querySelector('.badge-reveal__content');
    if (contentEl) {
      contentEl.style.animation = 'none';
      contentEl.style.opacity = '1';
      contentEl.style.transform = 'none';
    }
    var closeBtn = overlay.querySelector('.badge-reveal__close');
    if (closeBtn) {
      closeBtn.style.animation = 'none';
      closeBtn.style.opacity = '1';
    }

    cardEl.style.animation = 'none';
    cardEl.getBoundingClientRect();
    cardEl.style.transition =
      'transform 0.55s cubic-bezier(0.55, 0, 0.8, 0.08), opacity 0.42s ease 0.12s';
    cardEl.style.transformOrigin = '50% 50%';
    cardEl.style.transform =
      'translate(' + dx.toFixed(1) + 'px, ' + dy.toFixed(1) + 'px) scale(0.04)';
    cardEl.style.opacity = '0';

    setTimeout(function () { overlay.classList.add('is-exiting'); }, 380);
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 950);
  }

  function getBadgeChapterId(badgeName) {
    for (var i = 0; i < CHAPTERS.length; i++) {
      if (buildBadgeName(CHAPTERS[i].id) === badgeName) return CHAPTERS[i].id;
    }
    return CHAPTERS[0].id;
  }

  function buildBadgeEarnDescription(chapterId) {
    var chapter = getChapter(chapterId);
    var name = chapter ? chapter.name : "this chapter";
    var count = UNIT_TEMPLATES.easy.length;
    return tx("Awarded for earning 3 stars on all {count} units in {name} within any single difficulty.")
      .replace("{count}", String(count))
      .replace("{name}", tx(name));
  }

  function renderQuizPage() {
    stopQuizLiveTimer();
    var session = ensureQuizSession();
    if (!session) {
      quizDialog = null;
      rootEl.innerHTML =
        '<section class="test-hero"><div class="test-kicker">' + tx("Quiz unavailable") + '</div><h1 class="test-title">' + tx("No question set is ready for this route yet.") + '</h1><div class="test-quick-actions">' +
        renderLinkButton(tx("Back to map"), "test.html", "test-link-btn--primary") +
        renderLinkButton(tx("Open mistakes"), "test-mistakes.html", "test-link-btn--soft") +
        "</div></section>";
      return;
    }

    var chapter = getChapter(session.chapterId);
    var level = getLevel(session.levelId);
    if (!Array.isArray(session.questions) || !session.questions.length) {
      quizDialog = null;
      rootEl.innerHTML =
        '<section class="test-hero"><div class="test-kicker">' + tx("Quiz unavailable") + '</div><h1 class="test-title">' + tx("No question set is ready for this route yet.") + '</h1><div class="test-quick-actions">' +
        renderLinkButton(tx("Back to map"), "test.html", "test-link-btn--primary") +
        "</div></section>";
      return;
    }
    if (session.currentIndex < 0 || session.currentIndex >= session.questions.length) {
      session.currentIndex = 0;
      saveState();
    }
    var question = session.questions[session.currentIndex];
    if (!question) {
      quizDialog = null;
      rootEl.innerHTML =
        '<section class="test-hero"><div class="test-kicker">' + tx("Quiz unavailable") + '</div><h1 class="test-title">' + tx("Current quiz state is out of sync. Please restart this unit.") + '</h1><div class="test-quick-actions">' +
        renderLinkButton(tx("Restart unit"), buildUrl("test-quiz.html", { chapter: session.chapterId, level: session.levelId, unit: session.unitId, fresh: "1" }), "test-link-btn--primary") +
        renderLinkButton(tx("Back to map"), buildUrl("test.html", { chapter: session.chapterId, level: session.levelId }), "test-link-btn--soft") +
        "</div></section>";
      return;
    }
    if (!question.prompt) question.prompt = tx("Question");
    if (!question.type) question.type = "mcq";
    if (!Array.isArray(question.options) && question.type !== "sort") question.options = [];
    var draft = session.drafts[question.id];
    var answered = Object.keys(session.submitted).length;
    var accuracy = answered ? Math.round((session.correctCount / answered) * 100) + "%" : "0%";
    var currentResult = session.submitted[question.id] || null;
    var progress = Math.max(((session.currentIndex + 1) / session.questions.length) * 100, 8);
    var isLast = session.currentIndex === session.questions.length - 1;
    var allSubmitted = Object.keys(session.submitted).length === session.questions.length;

    applyChapterTheme(session.chapterId);

    var overviewPanelHtml = renderQuizOverviewPanel(session);
    var analysisPanelHtml = renderQuizAnalysisPanel(session, accuracy);

    rootEl.innerHTML =
      '<div class="quiz-shell quiz-shell--workspace">' +
        renderQuizWorkspaceTopbar(session, chapter, level, overviewPanelHtml, analysisPanelHtml) +
        '<div class="quiz-workspace">' +
          '<div class="quiz-workspace__main">' +
            '<section class="quiz-workspace-card">' +
              '<div class="quiz-card__progress-row">' +
                '<span class="quiz-card__progress-text">' + tx("Question {cur} / {total}").replace("{cur}", String(session.currentIndex + 1)).replace("{total}", String(session.questions.length)) + '</span>' +
                '<button type="button" class="quiz-flag-btn' + (isQuestionFlagged(question.id) ? ' is-flagged' : '') + '" data-flag-question="' + question.id + '" title="' + escapeAttr(isQuestionFlagged(question.id) ? tx("Remove bookmark") : tx("Bookmark this question")) + '">' + (isQuestionFlagged(question.id) ? IC.flagFilled : IC.flag) + '</button>' +
              '</div>' +
              '<div class="quiz-progress__bar quiz-card__progress-bar"><div class="quiz-progress__fill" style="width:' + progress + '%"></div></div>' +
              '<h1 class="quiz-workspace-card__prompt">' + tx(question.prompt) + '</h1>' +
              renderQuestionBody(question, draft, currentResult) +
              renderHintBlock(question, session) +
            '</section>' +
            (currentResult ? renderFeedback(question, currentResult) : "") +
            '<div class="quiz-workspace-nav">' +
              renderQuizNavButton(IC.prev + " " + tx("Previous"), "prev", session.currentIndex === 0, "is-prev") +
              renderQuizNavButton(IC.hint + " " + tx("Hint"), "hint", !!currentResult, "is-hint") +
              (currentResult
                ? renderQuizNavButton(isLast ? (session.browseOnly ? tx("Back to summary") : IC.finish + " " + tx("Finish")) : tx("Next") + " " + IC.next, "next", isLast && !allSubmitted, "is-next")
                : renderQuizNavButton(IC.submit + " " + tx("Submit"), "submit", !hasAnswer(question, draft), "is-next")) +
            '</div>' +
          '</div>' +
          '<aside class="quiz-workspace__sidebar">' +
            overviewPanelHtml +
            analysisPanelHtml +
          "</aside>" +
        "</div>" +
      "</div>" +
      renderQuizDialog();
    startQuizLiveTimerIfNeeded();
  }

  function escapeAttr(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function renderQuizDialog() {
    if (!quizDialog) return "";
    var title;
    var body;
    var confirmLabel;
    var cancelLabel;
    var cancelClass = "quiz-dialog__btn quiz-dialog__btn--ghost";
    var confirmClass = "quiz-dialog__btn quiz-dialog__btn--primary";
    if (quizDialog.kind === "hint") {
      title = tx("Use a hint?");
      body =
        tx("If you reveal a hint, you will earn <strong>fewer points</strong> on this question when you answer correctly. Continue?");
      confirmLabel = tx("Show hint");
      cancelLabel = tx("Not now");
      cancelClass = "quiz-dialog__btn quiz-dialog__btn--primary";
      confirmClass = "quiz-dialog__btn quiz-dialog__btn--ghost";
    } else {
      title = tx("Leave this quiz?");
      body =
        tx("Your progress is saved automatically. If you go back now, you can pick up where you left off later.");
      confirmLabel = tx("Leave");
      cancelLabel = tx("Stay");
      cancelClass = "quiz-dialog__btn quiz-dialog__btn--primary";
      confirmClass = "quiz-dialog__btn quiz-dialog__btn--ghost";
    }
    return (
      '<div class="quiz-dialog-backdrop" data-quiz-dialog-backdrop="1" role="presentation">' +
        '<div class="quiz-dialog" role="alertdialog" aria-modal="true" aria-labelledby="quiz-dialog-title">' +
          '<h2 id="quiz-dialog-title" class="quiz-dialog__title">' + title + "</h2>" +
          '<p class="quiz-dialog__body">' + body + "</p>" +
          '<div class="quiz-dialog__actions">' +
            '<button type="button" class="' + cancelClass + '" data-quiz-dialog-action="cancel">' +
              cancelLabel +
            "</button>" +
            '<button type="button" class="' + confirmClass + '" data-quiz-dialog-action="confirm">' +
              confirmLabel +
            "</button>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderQuizWorkspaceTopbar(session, chapter, level, overviewPanelHtml, analysisPanelHtml) {
    var unitIndex = Math.max(0, (Number(session.unitId.split("-")[1]) || 1) - 1);
    var levelName = level && level.name ? tx(level.name) : tx("Level");
    var chapterName = chapter && chapter.name ? tx(chapter.name) : tx("Chapter");
    var title = getMapNodeNumber(session.chapterId, session.levelId, unitIndex) + " · " + levelName;

    var closeHref = session.browseOnly && session.reviewResultId
      ? buildUrl("test-results.html", { chapter: session.chapterId, level: session.levelId, resultId: session.reviewResultId })
      : buildUrl("test.html", { chapter: session.chapterId, level: session.levelId });

    var backLabel = session.browseOnly ? tx("Back to summary") : tx("Leave quiz");
    var closeControl = session.browseOnly
      ? '<a class="quiz-workspace-topbar__close quiz-workspace-topbar__close--browse" href="' + escapeAttr(closeHref) + '" aria-label="' + escapeAttr(backLabel) + '">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>' +
          '<span>' + tx("Back to Summary") + '</span>' +
        "</a>"
      : '<button type="button" class="quiz-workspace-topbar__close" data-quiz-exit data-quiz-exit-href="' + escapeAttr(closeHref) + '" aria-label="' + escapeAttr(backLabel) + '">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>' +
        "</button>";
    var dockHtml =
      overviewPanelHtml && analysisPanelHtml
        ? '<div class="quiz-workspace-topbar__dock" data-quiz-workspace-dock>' +
          '<div class="quiz-workspace-topbar__dock-icons">' +
            '<div class="quiz-workspace-dock-slot quiz-workspace-dock-slot--overview">' +
              '<button type="button" class="quiz-workspace-dock__tab" data-quiz-workspace-dock-tab="overview" aria-expanded="false" aria-controls="quiz-dock-panel-overview">' +
              '<span class="quiz-workspace-dock__tab-ic" aria-hidden="true">' +
              IC.overview +
              "</span>" +
              '<span class="visually-hidden">' + tx("Question Overview") + "</span>" +
              "</button>" +
              '<div id="quiz-dock-panel-overview" class="quiz-workspace-dock__sheet" data-quiz-workspace-dock-sheet="overview">' +
              overviewPanelHtml +
              "</div>" +
            "</div>" +
            '<div class="quiz-workspace-dock-slot quiz-workspace-dock-slot--analysis">' +
              '<button type="button" class="quiz-workspace-dock__tab" data-quiz-workspace-dock-tab="analysis" aria-expanded="false" aria-controls="quiz-dock-panel-analysis">' +
              '<span class="quiz-workspace-dock__tab-ic" aria-hidden="true">' +
              IC.analysis +
              "</span>" +
              '<span class="visually-hidden">' + tx("Live Analysis") + "</span>" +
              "</button>" +
              '<div id="quiz-dock-panel-analysis" class="quiz-workspace-dock__sheet" data-quiz-workspace-dock-sheet="analysis">' +
              analysisPanelHtml +
              "</div>" +
            "</div>" +
          "</div>" +
          "</div>"
        : "";
    return (
      '<section class="quiz-workspace-topbar">' +
      '<div class="quiz-workspace-topbar__backblock">' +
      closeControl +
      '<div class="quiz-workspace-topbar__heading"><strong>' +
      title +
      "</strong><span>" +
      chapterName +
      "</span></div>" +
      "</div>" +
      dockHtml +
      "</section>"
    );
  }

  function syncQuizWorkspaceDock(dockRoot, panelId) {
    if (!dockRoot) return;
    var tabs = dockRoot.querySelectorAll("[data-quiz-workspace-dock-tab]");
    var sheets = dockRoot.querySelectorAll("[data-quiz-workspace-dock-sheet]");
    var i;
    var tid;
    var sid;
    if (!panelId) {
      dockRoot.classList.remove("is-open");
      dockRoot.removeAttribute("data-active");
      for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("is-active");
        tabs[i].setAttribute("aria-expanded", "false");
      }
      for (i = 0; i < sheets.length; i++) {
        sheets[i].classList.remove("is-dock-active");
      }
      return;
    }
    dockRoot.classList.add("is-open");
    dockRoot.setAttribute("data-active", panelId);
    for (i = 0; i < tabs.length; i++) {
      tid = tabs[i].getAttribute("data-quiz-workspace-dock-tab");
      tabs[i].classList.toggle("is-active", tid === panelId);
      tabs[i].setAttribute("aria-expanded", tid === panelId ? "true" : "false");
    }
    for (i = 0; i < sheets.length; i++) {
      sid = sheets[i].getAttribute("data-quiz-workspace-dock-sheet");
      sheets[i].classList.toggle("is-dock-active", sid === panelId);
    }
  }

  function renderQuizLiveTimeScoreRow(session) {
    var timeText = formatElapsedDuration(getQuizElapsedMs(session));
    return (
      '<div class="quiz-sidecard__statgrid quiz-sidecard__statgrid--timescore">' +
        '<div class="quiz-sidecard__stat is-time">' +
          '<span class="quiz-sidecard__stat-ic quiz-sidecard__stat-ic--time" aria-hidden="true">' +
          IC.timeClock +
          "</span>" +
          '<span class="quiz-sidecard__stat-name">' + tx("Time") + '</span>' +
          '<strong class="quiz-sidecard__stat-val"><span data-quiz-live-time>' +
          timeText +
          "</span></strong>" +
        "</div>" +
        '<div class="quiz-sidecard__stat is-score">' +
          '<span class="quiz-sidecard__stat-ic" aria-hidden="true">' +
          IC.scoreStat +
          "</span>" +
          '<span class="quiz-sidecard__stat-name">' + tx("Current Score") + '</span>' +
          '<strong class="quiz-sidecard__stat-val"><span data-quiz-live-score>' +
          session.score +
          "</span></strong>" +
        "</div>" +
      "</div>"
    );
  }

  function renderQuizOverviewPanel(session) {
    var answered = Object.keys(session.submitted).length;

    return '<section class="quiz-sidecard quiz-sidecard--overview">' +
      '<h3 class="quiz-sidecard__title">' + IC.overview + " " + tx("Question Overview") + "</h3>" +
      '<div class="quiz-index-grid">' + session.questions.map(function (item, index) {
        var result = session.submitted[item.id];
        var classes = "quiz-index-btn";
        var statusIcon = "";
        if (index === session.currentIndex) {
          if (result) {
            classes += " is-current-submitted";
            classes += result.isCorrect ? " is-correct" : " is-wrong";
          } else {
            classes += " is-current";
          }
        } else if (result) classes += result.isCorrect ? " is-correct" : " is-wrong";
        if (result) {
          statusIcon = '<span class="quiz-index-btn__status" aria-hidden="true">' + (result.isCorrect ? IC.correctMini : IC.wrongMini) + '</span>';
        }
        return '<button type="button" class="' + classes + '" data-quiz-jump="' + index + '"><span class="quiz-index-btn__number">' + (index + 1) + '</span>' + statusIcon + '</button>';
      }).join("") + '</div>' +
      '<div class="quiz-overview-stats"><span>' + tx("Answered:") + '</span><strong>' + answered + ' / ' + session.questions.length + '</strong></div>' +
    '</section>';
  }

  function renderQuizAnalysisPanel(session, accuracy) {
    return '<section class="quiz-sidecard quiz-sidecard--analysis">' +
      '<h3 class="quiz-sidecard__title">' + IC.analysis + " " + tx("Live Analysis") + "</h3>" +
      '<div class="quiz-sidecard__metric"><span>' + tx("Accuracy") + '</span><strong>' + accuracy + '</strong></div>' +
      '<div class="quiz-sidecard__meter"><div class="quiz-sidecard__meter-fill" style="width:' + Math.max(parseInt(accuracy, 10) || 0, 4) + '%"></div></div>' +
      '<div class="quiz-sidecard__statgrid">' +
        '<div class="quiz-sidecard__stat is-correct">' +
          '<span class="quiz-sidecard__stat-ic" aria-hidden="true">' + IC.correctStat + '</span>' +
          '<span class="quiz-sidecard__stat-name">' + tx("Correct") + '</span>' +
          '<strong class="quiz-sidecard__stat-val">' + session.correctCount + '</strong>' +
        '</div>' +
        '<div class="quiz-sidecard__stat is-wrong">' +
          '<span class="quiz-sidecard__stat-ic" aria-hidden="true">' + IC.wrongStat + '</span>' +
          '<span class="quiz-sidecard__stat-name">' + tx("Wrong") + '</span>' +
          '<strong class="quiz-sidecard__stat-val">' + Math.max(Object.keys(session.submitted).length - session.correctCount, 0) + '</strong>' +
        '</div>' +
      '</div>' +
      renderQuizLiveTimeScoreRow(session) +
    '</section>';
  }

  function renderQuizNavButton(label, action, disabled, extraClass) {
    return '<button type="button" class="quiz-nav-btn ' + (extraClass || "") + '" data-quiz-action="' + action + '"' + (disabled ? " disabled" : "") + '>' + label + '</button>';
  }

  function buildResultBadgeMarkup(badgeName) {
    return (
      '<div class="result-badge-wrap">' +
        '<div class="result-badge-icon"><svg viewBox="0 0 48 48" aria-hidden="true" width="52" height="52">' +
          '<path d="M11.5 32.5L9 44.5L22 38.8L24 45L26 38.8L39 44.5L36.5 32.5L24 34.2Z" fill="var(--color-primary)" opacity="0.93"/>' +
          '<circle cx="24" cy="18" r="13" fill="color-mix(in srgb,var(--color-primary) 18%,white)" stroke="var(--color-primary)" stroke-width="2.5"/>' +
          '<circle cx="24" cy="18" r="8.5" fill="color-mix(in srgb,var(--color-primary) 12%,white)"/>' +
          '<path d="M24 11.5l2.1 4.25h4.7L27.35 18.9l1.45 4.65L24 20.35l-4.8 3.2 1.45-4.65-3.45-2.15h4.7z" fill="var(--color-primary)"/>' +
        "</svg></div>" +
        '<span class="result-badge-name">' + tx(badgeName) + "</span>" +
      "</div>"
    );
  }

  function renderResultsPage() {
    var params = getParams();
    var result = getResultForPage();
    if (!result) {
      rootEl.innerHTML =
        '<section class="test-hero"><div class="test-kicker">' + tx("Results unavailable") + '</div><h1 class="test-title">' + tx("No completed quiz result is available yet.") + '</h1><div class="test-quick-actions">' +
        renderLinkButton(tx("Back to map"), "test.html", "test-link-btn--primary") +
        "</div></section>";
      return null;
    }
    var nextLevel = getNextLevel(result.level);
    var unitIndex = getUnitIndexInLevel(result.level, result.unit);
    var nodeNum = getMapNodeNumber(result.chapter, result.level, unitIndex);
    var backUrl = buildUrl("test.html", { chapter: result.chapter, level: result.level });
    var slideDir = params.slideDir || "";

    /* collect all attempts for this unit, sorted oldest → newest */
    var allAttempts = state.history.filter(function (item) {
      return item.chapter === result.chapter && item.level === result.level && item.unit === result.unit;
    }).slice().sort(function (a, b) { return a.timestamp < b.timestamp ? -1 : 1; });
    var currentIdx = 0;
    for (var ai = 0; ai < allAttempts.length; ai++) {
      if (allAttempts[ai].id === result.id) { currentIdx = ai; break; }
    }
    var prevAttempt = currentIdx > 0 ? allAttempts[currentIdx - 1] : null;
    var nextAttempt = currentIdx < allAttempts.length - 1 ? allAttempts[currentIdx + 1] : null;
    var learnTopics = getLearnTopicsForUnit(result.chapter, result.unit);
    var learnHref = getPrimaryLearnHref(result.chapter, result.unit);
    var resultsHintDelaySec = Math.max(0, (result.starsEarned || 0) * 0.28 + 0.42 + 0.06);

    applyChapterTheme(result.chapter);

    /* mini question overview blocks */
    var qResults = Array.isArray(result.questionResults) && result.questionResults.length
      ? result.questionResults
      : (function () {
          var arr = [];
          var c = typeof result.correctCount === "number" ? result.correctCount : 0;
          var t = typeof result.totalQuestions === "number" ? result.totalQuestions : 0;
          for (var qi = 0; qi < t; qi++) arr.push({ isCorrect: qi < c });
          return arr;
        })();
    var miniOvHtml =
      '<div class="results-mini-ov-wrap">' +
        '<p class="results-mini-ov__hint" style="animation-delay:' + resultsHintDelaySec.toFixed(2) + 's">' + tx("Tap a box to review!") + ' <span aria-hidden="true">→</span></p>' +
        '<div class="results-mini-ov">' +
        qResults.map(function (qr, i) {
          var cls = qr.isCorrect === null ? " is-pending" : qr.isCorrect ? " is-correct" : " is-wrong";
          var statusIcon = qr.isCorrect === null ? "" : '<span class="results-mini-ov__status" aria-hidden="true">' + (qr.isCorrect ? IC.correctMini : IC.wrongMini) + '</span>';
          var browseHref = buildUrl("test-quiz.html", {
            chapter: result.chapter,
            level: result.level,
            unit: result.unit,
            resultId: result.id,
            browse: "1",
            q: String(i)
          });
          return '<a class="results-mini-ov__block' + cls + '" href="' + browseHref + '"><span class="results-mini-ov__number">' + (i + 1) + '</span>' + statusIcon + "</a>";
        }).join("") +
        '</div>' +
      '</div>';

    /* attempt switcher bar */
    var attemptBarHtml = allAttempts.length > 1
      ? '<div class="results-attempt-bar">' +
          '<button type="button" class="results-attempt-nav-btn"' +
            (prevAttempt ? ' data-attempt-nav="' + prevAttempt.id + '" data-slide-dir="right"' : ' disabled') +
            ' aria-label="' + escapeAttr(tx("Older attempt")) + '">\u2039</button>' +
          '<div class="results-attempt-info">' +
            '<span class="results-attempt-label">' + tx("Attempt {cur} / {total}").replace("{cur}", String(currentIdx + 1)).replace("{total}", String(allAttempts.length)) + '</span>' +
            '<span class="results-attempt-date">' + formatDateTime(result.timestamp) + '</span>' +
          '</div>' +
          '<button type="button" class="results-attempt-nav-btn"' +
            (nextAttempt ? ' data-attempt-nav="' + nextAttempt.id + '" data-slide-dir="left"' : ' disabled') +
            ' aria-label="' + escapeAttr(tx("Newer attempt")) + '">\u203a</button>' +
        '</div>'
      : '<div class="results-attempt-bar results-attempt-bar--single">' +
          '<div class="results-attempt-info">' +
            '<span class="results-attempt-label">' + tx("First attempt") + '</span>' +
            '<span class="results-attempt-date">' + formatDateTime(result.timestamp) + '</span>' +
          '</div>' +
        '</div>';

    /* stars + badge */
    var starPath = "M24 5l4.9 10.1 11.1 1.6-8 7.8 1.9 11-9.9-5.2-9.9 5.2 1.9-11-8-7.8 11.1-1.6z";
    var starsHtml = [1, 2, 3].map(function (i) {
      var willFill = i <= result.starsEarned;
      return '<div class="result-star-wrap' + (willFill ? ' will-fill' : '') + '" style="animation-delay:' + (i * 0.28) + 's">' +
        '<svg class="result-star-svg" viewBox="0 0 48 48" aria-hidden="true">' +
          '<path class="result-star-outline" d="' + starPath + '" stroke-linejoin="round"/>' +
          (willFill ? '<path class="result-star-fill" d="' + starPath + '" stroke-linejoin="round" style="animation-delay:' + (i * 0.28) + 's"/>' : '') +
        '</svg>' +
      '</div>';
    }).join("");
    var celebrationState = resultCelebrationState[result.id] || "";
    var celebrationDone = celebrationState === "done";
    var celebrationRunning = celebrationState === "running";
    var badgeHtml = result.badgeAwarded && celebrationDone
      ? buildResultBadgeMarkup(result.badgeAwarded)
      : result.badgeAwarded
      ? '<div class="result-badge-wrap result-badge-wrap--slot" id="result-badge-slot" aria-hidden="true"></div>'
      : '';

    rootEl.innerHTML =
      '<div class="results-page' + (celebrationDone ? ' is-celebrated' : celebrationRunning ? ' is-celebrating' : '') + '">' +
        '<div class="results-topbar">' +
          '<a class="results-back-btn" href="' + backUrl + '" aria-label="' + escapeAttr(tx("Back to map")) + '">' + IC.prev + '</a>' +
          '<div class="results-topbar__heading">' +
            '<div class="test-kicker">' + tx("Results Summary") + '</div>' +
            '<h1 class="test-title">' + tx(result.chapterName) + ' ' + nodeNum + ' \u2013 ' + tx(result.levelName) + '</h1>' +
          '</div>' +
          '<div class="results-topbar__right">' +
            miniOvHtml +
          '</div>' +
        '</div>' +
        attemptBarHtml +
        '<div class="results-slidable"' + (slideDir ? ' data-slide-dir="' + slideDir + '"' : '') + '>' +
          '<div class="results-stars-section">' +
            '<div class="results-stars-row">' + starsHtml + badgeHtml + '</div>' +
            '<div class="result-stats-grid">' +
              renderResultStat(tx("Score"), result.score + " / " + result.maxScore) +
              renderResultStat(tx("Accuracy"), Math.round(result.accuracy * 100) + "%") +
              renderResultStat(tx("Hints used"), result.hintsUsed) +
              renderResultStat(tx("Time spent"), formatElapsedDuration(getResultElapsedMs(result))) +
            '</div>' +
          '</div>' +
          '<div class="results-insights">' +
            '<div class="results-split">' +
              renderResultsCard("Strengths", renderResultInsightContent(result.strengths, NO_STRENGTH_CANONICAL), IC.strengthTitle) +
              renderResultsCard(
                "Weak Areas",
                renderResultInsightContent(result.weakAreas, result.weakAreasEmptyMessage || getNoWeaknessMessageKey(result.level)),
                IC.weakTitle
              ) +
              renderResultsCard("Recommended review topics", renderLearnTopicList(learnTopics), IC.bookTitle) +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="results-actions-bar">' +
          renderLinkButton(
            '<span class="label-desktop">' + tx("Retry This Quiz") + '</span><span class="label-mobile">' + tx("Retry") + '</span>',
            buildUrl("test-quiz.html", { chapter: result.chapter, level: result.level, unit: result.unit, fresh: "1" }),
            "test-link-btn--primary results-action-retry"
          ) +
          renderLinkButton(
            tx("Reflect"),
            buildUrl("test-quiz.html", { chapter: result.chapter, level: result.level, unit: result.unit, resultId: result.id, browse: "1" }),
            "test-link-btn--primary results-action-summarize"
          ) +
          '<button type="button" class="test-link-btn test-link-btn--primary results-action-share" data-share-community="' + result.id + '">' +
            '<span class="results-action-share__icon" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">' +
                '<path d="M16 11c1.93 0 3.5-1.57 3.5-3.5S17.93 4 16 4s-3.5 1.57-3.5 3.5S14.07 11 16 11zm-8 0c1.93 0 3.5-1.57 3.5-3.5S9.93 4 8 4 4.5 5.57 4.5 7.5 6.07 11 8 11zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8 0c-.29 0-.62.02-.97.05 1.33.96 2.47 2.25 2.47 3.95v2h6v-2c0-2.66-5.33-4-7.5-4z"/>' +
              "</svg>" +
            "</span>" +
            '<span class="label-desktop">' + tx("Share to Community") + '</span><span class="label-mobile">' + tx("Share") + '</span>' +
          "</button>" +
        '</div>' +
      '</div>';

    return result;
  }

  function runResultCelebrationOnce(result) {
    if (!result || !result.id || resultCelebrationState[result.id]) return;
    resultCelebrationState[result.id] = "running";

    requestAnimationFrame(function () {
      var pageEl = rootEl.querySelector(".results-page");
      if (pageEl) {
        pageEl.offsetHeight;
        pageEl.classList.add("is-celebrating");
      }

      /* Timings match CSS starPop / starFill delays (0.28s step, 0.42s pop, peak ~60%). */
      var starStepMs = 280;
      var starPopMs = 420;
      var starPeakMs = Math.round(starPopMs * 0.6);
      var si;
      for (si = 1; si <= result.starsEarned; si++) {
        scheduleSfx(SFX_STAR, si * starStepMs + starPeakMs);
      }
      if (result.starsEarned === 3) {
        var badgeDelayMs = 3 * starStepMs + 180;
        var badgePeakMs = Math.round(500 * 0.52);
        var confettiAtMs = badgeDelayMs + badgePeakMs;
        scheduleSfx(result.badgeAwarded ? SFX_TADA : SFX_CONFETTI, confettiAtMs);
        setTimeout(function () {
          launchConfetti();
          if (result.badgeAwarded) {
            var slot = document.getElementById("result-badge-slot");
            if (slot) slot.outerHTML = buildResultBadgeMarkup(result.badgeAwarded);
          }
        }, confettiAtMs);
      }
      setTimeout(function () {
        resultCelebrationState[result.id] = "done";
        var currentPageEl = rootEl.querySelector(".results-page");
        if (currentPageEl) {
          currentPageEl.classList.remove("is-celebrating");
          currentPageEl.classList.add("is-celebrated");
        }
      }, getResultCelebrationDurationMs(result, starStepMs, starPopMs));
    });
  }

  function getResultCelebrationDurationMs(result, starStepMs, starPopMs) {
    var starCount = Math.max(0, Number(result && result.starsEarned) || 0);
    var starEndMs = starCount ? starCount * starStepMs + starPopMs : 0;
    if (result && result.starsEarned === 3) {
      var badgeDelayMs = 3 * starStepMs + 180;
      var badgePeakMs = Math.round(500 * 0.52);
      return Math.max(starEndMs, badgeDelayMs + badgePeakMs + 550);
    }
    return starEndMs;
  }

  function renderMistakesPage() {
    var chapterFilter = getMistakeChapterFilter();
    var levelFilter = getMistakeLevelFilter();
    var statusFilter = getMistakeStatusFilter();
    var tab = getMistakeTab();
    var rawMistakePage = getMistakePage();
    var PER_PAGE = isTestMistakesNarrowViewport() ? 3 : 9;

    // Use the home theme colours, not the chapter override
    mainEl.style.removeProperty("--theme-stop-2");
    mainEl.style.removeProperty("--theme-stop-3");
    mainEl.style.removeProperty("--color-primary");
    mainEl.style.removeProperty("--test-border");

    var backUrl = buildUrl("test.html", { chapter: chapterFilter === "all" ? state.selection.chapter : chapterFilter, level: levelFilter === "all" ? state.selection.level : levelFilter });
    var mkTabUrl = buildUrl("test-mistakes.html", {});
    var flTabUrl = buildUrl("test-mistakes.html", { tab: "flagged" });

    var allMistakes = getVisibleMistakes(chapterFilter, levelFilter, "all");
    var reviewedCount = allMistakes.filter(function (i) { return i.mastered; }).length;
    var pendingCount = allMistakes.length - reviewedCount;
    var allFlagged = getVisibleFlagged(chapterFilter, levelFilter);

    var bookmarkSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
    var mistakeSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 13.59L14.59 17 12 14.41 9.41 17 8 15.59l2.59-2.59L8 10.41 9.41 9 12 11.59 14.59 9 16 10.41l-2.59 2.59L16 15.59z"/></svg>';

    var tabsHtml =
      '<nav class="mistakes-tabs" aria-label="' + escapeAttr(tx("Question folder sections")) + '">' +
        '<a class="mistakes-tab' + (tab === "mistakes" ? " is-active" : "") + '" href="' + mkTabUrl + '">' +
          mistakeSvg + " " + tx("Mistakes") +
        '</a>' +
        '<a class="mistakes-tab' + (tab === "flagged" ? " is-active" : "") + '" href="' + flTabUrl + '">' +
          bookmarkSvg + " " + tx("Bookmarked") +
        '</a>' +
      '</nav>';

    var bodyHtml;
    if (tab === "flagged") {
      var fTotalPages = Math.max(1, Math.ceil(allFlagged.length / PER_PAGE));
      var fPage = Math.min(rawMistakePage, fTotalPages);
      var fPageItems = allFlagged.slice((fPage - 1) * PER_PAGE, fPage * PER_PAGE);
      bodyHtml =
        renderMistakesToolbar(chapterFilter, levelFilter, null) +
        (fPageItems.length
          ? '<div class="mistake-compact-grid">' + fPageItems.map(renderFlaggedCompactCard).join("") + '</div>'
          : '<div class="mistakes-empty mistakes-empty--stacked"><p class="mistakes-empty__line">' + tx("No bookmarked questions yet.") + '</p><p class="mistakes-empty__line">' + tx("Use the bookmark button during a quiz to save questions here.") + '</p></div>') +
        renderPagination(fPage, fTotalPages, chapterFilter, levelFilter, tab, "");
    } else {
      var visible = getVisibleMistakes(chapterFilter, levelFilter, statusFilter);
      var mTotalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
      var mPage = Math.min(rawMistakePage, mTotalPages);
      var mPageItems = visible.slice((mPage - 1) * PER_PAGE, mPage * PER_PAGE);
      bodyHtml =
        renderMistakesToolbar(chapterFilter, levelFilter, statusFilter) +
        '<div class="mistakes-stats-row">' +
          '<span class="mstat mstat--total"><strong>' + allMistakes.length + '</strong> ' + tx("total") + '</span>' +
          '<span class="msb-sep" aria-hidden="true"></span>' +
          '<span class="mstat mstat--reviewed"><strong>' + reviewedCount + '</strong> ' + tx("reviewed") + '</span>' +
          '<span class="msb-sep" aria-hidden="true"></span>' +
          '<span class="mstat mstat--pending"><strong>' + pendingCount + '</strong> ' + tx("pending") + '</span>' +
        '</div>' +
        (mPageItems.length
          ? '<div class="mistake-compact-grid">' + mPageItems.map(renderMistakeCompactCard).join("") + '</div>'
          : '<div class="mistakes-empty">' + tx("No mistakes match the current filters.") + '</div>') +
        renderPagination(mPage, mTotalPages, chapterFilter, levelFilter, tab, statusFilter);
    }

    var mainBodyHtml;
    if (soloState) {
      var soloToolbar = tab === "flagged"
        ? renderMistakesToolbar(chapterFilter, levelFilter, null)
        : renderMistakesToolbar(chapterFilter, levelFilter, statusFilter) +
          '<div class="mistakes-stats-row">' +
            '<span class="mstat mstat--total"><strong>' + allMistakes.length + '</strong> ' + tx("total") + '</span>' +
            '<span class="msb-sep" aria-hidden="true"></span>' +
            '<span class="mstat mstat--reviewed"><strong>' + reviewedCount + '</strong> ' + tx("reviewed") + '</span>' +
            '<span class="msb-sep" aria-hidden="true"></span>' +
            '<span class="mstat mstat--pending"><strong>' + pendingCount + '</strong> ' + tx("pending") + '</span>' +
          '</div>';
      mainBodyHtml =
        '<div class="mistakes-tab-body mistakes-tab-body--solo">' +
          soloToolbar +
          renderSoloPractice(tab, chapterFilter, levelFilter, statusFilter) +
        '</div>';
    } else {
      mainBodyHtml = '<div class="mistakes-tab-body">' + bodyHtml + '</div>';
    }

    rootEl.innerHTML =
      '<div class="mistakes-shell">' +
        '<header class="mistakes-header">' +
          '<div class="mistakes-header__left">' +
            '<a class="mistakes-back-btn" href="' + backUrl + '" aria-label="' + escapeAttr(tx("Back to map")) + '">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>' +
            '</a>' +
            '<div class="mistakes-header__text">' +
              '<div class="test-kicker">' + tx("Study Tools") + '</div>' +
              '<h1 class="mistakes-title">' + tx("Question Folder") + '</h1>' +
              '<p class="mistakes-subtitle">' + tx("Review missed and bookmarked questions.") + '</p>' +
            '</div>' +
          '</div>' +
          tabsHtml +
        '</header>' +
        mainBodyHtml +
      '</div>';
  }

  function pickQuestionResultForBrowse(qres, qid, idx) {
    if (!Array.isArray(qres)) return null;
    for (var ri = 0; ri < qres.length; ri++) {
      if (qres[ri] && qres[ri].id === qid) return qres[ri];
    }
    return qres[idx] || null;
  }

  function ensureQuizSession() {
    var params = getParams();
    var chapterId = params.chapter && getChapter(params.chapter) ? params.chapter : state.selection.chapter;
    if (!getChapter(chapterId)) chapterId = CHAPTERS[0].id;

    var levelId = params.level && getLevel(params.level) ? params.level : state.selection.level;
    if (!getLevel(levelId)) levelId = LEVEL_ORDER[0];

    var defaultUnitId = getCurrentUnitId(chapterId, levelId);
    var validUnitIds = UNIT_TEMPLATES[levelId].map(function (item) { return item.id; });
    var unitId = params.unit && validUnitIds.indexOf(params.unit) !== -1 ? params.unit : defaultUnitId;
    var mode = params.mode === "review" ? "review" : "path";
    var ids = params.ids ? params.ids.split(",").filter(Boolean) : [];

    var isBrowseReplay = params.browse === "1" && params.resultId;
    var browseResult = null;
    if (isBrowseReplay) {
      for (var bri = 0; bri < state.history.length; bri++) {
        if (state.history[bri].id === params.resultId) {
          browseResult = state.history[bri];
          break;
        }
      }
      if (!browseResult || browseResult.chapter !== chapterId || browseResult.level !== levelId || browseResult.unit !== unitId) {
        browseResult = null;
        isBrowseReplay = false;
      }
    }

    var baseSignature = isBrowseReplay && browseResult
      ? [chapterId, levelId, unitId, "browse", params.resultId].join("::")
      : [chapterId, levelId, unitId, mode, ids.join("|")].join("::");

    state.selection.chapter = chapterId;
    state.selection.level = levelId;

    if (params.fresh !== "1" && state.currentQuiz && state.currentQuiz.baseSignature === baseSignature) {
      ensureQuizTimerState(state.currentQuiz);
      normalizeQuizTimerForMode(state.currentQuiz);
      if (shouldRunQuizTimer(state.currentQuiz)) resumeQuizTimer(state.currentQuiz);
      if (state.currentQuiz.browseOnly && params.browse === "1") {
        var qSync = parseInt(params.q, 10);
        if (!isNaN(qSync) && qSync >= 0 && qSync < state.currentQuiz.questions.length && qSync !== state.currentQuiz.currentIndex) {
          state.currentQuiz.currentIndex = qSync;
          saveState();
        }
      }
      return state.currentQuiz;
    }

    if (!isBrowseReplay && params.fresh !== "1" && mode === "path") {
      var latestForUnit = getLatestUnitHistory(chapterId, levelId, unitId);
      if (latestForUnit) {
        window.location.href = buildUrl("test-results.html", { chapter: chapterId, level: levelId, resultId: latestForUnit.id });
        return null;
      }
    }

    var questions = mode === "review" ? getReviewQuestions(chapterId, levelId, ids) : getUnitQuestions(chapterId, levelId, unitId);
    if (isBrowseReplay && browseResult && Array.isArray(browseResult.questionResults) && browseResult.questionResults.length) {
      var snapQs = browseResult.questionResults
        .map(function (row) { return row && row.questionSnapshot ? clone(row.questionSnapshot) : null; })
        .filter(Boolean);
      if (snapQs.length === browseResult.questionResults.length && snapQs.length > 0) questions = snapQs;
    }
    if (!questions.length) return null;

    var startIndex = 0;
    if (isBrowseReplay && browseResult) {
      var qParam = parseInt(params.q, 10);
      if (!isNaN(qParam)) startIndex = qParam;
      if (startIndex < 0) startIndex = 0;
      if (startIndex >= questions.length) startIndex = questions.length - 1;
    }

    var drafts = {};
    var submitted = {};
    var scoreInit = 0;
    var correctInit = 0;
    if (isBrowseReplay && browseResult) {
      var qres = browseResult.questionResults || [];
      var legacyCorrect = typeof browseResult.correctCount === "number" ? browseResult.correctCount : 0;
      questions.forEach(function (q, idx) {
        var qr = pickQuestionResultForBrowse(qres, q.id, idx);
        if (!qr && qres[idx] && qres[idx].id === q.id) qr = qres[idx];
        if (!qr && qres.length === 0 && questions.length > 0) {
          qr = { id: q.id, isCorrect: idx < legacyCorrect, selected: null };
        }
        var hasSel = qr && Object.prototype.hasOwnProperty.call(qr, "selected") && qr.selected !== undefined && qr.selected !== null;
        var draftVal;
        if (hasSel) {
          draftVal = Array.isArray(qr.selected) ? qr.selected.slice() : qr.selected;
        } else if (qr && qr.isCorrect === true) {
          draftVal = q.type === "sort" ? (Array.isArray(q.correct) ? q.correct.slice() : []) : q.correct;
        } else {
          draftVal = q.type === "sort" ? [] : "";
        }
        drafts[q.id] = draftVal;
        submitted[q.id] = {
          selected: draftVal,
          isCorrect: !!(qr && qr.isCorrect),
          usedHint: false,
          points: 0
        };
      });
      scoreInit = typeof browseResult.score === "number" ? browseResult.score : 0;
      correctInit = typeof browseResult.correctCount === "number" ? browseResult.correctCount : 0;
    }

    var runLiveTimer = !isBrowseReplay && mode !== "review";

    state.currentQuiz = {
      baseSignature: baseSignature,
      chapterId: chapterId,
      levelId: levelId,
      unitId: unitId,
      mode: mode,
      questions: questions,
      currentIndex: isBrowseReplay && browseResult ? startIndex : 0,
      drafts: drafts,
      submitted: submitted,
      revealedHints: {},
      score: isBrowseReplay && browseResult ? scoreInit : 0,
      correctCount: isBrowseReplay && browseResult ? correctInit : 0,
      currentStreak: 0,
      bestStreak: isBrowseReplay && browseResult && typeof browseResult.bestStreak === "number" ? browseResult.bestStreak : 0,
      elapsedMs: isBrowseReplay && browseResult ? getResultElapsedMs(browseResult) : 0,
      timerActiveSince: runLiveTimer ? Date.now() : null,
      browseOnly: !!(isBrowseReplay && browseResult),
      reviewResultId: isBrowseReplay && browseResult ? browseResult.id : ""
    };
    normalizeQuizTimerForMode(state.currentQuiz);
    saveState();
    if (state.currentQuiz && state.currentQuiz.browseOnly) {
      syncBrowseReplayQueryUrl(state.currentQuiz);
    }

    /* Consume fresh=1 after creating a new session once.
       Otherwise every render rebuilds the session and wipes selection/hints. */
    if (params.fresh === "1" && window.history && window.history.replaceState) {
      var cleanParams = {
        chapter: chapterId,
        level: levelId,
        unit: unitId
      };
      if (mode === "review") cleanParams.mode = "review";
      if (ids.length) cleanParams.ids = ids.join(",");
      window.history.replaceState(null, "", buildUrl("test-quiz.html", cleanParams));
    }

    return state.currentQuiz;
  }

  function setDraftAnswer(value) {
    var quiz = state.currentQuiz;
    if (!quiz || quiz.browseOnly) return;
    var question = quiz.questions[quiz.currentIndex];
    if (!question || quiz.submitted[question.id] || question.type === "sort") return;
    quiz.drafts[question.id] = value;
    if (quiz.mode === "path") {
      state.lastQuizSubmit = {
        at: new Date().toISOString(),
        chapterId: quiz.chapterId,
        levelId: quiz.levelId,
        unitId: quiz.unitId,
        mode: "path",
        reviewIds: []
      };
    }

    saveState();
    renderPage();
  }

  function addSortItem(value) {
    var quiz = state.currentQuiz;
    if (!quiz || quiz.browseOnly) return;
    var question = quiz.questions[quiz.currentIndex];
    if (!question || question.type !== "sort" || quiz.submitted[question.id]) return;
    var draft = Array.isArray(quiz.drafts[question.id]) ? quiz.drafts[question.id] : [];
    if (draft.indexOf(value) === -1) draft.push(value);
    quiz.drafts[question.id] = draft;
    saveState();
    renderPage();
  }

  function removeSortItem(index) {
    var quiz = state.currentQuiz;
    if (!quiz || quiz.browseOnly) return;
    var question = quiz.questions[quiz.currentIndex];
    if (!question || question.type !== "sort" || quiz.submitted[question.id]) return;
    var draft = Array.isArray(quiz.drafts[question.id]) ? quiz.drafts[question.id].slice() : [];
    draft.splice(index, 1);
    quiz.drafts[question.id] = draft;
    saveState();
    renderPage();
  }

  function resetSortDraft() {
    var quiz = state.currentQuiz;
    if (!quiz || quiz.browseOnly) return;
    var question = quiz.questions[quiz.currentIndex];
    if (!question || question.type !== "sort") return;
    quiz.drafts[question.id] = [];
    saveState();
    renderPage();
  }

  function handleQuizAction(action) {
    var quiz = state.currentQuiz;
    if (!quiz) return;
    var question = quiz.questions[quiz.currentIndex];
    if (!question) return;

    if (quiz.browseOnly && (action === "hint" || action === "submit")) return;

    if (action === "prev") {
      if (quiz.currentIndex <= 0) return;
      quiz.currentIndex -= 1;
      saveState();
      if (quiz.browseOnly) syncBrowseReplayQueryUrl(quiz);
      renderPage();
      return;
    }
    if (action === "hint") {
      if (quiz.revealedHints[question.id]) return;
      quizDialog = { kind: "hint" };
      renderPage();
      return;
    }
    if (action === "hint-confirm") {
      quiz.revealedHints[question.id] = true;
      playSfx(SFX_HINT);
      saveState();
      renderPage();
      return;
    }
    if (action === "submit") {
      submitCurrentQuestion();
      return;
    }
    if (action === "next") {
      if (quiz.currentIndex >= quiz.questions.length - 1) {
        if (quiz.browseOnly && quiz.reviewResultId) {
          window.location.href = buildUrl("test-results.html", { chapter: quiz.chapterId, level: quiz.levelId, resultId: quiz.reviewResultId });
          return;
        }
        if (Object.keys(quiz.submitted).length !== quiz.questions.length) return;
        return finalizeQuiz();
      }
      quiz.currentIndex += 1;
      saveState();
      if (quiz.browseOnly) syncBrowseReplayQueryUrl(quiz);
      renderPage();
    }
  }

  function jumpToQuizQuestion(index) {
    var quiz = state.currentQuiz;
    if (!quiz || index < 0 || index >= quiz.questions.length || index === quiz.currentIndex) return;
    quiz.currentIndex = index;
    saveState();
    if (quiz.browseOnly) syncBrowseReplayQueryUrl(quiz);
    renderPage();
  }

  function submitCurrentQuestion() {
    var quiz = state.currentQuiz;
    if (!quiz || quiz.browseOnly) return;
    var question = quiz.questions[quiz.currentIndex];
    var draft = quiz.drafts[question.id];
    if (!hasAnswer(question, draft)) return;

    var correct = evaluate(question, draft);
    var usedHint = !!quiz.revealedHints[question.id];
    var basePoints = LEVEL_POINTS[quiz.levelId] || LEVEL_POINTS.easy;
    var points = correct ? (usedHint ? Math.ceil(basePoints / 2) : basePoints) : 0;

    quiz.submitted[question.id] = {
      selected: draft,
      isCorrect: correct,
      usedHint: usedHint,
      points: points
    };

    if (correct) {
      quiz.score += points;
      quiz.correctCount += 1;
      quiz.currentStreak += 1;
      quiz.bestStreak = Math.max(quiz.bestStreak, quiz.currentStreak);
      if (quiz.mode === "path") {
        state.rewards.currentStreak = (typeof state.rewards.currentStreak === "number" ? state.rewards.currentStreak : 0) + 1;
        state.rewards.streak = Math.max(typeof state.rewards.streak === "number" ? state.rewards.streak : 0, state.rewards.currentStreak);
      }
      if (quiz.mode === "review") markMistakeReviewed(question.id);
      playSfx(SFX_CORRECT);
    } else {
      quiz.currentStreak = 0;
      if (quiz.mode === "path") state.rewards.currentStreak = 0;
      upsertMistake(question, quiz, buildMistakeReason(question));
      playSfx(SFX_WRONG);
    }

    saveState();
    renderPage();
  }

  function finalizeQuiz() {
    var quiz = state.currentQuiz;
    if (!quiz || quiz.browseOnly) return;
    pauseQuizTimer(quiz);
    var result = buildResult(quiz);
    state.history.unshift(result);
    state.history = state.history.slice(0, 20);
    updateProgress(result);
    updateRewards(result);
    state.lastResult = result;
    var auth = getAuthApi();
    var username = getCurrentUsername();
    if (auth && auth.recordActivity && username) {
      auth.recordActivity(username, {
        pointsDelta: Number(result.score || 0),
        postDelta: 0,
        source: "test",
        type: "quiz_complete",
        refId: result.id
      });
    }
    state.currentQuiz = null;
    saveState();
    window.location.href = buildUrl("test-results.html", { chapter: result.chapter, level: result.level, resultId: result.id });
  }

  function buildResult(quiz) {
    var answered = Object.keys(quiz.submitted).length;
    var accuracy = answered ? quiz.correctCount / answered : 0;
    var weakTopics = [];
    var strongTopics = [];
    quiz.questions.forEach(function (question) {
      if (quiz.submitted[question.id] && quiz.submitted[question.id].isCorrect) strongTopics.push(question.topic);
      if (quiz.submitted[question.id] && !quiz.submitted[question.id].isCorrect) weakTopics.push(question.reviewTopic);
    });

    return {
      id: "result-" + Date.now(),
      chapter: quiz.chapterId,
      chapterName: getChapter(quiz.chapterId).name,
      level: quiz.levelId,
      levelName: getLevel(quiz.levelId).name,
      unit: quiz.unitId,
      mode: quiz.mode,
      score: quiz.score,
      maxScore: quiz.questions.length * LEVEL_POINTS[quiz.levelId],
      accuracy: accuracy,
      correctCount: quiz.correctCount,
      totalQuestions: quiz.questions.length,
      hintsUsed: Object.keys(quiz.revealedHints).length,
      starsEarned: Math.max(1, Math.round(accuracy * 3)),
      badgeAwarded: null,
      bestStreak: quiz.bestStreak,
      elapsedMs: getQuizElapsedMs(quiz),
      questionResults: quiz.questions.map(function (q) {
        var sub = quiz.submitted[q.id] || null;
        return { id: q.id, isCorrect: sub ? sub.isCorrect : null, selected: sub ? sub.selected : null, questionSnapshot: clone(q) };
      }),
      strengths: unique(strongTopics).slice(0, 3).length
        ? unique(strongTopics).slice(0, 3)
        : [NO_STRENGTH_CANONICAL],
      weakAreas: unique(weakTopics).slice(0, 3).length
        ? unique(weakTopics).slice(0, 3)
        : [getNoWeaknessMessageKey(quiz.levelId)],
      weakAreasEmptyMessage: getNoWeaknessMessageKey(quiz.levelId),
      reviewTopics: unique(weakTopics).length ? unique(weakTopics) : ["You can progress to the next path or revisit the map for confidence."],
      timestamp: new Date().toISOString()
    };
  }

  function updateProgress(result) {
    var progress = state.progress[result.chapter][result.level];
    progress.lastScore = result.score;
    progress.accuracy = result.accuracy;
    progress.lastPlayed = result.timestamp;
    if (result.mode === "path" && progress.completedUnits.indexOf(result.unit) === -1) {
      progress.completedUnits.push(result.unit);
      var nextUnit = UNIT_TEMPLATES[result.level][progress.completedUnits.length];
      progress.currentUnit = nextUnit ? nextUnit.id : UNIT_TEMPLATES[result.level][UNIT_TEMPLATES[result.level].length - 1].id;
    }
  }

  function updateRewards(result) {
    state.rewards.lifetimePoints = (typeof state.rewards.lifetimePoints === "number" ? state.rewards.lifetimePoints : 0) + result.score;
    var badgeName = buildBadgeName(result.chapter);
    var currentBadges = Array.isArray(state.rewards.badges) ? state.rewards.badges.slice() : [];
    var nextBadges = getBadgeInventoryFromHistory(state.history);
    var newlyUnlocked = nextBadges.indexOf(badgeName) !== -1 && currentBadges.indexOf(badgeName) === -1;
    var stars3 = typeof result.starsEarned === "number" && result.starsEarned === 3;
    /* Only flag a "new badge" celebration on this result when 3★; replays / low-star runs never get badgeAwarded */
    result.badgeAwarded = newlyUnlocked && stars3 ? badgeName : null;
    state.rewards.badges = nextBadges;
  }

  function getUnits(chapterId, levelId) {
    var focusList = getChapter(chapterId).focuses[levelId];
    return UNIT_TEMPLATES[levelId].map(function (template, index) {
      var stars = getUnitStars(chapterId, levelId, template.id);
      return {
        id: template.id,
        chapterId: chapterId,
        levelId: levelId,
        kind: "question",
        label: getMapNodeNumber(chapterId, levelId, index),
        short: getMapNodeNumber(chapterId, levelId, index),
        taskLabel: template.taskLabel,
        focus: focusList[index] || focusList[focusList.length - 1],
        stars: stars,
        status: stars > 0 ? "done" : "open",
        href: buildUrl("test-quiz.html", { chapter: chapterId, level: levelId, unit: template.id })
      };
    });
  }

  function getChapterUnitCounts(chapterId) {
    var done = 0;
    var total = 0;
    LEVEL_ORDER.forEach(function (lid) {
      done += state.progress[chapterId][lid].completedUnits.length;
      total += UNIT_TEMPLATES[lid].length;
    });
    return { done: done, total: total };
  }

  function getProgressSnapshot(chapterId, levelId) {
    var ch = getChapterUnitCounts(chapterId);
    var filtered = state.history.filter(function (item) {
      return item.chapter === chapterId && item.level === levelId;
    });
    var overallAccuracy = filtered.length
      ? Math.round(filtered.reduce(function (sum, item) { return sum + item.accuracy; }, 0) / filtered.length * 100) + "%"
      : "0%";
    return {
      chapterUnits: ch.done + "/" + ch.total,
      overallAccuracy: overallAccuracy
    };
  }

  function getUnitIndexInLevel(levelId, unitId) {
    var templates = UNIT_TEMPLATES[levelId];
    for (var i = 0; i < templates.length; i++) {
      if (templates[i].id === unitId) return i;
    }
    return 0;
  }

  function buildLastSubmitResumeHref(lastSubmit) {
    if (!lastSubmit || !lastSubmit.at) {
      return buildUrl("test.html", { chapter: state.selection.chapter, level: state.selection.level });
    }
    return buildUrl("test-quiz.html", { chapter: lastSubmit.chapterId, level: lastSubmit.levelId, unit: lastSubmit.unitId });
  }

  function formatResumeShortcut(chapterId, levelId, unitId) {
    var idx = getUnitIndexInLevel(levelId, unitId);
    var num = getMapNodeNumber(chapterId, levelId, idx);
    var lvl = getLevel(levelId);
    return num + " - " + (lvl ? tx(lvl.name) : levelId);
  }

  function getMapNodeNumber(chapterId, levelId, unitIndex) {
    var chapterIndex = CHAPTERS.findIndex(function (item) { return item.id === chapterId; }) + 1;
    return chapterIndex + "." + (unitIndex + 1);
  }

  function getUnitStars(chapterId, levelId, unitId) {
    var attempts = state.history.filter(function (r) { return r.chapter === chapterId && r.level === levelId && r.unit === unitId; });
    if (!attempts.length) return 0;
    var best = Math.max.apply(null, attempts.map(function (r) { return r.accuracy; }));
    if (best === 1) return 3;
    if (Math.floor(best * 100) >= 60) return 2;
    return 1;
  }

  function getUnitStarsFromHistory(history, chapterId, levelId, unitId) {
    var attempts = (history || []).filter(function (r) { return r.chapter === chapterId && r.level === levelId && r.unit === unitId; });
    if (!attempts.length) return 0;
    var best = Math.max.apply(null, attempts.map(function (r) { return r.accuracy; }));
    if (best === 1) return 3;
    if (Math.floor(best * 100) >= 60) return 2;
    return 1;
  }

  function getChapterLevelBestStars(chapterId, levelId) {
    return UNIT_TEMPLATES[levelId].reduce(function (sum, template) {
      return sum + getUnitStars(chapterId, levelId, template.id);
    }, 0);
  }

  function getChapterLevelBestStarsFromHistory(history, chapterId, levelId) {
    return UNIT_TEMPLATES[levelId].reduce(function (sum, template) {
      return sum + getUnitStarsFromHistory(history, chapterId, levelId, template.id);
    }, 0);
  }

  function getBadgeInventoryFromHistory(history) {
    var badges = [];
    CHAPTERS.forEach(function (chapter) {
      LEVEL_ORDER.forEach(function (levelId) {
        var maxStars = UNIT_TEMPLATES[levelId].length * 3;
        if (getChapterLevelBestStarsFromHistory(history, chapter.id, levelId) >= maxStars) {
          badges.push(buildBadgeName(chapter.id));
        }
      });
    });
    return unique(badges);
  }

  function getTotalBestStarsEarned() {
    var total = 0;
    CHAPTERS.forEach(function (ch) {
      LEVEL_ORDER.forEach(function (lid) {
        UNIT_TEMPLATES[lid].forEach(function (template) {
          total += getUnitStars(ch.id, lid, template.id);
        });
      });
    });
    return total;
  }
  function getLatestUnitHistory(chapterId, levelId, unitId) {
    return state.history.find(function (item) {
      return item.chapter === chapterId && item.level === levelId && item.unit === unitId;
    }) || null;
  }
  function renderStarRating(stars) {
    var p = 'M12 3.4c.38 0 .72.22.88.57l1.72 3.77c.1.22.31.37.55.4l4.12.59a.98.98 0 01.55 1.67l-2.99 2.89a.9.9 0 00-.27.8l.71 4.06a.98.98 0 01-1.42 1.02l-3.68-2.09a.94.94 0 00-.92 0l-3.68 2.09a.98.98 0 01-1.42-1.02l.71-4.06a.9.9 0 00-.27-.8l-2.99-2.89a.98.98 0 01.55-1.67l4.12-.59a.9.9 0 00.55-.4l1.72-3.77a.98.98 0 01.88-.57z';
    var html = '';
    for (var i = 1; i <= 3; i++) {
      var filled = stars > 0 && i <= stars;
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" class="node-star' + (filled ? ' node-star--filled' : '') + '"><path d="' + p + '" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="' + (filled ? '0' : '1.8') + '"/></svg>';
    }
    return html;
  }
  function getQuickLinks(chapterId, levelId) {
    var latest = getLatestHistory(chapterId, levelId);
    var currentQuizLink = state.currentQuiz && state.currentQuiz.chapterId === chapterId && state.currentQuiz.levelId === levelId
      ? buildUrl("test-quiz.html", {
          chapter: state.currentQuiz.chapterId,
          level: state.currentQuiz.levelId,
          unit: state.currentQuiz.unitId,
          mode: state.currentQuiz.mode === "review" ? "review" : "",
          fresh: ""
        })
      : buildUrl("test-quiz.html", { chapter: chapterId, level: levelId, unit: getCurrentUnitId(chapterId, levelId) });

    return {
      continueHref: currentQuizLink,
      mistakesHref: buildUrl("test-mistakes.html", {}),
      summaryHref: latest ? buildUrl("test-results.html", { chapter: chapterId, level: levelId, resultId: latest.id }) : "#"
    };
  }
  function getCurrentUnitId(chapterId, levelId) {
    var chapter = getChapter(chapterId) ? chapterId : CHAPTERS[0].id;
    var level = getLevel(levelId) ? levelId : LEVEL_ORDER[0];
    var chapterProgress = state.progress[chapter];
    var levelProgress = chapterProgress && chapterProgress[level] ? chapterProgress[level] : null;
    var fallbackUnit = UNIT_TEMPLATES[level] && UNIT_TEMPLATES[level][0] ? UNIT_TEMPLATES[level][0].id : "unit-1";
    return levelProgress && levelProgress.currentUnit ? levelProgress.currentUnit : fallbackUnit;
  }

  function getUnitQuestions(chapterId, levelId, unitId) {
    var banked = getBankQuestions(chapterId, levelId, unitId);
    if (banked.length) return banked;
    if (chapterId === "basics" && levelId === "easy" && unitId === "unit-1") {
      var fixed = [
        makeQuestion("mcq", "Primary colors", "Which one is a primary color in the basic RYB model?", ["Red", "Green", "Purple", "Brown"], "Red", "Primary color groups", chapterId, levelId, unitId),
        makeQuestion("true-false", "Warm vs cool", "Blue is usually considered a cool color.", ["True", "False"], "True", "Warm and cool color groups", chapterId, levelId, unitId),
        makeQuestion("image", "Contrast", "Pick the option with the clearest text contrast.", [
          { id: "a", label: "Light gray text on white", preview: previewText("#ffffff", "#d1d5db", "Light gray text", "White surface sample") },
          { id: "b", label: "Dark navy text on pale yellow", preview: previewText("#fef3c7", "#0f172a", "Dark navy text", "Pale yellow surface sample") },
          { id: "c", label: "Pink text on orange", preview: previewText("#fdba74", "#fb7185", "Pink text", "Orange surface sample") }
        ], "b", "Readable contrast for basic interfaces", chapterId, levelId, unitId),
        makeQuestion("sort", "Value order", "Arrange these from lightest to darkest.", ["Pale yellow", "Soft orange", "Brick orange", "Deep brown"], ["Pale yellow", "Soft orange", "Brick orange", "Deep brown"], "Value order and hierarchy", chapterId, levelId, unitId)
      ];
      fixed[0].explanation = "In the basic RYB model, red is a primary color. Green and purple are mixed colors, and brown is typically a composite.";
      fixed[1].explanation = "Blue is generally grouped as a cool color in foundational color theory.";
      fixed[2].explanation = "Dark navy text on a pale yellow background creates the strongest readable contrast among these options.";
      fixed[3].explanation = "The value sequence from light to dark is: Pale yellow, Soft orange, Brick orange, then Deep brown.";
      return fixed.map(function (q, index) {
        q.id = chapterId + "-" + levelId + "-" + unitId + "-q" + (index + 1);
        return q;
      });
    }
    var set = QUESTION_DATA[chapterId][levelId];
    var unitIndex = Math.max(1, Number(unitId.split("-")[1]) || 1) - 1;
    var pool = [
      makeQuestion("mcq", set.topics[0], set.mcqPrompt, set.mcqOptions, set.mcqCorrect, set.reviewTopics[0], chapterId, levelId, unitId),
      makeQuestion("true-false", set.topics[1], set.tfPrompt, ["True", "False"], set.tfCorrect ? "True" : "False", set.reviewTopics[1], chapterId, levelId, unitId),
      makeQuestion("image", set.topics[2], set.imagePrompt, set.imageOptions, set.imageCorrect, set.reviewTopics[2], chapterId, levelId, unitId),
      makeQuestion("sort", set.topics[3], set.sortPrompt, set.sortItems, set.sortItems, set.reviewTopics[3], chapterId, levelId, unitId),
      makeQuestion("mcq", set.topics[4], set.bonusPrompt, set.bonusOptions, set.bonusCorrect, set.reviewTopics[4], chapterId, levelId, unitId)
    ];
    var ordered = [];
    for (var i = 0; i < 4; i += 1) ordered.push(clone(pool[(unitIndex + i) % pool.length]));
    ordered.forEach(function (question, index) { question.id = chapterId + "-" + levelId + "-" + unitId + "-q" + (index + 1); });
    return ordered;
  }

  function getBankQuestions(chapterId, levelId, unitId) {
    var chapter = EXTERNAL_QUESTION_BANK && EXTERNAL_QUESTION_BANK[chapterId];
    var unit = chapter && chapter.units ? chapter.units[unitId] : null;
    var rows = unit && unit.levels ? unit.levels[levelId] : null;
    if (!Array.isArray(rows) || !rows.length) return [];
    return rows.map(function (row, index) {
      var question = makeQuestion(
        row.type,
        row.topic,
        row.prompt,
        row.options,
        row.correct,
        row.reviewTopic,
        chapterId,
        levelId,
        unitId
      );
      if (row.explanation) question.explanation = row.explanation;
      if (row.hint) question.hint = row.hint;
      question.hint = polishQuestionHint(question.hint, question.reviewTopic, question.type);
      question.explanation = polishQuestionExplanation(question.explanation, question.reviewTopic, question.type);
      question.id = chapterId + "-" + levelId + "-" + unitId + "-q" + (index + 1);
      return question;
    });
  }

  function polishQuestionHint(hint, reviewTopic, type) {
    var text = String(hint || "").trim();
    if (!text) return text;

    text = text
      .replace(/^Choose the answer about (.+)\.$/i, "Focus on $1.")
      .replace(/^Choose the option about (.+)\.$/i, "Focus on $1.")
      .replace(/^Pick the answer about (.+)\.$/i, "Focus on $1.")
      .replace(/^Pick the answer that (.+)\.$/i, "Focus on the option that $1.")
      .replace(/^Choose the answer that (.+)\.$/i, "Focus on the option that $1.")
      .replace(/^Look for the answer about (.+), not (.+)\.$/i, "Use $1 as the deciding idea rather than $2.")
      .replace(/^Look for the answer connecting (.+) and (.+)\.$/i, "Use the link between $1 and $2 to decide.")
      .replace(/^This is a (.+) question\.$/i, "Use the core idea of $1 here.")
      .replace(/^This is an (.+) question\.$/i, "Use the core idea of $1 here.")
      .replace(/^This is one of the main reasons (.+)\.$/i, "Keep in mind that $1.")
      .replace(/^Think about (.+)\.$/i, "Use $1 as the main clue.")
      .replace(/^Choose the answer with (.+)\.$/i, "Use $1 as the deciding clue.")
      .replace(/^Choose the answer that starts with (.+)\.$/i, "Start from $1 when you compare the options.")
      .replace(/^Choose the answer that verifies (.+)\.$/i, "Look for the option that checks $1.")
      .replace(/^Choose the answer that balances (.+)\.$/i, "Look for the option that balances $1.")
      .replace(/^Choose the answer that keeps (.+)\.$/i, "Keep $1 in view when you decide.")
      .replace(/^Choose the answer that ties (.+)\.$/i, "Tie $1 back to the decision.")
      .replace(/^Choose the answer that compares (.+)\.$/i, "Compare the options through $1.")
      .replace(/^Choose the answer that thinks in (.+)\.$/i, "Think in terms of $1.")
      .replace(/^Choose the answer that includes (.+)\.$/i, "Look for the option that includes $1.")
      .replace(/^Choose the answer about verification\.$/i, "Look for the option that verifies the result instead of assuming it.")
      .replace(/^Choose the answer about context\.$/i, "Use workflow context as the deciding idea.")
      .replace(/^This is a core accessibility idea\.$/i, "Use readability and contrast as the deciding ideas.")
      .replace(/^This is a basic colour-management principle\.$/i, "Use cross-device consistency as the key principle.")
      .replace(/^This is a core HDR distinction\.$/i, "Keep luminance range separate from resolution or gamut.")
      .replace(/^This is an end-to-end workflow topic\.$/i, "Judge the option by whether the whole workflow supports it.")
      .replace(/^This is a practical workflow principle\.$/i, "Prefer the option that checks the output before sign-off.")
      .replace(/^This is a destination-aware workflow question\.$/i, "Use the target destination as the deciding factor.")
      .replace(/^This is a systems topic\.$/i, "Think about the connected workflow, not one isolated step.")
      .replace(/^This is a workflow architecture question\.$/i, "Trace how colour is transformed through the system.")
      .replace(/^This is a predictability question\.$/i, "Prefer the option that makes transformations more predictable.")
      .replace(/^This is a trade-off question\.$/i, "Think about what the workflow is trying to preserve under constraints.")
      .replace(/^This is about trade-offs under constraints\.$/i, "Focus on how the workflow manages unavoidable output limits.")
      .replace(/^This is a practical sign-off principle\.$/i, "Prefer the option that checks the real destination before approval.")
      .replace(/^This is about measurable values, not guessing\.$/i, "Treat the picker as a source of exact values, not visual memory.")
      .replace(/^This is a precision question\.$/i, "Use the idea of exact, reusable values as the clue.")
      .replace(/^This is a handoff-control question\.$/i, "Think about keeping the same value consistent between tools.")
      .replace(/^This is a pattern-recognition idea\.$/i, "Look for the option that helps compare repeated visual patterns.")
      .replace(/^This is an evidence question\.$/i, "Prefer the option that adds visible evidence instead of opinion.")
      .replace(/^This is about choosing the right tool\.$/i, "Match the tool to the problem it is meant to measure.")
      .replace(/^This is an evidence-versus-guessing question\.$/i, "Prefer measurable feedback over visual guesswork.")
      .replace(/^This is a diagnosis question\.$/i, "Identify the actual problem before you choose a fix.")
      .replace(/^This is an integration question\.$/i, "Combine tool choice, context, and visible outcome in your reasoning.")
      .replace(/^This is a sign-off discipline point\.$/i, "Keep final-context review in the workflow before approval.");

    if (/^Focus on [a-z]/.test(text)) {
      text = text.replace(/^Focus on ([a-z])/, function (_, c) { return "Focus on " + c.toLowerCase(); });
    }

    if (type === "true-false" && /^Use /.test(text) === false && /^Focus /.test(text) === false) {
      text = "Check whether the statement matches the core idea of " + String(reviewTopic || "this topic") + ".";
    }

    return text;
  }

  function polishQuestionExplanation(explanation, reviewTopic, type) {
    var text = String(explanation || "").trim();
    if (!text) return text;
    if (type === "true-false" && /^That is /.test(text)) {
      return text.replace(/^That is /, "That principle is ");
    }
    if (text === "The correct answer depends on the key concept in this topic.") {
      return "The answer follows from the core idea behind " + String(reviewTopic || "this topic") + ".";
    }
    if (text === "This sequence matters because the process becomes easier to repeat and explain once the order is clear.") {
      return "This order matters because the workflow becomes easier to apply and explain once each step is in the right place.";
    }
    return text;
  }

  function makeQuestion(type, topic, prompt, options, correct, reviewTopic, chapterId, levelId, unitId) {
    return {
      type: type,
      topic: topic,
      prompt: prompt,
      options: options,
      correct: correct,
      reviewTopic: reviewTopic,
      objective: getUnitFocus(chapterId, levelId, unitId),
      explanation: type === "sort" ? "This sequence matters because the process becomes easier to repeat and explain once the order is clear." : "The correct answer depends on the key concept in this topic.",
      hint: type === "image" ? "Focus on contrast, clarity, and context before visual excitement." : "Pause and match the answer to the core idea in " + reviewTopic + "."
    };
  }

  function getReviewQuestions(chapterId, levelId, ids) {
    return state.mistakes.filter(function (item) {
      var chapterMatch = !chapterId || item.chapter === chapterId;
      var levelMatch = !levelId || item.level === levelId;
      var idMatch = !ids.length || ids.indexOf(item.id) !== -1;
      return chapterMatch && levelMatch && idMatch;
    }).map(function (item) { return clone(item.questionSnapshot); });
  }

  function hasAnswer(question, draft) { return question.type === "sort" ? Array.isArray(draft) && draft.length === question.correct.length : typeof draft === "string" && draft.length > 0; }
  function evaluate(question, draft) { return question.type === "sort" ? JSON.stringify(draft) === JSON.stringify(question.correct) : draft === question.correct; }
  function getQuestionOptionId(option) { return option && typeof option === "object" && Object.prototype.hasOwnProperty.call(option, "id") ? option.id : option; }
  function getQuestionOptionLabel(option) { return option && typeof option === "object" && Object.prototype.hasOwnProperty.call(option, "label") ? option.label : String(option); }
  function findQuestionOptionById(question, id) {
    var opts = Array.isArray(question.options) ? question.options : [];
    for (var i = 0; i < opts.length; i++) {
      if (getQuestionOptionId(opts[i]) === id) return opts[i];
    }
    return null;
  }
  /** Plain-text suffix after "The correct answer is: " for wrong-answer feedback (quiz + solo). */
  function formatCorrectAnswerForFeedback(question) {
    var opts = Array.isArray(question.options) ? question.options : [];
    var cor = question.correct;
    if (question.type === "sort" && Array.isArray(cor)) {
      return cor.map(function (id) {
        var option = findQuestionOptionById(question, id);
        return option ? tx(getQuestionOptionLabel(option)) : String(id);
      }).join(" \u2192 ");
    }
    if (question.type === "image") {
      for (var ii = 0; ii < opts.length; ii++) {
        if (opts[ii] && opts[ii].id === cor) {
          return String.fromCharCode(65 + ii) + ". " + tx(opts[ii].label || cor);
        }
      }
      return String(cor);
    }
    for (var j = 0; j < opts.length; j++) {
      if (opts[j] === cor) {
        return String.fromCharCode(65 + j) + ". " + tx(opts[j]);
      }
    }
    return String(cor);
  }
  function wrongAnswerFeedbackTitle(question) {
    return tx("The correct answer is: ") + formatCorrectAnswerForFeedback(question);
  }
  function buildMistakeReason(question) {
    return tx(
      question.type === "sort"
        ? "The sequence needs another pass before the process feels automatic."
        : question.type === "image"
          ? "Review which visual option best supports the communication goal."
          : question.type === "true-false"
            ? "Slow down and check the principle hidden inside the statement."
            : "Revisit the key distinction in this topic before the next attempt."
    );
  }

  function renderImagePreview(option) {
    var preview = option && option.preview ? option.preview : null;
    if (!preview || !preview.type) {
      return '<span class="quiz-image-option__preview quiz-image-option__preview--empty"><span class="quiz-image-option__placeholder">' + tx("Preview missing") + "</span></span>";
    }
    if (preview.type === "text-on-bg") {
      return '<span class="quiz-image-option__preview quiz-image-option__preview--text" style="background:' + (preview.background || "#ffffff") + ';color:' + (preview.color || "#0f172a") + ';"><span class="quiz-image-option__preview-copy">' + (preview.text || option.label || tx("Preview")) + '</span><span class="quiz-image-option__preview-subcopy">' + tx(preview.subtext || "Read this sample") + '</span></span>';
    }
    if (preview.type === "bg") {
      return '<span class="quiz-image-option__preview quiz-image-option__preview--bg" style="background:' + (preview.background || "#e2e8f0") + ';"></span>';
    }
    if (preview.type === "image") {
      if (preview.src) {
        return '<span class="quiz-image-option__preview quiz-image-option__preview--image"><img src="' + preview.src + '" alt="' + escapeAttr(preview.alt || option.label || "") + '" class="quiz-image-option__img"></span>';
      }
      return '<span class="quiz-image-option__preview quiz-image-option__preview--image-empty" style="background:' + (preview.background || "#e2e8f0") + ';"><span class="quiz-image-option__placeholder">' + tx(preview.eyebrow || "Preview pending") + '</span></span>';
    }
    return '<span class="quiz-image-option__preview quiz-image-option__preview--empty"><span class="quiz-image-option__placeholder">' + tx("Unsupported preview") + "</span></span>";
  }

  function renderQuestionBody(question, draft, submitted) {
    var isSubmitted = !!submitted;
    var opts = Array.isArray(question.options) ? question.options : [];
    if (question.type === "image") {
      return '<div class="quiz-image-options">' + opts.map(function (option) {
        var sel = draft === option.id;
        var cls = "quiz-image-option" + (sel ? " is-selected" : "");
        return '<button type="button" class="' + cls + '"' + (isSubmitted ? ' disabled' : ' data-answer-value="' + option.id + '"') + '>' + renderImagePreview(option) + (option.hideLabel ? "" : '<strong class="quiz-image-option__label">' + tx(option.label) + "</strong>") + '</button>';
      }).join("") + "</div>";
    }
    if (question.type === "sort") {
      var selected = Array.isArray(draft) ? draft : [];
      var remaining = opts.filter(function (item) { return selected.indexOf(getQuestionOptionId(item)) === -1; });
      var poolHtml = remaining.length
        ? remaining.map(function (item) {
            var itemId = getQuestionOptionId(item);
            var itemLabel = getQuestionOptionLabel(item);
            if (item && typeof item === "object" && item.preview) {
              return '<button type="button" class="quiz-image-option quiz-image-option--sort"' + (isSubmitted ? ' disabled' : ' data-sort-add="' + itemId + '"') + '>' + renderImagePreview(item) + (item.hideLabel ? "" : '<strong class="quiz-image-option__label">' + tx(itemLabel) + '</strong>') + '</button>';
            }
            return '<button type="button" class="quiz-sort-chip"' + (isSubmitted ? ' disabled' : ' data-sort-add="' + itemId + '"') + '>' + tx(itemLabel) + '</button>';
          }).join("")
        : '<span class="quiz-sort-pool-empty">' + tx("All items placed below") + '</span>';
      var rankHtml = question.correct.map(function (item, index) {
        var filled = !!selected[index];
        var selectedOption = filled ? findQuestionOptionById(question, selected[index]) : null;
        var selectedLabel = selectedOption ? getQuestionOptionLabel(selectedOption) : (filled ? String(selected[index]) : "");
        return '<div class="quiz-rank-row' + (filled ? ' is-filled' : '') + '">' +
          '<span class="quiz-rank-num">' + (index + 1) + '</span>' +
          (filled
            ? '<span class="quiz-rank-label">' + tx(selectedLabel) + '</span>' +
              (!isSubmitted ? '<button type="button" class="quiz-rank-remove" data-sort-remove="' + index + '" aria-label="' + escapeAttr(tx("Remove")) + '">\u00d7</button>' : '')
            : '<span class="quiz-rank-placeholder">' + tx("Click an item above to place it here") + '</span>') +
        '</div>';
      }).join("");
      return '<div class="quiz-sort-shell">' +
        '<div class="quiz-sort-pool quiz-sort-pool--chips">' + poolHtml + '</div>' +
        '<div class="quiz-rank-list">' + rankHtml + '</div>' +
        (!isSubmitted && selected.length > 0 ? '<button type="button" class="quiz-sort-reset" data-sort-reset>' + tx("Reset order") + '</button>' : '') +
      '</div>';
    }
    return '<div class="quiz-options">' + opts.map(function (option, index) {
      var sel = draft === option;
      var cls = "quiz-option" + (sel ? " is-selected" : "");
      return '<button type="button" class="' + cls + '"' + (isSubmitted ? ' disabled' : ' data-answer-value="' + option + '"') + '>' +
        '<span class="quiz-option__key">' + String.fromCharCode(65 + index) + '</span>' +
        '<span class="quiz-option__copy">' + tx(option) + '</span>' +
      '</button>';
    }).join("") + "</div>";
  }

  function renderHintBlock(question, quiz) {
    if (!quiz.revealedHints[question.id]) return "";
    return '<div class="quiz-hint-block">' + IC.hint + '<div><strong>' + tx("Hint") + '</strong><p>' + displayHintForQuestion(question) + '</p><span class="quiz-hint-note">' + tx("Using a hint reduces points available for this question.") + '</span></div></div>';
  }
  function renderFeedback(question, result) {
    var icon = result.isCorrect ? IC.correct : IC.wrong;
    var title = result.isCorrect ? tx("Correct!") : wrongAnswerFeedbackTitle(question);
    return '<div class="quiz-feedback ' + (result.isCorrect ? "is-correct" : "is-wrong") + '">' +
      '<h2 class="quiz-feedback__title">' + icon + ' ' + title + '</h2>' +
      '<p class="quiz-feedback__copy"><strong>' + tx("Explanation:") + '</strong> ' + tx(question.explanation) + '</p>' +
      '<p class="quiz-feedback__copy"><strong>' + tx("Knowledge point:") + '</strong> ' + tx(question.objective) + '</p>' +
    '</div>';
  }
  function renderMapNode(unit, index) {
    var palette = getNodePalette(unit.chapterId, unit.levelId, index);
    var style = '--node-accent:' + palette.accent + ';--node-accent-soft:' + palette.soft + ';--node-accent-strong:' + palette.strong + ';--node-accent-border:' + palette.border + ';';
    var starIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" class="test-map-node__icon"><path d="M12 3.4c.38 0 .72.22.88.57l1.72 3.77c.1.22.31.37.55.4l4.12.59a.98.98 0 01.55 1.67l-2.99 2.89a.9.9 0 00-.27.8l.71 4.06a.98.98 0 01-1.42 1.02l-3.68-2.09a.94.94 0 00-.92 0l-3.68 2.09a.98.98 0 01-1.42-1.02l.71-4.06a.9.9 0 00-.27-.8l-2.99-2.89a.98.98 0 01.55-1.67l4.12-.59a.9.9 0 00.55-.4l1.72-3.77a.98.98 0 01.88-.57z" fill="currentColor"/></svg>';

    return '<div class="test-map-node">' +
      '<a class="test-map-node__card is-' + unit.status + '" style="' + style + '" href="' + unit.href + '">' +
        '<span class="test-map-node__button is-' + unit.status + '">' + starIcon + '</span>' +
        '<span class="test-map-node__body">' +
          '<span class="test-map-node__eyebrow">' + tx(unit.taskLabel) + '</span>' +
          '<h3 class="test-map-node__title">' + unit.label + '</h3>' +
          (unit.focus ? '<p class="test-map-node__meta">' + tx(unit.focus) + '</p>' : '') +
        '</span>' +
        '<span class="test-map-node__star-rating">' + renderStarRating(unit.stars) + '</span>' +
      '</a>' +
    '</div>';
  }
  function renderMistakeCard(mistake) {
    var explanationOpen = !!mistake.showExplanation;
    return (
      '<article class="mistake-card mistake-card--review">' +
        '<div class="mistake-item__header"><div><div class="test-inline-meta">' +
          '<span class="mistake-tag">' + tx(getLevel(mistake.level).name) + '</span>' +
          '<span class="mistake-tag">' + tx(mistake.topic) + '</span>' +
          '<span class="mistake-tag">' + (mistake.mastered ? tx("Reviewed") : tx("Pending")) + '</span>' +
        '</div><h3 class="mistake-card__title">' + tx(mistake.prompt) + '</h3></div></div>' +
        '<div class="mistake-answer-panels">' +
          '<div class="mistake-answer-panel is-wrong"><span class="mistake-answer-panel__label">' + tx("Your answer") + '</span><strong>' + txAnswerTrail(getMistakeUserAnswer(mistake)) + '</strong></div>' +
          '<div class="mistake-answer-panel is-correct"><span class="mistake-answer-panel__label">' + tx("Correct answer") + '</span><strong>' + txAnswerTrail(getMistakeCorrectAnswer(mistake)) + '</strong></div>' +
        "</div>" +
        (explanationOpen
          ? '<div class="mistake-explanation"><strong>' + tx("Explanation:") + '</strong> ' + tx(mistake.correctConcept) + '<br /><span class="test-card-copy">' + tx(mistake.mistakeReason) + "</span></div>"
          : "") +
        '<div class="mistake-item__footer">' +
          '<div class="mistake-item__meta">' +
            '<span>' + tx("Attempts:") + " " + (mistake.attemptCount || 1) + "</span>" +
            '<span>' + tx("Last attempt:") + " " + formatDate(mistake.lastWrongAt) + "</span>" +
          "</div>" +
          '<div class="mistake-item__controls">' +
            '<button type="button" class="test-inline-btn" data-toggle-explanation="' + mistake.id + '">' +
              (explanationOpen ? tx("Hide explanation") : tx("View explanation")) +
            "</button>" +
            '<button type="button" class="test-action test-action--primary" data-mark-mastered="' + mistake.id + '">' +
              (mistake.mastered ? tx("Mark as pending") : tx("Mark reviewed")) +
            "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }
  function renderSidebarCard(title, inner, iconHtml, dockPanelId) {
    var head = iconHtml
      ? '<h3 class="test-card-title test-card-title--with-icon"><span class="test-card-title__icon">' + iconHtml + '</span><span class="test-card-title__text">' + title + "</span></h3>"
      : '<h3 class="test-card-title">' + title + "</h3>";
    var dockAttr = dockPanelId ? ' data-map-dock-panel="' + dockPanelId + '" id="map-dock-panel-' + dockPanelId + '"' : "";
    return "<section class=\"test-sidebar-card\"" + dockAttr + ">" + head + inner + "</section>";
  }
  function renderSidebarLinkCard(title, inner, href) { return '<a class="test-sidebar-card test-sidebar-card--link" href="' + href + '"><h3 class="test-card-title">' + title + "</h3>" + inner + "</a>"; }
  function renderReviewCard(chapterId, levelId, dockPanelId) {
    var mistakesUrl = buildUrl("test-mistakes.html", {});
    var savedUrl = buildUrl("test-mistakes.html", { tab: "flagged" });
    var mistakeSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 13.59L14.59 17 12 14.41 9.41 17 8 15.59l2.59-2.59L8 10.41 9.41 9 12 11.59 14.59 9 16 10.41l-2.59 2.59L16 15.59z"/></svg>';
    var bookmarkSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
    var dockAttr = dockPanelId ? ' data-map-dock-panel="' + dockPanelId + '" id="map-dock-panel-' + dockPanelId + '"' : "";
    return '<section class="test-sidebar-card"' + dockAttr + ">" +
      '<h3 class="test-card-title test-card-title--with-icon"><span class="test-card-title__icon">' + IC.folderTitle + '</span><span class="test-card-title__text">' + tx("Question Folder") + '</span></h3>' +
      '<div class="review-btn-row">' +
        '<a class="review-btn review-btn--mistakes" href="' + mistakesUrl + '">' + mistakeSvg + '<span>' + tx("Mistakes") + '</span></a>' +
        '<a class="review-btn review-btn--saved" href="' + savedUrl + '">' + bookmarkSvg + '<span>' + tx("Bookmarked") + '</span></a>' +
      '</div>' +
    '</section>';
  }
  function badgeRewardTagInlineStyle(chapterId) {
    var ch = getChapter(chapterId) || CHAPTERS[0];
    var p = ch.colors.primary;
    var rgb = hexToRgb(p);
    return (
      "color:" + p + ";" +
      "border:none;" +
      "background:rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.11);"
    );
  }

  function rewardBadgeMiniSvgHtml() {
    return (
      '<svg class="reward-badge-tag__ic" viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">' +
        '<path d="M11.5 32.5L9 44.5L22 38.8L24 45L26 38.8L39 44.5L36.5 32.5L24 34.2Z" fill="currentColor" opacity="0.9"/>' +
        '<circle cx="24" cy="18" r="13" fill="currentColor" opacity="0.14"/>' +
        '<circle cx="24" cy="18" r="13" fill="none" stroke="currentColor" stroke-width="2.2" opacity="0.45"/>' +
        '<circle cx="24" cy="18" r="8.5" fill="currentColor" opacity="0.1"/>' +
        '<path d="M24 11.5l2.1 4.25h4.7L27.35 18.9l1.45 4.65L24 20.35l-4.8 3.2 1.45-4.65-3.45-2.15h4.7z" fill="currentColor"/>' +
      "</svg>"
    );
  }

  function renderRewardsCard(totalScore, dockPanelId) {
    var starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" width="30" height="30" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/></svg>';
    var flameSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" width="30" height="30" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.39-2.59-10.2-6.5-13.33zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>';
    var trophySvg = '<svg viewBox="0 0 24 24" aria-hidden="true" width="30" height="30" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H9v2h6v-2h-2v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v2.83C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>';
    var dockAttr = dockPanelId ? ' data-map-dock-panel="' + dockPanelId + '" id="map-dock-panel-' + dockPanelId + '"' : "";
    return '<section class="test-sidebar-card" data-rewards-card' + dockAttr + ">" +
      '<h3 class="test-card-title test-card-title--with-icon"><span class="test-card-title__icon">' + IC.rewardsTitle + '</span><span class="test-card-title__text">' + tx("Rewards") + '</span></h3>' +
      '<div class="reward-grid">' +
        '<div class="reward-item">' +
          '<div class="reward-item__icon reward-item__icon--star">' + starSvg + '</div>' +
          '<strong class="reward-item__value">' + getTotalBestStarsEarned() + '</strong>' +
          '<span class="reward-item__label">' + tx("Stars") + '</span>' +
        '</div>' +
        '<div class="reward-item">' +
          '<div class="reward-item__icon reward-item__icon--streak">' + flameSvg + '</div>' +
          '<strong class="reward-item__value">' + state.rewards.streak + '</strong>' +
          '<span class="reward-item__label">' + tx("Max streak") + '</span>' +
        '</div>' +
        '<div class="reward-item">' +
          '<div class="reward-item__icon reward-item__icon--score">' + trophySvg + '</div>' +
          '<strong class="reward-item__value">' + (totalScore || 0) + '</strong>' +
          '<span class="reward-item__label">' + tx("Total pts") + '</span>' +
        '</div>' +
      '</div>' +
      (state.rewards.badges.length
        ? '<div class="reward-badges">' +
            state.rewards.badges.map(function (b) {
              var cid = getBadgeChapterId(b);
              return (
                '<button type="button" class="test-tag badge-reveal-tag reward-badge-tag" style="' +
                escapeAttr(badgeRewardTagInlineStyle(cid)) +
                '" data-badge-replay="' +
                escapeAttr(b) +
                '">' +
                rewardBadgeMiniSvgHtml() +
                '<span class="reward-badge-tag__lbl">' +
                tx(b) +
                "</span></button>"
              );
            }).join('') +
          '</div>'
        : '') +
    '</section>';
  }
  function renderResultsCard(title, inner, iconHtml) {
    var t = tx(title);
    var head = iconHtml
      ? '<h2 class="results-card__title results-card__title--with-icon"><span class="results-card__title-icon">' + iconHtml + '</span><span class="results-card__title-text">' + t + "</span></h2>"
      : '<h2 class="results-card__title">' + t + "</h2>";
    return "<section class=\"results-card\">" + head + inner + "</section>";
  }
  function playSfx(src, opts) {
    if (window.CLWSound && typeof CLWSound.play === "function") {
      CLWSound.play(src, opts);
    }
  }

  function scheduleSfx(src, delayMs, opts) {
    if (window.CLWSound && typeof CLWSound.schedule === "function") {
      CLWSound.schedule(src, delayMs, opts);
    }
  }

  /* ── Confetti: coloured pieces fall from the top of the viewport ── */
  function launchConfetti() {
    var wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    document.body.appendChild(wrap);
    var palette = ['#f59e0b','#3b82f6','#ef4444','#10b981','#8b5cf6',
                   '#f97316','#06b6d4','#ec4899','#fbbf24','#34d399','#a78bfa'];
    for (var i = 0; i < 80; i++) {
      var p = document.createElement('div');
      var isCircle = Math.random() > 0.55;
      var isTall   = !isCircle && Math.random() > 0.5;
      var w = 5 + Math.random() * 8;
      var h = isTall ? w * 2.2 : w;
      var dur = (1.6 + Math.random() * 2).toFixed(2);
      var delay = (Math.random() * 1.0).toFixed(2);
      var cw = Math.random() > 0.5;
      p.className = 'confetti-piece ' + (cw ? 'confetti-cw' : 'confetti-ccw');
      p.style.cssText =
        'left:' + (Math.random() * 100) + 'vw;' +
        'background:' + palette[Math.floor(Math.random() * palette.length)] + ';' +
        'width:' + w + 'px;height:' + h + 'px;' +
        'border-radius:' + (isCircle ? '50%' : '2px') + ';' +
        'animation-duration:' + dur + 's;' +
        'animation-delay:' + delay + 's;';
      wrap.appendChild(p);
    }
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 5000);
  }

  function renderMistakeMetric(label, value, extraClass) { return '<section class="mistakes-metric ' + (extraClass || "") + '"><span class="mistakes-metric__label">' + label + '</span><strong class="mistakes-metric__value">' + value + "</strong></section>"; }
  function renderChoiceChip(label, attrs, active) { return '<button type="button" class="test-chip' + (active ? " is-active" : "") + '" ' + attrs + ">" + label + "</button>"; }
  function renderLinkButton(label, href, extraClass) { var disabled = extraClass && extraClass.indexOf("is-disabled") !== -1; return '<a class="test-link-btn ' + (extraClass || "") + '" href="' + (disabled ? "#" : href) + '"' + (disabled ? ' aria-disabled="true"' : "") + ">" + label + "</a>"; }
  function renderActionButton(label, action, disabled, locked) { return '<button type="button" class="' + (action === "next" ? "test-action test-action--primary" : "test-action test-action--soft") + '" data-quiz-action="' + action + '"' + (disabled || locked ? " disabled" : "") + ">" + label + "</button>"; }
  function renderMapChapterSelect(current) { return '<select class="test-map-topbar__select" data-map-select="chapter">' + CHAPTERS.map(function (item, index) { return '<option value="' + item.id + '"' + (current === item.id ? " selected" : "") + ">" + (index + 1) + ". " + tx(item.name) + "</option>"; }).join("") + "</select>"; }
  function renderMapLevelSelect(current) { return '<select class="test-map-topbar__select" data-map-select="level">' + LEVELS.map(function (item) { return '<option value="' + item.id + '"' + (current === item.id ? " selected" : "") + ">" + tx(item.name) + "</option>"; }).join("") + "</select>"; }
  function renderChapterFilter(current) { return '<select class="test-map-topbar__select" id="mistake-chapter" data-mistake-filter="chapter"><option value="all"' + (current === "all" ? " selected" : "") + '>' + tx("All Chapters") + '</option>' + CHAPTERS.map(function (item, index) { return '<option value="' + item.id + '"' + (current === item.id ? " selected" : "") + ">" + (index + 1) + ". " + tx(item.name) + "</option>"; }).join("") + "</select>"; }
  function renderLevelFilter(current) { return '<select class="test-map-topbar__select" id="mistake-level" data-mistake-filter="level"><option value="all"' + (current === "all" ? " selected" : "") + '>' + tx("All Levels") + '</option>' + LEVELS.map(function (item) { return '<option value="' + item.id + '"' + (current === item.id ? " selected" : "") + ">" + tx(item.name) + "</option>"; }).join("") + "</select>"; }
  function renderStatusFilter(current) { return '<select class="test-map-topbar__select" id="mistake-status" data-mistake-filter="status"><option value="all"' + (current === "all" ? " selected" : "") + '>' + tx("All Status") + '</option><option value="pending"' + (current === "pending" ? " selected" : "") + '>' + tx("Pending") + '</option><option value="reviewed"' + (current === "reviewed" ? " selected" : "") + '>' + tx("Reviewed") + '</option></select>'; }
  function getMistakeChapterFilter() { var params = getParams(); return params.chapter && getChapter(params.chapter) ? params.chapter : "all"; }
  function getMistakeLevelFilter() { var params = getParams(); return params.level && getLevel(params.level) ? params.level : "all"; }
  function getMistakeStatusFilter() { var params = getParams(); return params.status === "pending" || params.status === "reviewed" ? params.status : "all"; }
  function renderStat(label, value, title) {
    var tip = title ? ' title="' + String(title).replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '"' : "";
    return '<div class="test-stat"' + tip + '><span class="test-stat__label">' + label + '</span><span class="test-stat__value">' + value + "</span></div>";
  }
  function renderStatLink(label, valueText, href, title, extraClass) {
    var tip = title ? ' title="' + String(title).replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '"' : "";
    var cls = "test-stat test-stat--link" + (extraClass ? " " + extraClass : "");
    return '<a class="' + cls + '" href="' + href + '"' + tip + '><span class="test-stat__label">' + label + '</span><span class="test-stat__value">' + valueText + "</span></a>";
  }
  function renderResultStat(label, value) { return '<div class="result-stat"><span class="result-stat__label">' + label + '</span><span class="result-stat__value">' + value + "</span></div>"; }
  function renderQuizMini(label, value) { return '<div class="quiz-mini"><span class="quiz-mini__label">' + label + '</span><span class="quiz-mini__value">' + value + "</span></div>"; }

  /* ── Flag / Bookmark helpers ── */
  function toggleFlag(questionId) {
    var quiz = state.currentQuiz;
    if (!quiz) return;
    var question = null;
    for (var qi = 0; qi < quiz.questions.length; qi++) {
      if (quiz.questions[qi].id === questionId) { question = quiz.questions[qi]; break; }
    }
    if (!question) return;
    if (!Array.isArray(state.flagged)) state.flagged = [];
    var idx = -1;
    for (var fi = 0; fi < state.flagged.length; fi++) {
      if (state.flagged[fi].questionId === questionId) { idx = fi; break; }
    }
    if (idx !== -1) {
      state.flagged.splice(idx, 1);
    } else {
      state.flagged.unshift({ id: "flag-" + questionId, questionId: questionId, questionSnapshot: clone(question), chapter: quiz.chapterId, level: quiz.levelId, unit: quiz.unitId, flaggedAt: new Date().toISOString() });
      state.flagged = state.flagged.slice(0, 60);
    }
    saveState();
    renderPage();
  }
  function unflagQuestion(questionId) {
    if (!Array.isArray(state.flagged)) { state.flagged = []; saveState(); return; }
    state.flagged = state.flagged.filter(function (f) { return f.questionId !== questionId; });
    saveState();
    renderPage();
  }
  function isQuestionFlagged(questionId) {
    if (!Array.isArray(state.flagged)) return false;
    for (var fi = 0; fi < state.flagged.length; fi++) {
      if (state.flagged[fi].questionId === questionId) return true;
    }
    return false;
  }
  function getVisibleFlagged(chapterId, levelId) {
    if (!Array.isArray(state.flagged)) return [];
    return state.flagged.filter(function (item) {
      var cm = !chapterId || chapterId === "all" || item.chapter === chapterId;
      var lm = !levelId || levelId === "all" || item.level === levelId;
      return cm && lm;
    });
  }

  /* ── Question Folder page renderers ── */
  function getMistakeTab() { return getParams().tab === "flagged" ? "flagged" : "mistakes"; }
  function getMistakePage() { return Math.max(1, parseInt(getParams().page, 10) || 1); }
  function isTestMistakesNarrowViewport() {
    return typeof window.matchMedia !== "undefined" && window.matchMedia("(max-width: 60rem)").matches;
  }

  function renderMistakesToolbar(chapterFilter, levelFilter, statusFilter) {
    return '<div class="mistakes-toolbar">' +
      '<div class="test-map-topbar__field"><span>' + tx("Chapter") + '</span>' + renderChapterFilter(chapterFilter) + '</div>' +
      '<div class="test-map-topbar__field"><span>' + tx("Difficulty") + '</span>' + renderLevelFilter(levelFilter) + '</div>' +
      (statusFilter !== null && statusFilter !== undefined
        ? '<div class="test-map-topbar__field"><span>' + tx("Status") + '</span>' + renderStatusFilter(statusFilter) + '</div>'
        : '') +
    '</div>';
  }

  function renderMistakeCompactCard(mistake) {
    var chObj = getChapter(mistake.chapter);
    var unitIdx = Math.max(0, (Number((mistake.unit || "unit-1").split("-")[1]) || 1) - 1);
    var nodeNum = getMapNodeNumber(mistake.chapter, mistake.level, unitIdx);
    var chapterName = chObj ? tx(chObj.name) : mistake.chapter;
    var lvObj = getLevel(mistake.level);
    var levelName = lvObj ? tx(lvObj.name) : mistake.level;
    var chColor = chObj ? chObj.colors.primary : "";
    var chBorder = chObj ? chObj.colors.border : "";
    return (
      '<article class="mistake-compact-card' + (mistake.mastered ? " is-reviewed" : " is-pending") + '"' +
        (chBorder ? ' style="border-color:' + chBorder + '"' : '') + '>' +
        '<div class="mcc__meta">' +
          '<span class="mcc__source"' + (chColor ? ' style="color:' + chColor + '"' : '') + '>' + chapterName + ' \xb7 ' + nodeNum + '</span>' +
          '<span class="mcc__status-tag' + (mistake.mastered ? " is-ok" : "") + '">' + (mistake.mastered ? tx("Reviewed") : tx("Pending")) + '</span>' +
        '</div>' +
        '<p class="mcc__prompt">' + tx(mistake.prompt) + '</p>' +
        '<div class="mcc__tags">' +
          '<span class="mcc__level-badge">' + levelName + '</span>' +
          '<span class="mcc__type-tag">' + labelForType(mistake.questionType || "mcq") + '</span>' +
        '</div>' +
        '<div class="mcc__footer">' +
          '<span class="mcc__date">' + (mistake.attemptCount > 1 ? '\xd7' + mistake.attemptCount + ' \xb7 ' : '') + formatDateTime(mistake.lastWrongAt) + '</span>' +
          '<button type="button" class="test-inline-btn mcc__btn mcc__btn--practice" data-practice-question="' + mistake.id + '" data-practice-type="mistake">' + tx("Practice") + '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderFlaggedCompactCard(item) {
    var chObj = getChapter(item.chapter);
    var unitIdx = Math.max(0, (Number((item.unit || "unit-1").split("-")[1]) || 1) - 1);
    var nodeNum = getMapNodeNumber(item.chapter, item.level, unitIdx);
    var chapterName = chObj ? tx(chObj.name) : item.chapter;
    var lvObj = getLevel(item.level);
    var levelName = lvObj ? tx(lvObj.name) : item.level;
    var q = item.questionSnapshot || {};
    var chColor = chObj ? chObj.colors.primary : "";
    var chBorder = chObj ? chObj.colors.border : "";
    return (
      '<article class="mistake-compact-card is-flagged"' +
        (chBorder ? ' style="border-color:' + chBorder + '"' : '') + '>' +
        '<div class="mcc__meta">' +
          '<span class="mcc__source"' + (chColor ? ' style="color:' + chColor + '"' : '') + '>' + chapterName + ' \xb7 ' + nodeNum + '</span>' +
        '</div>' +
        '<p class="mcc__prompt">' + (q.prompt ? tx(q.prompt) : "\u2014") + '</p>' +
        '<div class="mcc__tags">' +
          '<span class="mcc__level-badge">' + levelName + '</span>' +
          '<span class="mcc__type-tag">' + labelForType(q.type || "mcq") + '</span>' +
        '</div>' +
        '<div class="mcc__footer">' +
          '<span class="mcc__date">' + formatDateTime(item.flaggedAt) + '</span>' +
          '<div class="mcc__btns">' +
            '<button type="button" class="test-inline-btn mcc__btn mcc__btn--unbookmark" data-unflag-question="' + item.questionId + '">' + tx("Remove") + '</button>' +
            '<button type="button" class="test-inline-btn mcc__btn mcc__btn--practice" data-practice-question="' + item.questionId + '" data-practice-type="flagged">' + tx("Practice") + '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderPagination(currentPage, totalPages, chapterFilter, levelFilter, tab, statusFilter) {
    if (totalPages <= 1) return "";
    function mkUrl(p) {
      return buildUrl("test-mistakes.html", {
        chapter: chapterFilter === "all" ? "" : chapterFilter,
        level: levelFilter === "all" ? "" : levelFilter,
        tab: tab === "mistakes" ? "" : tab,
        status: !statusFilter || statusFilter === "all" ? "" : statusFilter,
        page: p === 1 ? "" : String(p)
      });
    }
    var btns = [];
    var prevPage = currentPage > 1 ? currentPage - 1 : 0;
    var nextPage = currentPage < totalPages ? currentPage + 1 : 0;
    btns.push(prevPage ? '<a class="mpg-btn mpg-btn--nav" href="' + mkUrl(prevPage) + '" aria-label="' + escapeAttr(tx("Previous page")) + '">\u2039</a>' : '<span class="mpg-btn mpg-btn--nav is-disabled">\u2039</span>');
    for (var pi = 1; pi <= totalPages; pi++) {
      btns.push('<a class="mpg-btn' + (pi === currentPage ? " is-active" : "") + '" href="' + mkUrl(pi) + '">' + pi + '</a>');
    }
    btns.push(nextPage ? '<a class="mpg-btn mpg-btn--nav" href="' + mkUrl(nextPage) + '" aria-label="' + escapeAttr(tx("Next page")) + '">\u203a</a>' : '<span class="mpg-btn mpg-btn--nav is-disabled">\u203a</span>');
    return '<div class="mistakes-pagination">' + btns.join("") + '</div>';
  }

  /* ── Solo Practice Workbench ── */

  function initSoloState() {
    var params = getParams();
    if (!params.solo) return;
    var sep = params.solo.indexOf(":");
    if (sep === -1) return;
    var type = params.solo.slice(0, sep);
    var id = params.solo.slice(sep + 1);
    if ((type === "mistake" || type === "flagged") && id) {
      soloState = { type: type, itemId: id, draft: null, submitted: false, isCorrect: false, filterSheet: false };
    }
  }

  function enterSoloPractice(type, itemId) {
    soloState = { type: type, itemId: itemId, draft: null, submitted: false, isCorrect: false, filterSheet: false };
    var params = getParams();
    var next = { chapter: params.chapter || "", level: params.level || "", tab: params.tab || "", status: params.status || "", solo: type + ":" + itemId };
    if (window.history && window.history.replaceState) window.history.replaceState(null, "", buildUrl("test-mistakes.html", next));
    renderPage();
  }

  function exitSoloPractice() {
    soloState = null;
    var params = getParams();
    var next = { chapter: params.chapter || "", level: params.level || "", tab: params.tab || "", status: params.status || "", page: params.page || "" };
    if (window.history && window.history.replaceState) window.history.replaceState(null, "", buildUrl("test-mistakes.html", next));
    renderPage();
  }

  function getSoloItem(type, itemId) {
    if (type === "mistake") return state.mistakes.find(function (m) { return m.id === itemId; }) || null;
    return state.flagged.find(function (f) { return f.questionId === itemId; }) || null;
  }

  function setSoloDraft(value) {
    if (!soloState || soloState.submitted) return;
    soloState.draft = value;
    renderPage();
  }

  function addSoloSortItem(value) {
    if (!soloState || soloState.submitted) return;
    var draft = Array.isArray(soloState.draft) ? soloState.draft : [];
    if (draft.indexOf(value) === -1) draft = draft.concat([value]);
    soloState.draft = draft;
    renderPage();
  }

  function removeSoloSortItem(index) {
    if (!soloState || soloState.submitted) return;
    var draft = Array.isArray(soloState.draft) ? soloState.draft.slice() : [];
    draft.splice(index, 1);
    soloState.draft = draft;
    renderPage();
  }

  function resetSoloSortDraft() {
    if (!soloState || soloState.submitted) return;
    soloState.draft = [];
    renderPage();
  }

  function submitSoloPractice() {
    if (!soloState || soloState.submitted) return;
    var item = getSoloItem(soloState.type, soloState.itemId);
    if (!item) return;
    var question = item.questionSnapshot;
    if (!question || !hasAnswer(question, soloState.draft)) return;

    var correct = evaluate(question, soloState.draft);
    soloState.submitted = true;
    soloState.isCorrect = correct;
    soloState.filterSheet = false;
    if (correct) playSfx(SFX_CORRECT);
    else playSfx(SFX_WRONG);
    var now = new Date().toISOString();

    if (soloState.type === "mistake") {
      var mistake = item;
      if (correct) {
        mistake.mastered = true;
        mistake.reviewedAt = now;
      } else {
        mistake.mastered = false;
        mistake.reviewedAt = "";
        mistake.lastWrongAt = now;
        mistake.attemptCount = (mistake.attemptCount || 1) + 1;
        mistake.userAnswer = stringifyMistakeAnswer(soloState.draft);
      }
    } else {
      /* flagged: wrong answer → create / update a mistake record */
      if (!correct) {
        var fq = question;
        var fakeSession = { chapterId: item.chapter, levelId: item.level, unitId: item.unit || "unit-1", drafts: {} };
        fakeSession.drafts[fq.id] = soloState.draft;
        upsertMistake(fq, fakeSession, buildMistakeReason(fq));
      }
    }

    saveState();
    renderPage();
  }

  function renderSoloPractice(tab, chapterFilter, levelFilter, statusFilter) {
    var type = soloState.type;
    var itemId = soloState.itemId;
    var item = getSoloItem(type, itemId);

    /* Build the list items for the right panel */
    var listItems = tab === "flagged"
      ? getVisibleFlagged(chapterFilter, levelFilter)
      : getVisibleMistakes(chapterFilter, levelFilter, statusFilter);

    /* If current item is no longer in the filtered list, switch to first */
    var inList = listItems.some(function (li) {
      return (tab === "flagged" ? li.questionId : li.id) === itemId;
    });
    if (!inList && listItems.length > 0) {
      var firstId = tab === "flagged" ? listItems[0].questionId : listItems[0].id;
      soloState = { type: type, itemId: firstId, draft: null, submitted: false, isCorrect: false, filterSheet: false };
      itemId = firstId;
      item = getSoloItem(type, itemId);
    }

    var emptyMain = !item
      ? '<div class="solo-panel solo-panel--empty"><p>' + tx("No questions match the current filters.") + '</p>' +
          '<button type="button" class="solo-exit-btn" data-solo-action="exit">\u2190 ' + tx("Back to folder") + '</button>' +
        '</div>'
      : renderSoloLeft(item, type);

    var narrowSolo = isTestMistakesNarrowViewport();
    if (!narrowSolo && soloState.filterSheet) soloState.filterSheet = false;

    var listHtml = renderSoloRight(itemId, tab, listItems, type);
    if (narrowSolo) {
      var filterOpen = !!soloState.filterSheet;
      var menuBtn =
        '<button type="button" class="solo-filter-menu-btn" data-solo-toggle-filter aria-expanded="' +
        (filterOpen ? "true" : "false") +
        '" aria-label="' +
        (filterOpen ? "Back to question" : "Questions in this filter") +
        '">' +
        '<svg class="solo-filter-menu-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 7h14M5 12h14M5 17h14"/></svg>' +
        "</button>";
      var mainInner = '<div class="solo-narrow-main-wrap">' + menuBtn + (filterOpen ? listHtml : emptyMain) + "</div>";
      return '<div class="solo-workbench solo-workbench--narrow">' + '<div class="solo-workbench__main">' + mainInner + "</div>" + "</div>";
    }

    return '<div class="solo-workbench">' +
      '<div class="solo-workbench__main">' + emptyMain + '</div>' +
      '<aside class="solo-workbench__sidebar">' + listHtml + "</aside>" +
    "</div>";
  }

  function renderSoloLeft(item, type) {
    var question = item.questionSnapshot;
    var chObj = getChapter(item.chapter);
    var unitIdx = Math.max(0, (Number((item.unit || "unit-1").split("-")[1]) || 1) - 1);
    var nodeNum = getMapNodeNumber(item.chapter, item.level, unitIdx);
    var chapterName = chObj ? tx(chObj.name) : item.chapter;
    var lvObj = getLevel(item.level);
    var levelName = lvObj ? tx(lvObj.name) : item.level;
    var chColor = chObj ? chObj.colors.primary : "";
    var draft = soloState.draft;
    var submitted = soloState.submitted;
    var canSubmit = !submitted && hasAnswer(question, draft);

    var feedbackHtml = "";
    if (submitted) {
      var icon = soloState.isCorrect ? IC.correct : IC.wrong;
      var fbTitle = soloState.isCorrect ? tx("Correct!") : wrongAnswerFeedbackTitle(question);
      var fbCls = soloState.isCorrect ? "is-correct" : "is-wrong";
      feedbackHtml =
        '<div class="quiz-feedback ' + fbCls + '">' +
          '<h2 class="quiz-feedback__title">' + icon + ' ' + fbTitle + '</h2>' +
          '<p class="quiz-feedback__copy"><strong>' + tx("Explanation:") + '</strong> ' + tx(question.explanation) + '</p>' +
          '<p class="quiz-feedback__copy"><strong>' + tx("Knowledge point:") + '</strong> ' + tx(question.objective) + '</p>' +
          (type === "mistake" && soloState.isCorrect
            ? '<p class="quiz-feedback__copy solo-feedback__mastered">\u2713 ' + tx("Marked as Reviewed in your mistake list.") + '</p>'
            : '') +
          (type === "flagged" && !soloState.isCorrect
            ? '<p class="quiz-feedback__copy solo-feedback__added">\u26a0\ufe0f ' + tx("Added to your mistake list.") + '</p>'
            : '') +
        '</div>';
    }

    return '<div class="solo-panel">' +
      '<div class="solo-panel__meta">' +
        '<span class="solo-panel__source"' + (chColor ? ' style="color:' + chColor + '"' : '') + '>' +
          chapterName + ' \xb7 ' + nodeNum +
        '</span>' +
        '<span class="mcc__level-badge">' + levelName + '</span>' +
        (type === "mistake" && !submitted
          ? '<span class="mcc__status-tag' + (item.mastered ? ' is-ok' : '') + '">' + (item.mastered ? tx('Reviewed') : tx('Pending')) + '</span>'
          : '') +
      '</div>' +
      '<h2 class="solo-panel__prompt">' + tx(question.prompt) + '</h2>' +
      renderSoloQuestionBody(question, draft, submitted) +
      feedbackHtml +
      '<div class="solo-panel__actions">' +
        '<button type="button" class="solo-exit-btn" data-solo-action="exit">\u2190 ' + tx("Back to folder") + '</button>' +
        (!submitted
          ? '<button type="button" class="quiz-nav-btn is-next solo-panel__submit" data-solo-action="submit"' + (canSubmit ? '' : ' disabled') + '>' + IC.submit + ' ' + tx("Submit") + '</button>'
          : '') +
      '</div>' +
    '</div>';
  }

  function renderSoloQuestionBody(question, draft, submitted) {
    var opts = Array.isArray(question.options) ? question.options : [];
    if (question.type === "image") {
      return '<div class="quiz-image-options">' + opts.map(function (option) {
        var sel = draft === option.id;
        var cls = "quiz-image-option" + (sel ? " is-selected" : "");
        return '<button type="button" class="' + cls + '"' + (submitted ? ' disabled' : ' data-solo-answer="' + option.id + '"') + '>' + renderImagePreview(option) + '<strong class="quiz-image-option__label">' + tx(option.label) + '</strong></button>';
      }).join("") + "</div>";
    }
    if (question.type === "sort") {
      var selected = Array.isArray(draft) ? draft : [];
      var remaining = opts.filter(function (item) { return selected.indexOf(item) === -1; });
      var poolHtml = remaining.length
        ? remaining.map(function (item) { return '<button type="button" class="quiz-sort-chip"' + (submitted ? ' disabled' : ' data-solo-sort-add="' + item + '"') + '>' + tx(item) + '</button>'; }).join("")
        : '<span class="quiz-sort-pool-empty">' + tx("All items placed below") + '</span>';
      var rankHtml = question.correct.map(function (item, index) {
        var filled = !!selected[index];
        return '<div class="quiz-rank-row' + (filled ? ' is-filled' : '') + '">' +
          '<span class="quiz-rank-num">' + (index + 1) + '</span>' +
          (filled
            ? '<span class="quiz-rank-label">' + tx(selected[index]) + '</span>' + (!submitted ? '<button type="button" class="quiz-rank-remove" data-solo-sort-remove="' + index + '" aria-label="' + escapeAttr(tx("Remove")) + '">\u00d7</button>' : '')
            : '<span class="quiz-rank-placeholder">' + tx("Click an item above to place it here") + '</span>') +
        '</div>';
      }).join("");
      return '<div class="quiz-sort-shell">' +
        '<div class="quiz-sort-pool quiz-sort-pool--chips">' + poolHtml + '</div>' +
        '<div class="quiz-rank-list">' + rankHtml + '</div>' +
        (!submitted && selected.length > 0 ? '<button type="button" class="quiz-sort-reset" data-solo-sort-reset>' + tx("Reset order") + '</button>' : '') +
      '</div>';
    }
    /* true-false and MCQ — mirrors renderQuestionBody exactly */
    return '<div class="quiz-options">' + opts.map(function (option, index) {
      var sel = draft === option;
      var cls = "quiz-option" + (sel ? " is-selected" : "");
      return '<button type="button" class="' + cls + '"' + (submitted ? ' disabled' : ' data-solo-answer="' + option + '"') + '>' +
        '<span class="quiz-option__key">' + String.fromCharCode(65 + index) + '</span>' +
        '<span class="quiz-option__copy">' + tx(option) + '</span>' +
      '</button>';
    }).join("") + "</div>";
  }

  function renderSoloRight(currentId, tab, listItems, type) {
    if (!listItems.length) {
      return '<div class="solo-list"><p class="solo-list__empty">' + tx("No questions match the filter.") + '</p></div>';
    }
    var itemsHtml = listItems.map(function (li) {
      var id = tab === "flagged" ? li.questionId : li.id;
      var q = li.questionSnapshot || {};
      var prompt = tab === "flagged" ? (q.prompt ? tx(q.prompt) : "\u2014") : tx(li.prompt);
      var isActive = id === currentId;
      var chObj = getChapter(li.chapter);
      var chColor = chObj ? chObj.colors.primary : "#94a3b8";
      var statusLabel = tab === "flagged" ? tx("Bookmarked") : (li.mastered ? tx("Reviewed") : tx("Pending"));
      var statusCls = tab === "flagged" ? "is-flagged" : (li.mastered ? "is-ok" : "");
      return '<button type="button" class="solo-list__item' + (isActive ? ' is-active' : '') + '"' +
        ' data-solo-select="' + id + '" data-solo-select-type="' + type + '">' +
        '<span class="solo-list__dot" style="background:' + chColor + '"></span>' +
        '<span class="solo-list__prompt">' + prompt + '</span>' +
        '<span class="mcc__status-tag ' + statusCls + '">' + statusLabel + '</span>' +
      '</button>';
    }).join("");
    return '<div class="solo-list">' +
      '<div class="solo-list__header">' + tx("In this filter") + " &nbsp;<strong>" + listItems.length + "</strong></div>" +
      '<div class="solo-list__scroll">' + itemsHtml + '</div>' +
    '</div>';
  }

  function getParams() { var search = window.location.search.replace(/^\?/, ""); if (!search) return {}; return search.split("&").reduce(function (acc, item) { var parts = item.split("="); acc[decodeURIComponent(parts[0] || "")] = decodeURIComponent(parts.slice(1).join("=") || ""); return acc; }, {}); }
  /** Keeps ?q= in sync with currentIndex so ensureQuizSession does not snap back after in-page navigation. */
  function syncBrowseReplayQueryUrl(quiz) {
    if (!quiz || !quiz.browseOnly || !quiz.reviewResultId || !window.history || !window.history.replaceState) return;
    var nextUrl = buildUrl("test-quiz.html", {
      chapter: quiz.chapterId,
      level: quiz.levelId,
      unit: quiz.unitId,
      browse: "1",
      resultId: quiz.reviewResultId,
      q: String(quiz.currentIndex)
    });
    window.history.replaceState(null, "", nextUrl);
  }
  function buildUrl(path, params) { var query = Object.keys(params || {}).filter(function (key) { return params[key]; }).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]); }).join("&"); return query ? path + "?" + query : path; }
  function syncSelectionFromQuery() { var params = getParams(); if (params.chapter && getChapter(params.chapter)) state.selection.chapter = params.chapter; if (params.level && getLevel(params.level)) state.selection.level = params.level; saveState(); }
  function resolveChapterId() { var params = getParams(); return params.chapter || state.selection.chapter || "basics"; }
  function applyChapterTheme(chapterId) { var chapter = getChapter(chapterId) || CHAPTERS[0]; mainEl.style.setProperty("--theme-stop-2", chapter.colors.primary); mainEl.style.setProperty("--theme-stop-3", chapter.colors.secondary); mainEl.style.setProperty("--color-primary", chapter.colors.primary); mainEl.style.setProperty("--test-border", chapter.colors.border); }
  function getChapter(id) { return CHAPTERS.find(function (item) { return item.id === id; }) || null; }
  function getLevel(id) { return LEVELS.find(function (item) { return item.id === id; }) || null; }
  function getNextLevel(id) { var index = LEVEL_ORDER.indexOf(id); return index >= 0 && index < LEVEL_ORDER.length - 1 ? getLevel(LEVEL_ORDER[index + 1]) : null; }
  function getUnitFocus(chapterId, levelId, unitId) { var list = getChapter(chapterId).focuses[levelId]; var index = Math.max(0, (Number(unitId.split("-")[1]) || 1) - 1); return list[Math.min(index, list.length - 1)]; }
  function getLatestHistory(chapterId, levelId) { return state.history.find(function (item) { return item.chapter === chapterId && item.level === levelId; }) || null; }
  function getLearnTopicsForChapter(chapterId) {
    var chapter = LEARN_SECTION_MAP[chapterId];
    return chapter && Array.isArray(chapter.chapterTopics) ? chapter.chapterTopics.slice() : [{ label: "Overview", href: "learning.html#overview" }];
  }
  function getLearnTopicsForUnit(chapterId, unitId) {
    var chapter = LEARN_SECTION_MAP[chapterId];
    if (!chapter || !chapter.unitTopics) return getLearnTopicsForChapter(chapterId);
    var topics = chapter.unitTopics[unitId];
    return Array.isArray(topics) && topics.length ? topics.slice() : getLearnTopicsForChapter(chapterId);
  }
  function getPrimaryLearnHref(chapterId, unitId) {
    var topics = getLearnTopicsForUnit(chapterId, unitId);
    return topics.length && topics[0].href ? topics[0].href : "learning.html#overview";
  }
  function renderLearnTopicList(topics) {
    var list = Array.isArray(topics) && topics.length ? topics : [{ label: "Overview", href: "learning.html#overview" }];
    return '<div class="test-learn-rows">' + list.map(function (item) {
      return '<a class="test-learn-row" href="' + item.href + '"><span class="test-learn-row__label">' + tx(item.label) + '</span><span class="test-learn-row__arrow" aria-hidden="true"></span></a>';
    }).join("") + '</div>';
  }
  function renderResultInsightContent(items, emptyMessage) {
    if (!Array.isArray(items) || !items.length) {
      return '<p class="test-card-copy">' + tx(emptyMessage) + "</p>";
    }
    if (items.length === 1 && items[0] === emptyMessage) {
      return '<p class="test-card-copy">' + tx(emptyMessage) + "</p>";
    }
    return '<ul class="test-note-list">' + items.map(function (item) {
      return "<li>" + tx(item) + "</li>";
    }).join("") + "</ul>";
  }
  function getVisibleMistakes(chapterId, levelId, status) { return state.mistakes.filter(function (item) { var chapterMatch = !chapterId || chapterId === "all" || item.chapter === chapterId; var levelMatch = !levelId || levelId === "all" || item.level === levelId; var statusMatch = !status || status === "all" || (status === "reviewed" ? item.mastered : !item.mastered); return chapterMatch && levelMatch && statusMatch; }); }
  function getNodePalette(chapterId, levelId, unitIndex) { var chapter = getChapter(chapterId) || CHAPTERS[0]; var totalUnits = LEVEL_ORDER.reduce(function (sum, item) { return sum + UNIT_TEMPLATES[item].length; }, 0); var previousUnits = LEVEL_ORDER.slice(0, LEVEL_ORDER.indexOf(levelId)).reduce(function (sum, item) { return sum + UNIT_TEMPLATES[item].length; }, 0); var absoluteIndex = previousUnits + unitIndex; var ratio = totalUnits > 1 ? absoluteIndex / (totalUnits - 1) : 0; var baseHsl = hexToHsl(chapter.colors.secondary); var accent = hslToHex(baseHsl.h, clamp(baseHsl.s - 12 - ratio * 6, 40, 68), clamp(68 - ratio * 16, 48, 68)); return { accent: accent, soft: hslToHex(baseHsl.h, clamp(baseHsl.s - 14 - ratio * 8, 34, 62), clamp(92 - ratio * 10, 80, 92)), strong: hslToHex(baseHsl.h, clamp(baseHsl.s - 8 - ratio * 4, 40, 70), clamp(58 - ratio * 12, 40, 58)), border: hslToHex(baseHsl.h, clamp(baseHsl.s - 16 - ratio * 10, 30, 58), clamp(82 - ratio * 8, 70, 82)) }; }
  function blendHex(hexA, hexB, amount) { var a = hexToRgb(hexA); var b = hexToRgb(hexB); var t = Math.max(0, Math.min(1, amount)); return rgbToHex(Math.round(a.r + (b.r - a.r) * t), Math.round(a.g + (b.g - a.g) * t), Math.round(a.b + (b.b - a.b) * t)); }
  function hexToRgb(hex) { var value = (hex || "").replace("#", ""); if (value.length === 3) value = value.split("").map(function (item) { return item + item; }).join(""); return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) }; }
  function rgbToHex(r, g, b) { return "#" + [r, g, b].map(function (item) { var value = Math.max(0, Math.min(255, item)).toString(16); return value.length === 1 ? "0" + value : value; }).join(""); }
  function hexToHsl(hex) { var rgb = hexToRgb(hex); var r = rgb.r / 255; var g = rgb.g / 255; var b = rgb.b / 255; var max = Math.max(r, g, b); var min = Math.min(r, g, b); var h; var s; var l = (max + min) / 2; if (max === min) { h = 0; s = 0; } else { var d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }; }
  function hslToHex(h, s, l) { var hue = ((h % 360) + 360) % 360 / 360; var sat = clamp(s, 0, 100) / 100; var light = clamp(l, 0, 100) / 100; var r; var g; var b; if (sat === 0) { r = g = b = light; } else { var hueToRgb = function (p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }; var q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat; var p = 2 * light - q; r = hueToRgb(p, q, hue + 1 / 3); g = hueToRgb(p, q, hue); b = hueToRgb(p, q, hue - 1 / 3); } return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)); }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function labelForType(type) {
    return tx(type === "true-false" ? "True / False" : type === "image" ? "Image Choice" : type === "sort" ? "Sort" : "MCQ");
  }
  function formatDate(value) {
    try {
      if (!value) return tx("Not yet");
      var zh = window.CLWLocale && CLWLocale.getLocale && CLWLocale.getLocale() === "zh";
      return new Date(value).toLocaleDateString(zh ? "zh-CN" : undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return value;
    }
  }
  function unique(items) { return items.filter(function (item, index) { return item && items.indexOf(item) === index; }); }
  function formatDateTime(value) { try { if (!value) return ""; var d = new Date(value); var zh = window.CLWLocale && CLWLocale.getLocale && CLWLocale.getLocale() === "zh"; var loc = zh ? "zh-CN" : "en-GB"; return d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" }) + " " + d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" }); } catch (e) { return value || ""; } }
  function shouldRunQuizTimer(quiz) {
    return !!(quiz && !quiz.browseOnly && quiz.mode !== "review");
  }
  function normalizeQuizTimerForMode(quiz) {
    if (!quiz) return;
    ensureQuizTimerState(quiz);
    if (!shouldRunQuizTimer(quiz)) quiz.timerActiveSince = null;
  }
  function stopQuizLiveTimer() {
    if (quizLiveTimerId) {
      clearInterval(quizLiveTimerId);
      quizLiveTimerId = null;
    }
  }
  function syncQuizLiveDisplays() {
    var q = state.currentQuiz;
    if (!q || !rootEl || mainEl.getAttribute("data-test-page") !== "quiz") return;
    var timeText = formatElapsedDuration(getQuizElapsedMs(q));
    var scoreText = String(q.score);
    var ti;
    var timeNodes = rootEl.querySelectorAll("[data-quiz-live-time]");
    for (ti = 0; ti < timeNodes.length; ti++) timeNodes[ti].textContent = timeText;
    var si;
    var scoreNodes = rootEl.querySelectorAll("[data-quiz-live-score]");
    for (si = 0; si < scoreNodes.length; si++) scoreNodes[si].textContent = scoreText;
  }
  function startQuizLiveTimerIfNeeded() {
    stopQuizLiveTimer();
    if (!rootEl || mainEl.getAttribute("data-test-page") !== "quiz") return;
    var q = state.currentQuiz;
    syncQuizLiveDisplays();
    if (!shouldRunQuizTimer(q)) return;
    quizLiveTimerId = setInterval(syncQuizLiveDisplays, 500);
  }
  function ensureQuizTimerState(quiz) {
    if (!quiz) return;
    if (typeof quiz.elapsedMs !== "number" || quiz.elapsedMs < 0) quiz.elapsedMs = 0;
    if (!Object.prototype.hasOwnProperty.call(quiz, "timerActiveSince")) quiz.timerActiveSince = null;
  }
  function getQuizElapsedMs(quiz) {
    if (!quiz) return 0;
    ensureQuizTimerState(quiz);
    if (!shouldRunQuizTimer(quiz)) return Math.max(0, Math.round(quiz.elapsedMs));
    if (!quiz.timerActiveSince) return Math.max(0, Math.round(quiz.elapsedMs));
    return Math.max(0, Math.round(quiz.elapsedMs + Math.max(0, Date.now() - Number(quiz.timerActiveSince))));
  }
  function pauseQuizTimer(quiz) {
    if (!quiz || !shouldRunQuizTimer(quiz)) return;
    ensureQuizTimerState(quiz);
    if (!quiz.timerActiveSince) return;
    quiz.elapsedMs = getQuizElapsedMs(quiz);
    quiz.timerActiveSince = null;
    saveState();
  }
  function resumeQuizTimer(quiz) {
    if (!quiz || !shouldRunQuizTimer(quiz)) return;
    ensureQuizTimerState(quiz);
    if (quiz.timerActiveSince) return;
    quiz.timerActiveSince = Date.now();
    saveState();
  }
  function pauseActiveQuizTimer() {
    if (!state || !state.currentQuiz) return;
    pauseQuizTimer(state.currentQuiz);
  }
  function getResultElapsedMs(result) {
    return result && typeof result.elapsedMs === "number" && result.elapsedMs > 0 ? result.elapsedMs : 0;
  }
  function formatElapsedDuration(ms) {
    var totalSeconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    if (totalSeconds >= 3600) {
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      return String(hours) + "h" + String(minutes).padStart(2, "0") + "min";
    }
    var mins = Math.floor(totalSeconds / 60);
    var secs = totalSeconds % 60;
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }
  function handleDocumentVisibilityChange() {
    var quiz = state.currentQuiz;
    if (!quiz || !shouldRunQuizTimer(quiz)) return;
    if (document.hidden) {
      pauseQuizTimer(quiz);
      stopQuizLiveTimer();
      syncQuizLiveDisplays();
      return;
    }
    if (mainEl.getAttribute("data-test-page") === "quiz") {
      resumeQuizTimer(quiz);
      syncQuizLiveDisplays();
      startQuizLiveTimerIfNeeded();
    }
  }
  function handlePageHide() { pauseActiveQuizTimer(); }
  function buildBadgeName(chapterId) {
    return chapterId === "basics" ? "Contrast Keeper"
      : chapterId === "models" ? "Output Strategist"
      : chapterId === "meaning" ? "Display Navigator"
      : chapterId === "workflow" ? "Workflow Steward"
      : chapterId === "practice" ? "Tool Pathfinder"
      : "Color Scholar";
  }
  function createMistakeRecord(question, session, reason, timestamp) { return { id: "mistake-" + question.id, chapter: session.chapterId, level: session.levelId, unit: session.unitId, topic: question.topic, reviewTopic: question.reviewTopic, questionType: question.type, prompt: question.prompt, correctConcept: question.explanation, mistakeReason: reason, mastered: false, questionSnapshot: clone(question), lastWrongAt: timestamp, attemptCount: 1, userAnswer: "", reviewedAt: "", showExplanation: false }; }
  function upsertMistake(question, quiz, reason) { var existing = state.mistakes.find(function (item) { return item.questionSnapshot.id === question.id; }); if (existing) { existing.mastered = false; existing.reviewedAt = ""; existing.lastWrongAt = new Date().toISOString(); existing.mistakeReason = reason; existing.attemptCount = (existing.attemptCount || 1) + 1; existing.userAnswer = stringifyMistakeAnswer(quiz.drafts[question.id]); existing.showExplanation = false; return; } var next = createMistakeRecord(question, quiz, reason, new Date().toISOString()); next.userAnswer = stringifyMistakeAnswer(quiz.drafts[question.id]); state.mistakes.unshift(next); state.mistakes = state.mistakes.slice(0, 40); }
  function markMistakeReviewed(questionId) { var item = state.mistakes.find(function (mistake) { return mistake.questionSnapshot.id === questionId; }); if (item) { item.mastered = true; item.reviewedAt = new Date().toISOString(); } }
  function toggleMastered(id) { var item = state.mistakes.find(function (mistake) { return mistake.id === id; }); if (!item) return; item.mastered = !item.mastered; item.reviewedAt = item.mastered ? new Date().toISOString() : ""; saveState(); renderPage(); }
  function toggleMistakeExplanation(id) { var item = state.mistakes.find(function (mistake) { return mistake.id === id; }); if (!item) return; item.showExplanation = !item.showExplanation; saveState(); renderPage(); }
  function stringifyMistakeAnswer(answer) { if (Array.isArray(answer)) return answer.join(" -> "); if (answer && typeof answer === "object") return answer.label || answer.id || JSON.stringify(answer); return answer || "No answer recorded"; }
  function getMistakeUserAnswer(mistake) { return mistake.userAnswer || "No answer recorded"; }
  function getMistakeCorrectAnswer(mistake) { return stringifyMistakeAnswer(mistake.questionSnapshot.correct); }
  function getResultForPage() { var params = getParams(); if (params.resultId) { var match = state.history.find(function (item) { return item.id === params.resultId; }); if (match) return match; } if (params.chapter && params.level) { var filtered = getLatestHistory(params.chapter, params.level); if (filtered) return filtered; } return state.lastResult || state.history[0] || DEFAULT_STATE.lastResult || null; }
})();
