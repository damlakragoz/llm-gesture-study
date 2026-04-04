/**
 * User Study Configuration
 * Edit these values before deploying to GitHub Pages.
 */

const CONFIG = {
  // URL to your consent form PDF (relative to study/ or full URL)
  // Local: "./consent.pdf"  |  GitHub Pages: "./consent.pdf" or full URL
  CONSENT_PDF_URL: "./consent.pdf",

  // Base path for animation GIFs (relative to study page)
  // Use "./animations" when GIFs are in study/animations/ (works from study/ or project root)
  ANIMATIONS_PATH: "./animations",

  // Google Apps Script Web App URL (deploy your Sheet as Web App, set to "Anyone")
  // Leave empty to skip server submission (responses only in browser)
  GOOGLE_SHEETS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbz16D2EhDDUJVo-GAYSFPEoRV7scN_sPJJaR3YMiPsISAdw0SbpX6GzQh4i_u7TBSA6/exec",

  // Number of pair comparisons per question (total trials = 5 * this)
  TRIALS_PER_QUESTION: 4,

  // Prolific completion redirect (optional - for Prolific redirect after study)
  PROLIFIC_REDIRECT_URL: "",
};
