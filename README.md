# Gesture & Personality Perception Study

Prolific-compatible web interface for a user study on gesture-based personality perception.

## Setup

### 1. Consent Form PDF

- Upload your consent form PDF to the repo (e.g. `study/consent.pdf`) or host it elsewhere.
- In `config.js`, set `CONSENT_PDF_URL`:
  ```js
  CONSENT_PDF_URL: "https://yourusername.github.io/cs490/study/consent.pdf"
  ```

### 2. Animations

- GIFs are in `study/animations/` (copied from `out/animations/`).
- Config uses `ANIMATIONS_PATH: "./animations"`.
- To refresh: `cp out/animations/*.gif study/animations/`

### 3. Google Sheets Backend

1. Create a new [Google Sheet](https://sheets.google.com).
2. **Extensions → Apps Script**.
3. Replace the default `Code.gs` with the contents of `GoogleAppsScript.gs`.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL and set in `config.js`:
   ```js
   GOOGLE_SHEETS_WEB_APP_URL: "https://script.google.com/macros/s/.../exec"
   ```

### 4. Prolific (Optional)

- For completion redirect, set `PROLIFIC_REDIRECT_URL` in `config.js` to your Prolific completion URL.
- Prolific passes `PROLIFIC_PID`, `STUDY_ID`, `SESSION_ID` via URL params; these are captured automatically.

### 5. GitHub Pages Deploy

1. Push the repo to GitHub.
2. **Settings → Pages → Source**: Deploy from branch (e.g. `main`), folder `/ (root)` or `/docs` if you use that.
3. Study URL: `https://yourusername.github.io/cs490/study/`

For Prolific, use:
```
https://yourusername.github.io/cs490/study/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
```

## Config Options

| Variable | Description |
|----------|-------------|
| `CONSENT_PDF_URL` | URL to consent form PDF |
| `ANIMATIONS_PATH` | Base path for GIF files |
| `GOOGLE_SHEETS_WEB_APP_URL` | Google Apps Script Web App URL |
| `TRIALS_PER_QUESTION` | Pairs per question (default: 4, total = 5 × 4 = 20) |
| `PROLIFIC_REDIRECT_URL` | Redirect after completion |

## Study Flow

1. **Consent** — PDF viewer + checkbox
2. **Instructions** — Task description
3. **Trials** — Pairs of GIFs with one of 5 questions each
4. **Completion** — Thank you message

## Questions

- Extraversion: *Which person appears more outgoing, sociable, and energetic?*
- Agreeableness: *Which person appears more friendly, cooperative, and warm?*
- Conscientiousness: *Which person appears more organized, responsible, and reliable?*
- Emotional stability: *Which person appears more calm, emotionally stable, and resilient?*
- Openness: *Which person appears more open to new experiences, creative, and curious?*
