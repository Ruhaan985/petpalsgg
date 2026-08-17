# Add Razorpay Checkout alongside the UPI QR

Right now the payment step is a UPI QR (desktop) and a `upi://` deep link (mobile) that pay your personal UPI ID directly. That needed no account, but it also means nothing is verified — you have to match UPI reference numbers by hand.

Razorpay fixes that: cards, UPI, wallets and netbanking in one popup, with a server-verified signature so the app knows for certain that ₹520 was actually paid.

## What Razorpay needs from you

1. A Razorpay account (free signup, KYC required before live payments).
2. **Key ID** and **Key Secret** from the Razorpay dashboard (Settings, API Keys). Test keys are fine to start — they look like `rzp_test_...`.
3. A webhook secret (I'll generate the endpoint first, then you paste the URL and secret into Razorpay).

Until keys exist, the UPI QR stays as the payment method, so the site keeps working.

## What gets built

- **Payment page upgrade.** `/payment` keeps the order summary and gains a primary "Pay ₹520 securely" button that opens Razorpay Checkout. The existing UPI QR stays below it as a secondary "Pay directly over UPI" option.
- **Verified payments.** Payment is created server-side, the signature is verified server-side after checkout, and only a verified payment marks the order as paid. A Razorpay webhook backs this up in case the user closes the browser mid-payment.
- **Payment records in the database.** A new payments table stores amount, status, Razorpay order/payment IDs and the linked enquiry, so every payment traces back to a person.
- **Admin visibility.** The Enquiries tab in the admin panel shows a Paid / Unpaid / Failed badge and the amount next to each enquiry, so you can see at a glance who has reserved a copy.
- **Success screen.** After a verified payment the user sees a confirmation with their payment reference, and signed-in users see payment status on My Enquiries.

## Pricing behaviour (unchanged)

Handbook ₹520. The bowl and the leash stay prototype, enquiry-only, no charge. If a cart has only prototype items, the payment step shows "nothing to pay" as it does today.

## Technical notes

- Two secrets: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, requested through the secure secret form (never in code). Key ID is also needed in the browser to open Checkout — it is served to the client from a server function, not hardcoded.
- Server functions in `src/lib/payments.functions.ts`: `createRazorpayOrder` (calls Razorpay Orders API with the amount computed server-side from product IDs, never from client-sent amounts) and `verifyRazorpayPayment` (HMAC-SHA256 of `order_id|payment_id` compared with the returned signature, timing-safe).
- Webhook at `src/routes/api/public/razorpay-webhook.ts`, verifying the `x-razorpay-signature` HMAC over the raw body before touching data. This needs a third secret, `RAZORPAY_WEBHOOK_SECRET`, which you create and paste into both Razorpay and Lovable.
- Razorpay Checkout script loaded on demand in the browser (no SSR import).
- Migration: `public.payments` (id, enquiry_id, amount_paise, currency, status, razorpay_order_id, razorpay_payment_id, created_at) with GRANTs, RLS enabled, admins select-all via `has_role`, users select their own through the enquiry link, and writes restricted to server/service role only. Amount is always recomputed server-side.
- Product prices continue to live in `src/lib/products.ts` as the single source of truth.
