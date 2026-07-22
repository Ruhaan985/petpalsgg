import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import petpalsLogo from "@/assets/petpals-logo.png";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";
import { ArrowRight, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/enquire")({
  head: () => ({
    meta: [
      { title: "Enquire — PetPals" },
      { name: "description", content: "Send an enquiry about the PetPals pieces in your cart." },
      { property: "og:title", content: "Enquire — PetPals" },
      { property: "og:description", content: "Send an enquiry about the PetPals pieces in your cart." },
    ],
  }),
  component: EnquirePage,
});

function EnquirePage() {
  const { user } = useAuth();
  const { items, clear, hydrated } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", pet_name: "", message: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      toast.info("Your cart is empty — add a piece first.");
      navigate({ to: "/cart" });
    }
  }, [hydrated, items.length, navigate]);

  const cartProducts = items
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setBusy(true);
    const { error } = await supabase.from("enquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      pet_name: form.pet_name || null,
      message: form.message || null,
      interested_items: items,
      user_id: user?.id ?? null,
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't send enquiry", { description: error.message });
      return;
    }
    toast.success("Enquiry sent", { description: "We'll be in touch within 2 days." });
    clear();
    navigate({ to: "/" });
  };

  const field =
    "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">
          <ShoppingBag className="h-3.5 w-3.5" /> ← Cart
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Enquiry</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          A few details, <em className="italic text-primary">and we'll be in touch.</em>
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          We're a student-led project and reply personally to every enquiry within two days.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5">
          <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">You're enquiring about</div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cartProducts.map((p) => (
              <li key={p.id} className="rounded-full border border-border bg-background px-3 py-1 text-xs">
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Name*</label>
              <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Email*</label>
              <input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Phone</label>
              <input maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Pet's name</label>
              <input maxLength={100} value={form.pet_name} onChange={(e) => setForm({ ...form, pet_name: e.target.value })} className={field} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Message</label>
            <textarea rows={4} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/cart" className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">← Back to cart</Link>
            <button
              type="submit"
              disabled={busy || items.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending…" : (<>Send enquiry <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
