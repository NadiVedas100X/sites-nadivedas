import { env } from "cloudflare:workers";

// Never accept an amount or transaction reference supplied by the browser.
export async function recoverPayuPayment(leadId: string) {
  const runtime = env as unknown as { DB: D1Database; PAYU_KEY?: string; PAYU_SALT?: string; PAYU_MODE?: string };
  const lead = await runtime.DB.prepare("SELECT payment_status,payment_txnid,payment_amount,payment_currency FROM leads WHERE id=?").bind(leadId).first<{payment_status:string;payment_txnid:string;payment_amount:number;payment_currency:string}>();
  if (!lead) return "not_found";
  if (lead.payment_status === "success") return "success";
  if (!lead.payment_txnid) return "not_started";
  if (!runtime.PAYU_KEY || !runtime.PAYU_SALT) throw new Error("Payment verification unavailable");
  const command = "verify_payment";
  const digest = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(`${runtime.PAYU_KEY}|${command}|${lead.payment_txnid}|${runtime.PAYU_SALT}`));
  const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
  const response = await fetch(runtime.PAYU_MODE === "test" ? "https://test.payu.in/merchant/postservice?form=2" : "https://info.payu.in/merchant/postservice.php?form=2", {
    method:"POST", headers:{"content-type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({key:runtime.PAYU_KEY,command,var1:lead.payment_txnid,hash}), signal:AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Payment verification unavailable");
  const result = await response.json() as {transaction_details?:Record<string,{txnid?:string;status?:string;unmappedstatus?:string;amt?:string;transaction_amount?:string}>};
  const details = result.transaction_details || {};
  // PayU normally keys this map by the merchant txnid, but some UPI responses
  // use a provider-generated key. In that case locate the same merchant txnid
  // inside the signed PayU response instead of treating a captured payment as
  // missing. Never fall back to email, phone, amount, or browser input.
  const payment = details[lead.payment_txnid] || Object.values(details).find(item => item.txnid === lead.payment_txnid);
  if (!payment || (payment.txnid && payment.txnid !== lead.payment_txnid)) throw new Error("Payment verification incomplete");
  const status = String(payment.status || "").trim().toLowerCase();
  const unmappedStatus = String(payment.unmappedstatus || "").trim().toLowerCase();
  const refundStatus = status==="refund"||status==="refunded"||status==="chargeback"||status==="chargeback_reversed"||unmappedStatus==="refund"||unmappedStatus==="refunded"||unmappedStatus==="chargeback"||unmappedStatus==="chargeback reversed";
  // PayU's verify_payment response is not casing-consistent across payment
  // methods. A successful merchant verification response is authoritative;
  // `captured` is retained as an accepted gateway detail when supplied.
  if (status === "success" || unmappedStatus === "captured") {
    if (lead.payment_currency !== "INR" || !Number.isFinite(Number(lead.payment_amount)) || Number(lead.payment_amount) <= 0 || Math.round(Number(payment.amt ?? payment.transaction_amount)*100) !== Math.round(Number(lead.payment_amount)*100)) throw new Error("Payment verification mismatch");
    await runtime.DB.prepare("UPDATE leads SET payment_status='success',status='paid',refund_requested=0,refund_status=NULL WHERE id=? AND payment_txnid=?").bind(leadId,lead.payment_txnid).run();
    return "success";
  }
  if (refundStatus) {
    await runtime.DB.prepare("UPDATE leads SET payment_status='refunded',status='payment_refunded',refund_requested=1,refund_status=? WHERE id=? AND payment_txnid=?").bind(status || "refunded", leadId, lead.payment_txnid).run();
    return "refunded";
  }
  if (status === "failure" && unmappedStatus !== "pending") return "failure";
  return "pending";
}
