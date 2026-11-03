<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Site content (services, industries, contact placeholders) lives in `src/lib/site.ts`; empty contact values render as "To be confirmed" so no fake details ship.
- Enquiries and tracking go through server functions in `src/lib/*.functions.ts` using the admin client; tables have RLS on with no public policies so browsers cannot read submissions.
- Tracking only shows data from the `shipments`/`shipment_events` tables; it never fabricates statuses.
- Roles live in `user_roles` (checked via `has_role`); the first account ever registered is made admin by the signup trigger, so staff bootstrap needs no manual SQL.
- Admin writes go through `src/lib/admin.functions.ts` (auth middleware + has_role check, then admin client); customer reads use the browser client under RLS (own rows only).
- Shipment updates queue rows in `notifications` (status pending) only for real recorded events; an email sender should consume these once a sending domain exists, and SMS/WhatsApp reuse the same table via `channel`.
- Dashboards use the shared glass shell in `src/components/portal/DashboardShell.tsx`.
- Account screens have their own branded navigation and omit the public site header/footer; dashboard sections use the shared desktop sidebar/mobile tab navigation.
- Sign-in, password reset, and header navigation use shared role-based dashboard destinations; admins enter operations directly while customers enter the portal, with server authorization retained for all staff features.

- Sitemap URLs derive from router staticData.sitemap decisions; exclude the authenticated subtree, account flows, and unfinished legal placeholders so new pages require an explicit discovery decision.
