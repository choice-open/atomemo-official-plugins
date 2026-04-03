# Model Plugin Development Guide

Model plugins describe LLMs to the Atomemo platform: capabilities, supported input and
output modalities, pricing, and parameter constraints. They do not implement the LLM
itself. Instead, they tell Atomemo how to present and route a model.

## File Location

```
src/models/<model-name>.ts
```

## Complete Example

```typescript
import type { ModelDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const openaiGpt4o = {
  name: "openai/gpt-4o",
  display_name: t("GPT4O_DISPLAY_NAME"),
  description: t("GPT4O_DESCRIPTION"),
  icon: "🔷",
  model_type: "llm",
  input_modalities: ["text", "image"],
  output_modalities: ["text"],
  override_parameters: {
    temperature: {
      default: 1.0,
      maximum: 2.0,
      minimum: 0.0,
    },
  },
  pricing: {
    currency: "USD",
    input: 0.0025,
    output: 0.01,
  },
  unsupported_parameters: ["seed", "verbosity"],
} satisfies ModelDefinition
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique system identifier — `provider/model_name` format |
| `display_name` | I18nText | User-facing name |
| `description` | I18nText | Short description |
| `icon` | string | Emoji or image URL |
| `model_type` | `"llm"` | Fixed value; only `"llm"` is supported currently |
| `input_modalities` | string[] | What the model can receive: `"text"`, `"image"`, `"file"` |
| `output_modalities` | string[] | What the model can produce: `"text"` |

## Optional Fields

### `override_parameters`
Customize default values and allowed ranges for standard LLM parameters:
```typescript
override_parameters: {
  temperature: { default: 0.7, minimum: 0.0, maximum: 1.0 },
  max_tokens: { default: 2048, maximum: 8192 },
}
```

### `pricing`
Omit for free/self-hosted models. Per 1K tokens:
```typescript
pricing: {
  currency: "USD",
  input: 0.001,   // cost per 1K input tokens
  output: 0.002,  // cost per 1K output tokens
}
```

### `unsupported_parameters`
List parameters that don't apply to this model — they'll be hidden in the UI:
```typescript
unsupported_parameters: [
  "endpoint",
  "seed",
  "stream",
  "structured_outputs",
  "parallel_tool_calls",
  "verbosity",
]
```

## Model Name Format

The `name` field is the system identifier and must be globally unique:
- Format: `provider/model_name`
- Length: 4–64 characters
- Allowed: alphanumeric, underscore, hyphen, forward slash
- Examples: `openai/gpt-4o`, `anthropic/claude-3-5-sonnet`, `my-company/custom-model`

## Input Modalities

| Value | Meaning |
|-------|---------|
| `"text"` | Text input (always include) |
| `"image"` | Vision capability (images in context) |
| `"file"` | File/document input |

## Connecting Models to Credentials

Model plugins typically need a credential to authenticate against the LLM provider's API.
The credential's `authenticate()` function returns the adapter config that Atomemo uses
to route API calls. See `credential.md` for how to set this up.

## Registration in index.ts

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiGpt4o } from "./models/openai-gpt4o"
import { openaiGpt4oMini } from "./models/openai-gpt4o-mini"

const plugin = await createPlugin({ /* ... */ })
plugin.addModel(openaiGpt4o)
plugin.addModel(openaiGpt4oMini)
plugin.run()
```

## Common Patterns

### Provider package (multiple models, one credential)

```typescript
// models/gpt-4o.ts
export const gpt4o = { name: "openai/gpt-4o", /* ... */ } satisfies ModelDefinition

// models/gpt-4o-mini.ts
export const gpt4oMini = { name: "openai/gpt-4o-mini", /* ... */ } satisfies ModelDefinition

// credentials/openai-key.ts
export const openaiKey = { name: "openai-api-key", /* ... authenticate() */ } satisfies CredentialDefinition

// index.ts
plugin.addModel(gpt4o)
plugin.addModel(gpt4oMini)
plugin.addCredential(openaiKey)
```
