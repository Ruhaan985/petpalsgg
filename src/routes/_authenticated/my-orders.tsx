import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Check, Package, Truck, MapPin, Home, Store } from "lucide-react";
import { listMyEnquiries } from "@/lib/enquiries.functions";
import petpalsLogo from "@/assets/petpals-logo.png";
import { productById } from "@/lib/products";
import { ORDER_STAGES, PICKUP_STAGE, stageIndex, stageMeta } from "@/lib/orderStages";

export const Route = createFileRoute("/_authenticated/my-orders")({
  head: () => ({ meta: [{ title: "My orders — PetPals" }, { name: "robots", content: "noindex" }] }),
  component: MyOrders,
});

const icons = [Package, Truck, MapPin, Home];

type Row = {
  id: string;
  created_at: string;
  status: string;
  interested_items: string[] | null;
  order_stage: string | null;
  order_stage_note: string | null;
  order_stage_updated_at: string | null;
};

function Tracker({ stage }: { stage: string | null }) {
  if (stage === PICKUP_STAGE.id) {
    return (
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-5">
        <Store className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <div className="font-display text-lg">{PICKUP_STAGE.label}</div>
          <p className="mt-1 text-sm text-muted-foreground">{PICKUP_STAGE.blurb}</p>
        </div>
      </div>
    );
  }

  const current = stageIndex(stage);

  return (
    <ol className="mt-6 space-y-0">
      {ORDER_STAGES.map((s, i) => {
        const Icon = icons[i] ?? Package;
        const done = current >= 0 && i <= current;
        const isCurrent = i === current;
        return (
          <li key={s.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border ${
                  done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done && !isCurrent ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              {i < ORDER_STAGES.length - 1 && (
                <div className={`w-px flex-1 ${current > i ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
            <div className={`pb-6 ${done ? "" : "opacity-50"}`}>
              <div className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>{s.label}</div>
              <p className="mt-0.5 text-sm text-muted-foreground">{s.blurb}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function MyOrders() {
  const fn = useServerFn(listMyEnquiries);
  const { data, isLoading, error } = useQuery({ queryKey: ["my-enquiries"], queryFn: () => fn() });

  const rows = ((data ?? []) as unknown as Row[]).filter((r) => !!r.order_stage);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <Link to="/my-enquiries" className="hover:text-foreground">My enquiries</Link>
          <Link to="/" className="hover:text-foreground">← Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your account</div>
        <h1 className="mt-3 font-display text-5xl">My orders</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Track where your order is. We update the stage by hand as it moves — later stages will be added as we grow.
        </p>

        <div className="mt-12 space-y-4">
          {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
          {error && <div className="text-sm text-destructive">Couldn't load your orders.</div>}
          {data && rows.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <div className="font-display text-2xl">No orders in transit yet.</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Once we accept an enquiry and start your order, its tracking appears here.
              </p>
              <Link to="/my-enquiries" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-xs text-primary-foreground">
                See my enquiries
              </Link>
            </div>
          )}
          {rows.map((e) => (
            <article key={e.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Order · {new Date(e.created_at).toLocaleDateString()}
                </div>
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-primary">
                  {stageMeta(e.order_stage)?.label ?? e.order_stage}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(e.interested_items ?? []).map((id) => (
                  <span key={id} className="rounded-full border border-border px-3 py-1 text-xs">
                    {productById(id)?.name ?? id}
                  </span>
                ))}
              </div>
              <Tracker stage={e.order_stage} />
              {e.order_stage_note && (
                <p className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                  Note from us: {e.order_stage_note}
                </p>
              )}
              {e.order_stage_updated_at && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Last updated {new Date(e.order_stage_updated_at).toLocaleString()}
                </p>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
