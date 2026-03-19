# Quick Start: New Plugin Project

## Prerequisites

- Node.js v20+
- Git v2+
- A registered Atomemo account (at <https://atomemo.ai>)
- Familiarity with TypeScript/JavaScript

## Installation

```bash
npm install @choiceopen/atomemo-plugin-cli --global
atomemo --version   # verify installation
```

## Create a New Plugin Project

### Step 1: Authenticate (user must run this — never run it yourself)

**Do not run `atomemo auth login` on the user's behalf.** It blocks waiting for
browser interaction and will fail or hang in any automated context.

Instead:

1. Ask the user to run:

   ```bash
   atomemo auth login
   ```

2. Tell them: the command prints a verification URL and a short code — they must
   open the URL in their browser and enter the code to approve the device.
3. Wait for the user to confirm they've completed the browser step.
4. Then verify the session yourself:

   ```bash
   atomemo auth status
   ```

### Step 2: Initialize project

**Interactive mode** (prompts for each field):

```bash
atomemo plugin init
```

**Non-interactive mode** (all flags provided — can be run automatically):

```bash
atomemo plugin init --no-interactive \
  -n <plugin-name> \
  -d "<description>" \
  -l typescript
```

When a valid `--name` flag is present, the CLI automatically switches to
non-interactive mode even without `--no-interactive`.

### Step 3: Install dependencies and set up dev key

```bash
cd <plugin-name>
atomemo plugin refresh-key   # generates .env with debug API key (expires 24h)
bun install
bun run build
bun run ./dist               # connects to Plugin Hub
```

All of these commands are non-interactive and can be run automatically.

## Naming Rules

Plugin names must match: `/^[a-z][a-z0-9_-]{2,62}[a-z0-9]$/`

- **Lowercase only** — no uppercase letters
- Length: 4–64 characters
- Allowed characters: lowercase letters, digits, underscores, hyphens
- Must start with a lowercase letter (not a digit or special character)
- Must end with a lowercase letter or digit (not `_` or `-`)
- No consecutive special characters (`--` or `__` is invalid)

Valid: `my-plugin`, `weather-lookup`, `openai-models`
Invalid: `My-Plugin` (uppercase), `my--plugin` (consecutive hyphens), `plugin-` (ends with `-`)

## Generated Project Structure

```plain
<plugin-name>/
├── src/
│   ├── index.ts          ← main entry point
│   ├── tools/            ← tool definitions go here
│   ├── models/           ← model definitions go here
│   ├── credentials/      ← credential definitions go here
│   └── i18n/             ← translation files (SDK-managed)
├── package.json
├── tsconfig.json
└── .env                  ← auto-generated, contains debug API key (already in .gitignore — never commit)
```

## Running Locally

```bash
bun run build     # build the plugin
bun run ./dist    # connect to Plugin Hub
```

`bun run dev` is watch/rebuild mode only — it does **not** connect to the Hub.

To iterate quickly:

```bash
bun run build && bun run ./dist
```

A successful connection to the Plugin Hub shows:

```plain
status: ok, response: { success: true }
```

## Dev Key Expiry

The debug API key in `.env` expires after **24 hours**. If you see auth errors, refresh it:

```bash
atomemo plugin refresh-key
```

## Next Steps

After the project is set up:

- Add a Tool → see `tool-plugin.md`
- Add a Model → see `model-plugin.md`
- Add Credentials → see `credential.md`
