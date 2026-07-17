import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Welcome to the pack!", { description: "Your PetPals account is ready." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-gradient-soft lg:grid-cols-2">
      {/* LEFT: brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-hero p-12 text-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold opacity-90 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" /> Back to PetPals
        </Link>
        <div>
          <div className="mb-6 inline-flex items-center gap-2">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold">
              P
            </div>
            <span className="font-display text-3xl font-bold">PetPals</span>
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-tight">
            Your dog's second-favorite login.
          </h1>
          <p className="mt-4 max-w-md text-foreground/85">
            A PetPals account unlocks live GPS tracking, walk history, and safe-zone alerts for every leash in your pack.
          </p>
        </div>
        <div className="text-xs opacity-70">© {new Date().getFullYear()} PetPals</div>
      </div>

      {/* RIGHT: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-pop">
            <div className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
              PetPals account
            </div>
            <h2 className="font-display text-3xl font-bold">
              {mode === "signin" ? "Welcome back" : "Join the pack"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to track your dog in real time."
                : "Create your account in seconds."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@petpals.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "New to PetPals?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-semibold text-primary hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
