import { createFileRoute, Link } from "@tanstack/react-router";
import petpalsLogo from "@/assets/petpals-logo.png";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — PetPals" },
      { name: "description", content: "Review the pieces you're interested in and proceed to enquire." },
      { property: "og:title", content: "Your Cart — PetPals" },
      { property: "og:description", content: "Review the pieces you're interested in and proceed to enquire." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, clear, hydrated } = useCart();
  const cartProducts = items
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={petpalsLogo} alt="PetPals" className="h-8 w-8 rounded-lg bg-card object-contain" />
          <span className="font-display text-xl tracking-tight text-foreground">PetPals</span>
        </Link>
        <Link to="/" className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground">← Collection</Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your cart</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Pieces you're considering</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We don't sell online — the cart holds the pieces you'd like to enquire about. Proceed when you're ready and a founder will reach out within two days.
        </p>

        {hydrated && cartProducts.length === 0 ? (
          <div className="mt-14 grid place-items-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            <div className="mt-4 font-display text-2xl">Your cart is empty</div>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Browse the collection and add the pieces you'd like to hear more about.
            </p>
            <Link
              to="/"
              hash="products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              View the collection <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {cartProducts.map((p) => (
                <li key={p.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-5 py-5">
                  <img src={p.image} alt={p.name} className="aspect-square w-20 rounded-lg object-cover" />
                  <div>
                    <Link
                      to="/products/$id"
                      params={{ id: p.id }}
                      className="font-display text-xl hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <div className="mt-1 text-xs italic text-muted-foreground">{p.tagline}</div>
                  </div>
                  <button
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={clear}
                className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
              >
                Clear cart
              </button>
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Proceed to enquire <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
