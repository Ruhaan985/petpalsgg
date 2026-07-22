import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import petpalsLogo from "@/assets/petpals-logo.png";
import { productById, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ArrowRight, ShoppingBag, Check } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = productById(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — PetPals" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — PetPals` },
        { name: "description", content: p.body },
        { property: "og:title", content: `${p.name} — PetPals` },
        { property: "og:description", content: p.tagline },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <div className="font-display text-4xl">Not found</div>
        <p className="mt-2 text-sm text-muted-foreground">That piece doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-xs text-primary-foreground">Home</Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">Something went wrong.</div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const Icon = product.icon;
  const others = PRODUCTS.filter((p) => p.id !== product.id);
  const { add, has, items, hydrated } = useCart();
  const inCart = hydrated && has(product.id);

  const handleAdd = () => {
    if (inCart) {
      toast.info("Already in your cart.");
      return;
    }
    add(product.id);
    toast.success(`${product.name} added to cart.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium hover:bg-muted">
            <ShoppingBag className="h-3.5 w-3.5" /> Cart
            {hydrated && items.length > 0 && (
              <span className="ml-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{items.length}</span>
            )}
          </Link>
          <Link to="/" className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">← Collection</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-muted">
            <img
              src={product.image}
              alt={`${product.name} — fictional representation`}
              className="aspect-square h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
              Fictional representation or prototype
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-border">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </span>
              The collection
            </div>
            <h1 className="mt-5 font-display text-5xl leading-tight md:text-6xl">{product.name}</h1>
            <p className="mt-3 text-lg italic text-muted-foreground">{product.tagline}</p>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground">{product.body}</p>

            <ul className="mt-8 space-y-3 border-y border-border py-6">
              {product.details.map((d: string) => (
                <li key={d} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {product.meta.map((m: string) => (
                <span key={m} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{m}</span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {inCart ? (<><Check className="h-4 w-4" /> Added to cart</>) : (<><ShoppingBag className="h-4 w-4" /> Add to cart</>)}
              </button>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                View cart <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/faq" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-muted">
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Also in the collection</div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.id}
                to="/products/$id"
                params={{ id: p.id }}
                className="group grid grid-cols-[120px_1fr] items-center gap-5 rounded-xl border border-border bg-card p-4 transition hover:bg-muted"
              >
                <img src={p.image} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                <div>
                  <div className="font-display text-xl">{p.name}</div>
                  <div className="mt-1 text-xs italic text-muted-foreground">{p.tagline}</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.15em] text-primary">View →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
