/**
 * Shared form validation for every lead form (consultation, contact, sign-in).
 * Each check returns an error message, or "" when the value is fine.
 */

// A real name: 2-60 characters, letters in any script plus spaces . ' -, and at
// least two actual letters. Rejects "a", "12345", "!!!", and "aaaa".
export function nameError(raw) {
  const v = (raw ?? "").trim().replace(/\s+/g, " ");
  if (!v) return "Enter your name.";
  if (v.length < 2 || v.length > 60) return "Enter your full name (2 to 60 characters).";
  if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(v)) return "Name can only contain letters, spaces, . ' and -.";
  const letters = v.replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return "Enter your full name.";
  if (new Set(letters.toLowerCase()).size < 2) return "Enter your real name.";
  return "";
}

// Strips spaces, dashes, brackets and a +91 / 91 / 0 prefix; null if what is
// left isn't exactly ten digits.
export function indianMobile(raw) {
  let d = (raw ?? "").replace(/[\s\-().]/g, "");
  if (!/^\+?\d+$/.test(d)) return null;
  d = d.replace(/^\+/, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^\d{10}$/.test(d) ? d : null;
}

// Indian mobile numbers start with 6, 7, 8 or 9 and have ten digits. On top of
// that, numbers that are obviously not real are refused: one repeated digit
// (9999999999), straight runs of 5+ digits (9876543210, 9123456789), repeating blocks
// (9898989898, 9876598765), doubled pairs (9988776655), mirror numbers
// (9876556789), long repeats (9000000000) and too few distinct digits.
export function phoneError(raw) {
  const d = indianMobile(raw);
  if (!d) return "Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8 or 9).";
  if (!/^[6-9]/.test(d)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
  const fake = "That doesn't look like a real mobile number. Please enter yours.";
  if (new Set(d).size < 4) return fake;
  if (/(\d)\1{5,}/.test(d)) return fake;
  let run = 1, best = 1;
  for (let i = 1; i < 10; i++) {
    const step = d.charCodeAt(i) - d.charCodeAt(i - 1);
    if (step === 1 || step === -1) {
      run = i > 1 && d.charCodeAt(i - 1) - d.charCodeAt(i - 2) === step ? run + 1 : 2;
      best = Math.max(best, run);
    } else run = 1;
  }
  if (best >= 5) return fake;
  // Doubled pairs (9988776655), or a number that reads the same backwards.
  let doubles = 0;
  for (let i = 1; i < 10; i++) if (d[i] === d[i - 1]) doubles++;
  if (doubles >= 4) return fake;
  if (d === [...d].reverse().join("")) return fake;
  for (let p = 1; p <= 5; p++) {
    let rep = true;
    for (let i = p; i < 10; i++) if (d[i] !== d[i - p]) { rep = false; break; }
    if (rep) return fake;
  }
  return "";
}

// Cleaned values to store/send: single-spaced name, +91 followed by ten digits.
export const cleanName = (raw) => (raw ?? "").trim().replace(/\s+/g, " ");
export const cleanPhone = (raw) => `+91${indianMobile(raw)}`;
