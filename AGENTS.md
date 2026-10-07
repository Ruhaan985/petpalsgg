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

- Keep purchasable book IDs and prices synchronized between the browser product catalog and the server-safe price module, with concrete price tests; payment validation must match the displayed cart total.
- Use the shared product catalog for collection, detail, cart and enquiry entries so new books are available throughout the existing purchase flow.
- Product route loaders return only serializable identifiers, not catalog objects with React icons; resolve presentation objects within the component and head callback.
- Use Node's test/assert interfaces for small Bun-run price tests so tests require no additional type packages.
- Keep the opening film in a dedicated component with session-scoped playback, skip and sound controls; preserve its framing and bypass automatic motion for reduced-motion users.
