/**
 * Momentum Members API — paste into Apps Script (Extensions → Apps Script)
 * Then: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec URL into js/members.js (SHEETS_API_URL)
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return jsonResponse_([]);
  }

  const headers = values[0].map(function (h) {
    return String(h).trim().toLowerCase();
  });

  const rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    var hasValue = false;
    for (var j = 0; j < headers.length; j++) {
      var cell = values[i][j];
      if (cell !== '' && cell != null) hasValue = true;
      obj[headers[j]] = cell != null ? String(cell) : '';
    }
    if (hasValue && obj.name) rows.push(obj);
  }

  var callback = e && e.parameter && e.parameter.callback;
  var json = JSON.stringify(rows);

  if (callback) {
    return ContentService.createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
