import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default function AiRecoveryEntry() {
  redirect("/journey?utm_source=bolna&utm_medium=ai_call&utm_campaign=leaf_finding_recovery&utm_content=whatsapp_followup");
}
