/**
 * SOJAT — Inscripciones desde el sitio web.
 *
 * Web App endpoint that receives form submissions from the Astro site, appends
 * them to a Google Sheet (one tab per form type: "voluntarios" / "comunidad"),
 * emails a confirmation to the applicant, and optionally notifies the team.
 * Columns are created automatically from the submitted fields.
 *
 * ── SETUP (Gian, una sola vez) ──────────────────────────────────────────────
 *  1. Crea (o abre) un Google Sheet donde se guardarán las inscripciones.
 *  2. En ese Sheet: Extensiones > Apps Script. Borra lo que haya y pega ESTE archivo.
 *  3. (Opcional) Completa TEAM_NOTIFICATION_EMAIL para recibir un aviso por cada postulación.
 *  4. Implementar > Nueva implementación > Aplicación web:
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquiera
 *     (La primera vez te pedirá autorizar permisos: acéptalos.)
 *  5. Copia la URL de la Web App (termina en /exec) y pásamela.
 *
 * Anti-spam: el campo oculto "_gotcha" se descarta si viene lleno.
 */

// Optional: paste the Spreadsheet ID, or leave "" if the script is bound to a Sheet.
const SPREADSHEET_ID = "";

// Optional: team inbox notified on each new signup. Leave "" to disable.
const TEAM_NOTIFICATION_EMAIL = "";

const ORG_NAME = "Socializando Junto A Ti";
const ORG_SLOGAN = "Conectamos corazones, fortalecemos mentes";
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
    sendConfirmation(data);
    notifyTeam(data, formType);

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
    sheet.appendRow(["Fecha"]);
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
    if (header === "Fecha") return new Date();
    return data[header] != null ? data[header] : "";
  });
  sheet.appendRow(row);
}

// Best-effort confirmation email to the applicant (non-fatal on error).
function sendConfirmation(data) {
  try {
    const email = String(data["Email"] || data["Correo"] || "").trim();
    if (!email || email.indexOf("@") === -1) return;
    const name = String(data["Nombres y Apellidos"] || "").trim();
    const greeting = name ? "Hola " + name + "," : "Hola,";
    const subject = "Recibimos tu postulación — " + ORG_NAME;
    const body =
      greeting +
      "\n\nGracias por postularte en " +
      ORG_NAME +
      ". Recibimos tu información y pronto nos pondremos en contacto contigo.\n\n\"" +
      ORG_SLOGAN +
      "\"\n\nEquipo de " +
      ORG_NAME;
    MailApp.sendEmail(email, subject, body);
  } catch (err) {
    // ignore — confirmation is best-effort
  }
}

function notifyTeam(data, formType) {
  try {
    if (!TEAM_NOTIFICATION_EMAIL) return;
    const name = String(data["Nombres y Apellidos"] || "(sin nombre)");
    const lines = Object.keys(data).map(function (k) {
      return k + ": " + data[k];
    });
    MailApp.sendEmail(
      TEAM_NOTIFICATION_EMAIL,
      "Nueva postulación (" + formType + "): " + name,
      lines.join("\n"),
    );
  } catch (err) {
    // ignore — notification is best-effort
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
