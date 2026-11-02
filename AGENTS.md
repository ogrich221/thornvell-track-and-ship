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
