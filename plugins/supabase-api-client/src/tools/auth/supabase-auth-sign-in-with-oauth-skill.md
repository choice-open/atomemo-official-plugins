# Supabase Auth Sign In With OAuth Tool Documentation

## Tool

- **Name**: `supabase-auth-sign-in-with-oauth`
- **Purpose**: Starts OAuth sign-in; returns URL when skipping browser redirect.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `provider` | `string` | `true` | select | OAuth provider id (google, github, …). | "google" |
| `redirect_to` | `string` | `false` | input | Redirect URL after OAuth. | "https://app.example.com/callback" |
| `scopes` | `string` | `false` | input | Space-delimited OAuth scopes. | "openid email" |
| `query_params` | `string` | `false` | input | JSON object of extra query params. | "{}" |
| `skip_browser_redirect` | `boolean` | `false` | switch | If true, return URL instead of redirecting (default true). | true |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "provider": "github",
    "skip_browser_redirect": true
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "url": "https://…" },
  "error": null,
  "code": null
}
```
