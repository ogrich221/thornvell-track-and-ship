export function dashboardPath(isAdmin: boolean): "/admin" | "/portal" {
  return isAdmin ? "/admin" : "/portal";
}