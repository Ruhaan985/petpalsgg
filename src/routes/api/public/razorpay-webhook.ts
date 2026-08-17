import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });

        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const body = await request.text();

        const { hmacSha256Hex, safeEqualHex } = await import("@/lib/payments.server");
        if (!safeEqualHex(hmacSha256Hex(secret, body), signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: any;
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const entity = event?.payload?.payment?.entity;
        const orderId: string | undefined = entity?.order_id;
        const paymentId: string | undefined = entity?.id;
        if (!orderId) return new Response("ok");

        const status =
          event?.event === "payment.captured" || event?.event === "payment.authorized"
            ? "paid"
            : event?.event === "payment.failed"
              ? "failed"
              : null;
        if (!status) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("payments")
          .update({ status, razorpay_payment_id: paymentId ?? null })
          .eq("razorpay_order_id", orderId);
        if (error) console.error("[razorpay-webhook] update failed", error.message);

        return new Response("ok");
      },
    },
  },
});
