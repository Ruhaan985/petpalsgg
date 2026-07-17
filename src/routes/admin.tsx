import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { listEnquiries, setEnquiryStatus, listAccounts } from "@/lib/admin.functions";
import { toast } from "sonner";
import { ArrowLeft, Check, X, Mail, Phone, PawPrint, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ITEM_LABELS: Record<string, string> = {
  handbook: "PetPals Handbook",
  bowl: "Safe Eating Bowl",
};

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  pet_name: string | null;
  message: string | null;
  status: string;
  created_at: string;
  interested_items: string[] | null;
};

type Account = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
};

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"enquiries" | "accounts">("enquiries");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [busy, setBusy] = useState(false);

  const fetchEnquiries = useServerFn(listEnquiries);
  const fetchAccounts = useServerFn(listAccounts);
  const updateStatus = useServerFn(setEnquiryStatus);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user, loading, navigate]);

  const loadAll = async () => {
    setBusy(true);
    try {
      const [e, a] = await Promise.all([fetchEnquiries(), fetchAccounts()]);
      setEnquiries(e as Enquiry[]);
      setAccounts(a as Account[]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleStatus = async (id: string, status: "accepted" | "declined") => {
    try {
      await updateStatus({ data: { id, status } });
      setEnquiries((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
      toast.success(`Enquiry ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  if (loading || isAdmin === null) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-soft p-6 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-pop">
          <h1 className="font-display text-3xl font-bold">Not authorized</h1>
          <p className="mt-2 text-muted-foreground">You don't have admin access to this page.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">P</div>
            PetPals <span className="text-sm font-semibold text-secondary-foreground bg-secondary px-2 py-0.5 rounded-full ml-2">Admin</span>
          </Link>
          <button
            onClick={loadAll}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1">
          {(["enquiries", "accounts"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-bold capitalize transition ${
                tab === t ? "bg-primary text-primary-foreground shadow-pop" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t} {t === "enquiries" ? `(${enquiries.length})` : `(${accounts.length})`}
            </button>
          ))}
        </div>

        {tab === "enquiries" && (
          <div className="space-y-4">
            {enquiries.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
                No enquiries yet.
              </div>
            )}
            {enquiries.map((e) => (
              <div key={e.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg font-bold">{e.name}</h3>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase ${
                          e.status === "accepted"
                            ? "bg-success text-success-foreground"
                            : e.status === "declined"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {e.email}</span>
                      {e.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {e.phone}</span>}
                      {e.pet_name && <span className="inline-flex items-center gap-1"><PawPrint className="h-3.5 w-3.5" /> {e.pet_name}</span>}
                    </div>
                    {e.interested_items && e.interested_items.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {e.interested_items.map((it) => (
                          <span key={it} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium">
                            {ITEM_LABELS[it] ?? it}
                          </span>
                        ))}
                      </div>
                    )}
                    {e.message && <p className="mt-3 text-sm">{e.message}</p>}
                    <p className="mt-3 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(e.id, "accepted")}
                      disabled={e.status === "accepted"}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-pop hover:opacity-90 disabled:opacity-40"
                    >
                      <Check className="h-4 w-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleStatus(e.id, "declined")}
                      disabled={e.status === "declined"}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-bold hover:bg-muted disabled:opacity-40"
                    >
                      <X className="h-4 w-4" /> Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "accounts" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Last sign in</th>
                  <th className="px-4 py-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{a.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.last_sign_in_at ? new Date(a.last_sign_in_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {a.email_confirmed_at ? (
                        <span className="rounded-full bg-success px-2 py-0.5 text-xs font-bold text-success-foreground">Yes</span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">No</span>
                      )}
                    </td>
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">No accounts yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
