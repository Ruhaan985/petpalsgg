import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — PetPals" },
      { name: "description", content: "PetPals privacy policy — how we handle your data when you book an enquiry." },
      { property: "og:title", content: "Privacy Policy — PetPals" },
      { property: "og:description", content: "How PetPals collects, uses, and protects your enquiry data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl font-bold text-primary">PetPals</Link>
        <Link to="/" className="text-sm font-semibold hover:text-primary">← Back to home</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-[2rem] border border-border bg-card p-8 md:p-12">
          <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Legal
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-8 rounded-2xl bg-accent p-5 text-sm">
            <p className="font-semibold text-primary">Summary</p>
            <p className="mt-1 text-muted-foreground">
              PetPals is a student-led, prebooking-only website. We collect only the
              information we need to reply to your enquiry, and we never sell it.
            </p>
          </div>

          <Section title="1. Who we are">
            PetPals is a student project run by individual student founders. This
            website is built to share our GPS Tracker Leash concept and collect
            prebooking interest. The team is the data controller for anything you
            submit through this site.
          </Section>

          <Section title="2. What we collect">
            When you submit an enquiry we may collect:
            <ul className="list-disc space-y-1 pl-5">
              <li>Your name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Your pet's name (optional)</li>
              <li>Any message you choose to include</li>
            </ul>
            If you create an account we also store your email address and account
            metadata required by the authentication service.
          </Section>

          <Section title="3. How we use your data">
            We use your information only to:
            <ul className="list-disc space-y-1 pl-5">
              <li>Reply to your enquiry</li>
              <li>Arrange a demo or follow-up discussion</li>
              <li>Keep track of enquiry status (accepted, declined, pending)</li>
              <li>Keep your account secure</li>
            </ul>
            We do not use your data for automated profiling, advertising, or sales.
          </Section>

          <Section title="4. Legal basis for processing">
            We process enquiry data on the basis of your consent, which you give by
            submitting the enquiry form. You can withdraw that consent at any time by
            contacting us and asking us to delete your enquiry.
          </Section>

          <Section title="5. How we share your data">
            We do not sell your data. We share it only with the PetPals student
            founders who need to see enquiries to respond to them. We use a backend
            service to store and process data securely; that provider is bound by
            confidentiality and security obligations.
          </Section>

          <Section title="6. How long we keep your data">
            We keep enquiry records for as long as the project is active so we can
            follow up with you. If you ask us to delete your enquiry, we will remove
            it from our active database unless we are required to keep it by law.
          </Section>

          <Section title="7. Cookies and analytics">
            This site uses a small number of cookies to keep you signed in and to
            remember basic session settings. We do not use third-party advertising or
            tracking cookies.
          </Section>

          <Section title="8. Your rights">
            You can ask us to:
            <ul className="list-disc space-y-1 pl-5">
              <li>Show you the data we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Delete your enquiry or account</li>
              <li>Withdraw your consent</li>
            </ul>
            To make a request, use the enquiry form on the home page or contact a founder.
          </Section>

          <Section title="9. Security">
            We use standard industry measures to protect your data, including
            encrypted connections, access controls for admin accounts, and row-level
            security in the database. No system is perfectly secure, and we regularly
            review our setup to keep risks low.
          </Section>

          <Section title="10. Children's privacy">
            This website is intended for dog owners and adults. If you are under 13,
            please do not submit an enquiry or create an account.
          </Section>

          <Section title="11. Changes">
            We may update this privacy policy as the project grows. The "Last updated"
            date at the top will always show the current version.
          </Section>

          <Section title="12. Contact">
            Questions about privacy? Reach out via the enquiry form on the home page and
            a founder will reply.
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
