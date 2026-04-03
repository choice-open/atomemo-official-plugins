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
- Configuring Parameters → `references/declarative-parameters.md`
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
bun run dev
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

### Step 5: Declarative parameters and file handling

Use declarative parameters for user input and configuration. Start with:

- `references/declarative-parameters.md`
- `references/declarative-parameters-examples.md`

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

`bun run dev` rebuilds in watch mode. `bun run ./dist` creates the actual Hub connection.

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
| `references/core-concepts.md` | Architecture, manifest, lifecycle |
| `references/tool-plugin.md` | Building Tool plugins |
| `references/model-plugin.md` | Building Model plugins |
| `references/credential.md` | Defining credentials |
| `references/declarative-parameters.md` | Parameter types and UI config |
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
