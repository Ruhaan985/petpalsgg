import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemsSchema = z.object({
  items: z.array(z.string().min(1).max(40)).min(1).max(5),
  enquiryId: z.string().uuid().optional(),
});

const verifySchema = z.object({
  razorpay_order_id: z.string().min(4).max(200),
  razorpay_payment_id: z.string().min(4).max(200),
  razorpay_signature: z.string().min(10).max(300),
});

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { razorpayKeys } = await import("./payments.server");
  const { keyId, configured } = razorpayKeys();
  return { configured, keyId: configured ? keyId! : null };
});

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => itemsSchema.parse(d))
  .handler(async ({ data }) => {
    const { razorpayKeys, createOrder } = await import("./payments.server");
    const { totalInr } = await import("./prices");
    const { keyId, keySecret, configured } = razorpayKeys();
    if (!configured) throw new Error("Payments are not configured yet");

    const amountInr = totalInr(data.items);
    if (amountInr <= 0) throw new Error("Nothing payable in this selection");
    const amountPaise = amountInr * 100;

    const order = await createOrder({
      keyId: keyId!,
      keySecret: keySecret!,
      amountPaise,
      receipt: `petpals-${Date.now()}`,
      notes: { items: data.items.join(","), enquiry_id: data.enquiryId ?? "" },
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payments").insert({
      enquiry_id: data.enquiryId ?? null,
      amount_paise: amountPaise,
      currency: "INR",
      status: "created",
      razorpay_order_id: order.id,
      items: data.items,
    });
    if (error) console.error("[razorpay] failed to record order", error.message);

    return { orderId: order.id, amountPaise, keyId: keyId! };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => verifySchema.parse(d))
  .handler(async ({ data }) => {
    const { razorpayKeys, hmacSha256Hex, safeEqualHex } = await import("./payments.server");
    const { keySecret, configured } = razorpayKeys();
    if (!configured) throw new Error("Payments are not configured yet");

    const expected = hmacSha256Hex(
      keySecret!,
      `${data.razorpay_order_id}|${data.razorpay_payment_id}`,
    );
    const valid = safeEqualHex(expected, data.razorpay_signature);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("payments")
      .update({
        status: valid ? "paid" : "failed",
        razorpay_payment_id: data.razorpay_payment_id,
      })
      .eq("razorpay_order_id", data.razorpay_order_id);

    if (!valid) throw new Error("Payment could not be verified");
    return { ok: true, paymentId: data.razorpay_payment_id };
  });
