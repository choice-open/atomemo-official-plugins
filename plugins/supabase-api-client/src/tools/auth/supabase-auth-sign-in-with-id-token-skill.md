# Supabase Auth Sign In With ID Token Tool Documentation

## Tool

- **Name**: `supabase-auth-sign-in-with-id-token`
- **Purpose**: Exchanges a third-party ID token for a Supabase session.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `provider` | `string` | `true` | select | Built-in provider or `custom`. | "google" |
| `provider_custom` | `string` | `false` | input | Custom provider id when provider is `custom`. | "" |
| `token` | `string` | `true` | input | OIDC ID token (sensitive). | "eyJ…" |
| `access_token` | `string` | `false` | input | Optional access token (sensitive). | "" |
| `nonce` | `string` | `false` | input | Optional nonce. | "" |
| `options` | `string` | `false` | input | JSON e.g. `{"captchaToken":"..."}`. | "{}" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "provider": "google",
    "token": "eyJ…"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "session": null, "user": null },
  "error": null,
  "code": null
}
```
