import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import petpalsLogo from "@/assets/petpals-logo.png";
import upiQr from "@/assets/upi-qr.png.asset.json";
import { PRODUCTS, UPI, cartTotal, productById } from "@/lib/products";
import { createRazorpayOrder, getPaymentConfig, verifyRazorpayPayment } from "@/lib/payments.functions";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ArrowRight, Smartphone, QrCode, Copy, Check, CreditCard, ShieldCheck } from "lucide-react";

type Search = { items?: string; enquiry?: string };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export const Route = createFileRoute("/payment")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    items: typeof search.items === "string" ? search.items : undefined,
    enquiry: typeof search.enquiry === "string" ? search.enquiry : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Complete Payment — PetPals" },
      { name: "description", content: "Reserve your copy of Tails of Care — pay securely by card, UPI, wallet or netbanking." },
      { property: "og:title", content: "Complete Payment — PetPals" },
      { property: "og:description", content: "Reserve your copy of Tails of Care — pay securely by card, UPI, wallet or netbanking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPage,
});

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function PaymentPage() {
  const { items, enquiry } = Route.useSearch();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [paidRef, setPaidRef] = useState<string | null>(null);

  const configFn = useServerFn(getPaymentConfig);
  const createOrder = useServerFn(createRazorpayOrder);
  const verify = useServerFn(verifyRazorpayPayment);

  const { data: config } = useQuery({ queryKey: ["payment-config"], queryFn: () => configFn() });

  const ids = (items ?? "").split(",").filter(Boolean);
  const chosen = ids.map(productById).filter(Boolean);
  const total = cartTotal(ids);

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI.id)}&pn=${encodeURIComponent(UPI.name)}&am=${total}&cu=INR&tn=${encodeURIComponent("PetPals prebooking")}`;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const payWithRazorpay = async () => {
    setBusy(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Couldn't load the secure checkout");
      const order = await createOrder({ data: { items: ids, enquiryId: enquiry } });

      const rz = new window.Razorpay!({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amountPaise,
        currency: "INR",
        name: "PetPals",
        description: "Prebooking — Tails of Care",
        theme: { color: "#7c3aed" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const result = await verify({ data: response });
            setPaidRef(result.paymentId);
            toast.success("Payment received", { description: "Your copy is reserved." });
          } catch {
            toast.error("We couldn't verify that payment", {
              description: "If money left your account, email wo1359rk@gmail.com and we'll sort it out.",
            });
          }
        },
        modal: { ondismiss: () => toast.info("Payment cancelled — your enquiry is still with us.") },
      });
      rz.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start the payment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <Link to="/" className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">← Collection</Link>
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8">
        {paidRef ? (
          <div className="rounded-2xl border border-border bg-card/60 p-10 text-center">
            <ShieldCheck className="mx-auto h-9 w-9 text-primary" />
            <h1 className="mt-4 font-display text-4xl">Payment confirmed</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your copy of {PRODUCTS[0].name} is reserved. Reference <span className="text-foreground">{paidRef}</span>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/my-enquiries" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                View my enquiries <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs">
                Back to collection
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 2 of 2</div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              Enquiry received — <em className="italic text-primary">reserve it with payment.</em>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Payment is optional and only reserves your copy. Prototype pieces are enquiry-only and carry no charge.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5">
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Order summary</div>
              <ul className="mt-3 divide-y divide-border">
                {chosen.map((p) => p && (
                  <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{p.price ? `₹${p.price}` : "Enquiry only"}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">Payable now</span>
                <span className="font-display text-2xl">₹{total}</span>
              </div>
            </div>

            {total === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
                Nothing to pay for right now — a founder will reach out about your enquiry within two days.
                <div className="mt-5">
                  <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                    Back to collection <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {config?.configured && (
                  <div className="mt-8 rounded-2xl border border-primary/40 bg-card/60 p-6">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5" /> Recommended
                    </div>
                    <div className="mt-2 font-display text-2xl">Pay ₹{total} securely</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Cards, UPI, wallets and netbanking in one window. We get an instant, verified confirmation — no reference numbers to send us.
                    </p>
                    <button
                      onClick={payWithRazorpay}
                      disabled={busy}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    >
                      {busy ? "Opening checkout…" : (<>Pay ₹{total} securely <ArrowRight className="h-4 w-4" /></>)}
                    </button>
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-border bg-card/60 p-6">
                  <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {config?.configured ? "Or pay directly over UPI" : "Pay over UPI"}
                  </div>
                  {isMobile ? (
                    <div className="mt-4 text-center">
                      <Smartphone className="mx-auto h-7 w-7 text-primary" />
                      <div className="mt-3 font-display text-2xl">₹{total} to {UPI.name}</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Opens GPay, PhonePe, Paytm or any UPI app with the amount prefilled.
                      </p>
                      <a
                        href={upiUrl}
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
                      >
                        Pay with UPI app <ArrowRight className="h-4 w-4" />
                      </a>
                      <div className="mt-4 text-xs text-muted-foreground">or send to {UPI.id}</div>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                      <img
                        src={upiQr.url}
                        alt={`UPI QR code to pay ₹${total} to ${UPI.name}`}
                        className="mx-auto w-48 rounded-xl bg-background object-contain p-2"
                      />
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          <QrCode className="h-3.5 w-3.5" /> Scan to pay
                        </div>
                        <div className="mt-2 font-display text-2xl">₹{total} to {UPI.name}</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Scan with any UPI app and enter ₹{total}. Send us the UPI reference so we can match it to your enquiry.
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(UPI.id);
                            setCopied(true);
                          }}
                          className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? "UPI ID copied" : UPI.id}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
              PetPals is a student-led prebooking project. Payments reserve a copy of {PRODUCTS[0].name} and are fully refundable
              within two days. Questions? wo1359rk@gmail.com
            </p>
          </>
        )}
      </main>
    </div>
  );
}
