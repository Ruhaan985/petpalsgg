import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — PetPals" },
      {
        name: "description",
        content:
          "Detailed PetPals terms: prebooking, Tails of Care editions (B&W ₹520, Colored ₹800), payments, delivery, collection, returns and liability.",
      },
      { property: "og:title", content: "Terms & Conditions — PetPals" },
      {
        property: "og:description",
        content:
          "Full terms for the PetPals prebooking site — editions and pricing, payment, order stages, returns and refunds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display text-2xl tracking-tight text-primary">PetPals</Link>
        <Link to="/" className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">← Back to home</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-[2rem] border border-border bg-card p-8 md:p-12">
          <span className="inline-block rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Legal
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm">
            <p className="font-semibold text-foreground">Read this first</p>
            <p className="mt-1 text-muted-foreground">
              PetPals is a student-led <strong>prebooking</strong> project by Team Beagle. Two books
              are currently payable — the <em>Tails of Care</em> handbook, offered in a Black
              &amp; white edition at <strong>₹520</strong> and a Colored edition at{" "}
              <strong>₹800</strong>, and its companion quizbook <em>A Final Pawprint</em> at <strong>₹499</strong>. The Safe Eating Bowl and GPS Tracker Leash are prototypes shown
              for interest only; they cannot be bought, and no payment is collected for them.
            </p>
          </div>

          <Section title="1. Who we are and what these terms cover">
            PetPals is operated by a small team of individual students ("Team Beagle", "we", "us").
            These terms form the agreement between you and Team Beagle whenever you browse this
            website, create an account, add items to the cart, submit an enquiry, make a payment, or
            track an order. By doing any of those things you confirm you have read, understood and
            accepted these terms. If you do not agree with them, please do not use the site.
          </Section>

          <Section title="2. Definitions">
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Site</strong> — this PetPals website and all of its pages.</li>
              <li><strong>Handbook</strong> — <em>Tails of Care</em>, the illustrated care handbook written and illustrated by Team Beagle.</li>
              <li><strong>Quizbook</strong> — <em>A Final Pawprint</em>, a companion aligned to the original <em>Tails of Care</em>, sold separately at ₹499. The handbook is not included.</li>
              <li><strong>Edition</strong> — the print variant of the Handbook you select: Black &amp; white (₹520) or Colored (₹800).</li>
              <li><strong>Prototype</strong> — the Safe Eating Bowl and the GPS Tracker Leash, both non-purchasable concepts.</li>
              <li><strong>Enquiry</strong> — the form you submit listing the items and editions you are interested in.</li>
              <li><strong>Prebooking</strong> — a paid reservation of a Handbook or Quizbook copy, not a completed retail sale of stock on hand.</li>
            </ul>
          </Section>

          <Section title="3. Eligibility and accounts">
            <ul className="list-disc space-y-1 pl-5">
              <li>You must be at least 13 years old to submit an enquiry or create an account, and 18 or older (or have the consent of a parent or guardian) to make a payment.</li>
              <li>You must give accurate contact details. We reply to the email address you provide, and we cannot deliver or update you if it is wrong.</li>
              <li>You are responsible for your password and for everything done through your account.</li>
              <li>We may suspend or delete accounts used for spam, fake or duplicate enquiries, abusive messages, fraudulent payments, or attempts to disrupt the site.</li>
              <li>One person should not create multiple accounts to place duplicate prebookings for the same copy.</li>
            </ul>
          </Section>

          <Section title="4. The collection, editions and pricing">
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Tails of Care — Black &amp; white edition: ₹520.</strong> Monochrome printing of the same text and line illustrations, on uncoated recycled stock.</li>
              <li><strong>Tails of Care — Colored edition: ₹800.</strong> Full-colour illustrations throughout, printed on heavier stock.</li>
              <li><strong>A Final Pawprint — companion quizbook: ₹499.</strong> Sold separately from Tails of Care; the handbook is not included.</li>
              <li>Both handbook editions have identical written content, chapter structure and page count. The difference is print treatment and paper only.</li>
              <li>You choose the edition on the Handbook's product page before adding it to the cart. The edition you selected is shown in your cart, in your enquiry and in the admin record, and it is the edition we print for you.</li>
              <li>Prices are in Indian Rupees (INR) and shown inclusive of the amount payable at checkout. Any statutory tax, if it ever becomes applicable to us, will be shown before you pay.</li>
              <li>Shipping, courier or collection charges, where they apply, are confirmed in writing by a founder before dispatch and are not automatically included in the ₹520 / ₹800 / ₹499 figures.</li>
              <li>The Safe Eating Bowl and GPS Tracker Leash carry no price and cannot be added to a paid order. Any interest you register in them is an expression of interest only.</li>
              <li>Prices may change for future print runs. The price shown on the site when you pay is the price that applies to your order.</li>
            </ul>
          </Section>

          <Section title="5. Cart, enquiries and how an order is formed">
            The cart is a shortlist, not a checkout basket, and holding an item there reserves
            nothing. Submitting the enquiry form sends us your details and your chosen editions; it
            is an offer to prebook, not an accepted order. A binding prebooking exists only when
            both of the following are true: (a) we have received your payment for the Handbook edition or Quizbook
            you selected, and (b) we have confirmed the prebooking to you by email or through
            your order tracking page. We may decline any enquiry or refund any payment if we cannot
            fulfil it — for example if a print run sells out, if delivery to your location is not
            practical for a student team, or if we suspect fraud.
          </Section>

          <Section title="6. Payment">
            <ul className="list-disc space-y-1 pl-5">
              <li>Payment for the Handbook and Quizbook is collected after you submit your enquiry, on the payment page, for the exact edition total (₹520 or ₹800 for the Handbook, ₹499 for the Quizbook, or the sum of the books selected).</li>
              <li>On a computer we show a UPI QR code payable to Team Beagle; on a phone we open your UPI app with the amount prefilled. Where secure card/UPI/wallet/netbanking checkout is enabled, that option is offered as well.</li>
              <li>We never see or store your card number, UPI PIN, bank credentials or one-time passwords. Those stay with your bank or the payment provider.</li>
              <li>Send only the amount shown. If you underpay, we will ask you to pay the difference before printing; if you overpay, we refund the excess.</li>
              <li>If you pay by QR or UPI app, keep the transaction reference. We may ask for it to match your payment to your enquiry.</li>
              <li>Payments in a currency other than INR, chargebacks raised without contacting us first, and payments sent to any account other than the one shown on the payment page are not our responsibility.</li>
            </ul>
          </Section>

          <Section title="7. Order stages and tracking">
            Once your prebooking is confirmed, a founder sets its stage in the admin panel and you
            can follow it on your orders page. The stages are:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Ordered</strong> — payment received and your copy is queued for the print run.</li>
              <li><strong>Shipped</strong> — your copy has been handed to the courier.</li>
              <li><strong>Out for delivery</strong> — the courier expects to deliver it that day.</li>
              <li><strong>Delivered</strong> — the copy has reached you.</li>
              <li><strong>Ready to collect</strong> — your copy is with us and you can come and collect it in person.</li>
            </ul>
            Stage updates are made manually by students, so there can be a short delay between
            something happening and the stage changing. Stage dates are indications, not guaranteed
            delivery dates. Further stages may be added as the project grows, and we will tell you
            about them when they exist.
          </Section>

          <Section title="8. Delivery and collection">
            <ul className="list-disc space-y-1 pl-5">
              <li>Print runs are produced in batches. We tell you the expected window for your batch when we confirm your prebooking; it is an estimate, not a deadline.</li>
              <li>Delivery is made to the address you confirm with a founder. Please check it carefully — we cannot recover a parcel sent to a wrong address you supplied.</li>
              <li>In-person collection is available where we are based, by prior arrangement. Please bring your order reference.</li>
              <li>Risk in either book passes to you on delivery or on collection. Ownership passes once payment has cleared in full.</li>
              <li>If a courier records a delivery you did not receive, tell us within 7 days so we can raise it with them.</li>
            </ul>
          </Section>

          <Section title="9. Returns, cancellations and refunds">
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Two-day return window.</strong> You may return a Handbook or Quizbook within 2 days of delivery or collection. Tell us within those 2 days and return it unused, unmarked and in resaleable condition with its packaging.</li>
              <li>Once we receive and inspect the return, we refund the price of the edition you paid for to the original payment method, normally within 7 working days. Return postage is yours unless the item was faulty or we sent the wrong edition.</li>
              <li><strong>Before dispatch.</strong> You may cancel a prebooking at any time before your copy is dispatched or marked ready to collect, for a full refund.</li>
              <li><strong>Wrong edition or damage.</strong> If we send the wrong edition, or the copy arrives damaged or misprinted, tell us within 2 days with a photo and we will replace it or refund it in full at no cost to you.</li>
              <li>We cannot refund a returned copy that has been written in, annotated, water-damaged, or otherwise made unsaleable, other than where it was faulty when it reached you.</li>
              <li>Because the Prototypes are not sold, no return or refund can arise for them.</li>
            </ul>
          </Section>

          <Section title="10. Product information and prototypes">
            All photographs, mock-ups, renders and demonstrations on this site are{" "}
            <strong>fictional representations or prototypes</strong> and are labelled as such. Colours
            on your screen may differ from printed ink and paper. Specifications quoted for the Safe
            Eating Bowl and GPS Tracker Leash — battery life, GPS accuracy, weight sensitivity, water
            resistance — are engineering targets for student prototypes, not tested product claims,
            and may change or be abandoned entirely. Nothing about the Prototypes is an offer of sale
            or a warranty.
          </Section>

          <Section title="11. Not veterinary advice">
            <em>Tails of Care</em>, <em>A Final Pawprint</em> and the guidance on this site are written by students for general
            education. They are not veterinary advice and must not be used to diagnose or treat any
            animal. Always consult a qualified veterinarian about your pet's health, diet, medication
            or emergency care. We are not liable for decisions taken on the basis of our content.
          </Section>

          <Section title="12. Acceptable use">
            <ul className="list-disc space-y-1 pl-5">
              <li>Do not submit false, automated or bulk enquiries, or another person's details without permission.</li>
              <li>Do not attempt to access the admin panel, other users' enquiries or orders, or any part of the backend you are not authorised to use.</li>
              <li>Do not scrape, copy or republish the site, probe it for vulnerabilities, or upload anything malicious.</li>
              <li>Do not send abusive, threatening, discriminatory or unlawful content through any form on the site.</li>
            </ul>
          </Section>

          <Section title="13. Intellectual property">
            The PetPals name and logo, the <em>Tails of Care</em> and <em>A Final Pawprint</em> titles, cover, text and
            illustrations, and all site copy, photography and design belong to Team Beagle. You may
            not reproduce, scan, photocopy, resell, redistribute or create derivative works from the
            Handbook, Quizbook or the site without our written permission. Buying a copy licenses you to read
            and use it personally, and does not transfer any rights in its content. You keep
            ownership of anything you write in an enquiry, and you grant us permission to store and
            use it to answer you.
          </Section>

          <Section title="14. Third-party services">
            This site relies on third parties for hosting, database and authentication, and for
            payment processing and delivery. Their processing is governed by their own terms and
            security practices. We choose reputable providers, but an outage, delay or error at a
            provider is outside our direct control; we will tell you promptly and put it right as far
            as we can.
          </Section>

          <Section title="15. Availability of the site">
            The site is provided on an "as is" and "as available" basis while the project is in
            prebooking. We do not promise uninterrupted access, and we may change, pause, or withdraw
            any feature — including the cart, payments or order tracking — at any time. If we
            withdraw a feature after you have paid, your prebooking and your refund rights are
            unaffected.
          </Section>

          <Section title="16. Liability">
            Nothing in these terms limits liability that cannot be limited by law, including
            liability for death or personal injury caused by our negligence, or for fraud. Subject to
            that, our total liability to you for any claim connected with the site, an enquiry, or a
            prebooking is limited to the amount you actually paid us for the affected order. We are
            not liable for indirect or consequential loss, loss of profit, loss of data, or loss
            arising from your reliance on prototype specifications or on content that is expressly
            educational.
          </Section>

          <Section title="17. Privacy">
            Our handling of your personal data is described in our{" "}
            <Link to="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</Link>,
            which forms part of these terms.
          </Section>

          <Section title="18. Changes to these terms">
            We may update these terms as the project moves toward launch. The "Last updated" date at
            the top always reflects the current version. Material changes will be reflected on this
            page, and the version in force when you paid is the version that governs that order.
          </Section>

          <Section title="19. Governing law and disputes">
            These terms are governed by the laws of India, and the courts of India have jurisdiction
            over any dispute. Please contact us first — almost everything is resolved by a single
            email, and we would much rather fix a problem than argue about it.
          </Section>

          <Section title="20. Contact">
            Questions about these terms, an order or a refund? Email{" "}
            <a href="mailto:wo1359rk@gmail.com" className="text-primary underline underline-offset-4">wo1359rk@gmail.com</a>{" "}
            or see our{" "}
            <Link to="/support" className="text-primary underline underline-offset-4">Support page</Link>.
            A founder normally replies within 2 business days.
          </Section>

          <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            By submitting an enquiry or making a payment you confirm you have read and agree to these
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
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
