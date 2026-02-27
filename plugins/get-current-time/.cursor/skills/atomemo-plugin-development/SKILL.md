---
name: atomemo-plugin-development
description: Build and troubleshoot Atomemo plugins using the official development docs. Use when the user asks about Atomemo plugin setup, tool/model/credential definitions, declarative parameters, local debugging, or publishing plugins.
---

# Atomemo Plugin Development

Use this skill to implement or debug Atomemo plugins with consistent patterns from the official docs.

## Upstream Source

- Original repository: <https://github.com/choice-open/atomemo-docs>
- Source directory used for this skill: <https://github.com/choice-open/atomemo-docs/tree/main/en/plugins/development>
- References in this skill point to upstream online docs directly.

## Scope

- Plugin project setup and local development loop
- Tool, model, and credential definitions
- Declarative parameter schema and UI mapping
- Publishing readiness and release checklist

## Quick Workflow

1. Confirm environment and scaffold:
   - Node.js 20+ (Bun recommended)
   - `npm install @choiceopen/atomemo-plugin-cli --global`
   - `atomemo auth login`
   - `atomemo plugin init`
2. Prepare debug key and run locally:
   - `atomemo plugin refresh-key` (key valid ~24h)
   - Install deps and build/watch (`bun install`, `bun run dev`)
   - Start compiled plugin (`bun run ./dist`)
3. Implement plugin features:
   - Add tools in `src/tools/` and register with `plugin.addTool(...)`
   - Add models in `src/models/` and register with `plugin.addModel(...)`
   - Add credentials in `src/credentials/` and register with `plugin.addCredential(...)`
4. Validate before publish:
   - Remove debug logging
   - No hardcoded secrets
   - Run release script (`bun run release`)
   - Ensure metadata/version consistency in `package.json` and plugin definition

## Implementation Rules

- Prefer TypeScript and exported typed definitions (`satisfies ToolDefinition`, `ModelDefinition`, `CredentialDefinition`).
- Keep `name` fields unique and convention-safe (ASCII letters/numbers with supported separators).
- Return JSON-serializable values from tool `invoke`.
- Use credential mechanisms for all secrets; do not embed API keys in source.
- For parameter-heavy tools, use declarative schema first; avoid ad hoc parsing logic.

## Parameter Design Defaults

- Use smallest workable schema first (`string`, `number`, `boolean`) before composite types.
- Use `credential_id` for third-party auth selection.
- Use `discriminated_union` when UI/inputs vary by mode.
- Use `display.show`/`display.hide` for conditional fields instead of runtime branching in UI logic.
- Enable `ui.support_expression` only where runtime variable interpolation is useful.

## Troubleshooting Heuristics

- If Hub connection fails with validation errors (for example Zod errors), inspect manifest and naming fields first.
- If auth starts failing during debug sessions, refresh development key and restart local runtime.
- If a tool cannot call a protected API, verify credential wiring in both parameter definition and `invoke` access path.

## Reference Docs

- Core concepts: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/core-concepts.md>
- Quick start: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/quick-start.md>
- Tool development: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/tool.md>
- Model development: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/model.md>
- Credential development: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/credential.md>
- Declarative parameters reference: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/declarative-parameters.md>
- Publishing guide: <https://github.com/choice-open/atomemo-docs/blob/main/en/plugins/development/publishing.md>

## When To Open Which Reference

- Building first plugin or fixing local setup: open Quick Start URL above.
- Understanding host/Hub/plugin architecture: open Core Concepts URL above.
- Defining tool I/O and invoke behavior: open Tool Development URL above.
- Registering LLM models and pricing/modalities: open Model Development URL above.
- Adding API keys/tokens securely: open Credential Development URL above.
- Complex forms (conditional UI, arrays, unions): open Declarative Parameters URL above.
- Marketplace release process: open Publishing Guide URL above.
