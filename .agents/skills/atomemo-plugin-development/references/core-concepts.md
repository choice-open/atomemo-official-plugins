# Core Concepts

Atomemo plugin development involves four pieces working together:

- **Host Service**: The Atomemo application itself
- **Plugin Hub**: The intermediary service that brokers communication
- **CLI**: The project scaffolding and debug setup tool
- **SDK**: The runtime and type system used inside your plugin

## Communication Model

```plain
Host Service
     ↕
 Plugin Hub
     ↕
 Your Plugin
```

The host never talks directly to your plugin. Plugin Hub handles routing, isolation,
and lifecycle messaging.

## What a Plugin Contains

A plugin can expose any combination of:

- **Tools** in `src/tools/`
- **Models** in `src/models/`
- **Credentials** in `src/credentials/`

All of them are registered from `src/index.ts`.

## Runtime Lifecycle

At startup, your plugin typically:

1. Loads i18n resources
2. Calls `createPlugin(...)`
3. Registers credentials, models, and tools
4. Calls `plugin.run()`

The SDK then connects to Plugin Hub and handles incoming messages for tool invocation,
credential auth, OAuth2 flows, resource locators, and resource mappers.

## File Handling

When tools receive or return files, the SDK exposes typed helpers through `context.files`.
Use these helpers instead of manually manipulating file references.

See `tool-plugin.md` for concrete examples.
