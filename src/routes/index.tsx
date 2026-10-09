import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { ArrowRight, GraduationCap, Shield, Leaf, User, ShoppingBag, Package, Menu, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import heroDog from "@/assets/hero-dog.jpg";
import petpalsLogo from "@/assets/petpals-logo.png";
import introVideo from "@/assets/petpals-cinematic-intro-45s.mp4.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { PRODUCTS, variantsFor } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { getEnquiryCount } from "@/lib/enquiries.functions";
import { pageMeta } from "@/lib/page-meta";
import { CinematicIntro } from "@/components/cinematic-intro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [...pageMeta("PetPals | Beagle Care Books & Pet Products — Team Beagle", "Discover PetPals by Team Beagle. Prebook Tails of Care from ₹520 and A Final Pawprint quizbook for ₹499, or enquire about our smart bowl and GPS leash prototypes."), { property: "og:url", content: "https://petpalsgg.lovable.app/" }],
    links: [{ rel: "canonical", href: "https://petpalsgg.lovable.app/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "PetPals", alternateName: "PetPals by Team Beagle", url: "https://petpalsgg.lovable.app/", description: "Student-led beagle care books and pet product prototypes by Team Beagle.", publisher: { "@type": "Organization", name: "Team Beagle", url: "https://petpalsgg.lovable.app/" } }) }],
  }),
  component: Index,
});

// Products moved to src/lib/products.ts

function Index() {
  const { user } = useAuth();
  const { items: cartItems, hydrated: cartHydrated } = useCart();
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
      <CinematicIntro source={introVideo.url} />
      {/* NAV */}
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={petpalsLogo}
            alt="PetPals logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg bg-card object-contain"
          />
          <div><span className="font-display text-2xl text-foreground">PetPals</span><span className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground">By Team Beagle</span></div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#products" className="hover:text-foreground">Products</a>
          <a href="#story" className="hover:text-foreground">Story</a>
          <a href="#enquiry" className="hover:text-foreground">Enquire</a>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <Link to="/support" className="hover:text-foreground">Support</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Cart
            {cartHydrated && cartItems.length > 0 && (
              <span className="ml-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{cartItems.length}</span>
            )}
          </Link>
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
              <Link
                to="/my-enquiries"
                className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium hover:bg-muted sm:inline-flex"
              >
                <User className="h-3.5 w-3.5" /> My enquiries
              </Link>
              <Link
                to="/my-orders"
                className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium hover:bg-muted sm:inline-flex"
              >
                <Package className="h-3.5 w-3.5" /> My orders
              </Link>
              <Button variant="ghost" size="sm"
                onClick={handleSignOut}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Sign out
              </Button>
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
        <details className="w-full border-t border-border pt-3 md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground"><Menu className="h-4 w-4" /> Explore PetPals</summary>
          <nav className="grid grid-cols-3 gap-4 py-4 text-sm" aria-label="Mobile navigation">
            <a href="#products">Collection</a><a href="#story">Our story</a><a href="#enquiry">Enquire</a><Link to="/faq">FAQ</Link><Link to="/support">Support</Link>
            {user && <><Link to="/my-orders">My orders</Link><Link to="/my-enquiries">My enquiries</Link></>}
          </nav>
        </details>
      </header>

      {/* HERO */}
      <section className="home-hero relative flex items-end overflow-hidden md:items-center">
        <img src={heroDog} alt="Beagle resting on linen — fictional representation" width={1408} height={1408} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-[center_42%]" />
        <div className="hero-shade absolute inset-0" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-12 md:py-14">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary"><Leaf className="h-3.5 w-3.5" /> Student-led. Beagle-loved.</div>
            <h1 className="mt-5 font-display text-6xl text-primary md:text-8xl">PetPals</h1>
            <h2 className="mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl">A little care.<br />A happier beagle.</h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/85">Thoughtful care books and curious little inventions. Made by Team Beagle, for the companions who make life better.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#products">Explore the collection <ArrowRight /></a></Button>
              <Button asChild variant="outline" size="lg"><a href="#enquiry">Book an enquiry</a></Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">Book preorders · Bowl & leash prototypes</p>
          </div>
        </div>
        <span className="absolute right-3 top-3 max-w-[180px] bg-background/80 px-2 py-1 text-[9px] uppercase tracking-wider text-foreground">Fictional representation or prototype</span>
      </section>
      <div className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-6 py-5 text-center text-xs text-muted-foreground">
          <span className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center"><BookOpen className="h-4 w-4 text-primary" /> Books for better care</span>
          <span className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center"><GraduationCap className="h-4 w-4 text-primary" /> Independent student founders</span>
          <span className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center"><Package className="h-4 w-4 text-primary" /> Prebooking only</span>
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The collection</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Good reads. Better routines.</h2>
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">04 / four pieces</div>
        </div>

        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <article key={p.id} className="group">
              <Link
                to="/products/$id"
                params={{ id: p.id }}
                className="relative block overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={p.image}
                  alt={`${p.name} — fictional representation`}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  className={`aspect-[5/4] w-full transition duration-700 motion-reduce:transition-none group-hover:scale-[1.02] ${"fit" in p && p.fit === "contain" ? "bg-card object-contain p-6" : "object-cover"}`}
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
                  Fictional representation or prototype
                </div>
              </Link>
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">0{i + 1}</div>
                  <Link to="/products/$id" params={{ id: p.id }}>
                    <h3 className="mt-2 font-display text-2xl text-foreground hover:text-primary">{p.name}</h3>
                  </Link>
                  <p className="mt-1 text-sm italic text-muted-foreground">{p.tagline}</p>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border">
                  <p.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                <span className="font-semibold text-primary">{p.id === "handbook" ? `₹${variantsFor(p.id)[0]?.price} B&W / ₹${variantsFor(p.id)[1]?.price} Colored` : p.price === null ? "Enquiry-only prototype" : `₹${p.price}`}</span>
                <span className="text-xs text-muted-foreground">{p.price === null ? "In development" : "Prebooking"}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.meta.map((m) => (
                  <span key={m} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {m}
                  </span>
                ))}
              </div>
              <Link
                to="/products/$id"
                params={{ id: p.id }}
                className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-primary hover:opacity-80"
              >
                {p.price === null ? "Explore prototype" : "View book"} <ArrowRight className="h-3 w-3" />
              </Link>
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
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/faq" className="hover:text-foreground">FAQ</Link>
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", pet_name: "", message: "" });
  const [items, setItems] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const fetchCount = useServerFn(getEnquiryCount);
  const { data: countData } = useQuery({
    queryKey: ["enquiry-count"],
    queryFn: () => fetchCount(),
    refetchOnWindowFocus: false,
  });

  const toggle = (id: string) =>
    setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please choose at least one item you're interested in.");
      return;
    }
    setBusy(true);
    // Anonymous visitors have insert-only access, so only request the id back when signed in.
    const insertQuery = supabase.from("enquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      pet_name: form.pet_name || null,
      message: form.message || null,
      interested_items: items,
      user_id: user?.id ?? null,
    });
    const result = user
      ? await insertQuery.select("id").maybeSingle()
      : await insertQuery;
    const error = result.error;
    const inserted = (user ? result.data : null) as { id: string } | null;
    setBusy(false);
    if (error) {
      toast.error("Couldn't send enquiry", { description: error.message });
      return;
    }
    toast.success("Enquiry booked", { description: "We'll be in touch within 2 days." });
    const chosen = items.join(",");
    setForm({ name: "", email: "", phone: "", pet_name: "", message: "" });
    setItems([]);
    navigate({ to: "/payment", search: { items: chosen, enquiry: inserted?.id ?? undefined } });
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
            Prebook a book or register interest in our prototypes. Tell us which piece you're curious
            about and a founder will reach out within two days.
          </p>
          {countData && countData.count > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-medium text-foreground">{countData.count.toLocaleString()}</span> {countData.count === 1 ? "person has" : "people have"} enquired so far
            </div>
          )}
          <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
            {[
              user ? "Saved to your PetPals account" : "Sign in to track replies in one place",
              "Personal reply from a founder",
              "Optional in-person demo",
              "No pressure, no spam",
            ].map((b) => (
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
              <label htmlFor="home-name" className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Name*</label>
              <input id="home-name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div>
              <label htmlFor="home-email" className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Email*</label>
              <input id="home-email" type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            </div>
            <div>
              <label htmlFor="home-phone" className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Phone</label>
              <input id="home-phone" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
            </div>
            <div>
              <label htmlFor="home-pet_name" className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">Pet's name</label>
              <input id="home-pet_name" maxLength={100} value={form.pet_name} onChange={(e) => setForm({ ...form, pet_name: e.target.value })} className={field} />
            </div>
          </div>
          <div>
            <label htmlFor="home-message" className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">A note</label>
            <textarea id="home-message" rows={4} maxLength={2000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Book enquiry"}
          </Button>
        </form>
      </div>
    </section>
  );
}
