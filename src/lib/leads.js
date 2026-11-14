import { site } from "../data/site";

/**
 * Sends a website lead to the Google Sheet (Apps Script web app — see
 * scripts/google-apps-script/leads.gs). `form` picks the tab:
 * "consultation" | "contact" | "estimate". Name and phone are required by
 * the script too, so the sheet never gets a row without them.
 *
 * Sent as text/plain so the browser makes a "simple" request with no CORS
 * preflight (Apps Script can't answer one); the script still parses it as
 * JSON. Throws with a readable message if the row wasn't saved.
 */
const ENDPOINT = import.meta.env.VITE_LEADS_URL || site.leadsEndpoint;

export async function sendLead(form, fields) {
  if (!ENDPOINT) throw new Error("Lead endpoint is not configured.");
  const payload = { form, page: window.location.href, ...fields };
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
  } catch {
    throw new Error("Couldn't reach our server. Check your connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!json?.ok) throw new Error(json?.error || "Something went wrong. Please try again.");
  return json;
}

// Hidden "website" field: real visitors never see or fill it, bots do.
export const honeypot = (form) => form?.elements?.website?.value ?? "";

// Reads a picked file as base64 for the Contact page's design upload.
export const MAX_UPLOAD_MB = 10;
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, type: file.type, data: String(r.result) });
    r.onerror = () => reject(new Error("Couldn't read that file."));
    r.readAsDataURL(file);
  });
}
