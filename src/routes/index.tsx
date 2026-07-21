import { createFileRoute, Link } from "@tanstack/react-router";

import { ArrowRight, GraduationCap, Shield, BookOpen, Utensils, Leaf, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroDog from "@/assets/hero-dog.jpg";
import productHandbook from "@/assets/product-handbook.jpg";
import productBowl from "@/assets/product-bowl.jpg";
import productLeash from "@/assets/product-leash.jpg";
import petpalsLogo from "@/assets/petpals-logo.png";
import introVideo from "@/assets/petpals-intro.mp4.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

const PRODUCTS = [
  {
    id: "handbook",
    name: "PetPals Handbook",
    tagline: "A quiet guide to a happy pet.",
    body: "A hand-bound care handbook covering nutrition, routines, gentle training and first-aid — written for new pet parents by students who obsess over the small details.",
    image: productHandbook,
    icon: BookOpen,
    meta: ["148 pages", "Linen hardcover", "Illustrated"],
  },
  {
    id: "bowl",
    name: "Safe Eating Bowl",
    tagline: "Portion patrol, quietly.",
    body: "A wooden scale-base that senses portion weight and glows soft green when the meal is just right. No app, no noise — just healthier feeding, one bowl at a time.",
    image: productBowl,
    icon: Utensils,
    meta: ["USB-C", "Fits any bowl", "Silent LED cue"],
  },
  {
    id: "leash",
    name: "GPS Tracker Leash",
    tagline: "Every walk, quietly mapped.",
    body: "A soft leather leash with a discreet GPS puck stitched into the handle — live location, safe-zone alerts and a two-week battery, so a wandering beagle is never really lost.",
    image: productLeash,
    icon: MapPin,
    meta: ["Live GPS", "14-day battery", "Safe-zone alerts", "Weatherproof"],
  },
];

function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("petpals-intro-seen-v2")) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem("petpals-intro-seen-v2", "1");
  }, []);

  const dismiss = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 600);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <video
        ref={videoRef}
        src={introVideo.url}
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        className="h-full w-full object-cover"
      />
      <button
        onClick={dismiss}
        className="absolute bottom-6 right-6 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur hover:bg-black/60"
      >
        Skip intro
      </button>
    </div>
  );
}

function Index() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
  };

  return (
    <div className="min-h-screen bg-background">
      <IntroOverlay />
      {/* NAV */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={petpalsLogo}
            alt="PetPals logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg bg-card object-contain"
          />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#products" className="hover:text-foreground">Products</a>
          <a href="#story" className="hover:text-foreground">Story</a>
          <a href="#enquiry" className="hover:text-foreground">Enquire</a>
          <Link to="/support" className="hover:text-foreground">Support</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  <Shield className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-24">
        <div className="grid items-end gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <Leaf className="h-3 w-3" /> Student-led · Prebooking only
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
              Small things,<br />
              <em className="italic text-primary">softly considered</em>,<br />
              for the pets we love.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              PetPals is a three-piece collection — a care handbook, a
              gentle smart bowl and a GPS tracker leash — designed to make
              everyday pet life a little calmer, a little kinder.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Book an enquiry <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                View the collection
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={heroDog}
                alt="Beagle sitting quietly on linen — fictional representation"
                width={1408}
                height={1408}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                Fictional representation or prototype
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The collection</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Three objects. Everyday care.</h2>
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">03 / three pieces</div>
        </div>

        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <article key={p.id} className="group">
              <div className="relative overflow-hidden rounded-xl bg-muted">
                <img
                  src={p.image}
                  alt={`${p.name} — fictional representation`}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  className="aspect-square h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                  Fictional representation or prototype
                </div>
              </div>
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">0{i + 1}</div>
                  <h3 className="mt-2 font-display text-2xl text-foreground">{p.name}</h3>
                  <p className="mt-1 text-sm italic text-muted-foreground">{p.tagline}</p>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border">
                  <p.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.meta.map((m) => (
                  <span key={m} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {m}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <EnquirySection />

      {/* STORY / TEAM */}
      <section id="story" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Our story</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Made quietly, between lectures.</h2>
          </div>
          <div>
            <p className="text-base leading-relaxed text-muted-foreground">
              PetPals is a student-led project. Three individual founders,
              stitching hardware, writing, and design together in the margins
              of a semester — building only what we'd want in our own homes.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                { role: "Hardware" },
                { role: "Writing & Design" },
                { role: "Operations" },
              ].map((m) => (
                <div key={m.role} className="border-t border-border pt-5">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <div className="mt-3 text-sm font-medium">Student Founder</div>
                  <div className="text-xs text-muted-foreground">{m.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <img src={petpalsLogo} alt="PetPals logo" width={20} height={20} className="h-5 w-5 rounded object-contain" loading="lazy" />
            <span>© {new Date().getFullYear()} PetPals — a student project.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/support" className="hover:text-foreground">Support</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EnquirySection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", pet_name: "", message: "" });
  const [items, setItems] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const toggle = (id: string) =>
    setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please choose at least one item you're interested in.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("enquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      pet_name: form.pet_name || null,
      message: form.message || null,
      interested_items: items,
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't send enquiry", { description: error.message });
      return;
    }
    toast.success("Enquiry booked", { description: "We'll be in touch within 2 days." });
    setForm({ name: "", email: "", phone: "", pet_name: "", message: "" });
    setItems([]);
  };

  const field =
    "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <section id="enquiry" className="border-y border-border bg-gradient-soft">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Enquiry</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Interested? <em className="italic text-primary">Let's talk.</em>
          </h2>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            We're not selling online yet. Tell us which piece you're curious
            about and a founder will reach out within two days.
          </p>
          <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
            {["Personal reply from a founder", "Optional in-person demo", "No pressure, no spam"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" /> {b}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              I'm interested in*
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRODUCTS.map((p) => {
                const active = items.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${
                      active ? "border-primary bg-card" : "border-border bg-card/60 hover:bg-card"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(p.id)}
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.tagline}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

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
            <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">A note</label>
            <textarea rows={4} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Book enquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
