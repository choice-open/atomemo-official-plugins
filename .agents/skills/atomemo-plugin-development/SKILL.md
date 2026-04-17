---
name: atomemo-plugin-development
description: >
  Use this skill for all Atomemo plugin development work. It captures the current
  Atomemo CLI workflow, SDK/runtime behavior, declarative parameter system, and
  publishing process. Invoke it whenever the user asks about creating a plugin,
  adding tools/models/credentials, handling files with context.files, defining
  parameters and UI, connecting to Plugin Hub, or publishing to the marketplace.
  Do NOT invoke for non-Atomemo plugin ecosystems such as VS Code, Chrome,
  Obsidian, Figma, Raycast, or generic npm package publishing.
---

# Atomemo Plugin Development

You are helping a developer build an Atomemo plugin. Atomemo plugins extend the
platform with:

- **Tools**: External API wrappers or local functions
- **Models**: LLM definitions with capabilities, pricing, and parameter overrides
- **Credentials**: Secure authentication definitions used by tools and models

## Architecture Overview

```plain
Host (Atomemo App)
      ↕
  Plugin Hub          ← secure intermediary for lifecycle + message routing
      ↕
  Your Plugin         ← SDK + your business logic
```

- **Plugin Hub** decouples the host and plugin and handles communication security
- **SDK** (`@choiceopen/atomemo-plugin-sdk-js`) provides `createPlugin`, runtime context, file helpers, schemas, and type-safe plugin definitions
- **CLI** (`@choiceopen/atomemo-plugin-cli`) scaffolds projects and manages auth plus debug setup

Read `references/core-concepts.md` first when the developer needs architectural context.

## Main Component Types

| Type | Purpose | Source directory |
| ---- | ------- | ---------------- |
| **Tool** | Invokes third-party services or local business logic | `src/tools/` |
| **Model** | Declares an LLM and its capabilities | `src/models/` |
| **Credential** | Collects and transforms authentication data | `src/credentials/` |

A single plugin can contain multiple tools, models, and credentials.

## Identify the Scenario

**Scenario A — New project from scratch:**
Read:

1. `references/quick-start.md`
2. `references/core-concepts.md`
3. The relevant implementation guides below

**Scenario B — Adding to an existing project:**
Read the relevant guide directly:

- Adding a Tool → `references/tool-plugin.md`
- Adding a Model → `references/model-plugin.md`
- Adding Credentials → `references/credential.md`
- Configuring Parameters → `references/declarative-parameters.md`, then load the specific sub-page(s) it points to for the task at hand
- Understanding `context.files` → `references/tool-plugin.md`

**Scenario C — Publishing:**
Read `references/publishing.md`.

---

## Workflow

### Step 1: Clarify intent

Determine:

1. Is this a new plugin or an existing plugin?
2. Does it need tools, models, credentials, or some combination?
3. Does it need file input/output (`file_ref`) handling?
4. Does it need advanced declarative parameters such as `resource_locator` or `resource_mapper`?
5. Is TypeScript acceptable? It is the recommended and best-supported path.

### Step 2: Verify the Atomemo CLI

Before running `atomemo` commands, check whether the CLI is installed:

```bash
atomemo --version
```

If missing, install it:

```bash
npm install @choiceopen/atomemo-plugin-cli --global
```

If you need to compare against the latest published CLI:

```bash
atomemo --version
npm view @choiceopen/atomemo-plugin-cli version
```

Only upgrade after confirming with the user:

```bash
npm install @choiceopen/atomemo-plugin-cli@latest --global
```

Checking versions is safe to automate. Installing or upgrading is not.

### Step 3: Set up the project (new projects only)

See `references/quick-start.md`. The normal sequence is:

```bash
atomemo auth login
atomemo plugin init
cd <plugin-name>
atomemo plugin refresh-key
bun install
```

Then in **two separate terminals**:

```bash
# Terminal 1 — watch mode (rebuilds on save, does NOT connect to Hub)
bun run dev
```

```bash
# Terminal 2 — connects to Plugin Hub
bun run ./dist
```

### Step 4: Implement plugin components

Create definitions in the appropriate directories and register them in `src/index.ts`.

Typical project layout:

```plain
src/
  index.ts
  tools/
  models/
  credentials/
  i18n/
```

Registration pattern:

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { myTool } from "./tools/my-tool"
import { myModel } from "./models/my-model"
import { myCredential } from "./credentials/my-credential"

const plugin = await createPlugin({ /* manifest fields */ })
plugin.addTool(myTool)
plugin.addModel(myModel)
plugin.addCredential(myCredential)
plugin.run()
```

For `createPlugin(...)` metadata, do **not** invent a brand-new manifest shape from memory.
Open the existing `src/index.ts` first and preserve the scaffolded structure unless the
developer explicitly wants to change plugin metadata. Keep the metadata used by
`createPlugin(...)` aligned with `package.json` and README details; see
`references/core-concepts.md` for entrypoint guidance and `references/publishing.md`
for the metadata consistency requirement.

### Step 5: Declarative parameters and file handling

Use declarative parameters for user input and configuration. Start with:

- `references/declarative-parameters.md` — index only; read this to find the right sub-page, then load the specific sub-file(s) you need
- `references/declarative-parameters-overview-and-core-concepts.md` — load this alongside the index for foundational knowledge
- `references/declarative-parameters-examples.md`

Then load the focused page that matches the question:

- Need allowed `type` values or plugin-type support → `references/declarative-parameters-property-type-overview.md`
- Need common schema keys such as `required`, `display`, `ui`, `depends_on`, or `decoder` → `references/declarative-parameters-property-base.md`
- Need the full definition of a scalar, object, array, or special property type → the matching basic/composite/special type page
- Need UI component names or default rendering behavior → `references/declarative-parameters-property-ui-reference.md` and `references/declarative-parameters-default-ui-behavior.md`
- Need dynamic visibility rules → `references/declarative-parameters-display-condition.md`
- Need Tool-only remote selection or mapping flows → `references/declarative-parameters-resource-locator.md` and `references/declarative-parameters-resource-mapper.md`
- Need examples to adapt quickly → `references/declarative-parameters-examples.md`

When a tool handles files, use `context.files` helpers instead of manually treating
file references as plain JSON.

### Step 6: Internationalization

All user-facing strings support i18n. Prefer the `t()` helper:

```typescript
import { t } from "../i18n/i18n-node"

display_name: t("WEATHER_TOOL_DISPLAY_NAME"),
description: t("WEATHER_TOOL_DESCRIPTION"),
```

### Step 7: Test locally

```bash
bun run build
bun run ./dist
```

`bun run dev` rebuilds in watch mode **but does not connect to Plugin Hub** — run it in a separate terminal from `bun run ./dist`, which creates the actual Hub connection.

### Step 8: Publish (when ready)

See `references/publishing.md`. Key steps:

1. `bun run release` — validates, builds, syncs versions
2. Fork `atomemo-official-plugins` repo
3. Add plugin to `plugins/<your-plugin-name>/`
4. Open PR with title `feat(plugin): add <your-plugin-name>`

---

## Reference Files

Load these on demand based on what the developer needs:

| File | When to read |
| ---- | ----------- |
| `references/quick-start.md` | New project setup |
| `references/core-concepts.md` | Architecture, plugin entrypoint, metadata consistency, lifecycle |
| `references/tool-plugin.md` | Building Tool plugins |
| `references/model-plugin.md` | Building Model plugins |
| `references/credential.md` | Defining credentials |
| `references/declarative-parameters.md` | Parameter routing guide + TOC; use it to choose the correct focused reference page |
| `references/declarative-parameters-examples.md` | Ready-to-copy parameter examples |
| `references/publishing.md` | Publishing to the marketplace |

---

## CLI Automation

You can automate most CLI steps except the browser-based login flow.

Safe commands to run automatically:

```bash
atomemo --version
npm view @choiceopen/atomemo-plugin-cli version
atomemo plugin init --no-interactive -n <plugin-name> -d "<description>" -l typescript
atomemo plugin refresh-key
bun install
bun run build
bun run ./dist
```

Commands that require user action:

`atomemo auth login` uses a device authorization flow. You cannot automate it.
Guide the user through the browser verification step and wait for confirmation.

## Common Mistakes to Avoid

- Plugin names must match `/^[a-z][a-z0-9_-]{2,62}[a-z0-9]$/`
- Never hardcode secrets
- Model names should follow `provider/model_name`
- Debug API keys expire; refresh with `atomemo plugin refresh-key`
- Tools that handle files should use `context.files`
- Every tool, model, and credential must be registered in `src/index.ts`
