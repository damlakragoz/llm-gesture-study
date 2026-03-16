/**
 * Google Apps Script — Web App backend for User Study
 *
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Extensions → Apps Script
 * 3. Replace the default Code.gs with this file
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL into config.js (GOOGLE_SHEETS_WEB_APP_URL)
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Ensure headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "timestamp",
        "participant_id",
        "session_id",
        "completed_at",
        "trial_index",
        "question_id",
        "question_text",
        "left_gif",
        "right_gif",
        "selected_side",
        "selected_gif",
      ]);
    }

    const body = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(body);

    const participantId = data.participantId || "";
    const sessionId = data.sessionId || "";
    const completedAt = data.completedAt || "";
    const responses = data.responses || [];

    for (let i = 0; i < responses.length; i++) {
      const r = responses[i];
      sheet.appendRow([
        new Date().toISOString(),
        participantId,
        sessionId,
        completedAt,
        r.trialIndex,
        r.questionId,
        r.questionText,
        r.leftGif,
        r.rightGif,
        r.selectedSide,
        r.selectedGif,
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    )
      .setMimeType(ContentService.MimeType.JSON);
  }
}
