const TEST_EMAILS = new Set(["pavan@nadivedas.com"]);
const TEST_PHONES = new Set(["7799639692"]);

export function isInternalTestIdentity(email?: string | null, phone?: string | null) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPhone = String(phone || "").replace(/\D/g, "").slice(-10);
  return TEST_EMAILS.has(normalizedEmail) || TEST_PHONES.has(normalizedPhone);
}
