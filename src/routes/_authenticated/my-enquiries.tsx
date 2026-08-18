import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMyEnquiries } from "@/lib/enquiries.functions";
import petpalsLogo from "@/assets/petpals-logo.png";
import { productById } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/my-enquiries")({
  head: () => ({ meta: [{ title: "My enquiries — PetPals" }, { name: "robots", content: "noindex" }] }),
  component: MyEnquiries,
});

const statusStyles: Record<string, string> = {
  pending: "border-border bg-card text-muted-foreground",
  accepted: "border-success/40 bg-success/10 text-success",
  declined: "border-destructive/40 bg-destructive/10 text-destructive",
};

function MyEnquiries() {
  const fn = useServerFn(listMyEnquiries);
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-enquiries"],
    queryFn: () => fn(),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <Link to="/my-orders" className="hover:text-foreground">My orders</Link>
          <Link to="/" className="hover:text-foreground">← Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your account</div>
        <h1 className="mt-3 font-display text-5xl">My enquiries</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Every enquiry you've sent us and where it stands. We reply within two days.
        </p>

        <div className="mt-12 space-y-4">
          {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {error && <div className="text-sm text-destructive">Couldn't load your enquiries.</div>}
          {data && data.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <div className="font-display text-2xl">Nothing yet.</div>
              <p className="mt-2 text-sm text-muted-foreground">Enquiries you send while signed in will appear here.</p>
              <Link to="/" hash="enquiry" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-xs text-primary-foreground">Book an enquiry</Link>
            </div>
          )}
          {data?.map((e) => (
            <article key={e.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {new Date(e.created_at).toLocaleString()}
                </div>
                <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${statusStyles[e.status] ?? statusStyles.pending}`}>
                  {e.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(e.interested_items ?? []).map((id: string) => (
                  <span key={id} className="rounded-full border border-border px-3 py-1 text-xs">
                    {productById(id)?.name ?? id}
                  </span>
                ))}
              </div>
              {(() => {
                const ps = (e as { payments?: { status: string; amount_paise: number; razorpay_payment_id: string | null }[] }).payments ?? [];
                const paid = ps.find((x) => x.status === "paid");
                if (!paid) return null;
                return (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-success">
                    Paid ₹{paid.amount_paise / 100}
                    {paid.razorpay_payment_id ? ` · ${paid.razorpay_payment_id}` : ""}
                  </div>
                );
              })()}
              {e.pet_name && <div className="mt-4 text-sm text-muted-foreground">Pet: <span className="text-foreground">{e.pet_name}</span></div>}
              {e.message && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.message}</p>}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
