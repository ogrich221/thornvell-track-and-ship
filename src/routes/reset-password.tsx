import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DashboardShell, GlassCard, glassField } from "@/components/portal/DashboardShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password — Thornvell Logistics" },
      { name: "description", content: "Choose a new password for your Thornvell Logistics customer account." },
      { property: "og:title", content: "Reset Password — Thornvell Logistics" },
      { property: "og:description", content: "Choose a new password for your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as { password: string; confirm: string };
    if (f.password.length < 8) return setErr("Password must be at least 8 characters.");
    if (f.password !== f.confirm) return setErr("Passwords do not match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: f.password });
    setBusy(false);
    if (error) return setErr(error.message);
    toast.success("Password updated");
    navigate({ to: "/portal" });
  }

  return (
    <DashboardShell eyebrow="Account security" title="Set a new password">
      <GlassCard className="mx-auto max-w-md">
        <form onSubmit={onSubmit} className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium">New password<input name="password" type="password" required autoComplete="new-password" className={glassField} /></label>
          <label className="grid gap-1.5 text-sm font-medium">Confirm password<input name="confirm" type="password" required autoComplete="new-password" className={glassField} /></label>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <Button type="submit" variant="gold" size="xl" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Update password</Button>
        </form>
      </GlassCard>
    </DashboardShell>
  );
}
