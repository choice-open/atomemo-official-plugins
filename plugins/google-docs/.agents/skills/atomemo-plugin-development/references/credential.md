# Credential Development Guide

Credentials define authentication information for third-party services such as API keys,
base URLs, OAuth2 tokens, and client secrets.

They serve two distinct roles:

- **Model authentication**: `authenticate()` runs and returns adapter config for LLM calls
- **Tool authorization**: Raw credential fields are passed to `args.credentials`

## File Location

```
src/credentials/<credential-name>.ts
```

## Complete Example (API Key for both Model and Tool use)

```typescript
import type { CredentialDefinition } from "@choiceopen/atomemo-plugin-sdk-js/types"
import { t } from "../i18n/i18n-node"

export const openaiCredential = {
  name: "openai-api-key",
  display_name: t("OPENAI_CREDENTIAL_DISPLAY_NAME"),
  description: t("OPENAI_CREDENTIAL_DESCRIPTION"),
  icon: "🔑",
  parameters: [
    {
      name: "api_key",
      type: "string",
      required: true,
      display_name: t("API_KEY_DISPLAY_NAME"),
      ui: {
        component: "input",
        sensitive: true,
        placeholder: t("API_KEY_PLACEHOLDER"),
        hint: t("API_KEY_HINT")
      }
    },
    {
      name: "base_url",
      type: "string",
      required: false,
      display_name: t("BASE_URL_DISPLAY_NAME"),
      default: "https://api.openai.com/v1",
      ui: { component: "input" }
    }
  ],
  async authenticate({ args: { credential, extra } }) {
    const model = extra.model ?? "gpt-4"

    return {
      adapter: "openai",
      api_key: credential.api_key ?? "",
      endpoint: credential.base_url || "https://api.openai.com/v1",
      model,
      headers: {
        Authorization: `Bearer ${credential.api_key}`
      }
    }
  }
} satisfies CredentialDefinition
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier; referenced by `credential_name` in tool parameters |
| `display_name` | I18nText | User-facing name |
| `description` | I18nText | Explains what service this credential connects to |
| `icon` | string | Emoji or image URL |
| `parameters` | Property[] | Fields the user fills in (API keys, URLs, etc.) |
| `authenticate` | async function | Returns adapter config for model credentials |

## The `authenticate()` Function

Called only when the credential is used with a Model (not a Tool).
Returns an object that tells Atomemo how to call the LLM API:

```typescript
async authenticate({ args: { credential, extra } }) {
  return {
    adapter: "openai",      // "openai" | "anthropic" | "google_ai" | "deepseek"
    endpoint: "https://api.openai.com/v1",
    headers: {
      Authorization: `Bearer ${credential.api_key}`
    }
  }
}
```

## Supported Adapters

| Adapter | Use for |
|---------|---------|
| `"openai"` | OpenAI API and compatible endpoints |
| `"anthropic"` | Anthropic Claude API |
| `"google_ai"` | Google Gemini API |
| `"deepseek"` | DeepSeek API |

## Using Credentials in Tools

When a tool needs a credential, declare a `credential_id` parameter:

```typescript
// In your tool's parameters array:
{
  name: "api_credential",
  type: "credential_id",
  required: true,
  display_name: t("API_CREDENTIAL_LABEL"),
  credential_name: "openai-api-key"   // must match the CredentialDefinition's name
}
```

Access in `invoke`:
```typescript
async invoke({ args }) {
  const cred = args.credentials["api_credential"]
  // cred contains all fields from the credential's parameters:
  const apiKey = cred.api_key
  const baseUrl = cred.base_url
}
```

Note: `authenticate()` is NOT called here. Raw credential fields flow directly.

## OAuth2 Credentials

If a provider uses OAuth2, set `oauth2: true` and include the required storage fields:

- `access_token` (`encrypted_string`)
- `refresh_token` (`encrypted_string`)
- `expires_at` (`integer`)

You must also implement:

1. `oauth2_build_authorize_url`
2. `oauth2_get_token`
3. `oauth2_refresh_token`

Those functions are responsible for the provider-specific authorization flow.

## Security Best Practices

- Mark sensitive fields with `sensitive: true` — they'll be masked in the UI
- Never hardcode API keys in source code
- Use credentials for all authentication tokens, passwords, and secret keys
- The credential system ensures keys are stored and transmitted securely

## Registration in index.ts

```typescript
import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { openaiCredential } from "./credentials/openai-api-key"

const plugin = await createPlugin({ /* ... */ })
plugin.addCredential(openaiCredential)
plugin.run()
```
