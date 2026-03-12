// MATE ROV Competition Scoreboard - Google Sheets Backend
const doPost = (e) => {
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    // Use the first sheet (always exists)
    const sheet = doc.getSheets()[0];
    
    // Add headers if empty
    if (sheet.getLastRow() === 0) {
      const headers = ['Timestamp', 'Trial Run', 'Team Name', 'CEO Name', 'Judge Name', 'Safety', 'Org', 'Weight', 'Task 1', 'Task 2', 'Task 3', 'Task 4', 'Total Score', 'Class'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const data = JSON.parse(e.postData.contents);
    const row = [
      new Date().toISOString(),
      data.trialRun || 1,
      data.teamName || '',
      data.ceoName || '',
      data.judgeName || '',
      data.scores?.safety || 0,
      data.scores?.org || 0,
      data.scores?.weight || 0,
      data.scores?.t1 || 0,
      data.scores?.t2 || 0,
      data.scores?.t3 || 0,
      data.scores?.t4 || 0,
      data.totalScore || 0,
      data.rovClass || 'explorer'
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

const doGet = () => {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
