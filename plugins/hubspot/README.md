# Atomemo Plugin - hubspot

HubSpot is currently scaffold-only. This package establishes the Atomemo plugin structure, metadata, i18n, and tests before any real HubSpot credentials or API operations are implemented.

## Current State

- No real HubSpot API calls are implemented yet.
- No credentials are configured yet.
- No models are included in this first pass.
- The only public tool is `hubspot-plugin-status`.

## Placeholder Tool

`hubspot-plugin-status` is a wiring and installation verification tool. It returns stable scaffold metadata so we can confirm the plugin loads correctly without pretending to support live HubSpot actions.

## Planned Scope

The intended future resource coverage mirrors the local n8n HubSpot V2 node as a planning reference:

- `contact`
- `company`
- `contactList`
- `deal`
- `engagement`
- `ticket`

The likely future auth directions are OAuth2 and private app token support, but neither is implemented in this scaffold.

## Development

- Install dependencies:

```bash
bun install
```

- Run the unit tests:

```bash
bun run test
```

- Build the library:

```bash
bun run build
```

- Run the type checker:

```bash
bun run typecheck
```
