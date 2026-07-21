import { createFileRoute, Link } from "@tanstack/react-router";
import petpalsLogo from "@/assets/petpals-logo.png";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — PetPals" },
      { name: "description", content: "Answers to common questions about PetPals prebooking, demos and returns." },
      { property: "og:title", content: "FAQ — PetPals" },
      { property: "og:description", content: "Prebooking, timelines, demos and returns — answered plainly." },
    ],
  }),
  component: FAQPage,
});

const FAQS = [
  {
    q: "Is PetPals selling products right now?",
    a: "No. PetPals is a student-led project in the prebooking stage. You can register interest in any of the three pieces and a founder will follow up personally — no payment is taken.",
  },
  {
    q: "When will the pieces be available?",
    a: "We're building small batches by hand between semesters. Timelines depend on the piece; we'll share honest estimates in our reply to your enquiry.",
  },
  {
    q: "Can I see a prototype in person?",
    a: "If you're nearby, yes — leave a note in the enquiry form and we'll arrange a quiet demo.",
  },
  {
    q: "What is the return policy?",
    a: "When pieces ship, we offer a 2-day return window from delivery — the piece just needs to come back in the state it arrived.",
  },
  {
    q: "How do you use my information?",
    a: "Only to reply to your enquiry. We don't sell data, run ads or send newsletters. See our Privacy page for the full plain-English version.",
  },
  {
    q: "Who's behind PetPals?",
    a: "Three individual student founders — hardware, writing/design and operations — building the pieces we wished existed for our own beagles.",
  },
];

function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <Link to="/" className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">← Back</Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Help</div>
        <h1 className="mt-3 font-display text-5xl">Frequently asked.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Plain answers to the questions we hear most.</p>
        <div className="mt-14 divide-y divide-border border-y border-border">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-foreground">
                {f.q}
                <span className="text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border border-border bg-card p-8">
          <div className="font-display text-2xl">Still curious?</div>
          <p className="mt-2 text-sm text-muted-foreground">Send an enquiry or write to us directly.</p>
          <div className="mt-5 flex gap-3">
            <Link to="/" className="rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:opacity-90">Book an enquiry</Link>
            <Link to="/support" className="rounded-full border border-border bg-card px-5 py-2.5 text-xs font-medium hover:bg-muted">Contact support</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
