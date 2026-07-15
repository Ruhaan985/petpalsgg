import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — PetPals" },
      { name: "description", content: "PetPals terms of use — a student-led prebooking website for the GPS Tracker Leash." },
      { property: "og:title", content: "Terms & Conditions — PetPals" },
      { property: "og:description", content: "Read the terms for using the PetPals prebooking website." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Terms & Conditions</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-8 rounded-2xl bg-accent p-5 text-sm">
            <p className="font-semibold text-primary">Important</p>
            <p className="mt-1 text-muted-foreground">
              PetPals is currently a <strong>prebooking-only website</strong>. No products
              are sold, shipped, or paid for through this site. Submitting an enquiry
              simply reserves your interest — it does not create a sale, contract, or
              guarantee of delivery.
            </p>
          </div>

          <Section title="1. About PetPals">
            PetPals is a student-led project building the GPS Tracker Leash. This
            website exists so interested owners can learn about the product and
            book an enquiry. All images, product mock-ups and demonstrations
            shown are <strong>fictional representations or prototypes</strong> and may
            differ from the final product.
          </Section>

          <Section title="2. Prebooking, not purchasing">
            <ul className="list-disc space-y-1 pl-5">
              <li>No prices are listed and no payments are collected on this site.</li>
              <li>Submitting the enquiry form does not create an order.</li>
              <li>A founder will contact you within roughly 2 days to discuss next steps.</li>
              <li>You may withdraw your enquiry at any time by emailing us.</li>
            </ul>
          </Section>

          <Section title="3. Accounts">
            You may create a PetPals account to submit an enquiry. You are
            responsible for keeping your password secure and for any activity on
            your account. We may suspend accounts that abuse the enquiry form
            (spam, fake submissions, harassment).
          </Section>

          <Section title="4. Information you give us">
            When you enquire we ask for your name, email, and optionally phone
            number, pet's name, and a message. We use this information only to
            reply to your enquiry. We do not sell or share it with third parties.
          </Section>

          <Section title="5. Product information">
            Battery life, GPS accuracy, water resistance and other specifications
            described on the site are engineering targets for the prototype and
            may change before the product is finalised. Nothing on this site
            constitutes a warranty or offer of sale.
          </Section>

          <Section title="6. Returns">
            Because nothing is being sold on this website, no returns apply. If
            and when the product ships in the future, a separate 2-day return
            window will apply from the date of delivery.
          </Section>

          <Section title="7. Intellectual property">
            The PetPals name, logo, copy and images belong to the PetPals student
            team. You may not reuse them without permission. You keep ownership
            of anything you write in the enquiry form.
          </Section>

          <Section title="8. Liability">
            PetPals is provided "as is" while in prebooking. To the extent
            allowed by law, the PetPals team is not liable for indirect or
            consequential loss arising from your use of this site.
          </Section>

          <Section title="9. Changes">
            We may update these terms as the project evolves toward launch. The
            "Last updated" date at the top will always reflect the current
            version.
          </Section>

          <Section title="10. Contact">
            Questions about these terms? Reach out via the enquiry form on the
            home page and a founder will reply.
          </Section>

          <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            By submitting an enquiry you confirm you have read and agree to these
            terms.
          </div>
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
