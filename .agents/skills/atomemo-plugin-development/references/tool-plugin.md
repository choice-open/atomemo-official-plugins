# Tool Plugin Development Guide

Tools are third-party service integrations or local functions that Atomemo can invoke.
Typical examples include web search, image generation, data processing, messaging,
or file transformation.

## File Location

```
src/tools/<tool-name>.ts
```

## Complete Example

Always use `t()` for user-facing strings so translations stay centralized in `src/i18n/`.

```typescript
import type { ToolDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const weatherTool = {
  name: "weather-lookup",
  display_name: t("WEATHER_TOOL_DISPLAY_NAME"),
  description: t("WEATHER_TOOL_DESCRIPTION"),
  icon: "🌤️",
  parameters: [
    {
      name: "location",
      type: "string",
      required: true,
      display_name: t("LOCATION_DISPLAY_NAME"),
      ui: {
        component: "input",
        hint: t("LOCATION_HINT"),
        placeholder: t("LOCATION_PLACEHOLDER"),
        support_expression: true,
        width: "full"
      }
    }
  ],
  async invoke({ args, context }) {
    const { parameters } = args
    const location = parameters.location

    const result = await fetchWeather(location)
    return {
      temperature: result.temp,
      condition: result.sky,
    }
  }
} satisfies ToolDefinition
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier within the plugin |
| `display_name` | I18nText | User-facing name |
| `description` | I18nText | Short description of what the tool does |
| `icon` | string | Emoji or image URL |
| `parameters` | Property[] | Input parameter definitions |
| `invoke` | async function | Business logic; receives `{ args, context }`, returns result |

## The `invoke` Function

```typescript
async invoke({ args, context }) {
  const { parameters, credentials } = args

  // parameters: object matching your declared parameter schema
  // credentials: credential objects keyed by credential_id field name
  // context: SDK runtime helpers, including context.files

  return { /* JSON-serializable result */ }
}
```

The return value is passed back to the Atomemo workflow as the tool's output.
Return anything JSON-serializable: objects, arrays, strings, numbers.

If you want the workflow node to be marked as failed, throw a JavaScript `Error`.
Returning `{ error: "..." }` will not produce an errored node state.

## Using Credentials in Tools

When your tool needs an API key or token, declare a `credential_id` parameter:

```typescript
parameters: [
  {
    name: "api_credential",
    type: "credential_id",
    required: true,
    display_name: t("API_CREDENTIAL_DISPLAY_NAME"),
    credential_name: "my-api-credential"  // matches the credential's name field
  },
  { name: "query", type: "string", required: true, /* ... */ }
]
```

Then access in `invoke`:
```typescript
async invoke({ args }) {
  const cred = args.credentials["api_credential"]
  const apiKey = cred.api_key   // field names from your CredentialDefinition
  // ...
}
```

See `credential.md` for how to define the credential itself.

## Working with `context.files`

When your tool accepts a `file_ref` parameter or returns a generated file, use the SDK's
file helpers instead of treating file references as untyped plain objects.

### Available helpers

- `context.files.parseFileRef(input)`
- `context.files.download(fileRef)`
- `context.files.attachRemoteUrl(fileRef)`
- `context.files.upload(fileRef, { prefixKey? })`

### Reading a file from parameters

```typescript
async invoke({ args, context }) {
  const fileRef = context.files.parseFileRef(args.parameters.file)
  const downloaded = await context.files.download(fileRef)

  return {
    filename: downloaded.filename,
    mime_type: downloaded.mime_type,
    size: downloaded.size,
  }
}
```

### Producing and returning a file

```typescript
async invoke({ context }) {
  const text = "hello"
  const fileRef = {
    __type__: "file_ref",
    source: "mem",
    filename: "report.txt",
    extension: ".txt",
    mime_type: "text/plain",
    size: Buffer.byteLength(text),
    content: Buffer.from(text).toString("base64"),
    res_key: null,
    remote_url: null,
  }

  return await context.files.upload(fileRef, { prefixKey: "reports/" })
}
```

This pattern keeps file handling compatible with Atomemo's storage and permissions model.

## Resource Locator and Resource Mapper

Tools can expose advanced parameter types:

- `resource_locator` for remote resource picking
- `resource_mapper` for schema-driven field mapping

See `declarative-parameters.md` and the linked focused references for details.

## Registration in index.ts

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { weatherTool } from "./tools/weather-lookup"

const plugin = await createPlugin({ /* ... */ })
plugin.addTool(weatherTool)
plugin.run()
```

## Multiple Tools

Register each tool separately:
```typescript
plugin.addTool(searchTool)
plugin.addTool(weatherTool)
plugin.addTool(imageGenTool)
```

## Parameter Configuration

For detailed parameter types, UI options, visibility rules, and advanced examples,
see `declarative-parameters.md`.

Quick reference for common patterns:

```typescript
// Text input
{ name: "query", type: "string", required: true,
  ui: { component: "input", support_expression: true } }

// Multi-line text
{ name: "prompt", type: "string",
  ui: { component: "textarea", width: "full" } }

// Dropdown selection
{ name: "format", type: "string",
  enum: ["json", "markdown", "plain"],
  ui: { component: "select" } }

// Number with range
{ name: "limit", type: "number", default: 10,
  minimum: 1, maximum: 100,
  ui: { component: "number-input" } }

// Boolean toggle
{ name: "include_metadata", type: "boolean", default: false,
  ui: { component: "switch" } }
```
