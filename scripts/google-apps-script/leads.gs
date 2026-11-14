/**
 * Home Geniee — website leads → Google Sheet
 *
 * Paste this whole file into the Google Sheet's Extensions → Apps Script
 * editor, then Deploy → New deployment → Web app
 *   Execute as: Me   ·   Who has access: Anyone
 * and give the Web app URL (ends in /exec) to the website.
 *
 * Every submission becomes one row, in a tab per form:
 *   "Consultations"   — Book free consultation popup
 *   "Contact"         — Contact page form (design upload saved to Drive)
 *   "Cost estimates"  — calculator sign-in before the cost is revealed
 * Tabs and header rows are created automatically on the first submission.
 */

// ---------- Settings you can change ----------
// Who gets an email for every new lead. Leave empty ("") for no emails.
// Several addresses: "a@example.com,b@example.com"
const NOTIFY_EMAIL = "";

// Drive folder for design files uploaded on the Contact page.
const UPLOAD_FOLDER = "Home Geniee - design uploads";
const MAX_FILE_MB = 10;

// Columns per tab: [header, field in the website's data]
const TABS = {
  consultation: {
    name: "Consultations",
    columns: [
      ["Received", "_time"], ["Name", "name"], ["Phone", "phone"], ["Email", "email"],
      ["Location", "location"], ["Interested in", "interest"], ["Message", "message"],
      ["Page", "page"],
    ],
  },
  contact: {
    name: "Contact",
    columns: [
      ["Received", "_time"], ["Name", "name"], ["Phone", "phone"], ["Email", "email"],
      ["Purpose", "purpose"], ["Message", "message"], ["Design file", "_file"],
      ["Page", "page"],
    ],
  },
  estimate: {
    name: "Cost estimates",
    columns: [
      ["Received", "_time"], ["Name", "name"], ["Phone", "phone"], ["Service", "service"],
      ["Size / layout", "size"], ["Scope", "scope"], ["Finish", "tier"],
      ["Estimate from (₹)", "low"], ["Estimate to (₹)", "high"], ["Page", "page"],
    ],
  },
};
// ---------------------------------------------

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Spam trap: a hidden field real visitors never fill in.
    if (data.website) return reply({ ok: true });

    const tab = TABS[data.form];
    if (!tab) return reply({ ok: false, error: "Unknown form" });

    const name = String(data.name || "").trim();
    const phone = String(data.phone || "").trim();
    if (!name) return reply({ ok: false, error: "Name is required" });
    if (!/^[\d\s+()-]{8,20}$/.test(phone)) return reply({ ok: false, error: "A valid phone number is required" });
    data.name = name;
    data.phone = phone;

    // Flatten the calculator's estimate into top-level fields.
    if (data.estimate && typeof data.estimate === "object") {
      for (const k of ["service", "size", "scope", "tier", "low", "high"]) data[k] = data.estimate[k];
    }

    data._time = new Date();
    data._file = data.file && data.file.data ? saveUpload(data.file, name) : "";

    // One writer at a time, so simultaneous submissions never overwrite each other.
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = getTab(tab);
      sheet.appendRow(tab.columns.map(([, key]) => clean(data[key])));
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY_EMAIL) notify(tab, data);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  }
}

// Open the Web app URL in a browser to check the deployment is live.
function doGet() {
  return reply({ ok: true, service: "Home Geniee leads" });
}

function getTab(tab) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(tab.name);
  if (!sheet) {
    sheet = ss.insertSheet(tab.name);
    const headers = tab.columns.map(([h]) => h);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#e8f0fe");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd mmm yyyy, hh:mm");
  }
  return sheet;
}

// Stop values like "=HYPERLINK(...)" or "+91…" being read as formulas.
function clean(v) {
  if (v === undefined || v === null) return "";
  if (v instanceof Date || typeof v === "number") return v;
  const s = String(v).slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function saveUpload(file, who) {
  const bytes = Utilities.base64Decode(String(file.data).replace(/^data:[^,]+,/, ""));
  if (bytes.length > MAX_FILE_MB * 1024 * 1024) return "(file over " + MAX_FILE_MB + " MB, not saved)";
  const folders = DriveApp.getFoldersByName(UPLOAD_FOLDER);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(UPLOAD_FOLDER);
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HHmm");
  const blob = Utilities.newBlob(bytes, file.type || "application/octet-stream", stamp + " - " + who + " - " + (file.name || "design"));
  return folder.createFile(blob).getUrl();
}

function notify(tab, data) {
  const lines = tab.columns
    .filter(([, key]) => key !== "_time" && data[key] !== undefined && data[key] !== "")
    .map(([h, key]) => h + ": " + data[key]);
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: "New website lead (" + tab.name + "): " + data.name + ", " + data.phone,
    body: lines.join("\n") + "\n\nOpen the sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
