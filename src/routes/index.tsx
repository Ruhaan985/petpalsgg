import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Battery, ShieldCheck, Waves, ArrowRight, GraduationCap, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import heroDog from "@/assets/hero-dog.jpg";
import productLeash from "@/assets/product-leash.jpg";
import petpalsLogo from "@/assets/petpals-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

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
    toast.success("Signed out. See you soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* NAV */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={petpalsLogo}
            alt="PetPals logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-2xl bg-white object-contain shadow-pop"
          />
          <span className="font-display text-2xl font-bold text-primary">PetPals</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#product" className="hover:text-primary">Product</a>
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#enquiry" className="hover:text-primary">Enquiry</a>
          <a href="#team" className="hover:text-primary">Team</a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Hi, {user.email?.split("@")[0]}
              </span>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground shadow-pop hover:opacity-90"
                >
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="mt-2 font-display text-5xl font-extrabold leading-[1.05] text-foreground md:text-7xl">
              Never lose sight of your{" "}
              <span className="text-primary">best friend</span>{" "}
              again.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              The PetPals GPS Tracker Leash pairs a heavy-duty yellow lead with a
              featherlight purple GPS. Live location, walk stats, and safe-zone
              alerts — all in one leash.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-pop hover:opacity-90"
              >
                Book an enquiry <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-7 py-3.5 text-base font-semibold hover:bg-accent"
              >
                How it works
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-display text-2xl font-bold text-primary">4.9★</span> early tester rating</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-display text-2xl font-bold text-primary">2d</span> return window</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-hero opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-pop">
              <img
                src={heroDog}
                alt="Beagle wearing the PetPals yellow GPS tracker leash — fictional representation"
                width={1408}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                Fictional representation or prototype
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-yellow md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Live location</div>
                  <div className="font-semibold">Riverside Park</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            One leash. Every walk safer.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything a dog parent needs, woven into a leash you'd want to hold.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: "Real-time GPS", body: "Sub-3m accuracy with worldwide LTE-M coverage." },
            { icon: Battery, title: "14-day battery", body: "One charge, two weeks of adventures." },
            { icon: ShieldCheck, title: "Safe zones", body: "Get an alert the moment your pup slips the yard." },
            { icon: Waves, title: "Waterproof", body: "IP68 rated. Splash, swim, repeat." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-pop">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT + ENQUIRY */}
      <section id="product" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 rounded-[2.5rem] bg-gradient-hero p-8 text-primary-foreground shadow-pop md:p-14 lg:grid-cols-2">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 backdrop-blur">
              <img
                src={productLeash}
                alt="PetPals GPS Tracker Leash — fictional representation"
                width={1200}
                height={1200}
                loading="lazy"
                className="h-full w-full object-contain"
              />
              <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                Fictional representation or prototype
              </div>
            </div>
          </div>
          <div>
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              Signature Product
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold md:text-6xl">
              The GPS Tracker Leash
            </h2>
            <p className="mt-5 max-w-md text-lg text-primary-foreground/85">
              A 6ft reflective-yellow lead with a snap-on purple tracker. Set up
              in 90 seconds, tracked on your phone forever.
            </p>
            <ul className="mt-8 space-y-2 text-sm">
              {["Free demo on request", "2-day return window", "2-year warranty", "No monthly fees for year one"].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-primary">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <a
              href="#enquiry"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground shadow-yellow hover:opacity-90"
            >
              Book an enquiry <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <EnquirySection />

      {/* TEAM */}
      <section id="team" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2.5rem] border border-border bg-card p-10 md:p-14">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              Built by students, for dog lovers.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              PetPals is a student-led project. Three individual founders,
              stitching hardware, software, and a lot of dog treats together
              between lectures.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { role: "Founder — Hardware" },
              { role: "Founder — App & Design" },
              { role: "Founder — Operations" },
            ].map((m) => (
              <div key={m.role} className="rounded-2xl bg-gradient-soft p-6">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="mt-4 font-bold">Student Founder</div>
                <div className="text-sm text-muted-foreground">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <img src={petpalsLogo} alt="PetPals logo" width={28} height={28} className="h-7 w-7 rounded-lg bg-white object-contain" loading="lazy" />
            <span>© {new Date().getFullYear()} PetPals. All tails wagging.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary">Support</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EnquirySection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", pet_name: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("enquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      pet_name: form.pet_name || null,
      message: form.message || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Couldn't send enquiry", { description: error.message });
      return;
    }
    toast.success("Enquiry booked!", { description: "We'll be in touch within 2 days." });
    setForm({ name: "", email: "", phone: "", pet_name: "", message: "" });
  };

  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <section id="enquiry" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-10 rounded-[2.5rem] border border-border bg-card p-8 md:p-14 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Enquiry booking
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold md:text-5xl">
            Interested? Let's talk.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're not selling online yet — book an enquiry and one of the founders
            will reach out with a demo, price, and next steps within 2 days.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Personal reply from a founder", "Optional in-person demo", "No pressure, no spam"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-primary">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Your name*</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Email*</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Pet's name</label>
              <input value={form.pet_name} onChange={(e) => setForm({ ...form, pet_name: e.target.value })} className={field} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Tell us about your pup</label>
            <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Book enquiry"}
          </button>
        </form>
      </div>
    </section>
  );
}
