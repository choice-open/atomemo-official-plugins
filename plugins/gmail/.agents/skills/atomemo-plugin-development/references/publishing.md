# Publishing Your Plugin

## Pre-Publishing Checklist

Before submitting, verify:

1. **Metadata** — `package.json` has accurate `name`, `version`, `description`, and `author`
2. **Plugin definition consistency** — metadata used by `createPlugin()` matches package metadata
3. **Code quality** — no lint errors and no leftover debug code
4. **Security** — no hardcoded API keys or secrets; use Credentials instead
5. **README** — clear explanation of what the plugin does and how to configure it
6. **Release script** — use the release script before submitting

## Build for Release

```bash
bun run release
```

This single command:
- validates artifacts and metadata
- builds and bundles the plugin
- syncs version numbers automatically

Do not manually edit build artifacts.

## Submission Steps

### Step 1: Fork the official plugins repository

Go to: https://github.com/choice-open/atomemo-official-plugins

Fork it to your account.

### Step 2: Add your plugin

Clone your fork, then add your plugin directory:

```
atomemo-official-plugins/
└── plugins/
    └── your-plugin-name/       ← add this directory
        ├── package.json
        ├── src/
        │   ├── index.ts
        │   ├── tools/
        │   ├── models/
        │   └── credentials/
        └── README.md
```

### Step 3: Submit a Pull Request

- **Title format**: `feat(plugin): add <your-plugin-name>`
- **Description**: Brief overview of what the plugin does

### Step 4: Automated Review

GitHub Actions runs: Lint → Build → Manifest validation.

Once automated checks pass and the team reviews, your PR merges and the plugin
becomes discoverable in the Atomemo marketplace.

## Updating a Published Plugin

1. Update the version in `package.json`
2. Update the plugin implementation
3. Run `bun run release`
4. Submit a new PR with the updated plugin directory

The marketplace detects new versions automatically after merge.
