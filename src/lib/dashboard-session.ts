import { supabase } from "@/integrations/supabase/client";
import { dashboardPath } from "./dashboard-access";

export async function getDashboardPath(userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error("Could not check dashboard access. Please try again.");
  return dashboardPath(data === true);
}