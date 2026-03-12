// MATE ROV Competition Scoreboard - Google Sheets Backend
// Instructions: 
// 1. Copy this code to Google Apps Script (sheet.new)
// 2. Extensions > Apps Script
// 3. Paste this code
// 4. Save and Deploy > New Deployment
// 5. Select "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Copy the Web App URL and share with scoreboard

const SHEET_NAME = "Scores";

const doPost = (e) => {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      // Create headers
      const headers = [
        'Timestamp', 'Trial Run', 'Team Name', 'CEO Name', 'Judge Name', 
        'Safety', 'Org', 'Weight', 'Task 1', 'Task 2', 'Task 3', 'Task 4', 
        'Total Score', 'Class'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    const body = e.postData.contents;
    const data = JSON.parse(body);
    
    const timestamp = new Date();
    const row = [
      timestamp.toISOString(),
      data.trialRun || 1,
      data.teamName || '',
      data.ceoName || '',
      data.judgeName || '',
      data.scores.safety || 0,
      data.scores.org || 0,
      data.scores.weight || 0,
      data.scores.t1 || 0,
      data.scores.t2 || 0,
      data.scores.t3 || 0,
      data.scores.t4 || 0,
      data.totalScore || 0,
      data.rovClass || 'explorer'
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': row }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

const doGet = (e) => {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'ok', 'message': 'MATE ROV Scoreboard API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
