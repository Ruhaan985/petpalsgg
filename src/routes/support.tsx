import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — PetPals" },
      { name: "description", content: "PetPals support contact." },
      { property: "og:title", content: "Support — PetPals" },
      { property: "og:description", content: "PetPals support contact." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl font-bold text-primary">PetPals</Link>
        <Link to="/" className="text-sm font-semibold hover:text-primary">← Back to home</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center md:p-12">
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Help
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Support</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Need help with an enquiry, your account, or just want to reach out?
            Contact us directly and a founder will reply.
          </p>

          <a
            href="mailto:wo1359rk@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            wo1359rk@gmail.com
          </a>

          <p className="mt-8 text-xs text-muted-foreground">
            We usually reply within 2 business days.
          </p>
        </div>
      </main>
    </div>
  );
}
