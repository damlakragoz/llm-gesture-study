/**
 * Gesture & Personality Perception Study — Main Logic
 * Prolific-compatible user study interface
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Questions (Big Five trait perceptions)
  // ---------------------------------------------------------------------------
  const QUESTIONS = [
    {
      id: "extraversion",
      text: "Which person appears more outgoing, sociable, and energetic?",
    },
    {
      id: "agreeableness",
      text: "Which person appears more friendly, cooperative, and warm?",
    },
    {
      id: "conscientiousness",
      text: "Which person appears more organized, responsible, and reliable?",
    },
    {
      id: "emotional_stability",
      text: "Which person appears more calm, emotionally stable, and resilient?",
    },
    {
      id: "openness",
      text: "Which person appears more open to new experiences, creative, and curious?",
    },
  ];

  // ---------------------------------------------------------------------------
  // GIF list (from animations/)
  // ---------------------------------------------------------------------------
  const GIF_FILES = [
    "high_agreeableness.gif",
    "high_agreeableness_baseline.gif",
    "high_agreeableness_llm_run1.gif",
    "high_agreeableness_llm_run2.gif",
    "high_agreeableness_llm_run3.gif",
    "high_agreeableness_llm_run4.gif",
    "high_conscientiousness.gif",
    "high_conscientiousness_baseline.gif",
    "high_conscientiousness_llm_run1.gif",
    "high_conscientiousness_llm_run2.gif",
    "high_conscientiousness_llm_run3.gif",
    "high_conscientiousness_llm_run4.gif",
    "high_extraversion.gif",
    "high_extraversion_baseline.gif",
    "high_extraversion_llm_run1.gif",
    "high_extraversion_llm_run3.gif",
    "high_extraversion_llm_run4.gif",
    "high_neuroticism.gif",
    "high_neuroticism_baseline.gif",
    "high_neuroticism_llm_run1.gif",
    "high_neuroticism_llm_run3.gif",
    "high_neuroticism_llm_run4.gif",
    "high_openness.gif",
    "high_openness_baseline.gif",
    "high_openness_llm_run1.gif",
    "high_openness_llm_run2.gif",
    "high_openness_llm_run3.gif",
    "low_agreeableness.gif",
    "low_agreeableness_llm_run1.gif",
    "low_agreeableness_llm_run2.gif",
    "low_agreeableness_llm_run3.gif",
    "low_agreeableness_llm_run4.gif",
    "low_conscientiousness.gif",
    "low_conscientiousness_llm_run1.gif",
    "low_conscientiousness_llm_run2.gif",
    "low_conscientiousness_llm_run3.gif",
    "low_conscientiousness_llm_run4.gif",
    "low_extraversion.gif",
    "low_extraversion_llm_run1.gif",
    "low_extraversion_llm_run2.gif",
    "low_extraversion_llm_run3.gif",
    "low_extraversion_llm_run4.gif",
    "low_neuroticism.gif",
    "low_neuroticism_llm_run1.gif",
    "low_neuroticism_llm_run2.gif",
    "low_neuroticism_llm_run3.gif",
    "low_neuroticism_llm_run4.gif",
    "low_openness.gif",
    "low_openness_llm_run1.gif",
    "low_openness_llm_run2.gif",
    "low_openness_llm_run3.gif",
    "low_openness_llm_run4.gif",
    "neutral.gif",
    "neutral_llm_run1.gif",
    "neutral_llm_run2.gif",
    "neutral_llm_run3.gif",
    "neutral_llm_run4.gif"
  ];

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let trials = [];
  let currentTrialIndex = 0;
  let responses = [];
  let participantId = "";
  let sessionId = "";
  let pendingSelectedSide = null;

  // ---------------------------------------------------------------------------
  // URL params (Prolific: PROLIFIC_PID, STUDY_ID, SESSION_ID)
  // ---------------------------------------------------------------------------
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      prolificPid: params.get("PROLIFIC_PID") || "",
      studyId: params.get("STUDY_ID") || "",
      sessionId: params.get("SESSION_ID") || "",
    };
  }

  function generateSessionId() {
    return "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
  }

  // ---------------------------------------------------------------------------
  // Build trials: pairs of GIFs + question per trial
  // ---------------------------------------------------------------------------
  function buildTrials() {
    const trialsPerQ = typeof CONFIG !== "undefined" && CONFIG.TRIALS_PER_QUESTION
      ? CONFIG.TRIALS_PER_QUESTION
      : 4;
    const animPath = typeof CONFIG !== "undefined" && CONFIG.ANIMATIONS_PATH
      ? CONFIG.ANIMATIONS_PATH
      : "./animations";

    const allTrials = [];
    const shuffledQuestions = [...QUESTIONS].sort(() => Math.random() - 0.5);

    for (let q = 0; q < shuffledQuestions.length; q++) {
      const question = shuffledQuestions[q];
      
      // AUDIT FIX: Group GIFs by trait so the question matches the visuals
      // "emotional_stability" maps to "neuroticism" in file naming
      const traitInternal = question.id === "emotional_stability" ? "neuroticism" : question.id;
      const traitGifs = GIF_FILES.filter(f => f.includes(traitInternal) || f.startsWith("neutral"));

      for (let t = 0; t < trialsPerQ; t++) {
        const [left, right] = pickRandomPair(traitGifs);
        const swap = Math.random() < 0.5;
        allTrials.push({
          questionId: question.id,
          questionText: question.text,
          leftGif: swap ? right : left,
          rightGif: swap ? left : right,
          leftPath: `${animPath}/${swap ? right : left}`,
          rightPath: `${animPath}/${swap ? left : right}`,
        });
      }
    }

    // Shuffle all trials
    return allTrials.sort(() => Math.random() - 0.5);
  }

  function pickRandomPair(arr) {
    // If for some reason we have < 2 GIFs after filtering
    if (arr.length < 2) return [GIF_FILES[0], GIF_FILES[1]];

    const i = Math.floor(Math.random() * arr.length);
    let j = Math.floor(Math.random() * arr.length);
    while (j === i) j = Math.floor(Math.random() * arr.length);
    return [arr[i], arr[j]];
  }

  // ---------------------------------------------------------------------------
  // Screen navigation
  // ---------------------------------------------------------------------------
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
  }

  // ---------------------------------------------------------------------------
  // Consent
  // ---------------------------------------------------------------------------
  function initConsent() {
    const pdfUrl =
      typeof CONFIG !== "undefined" && CONFIG.CONSENT_PDF_URL
        ? CONFIG.CONSENT_PDF_URL
        : "";

    const pdfObj = document.getElementById("consent-pdf");
    const link = document.getElementById("consent-link");
    const checkbox = document.getElementById("consent-checkbox");
    const btn = document.getElementById("consent-continue");

    if (pdfUrl) {
      link.href = pdfUrl;
      link.style.display = "inline-block";
      pdfObj.data = pdfUrl;
    } else {
      document.getElementById("consent-pdf-container").innerHTML =
        '<p class="consent-placeholder">Please add your consent form PDF URL in <code>config.js</code> (CONSENT_PDF_URL).</p>';
    }

    checkbox.addEventListener("change", () => {
      btn.disabled = !checkbox.checked;
    });

    btn.addEventListener("click", () => {
      if (checkbox.checked) showScreen("welcome-screen");
    });
  }

  // ---------------------------------------------------------------------------
  // Welcome
  // ---------------------------------------------------------------------------
  function initWelcome() {
    document.getElementById("welcome-continue").addEventListener("click", () => {
      showScreen("instructions-screen");
    });
  }

  // ---------------------------------------------------------------------------
  // Instructions
  // ---------------------------------------------------------------------------
  function initInstructions() {
    document.getElementById("instructions-start").addEventListener("click", () => {
      startStudy();
    });
  }

  // ---------------------------------------------------------------------------
  // Study flow
  // ---------------------------------------------------------------------------
  function startStudy() {
    const params = getUrlParams();
    participantId = params.prolificPid || "anonymous_" + Math.random().toString(36).slice(2, 10);
    sessionId = params.sessionId || generateSessionId();

    trials = buildTrials();
    currentTrialIndex = 0;
    responses = [];

    showScreen("trial-screen");
    showTrial();
  }

  function showTrial() {
    const trial = trials[currentTrialIndex];
    const total = trials.length;

    document.getElementById("progress-text").textContent = `Trial ${currentTrialIndex + 1} of ${total}`;
    document.getElementById("trial-question").textContent = trial.questionText;

    const imgLeft = document.getElementById("gif-left");
    const imgRight = document.getElementById("gif-right");

    imgLeft.src = trial.leftPath;
    imgRight.src = trial.rightPath;
    imgLeft.alt = "Person A";
    imgRight.alt = "Person B";

    // AUDIT FIX: Preload next trial GIFs
    if (currentTrialIndex + 1 < trials.length) {
      const next = trials[currentTrialIndex + 1];
      new Image().src = next.leftPath;
      new Image().src = next.rightPath;
    }

    // Reset selection state
    document.querySelector(".gif-pair").classList.remove("disabled");
    document.querySelectorAll(".gif-option").forEach((o) => o.classList.remove("selected"));
    document.querySelectorAll(".btn-choice").forEach((b) => {
      b.disabled = false;
      b.classList.remove("selected");
    });

    // Hide confidence section
    const confidenceSection = document.getElementById("confidence-section");
    confidenceSection.hidden = true;
    document.querySelectorAll(".btn-confidence").forEach((b) => b.classList.remove("selected"));
    pendingSelectedSide = null;
  }

  function showConfidencePrompt(selectedSide) {
    document.querySelectorAll(".btn-choice").forEach((b) => b.classList.remove("selected"));
    document.getElementById("btn-" + selectedSide).classList.add("selected");
    document.getElementById("confidence-section").hidden = false;
    pendingSelectedSide = selectedSide;
  }

  function recordResponse(selectedSide, confidence) {
    const trial = trials[currentTrialIndex];
    responses.push({
      trialIndex: currentTrialIndex + 1,
      questionId: trial.questionId,
      questionText: trial.questionText,
      leftGif: trial.leftGif,
      rightGif: trial.rightGif,
      selectedSide,
      selectedGif: selectedSide === "left" ? trial.leftGif : trial.rightGif,
      confidence,
      timestamp: new Date().toISOString(),
    });

    currentTrialIndex++;

    if (currentTrialIndex >= trials.length) {
      finishStudy();
    } else {
      showTrial();
    }
  }

  function finishStudy() {
    showScreen("completion-screen");

    const completionEl = document.getElementById("completion-id");
    completionEl.textContent = `Session ID: ${sessionId}`;

    submitToGoogleSheets();

    // Prolific redirect
    const redirectUrl =
      typeof CONFIG !== "undefined" && CONFIG.PROLIFIC_REDIRECT_URL
        ? CONFIG.PROLIFIC_REDIRECT_URL
        : "";
    if (redirectUrl) {
      // Prolific completion URL
      window.location.href = redirectUrl;
    }
  }

  // ---------------------------------------------------------------------------
  // Google Sheets submission
  // ---------------------------------------------------------------------------
  function submitToGoogleSheets() {
    const url =
      typeof CONFIG !== "undefined" && CONFIG.GOOGLE_SHEETS_WEB_APP_URL
        ? CONFIG.GOOGLE_SHEETS_WEB_APP_URL
        : "";

    if (!url) return;

    const payload = {
      participantId,
      sessionId,
      completedAt: new Date().toISOString(),
      responses,
    };

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then((r) => (r.ok ? Promise.resolve() : Promise.reject(new Error(r.statusText))))
      .catch((err) => console.warn("Sheets submission failed:", err));
  }

  // ---------------------------------------------------------------------------
  // Event bindings
  // ---------------------------------------------------------------------------
  function initTrialHandlers() {
    const handleSelection = (side) => {
      if (pendingSelectedSide === side) {
        // Toggle off (unselect)
        document.querySelector(".gif-pair").classList.remove("disabled");
        document.querySelectorAll(".gif-option").forEach((o) => o.classList.remove("selected"));
        document.querySelectorAll(".btn-choice").forEach((b) => b.classList.remove("selected"));
        document.getElementById("confidence-section").hidden = true;
        pendingSelectedSide = null;
      } else {
        // Select or Switch
        document.querySelector(".gif-pair").classList.add("disabled");
        document.querySelectorAll(".gif-option").forEach((o) => o.classList.remove("selected"));
        document.querySelector(`.gif-option[data-side='${side}']`).classList.add("selected");
        showConfidencePrompt(side);
      }
    };

    document.getElementById("btn-left").addEventListener("click", () => handleSelection("left"));
    document.getElementById("btn-right").addEventListener("click", () => handleSelection("right"));

    document.querySelectorAll(".gif-option").forEach((el) => {
      el.addEventListener("click", () => {
        const side = el.getAttribute("data-side");
        handleSelection(side);
      });
    });

    // Keyboard controls removed as per user request
    // All interactions should now be mouse/touch driven
    /*
    document.addEventListener("keydown", (e) => {
      if (!document.getElementById("trial-screen").classList.contains("active")) return;
      if (document.getElementById("confidence-section").hidden) {
        if (e.key === "1") { e.preventDefault(); selectLeft(); }
        else if (e.key === "2") { e.preventDefault(); selectRight(); }
      } else {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 5) {
          e.preventDefault();
          document.querySelector(`.btn-confidence[data-confidence="${num}"]`).click();
        }
      }
    });
    */

    document.querySelectorAll(".btn-confidence").forEach((btn) => {
      btn.addEventListener("click", () => {
        const confidence = parseInt(btn.getAttribute("data-confidence"), 10);
        recordResponse(pendingSelectedSide, confidence);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Detect file:// and show help
  // ---------------------------------------------------------------------------
  function checkProtocol() {
    if (window.location.protocol === "file:") {
      document.body.innerHTML =
        '<div style="max-width:500px;margin:2rem auto;padding:2rem;font-family:sans-serif;">' +
        "<h2>Cannot run from file</h2>" +
        "<p>Open this page via a local server. From the project root (<code>cs490/</code>), run:</p>" +
        "<pre style='background:#f0f0f0;padding:1rem;border-radius:6px;'>python3 -m http.server 8000</pre>" +
        "<p>Then open: <a href='http://localhost:8000/study/'>http://localhost:8000/study/</a></p>" +
        "</div>";
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    if (checkProtocol()) return;
    initConsent();
    initWelcome();
    initInstructions();
    initTrialHandlers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
