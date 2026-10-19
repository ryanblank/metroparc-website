// Formats raw user input into US phone style: "(305) 555-0123".
// Strips non-digits, drops a leading "1" country code (US area codes never
// start with 1, so "+1 305..." and autofilled "+13055550123" format correctly),
// caps at 10, and partially formats while the user types so the field can
// never hold a malformed value.
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// True when a formatted phone holds a full 10-digit US number.
export function isCompletePhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 10;
}
