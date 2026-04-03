# Supabase Auth Set Session Tool Documentation

## Tool

- **Name**: `supabase-auth-set-session`
- **Purpose**: Sets the active session from access and refresh tokens.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `access_token` | `string` | `true` | input | Access token (sensitive). | "jwt…" |
| `refresh_token` | `string` | `true` | input | Refresh token (sensitive). | "rt…" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "access_token": "…",
    "refresh_token": "…"
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
