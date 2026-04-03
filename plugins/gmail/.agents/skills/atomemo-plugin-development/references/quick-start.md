# Quick Start with Plugin Development

## Prerequisites

- Familiarity with TypeScript/JavaScript basics
- Node.js v20+ (Bun recommended for local plugin development)
- Git v2+
- A registered Atomemo account

## Step 1: Install the Command Line Tool

```bash
npm install @choiceopen/atomemo-plugin-cli --global
atomemo --version
```

## Step 2: Initialize Your Project

### 1. Login to Your Account

```bash
atomemo auth login
```

This uses a browser-based device authorization flow.

### 2. Create Your Project

```bash
atomemo plugin init
```

For non-interactive automation:

```bash
atomemo plugin init --no-interactive \
  -n <plugin-name> \
  -d "<description>" \
  -l typescript
```

When a valid `--name` flag is present, the CLI automatically switches to
non-interactive mode even without `--no-interactive`.

### 3. Project Structure Overview

```text
<plugin-name>/
├── src/
│   ├── index.ts
│   ├── tools/
│   ├── models/
│   ├── credentials/
│   └── i18n/
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## Step 3: Connect and Debug

### 1. Get Debug Credentials

```bash
cd <plugin-name>
atomemo plugin refresh-key
```

This updates `.env` with the current debug credentials, including `HUB_DEBUG_API_KEY`
and the correct `HUB_WS_URL`.

### 2. Start the Development Workflow

```bash
bun install
bun run dev
```

`bun run dev` rebuilds the plugin continuously, but it does not connect to Plugin Hub.

### 3. Connect to Plugin Hub

```bash
bun run ./dist
```

When the connection succeeds, you'll see an `ok` response in the terminal.

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

## Dev Key Expiry

The debug credentials expire after **24 hours**. If you see auth errors, refresh them:

```bash
atomemo plugin refresh-key
```

## Next Steps

After the project is set up, continue with:

- Add a Tool → see `tool-plugin.md`
- Add a Model → see `model-plugin.md`
- Add Credentials → see `credential.md`
- Understand lifecycle and architecture → see `core-concepts.md`
- Learn the parameter system → see `declarative-parameters.md`
