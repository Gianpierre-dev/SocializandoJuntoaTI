/**
 * SOJAT — Inscripciones desde el sitio web.
 *
 * Web App endpoint that receives form submissions from the Astro site and
 * appends them to a Google Sheet (one tab per form type: "voluntarios" /
 * "comunidad"). Columns are created automatically from the submitted fields.
 *
 * SETUP (lo hace Gian, una sola vez):
 *  1. Crea (o abre) un Google Sheet donde se guardarán las inscripciones.
 *  2. En ese Sheet: Extensiones > Apps Script. Pega ESTE archivo.
 *  3. (Opcional) Pega el ID del Sheet en SPREADSHEET_ID. Si dejas Apps Script
 *     vinculado al propio Sheet, puedes dejarlo en ''.
 *  4. Implementar > Nueva implementación > Aplicación web:
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquiera
 *  5. Copia la URL de la Web App y pásamela: es la que usará el sitio.
 *
 * NOTE: keep this deployed URL secret-ish; it accepts public POSTs by design.
 * Anti-spam: a honeypot field "_gotcha" is silently dropped if filled.
 */

// Optional: paste the Spreadsheet ID, or leave '' if the script is bound to a Sheet.
const SPREADSHEET_ID = "";

// Only these form types are accepted.
const ALLOWED_FORMS = ["voluntarios", "comunidad"];

function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};

    // Honeypot: bots fill hidden fields. Pretend success and ignore.
    if (params._gotcha) {
      return jsonOutput({ ok: true });
    }

    const formType = String(params.formType || "").toLowerCase();
    if (ALLOWED_FORMS.indexOf(formType) === -1) {
      return jsonOutput({ ok: false, error: "invalid formType" });
    }

    const ss = SPREADSHEET_ID
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, formType);

    const data = {};
    Object.keys(params).forEach(function (key) {
      if (key === "formType" || key === "_gotcha") return;
      data[key] = params[key];
    });

    appendRow(sheet, data);
    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

// Simple GET so the deployment URL can be health-checked in a browser.
function doGet() {
  return jsonOutput({ ok: true, service: "sojat-inscripciones" });
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(["timestamp"]);
  }
  return sheet;
}

function appendRow(sheet, data) {
  const lastCol = Math.max(1, sheet.getLastColumn());
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(String);

  // Register any new field as a new column header (keeps the sheet self-describing).
  Object.keys(data).forEach(function (key) {
    if (headers.indexOf(key) === -1) {
      headers.push(key);
      sheet.getRange(1, headers.length).setValue(key);
    }
  });

  const row = headers.map(function (header) {
    if (header === "timestamp") return new Date();
    return data[header] != null ? data[header] : "";
  });
  sheet.appendRow(row);
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
