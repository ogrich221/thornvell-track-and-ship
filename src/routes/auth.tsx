import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DashboardShell, GlassCard, glassField, TabBar } from "@/components/portal/DashboardShell";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Customer Login — Thornvell Logistics" },
      { name: "description", content: "Sign in or register for the Thornvell Logistics customer portal to manage shipments and quotes." },
      { property: "og:title", content: "Customer Login — Thornvell Logistics" },
      { property: "og:description", content: "Access your Thornvell Logistics customer portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "register" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && navigate({ to: "/portal", replace: true }));
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/portal" });
      } else if (mode === "register") {
        if (f.password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: { emailRedirectTo: `${window.location.origin}/portal`, data: { full_name: f.fullName, company: f.company, phone: f.phone } },
        });
        if (error) throw error;
        setMsg("Check your email and click the confirmation link to activate your account.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(f.email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMsg("If an account exists for that email, a password reset link is on its way.");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell eyebrow="Customer Portal" title="Your logistics, in one place." intro="Sign in to manage shipments, follow delivery progress and review your quote requests.">
      <GlassCard className="mx-auto max-w-md">
        {mode !== "forgot" && (
          <TabBar tabs={[{ id: "signin", label: "Sign in" }, { id: "register", label: "Register" }]} value={mode} onChange={(m) => { setMode(m); setMsg(null); }} />
        )}
        {mode === "forgot" && <h2 className="mb-4 text-lg font-bold">Reset your password</h2>}
        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === "register" && (
            <>
              <L label="Full name"><input name="fullName" required autoComplete="name" className={glassField} /></L>
              <div className="grid gap-4 sm:grid-cols-2">
                <L label="Company (optional)"><input name="company" autoComplete="organization" className={glassField} /></L>
                <L label="Phone (optional)"><input name="phone" type="tel" autoComplete="tel" className={glassField} /></L>
              </div>
            </>
          )}
          <L label="Email"><input name="email" type="email" required autoComplete="email" className={glassField} /></L>
          {mode !== "forgot" && (
            <L label="Password"><input name="password" type="password" required minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "register" ? "new-password" : "current-password"} className={glassField} /></L>
          )}
          <Button type="submit" variant="gold" size="xl" disabled={busy}>
            {busy && <Loader2 className="animate-spin" />}
            {mode === "signin" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
          </Button>
          {msg && <p role="status" className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm">{msg}</p>}
          <button type="button" onClick={() => { setMode(mode === "forgot" ? "signin" : "forgot"); setMsg(null); }} className="text-sm text-gold hover:underline">
            {mode === "forgot" ? "Back to sign in" : "Forgot your password?"}
          </button>
        </form>
      </GlassCard>
    </DashboardShell>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
