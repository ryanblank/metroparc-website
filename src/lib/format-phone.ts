// Preserve unsupported prefixes and extra digits so validation can catch them.
export function formatPhone(value: string): string {
  if (!/^\+?[\d().\s-]*$/.test(value) ||
      (value.startsWith("+") && value.length > 1 && !value.startsWith("+1"))) {
    return value;
  }

  if (value === "+1") return value;
  const digits = value.replace(/\D/g, "").replace(/^1/, "");
  if (digits.length > 10) return value;
  if (digits.length === 0) return value.startsWith("+") ? value : "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Accept common NANP formats and an optional country code. Both the area
// code and exchange must start with 2–9.
export function isCompletePhone(value: string): boolean {
  return /^(?:\+?1[ .-]?)?(?:\([2-9]\d{2}\)|[2-9]\d{2})[ .-]?[2-9]\d{2}[ .-]?\d{4}$/.test(value.trim());
}
