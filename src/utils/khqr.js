const KHQR_GATEWAY = "https://khqr.cc/api/payment/request";
const KHQR_PROFILE = import.meta.env.VITE_KHQR_PROFILE_ID;
const KHQR_SECRET  = import.meta.env.VITE_KHQR_SECRET_KEY;

async function sha1Hex(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function buildKHQRPayURL({ transactionId, amount, successUrl, remark }) {
  const amountStr = String(amount);
  const raw  = KHQR_SECRET + transactionId + amountStr + successUrl + remark;
  const hash = await sha1Hex(raw);
  const params = new URLSearchParams({ transaction_id: transactionId, amount: amountStr, success_url: successUrl, remark, hash });
  return `${KHQR_GATEWAY}/${KHQR_PROFILE}?${params}`;
}
