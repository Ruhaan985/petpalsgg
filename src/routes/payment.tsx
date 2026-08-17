import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import petpalsLogo from "@/assets/petpals-logo.png";
import upiQr from "@/assets/upi-qr.png.asset.json";
import { PRODUCTS, UPI, cartTotal, productById } from "@/lib/products";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, Smartphone, QrCode, Copy, Check } from "lucide-react";

type Search = { items?: string };

export const Route = createFileRoute("/payment")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    items: typeof search.items === "string" ? search.items : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Complete Payment — PetPals" },
      { name: "description", content: "Pay for your PetPals prebooking securely over UPI — scan the QR on desktop or pay in one tap on mobile." },
      { property: "og:title", content: "Complete Payment — PetPals" },
      { property: "og:description", content: "Pay for your PetPals prebooking securely over UPI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { items } = Route.useSearch();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  const ids = (items ?? "").split(",").filter(Boolean);
  const chosen = ids.length ? ids.map(productById).filter(Boolean) : [];
  const payable = chosen.filter((p) => p && p.price) as { id: string; name: string; price: number }[];
  const total = cartTotal(ids);

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI.id)}&pn=${encodeURIComponent(UPI.name)}&am=${total}&cu=INR&tn=${encodeURIComponent("PetPals prebooking")}`;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

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
                <span className="text-muted-foreground">
                  {p.price ? `₹${p.price}` : "Enquiry only"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm uppercase tracking-[0.15em] text-muted-foreground">Payable now</span>
            <span className="font-display text-2xl">₹{total}</span>
          </div>
        </div>

        {payable.length === 0 || total === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
            Nothing to pay for right now — a founder will reach out about your enquiry within two days.
            <div className="mt-5">
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                Back to collection <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : isMobile ? (
          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 text-center">
            <Smartphone className="mx-auto h-7 w-7 text-primary" />
            <div className="mt-3 font-display text-2xl">Pay ₹{total} over UPI</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Opens GPay, PhonePe, Paytm or any UPI app with the amount prefilled.
            </p>
            <a
              href={upiUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Pay with UPI app <ArrowRight className="h-4 w-4" />
            </a>
            <div className="mt-5 text-xs text-muted-foreground">or send to {UPI.id}</div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-card/60 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <img
              src={upiQr.url}
              alt={`UPI QR code to pay ₹${total} to ${UPI.name}`}
              className="mx-auto w-56 rounded-xl bg-background object-contain p-2"
            />
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <QrCode className="h-3.5 w-3.5" /> Scan to pay
              </div>
              <div className="mt-2 font-display text-2xl">₹{total} to {UPI.name}</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Open any UPI app on your phone — Paytm, GPay, PhonePe or BHIM — scan this code and enter ₹{total}.
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

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          After paying, reply to our confirmation email with your UPI reference number so we can match the payment to your enquiry.
          PetPals is a student-led prebooking project — payments reserve a copy of {PRODUCTS[0].name} and are fully refundable within two days.
        </p>
      </main>
    </div>
  );
}
