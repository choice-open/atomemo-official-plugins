# Supabase Auth Update User Tool Documentation

## Tool

- **Name**: `supabase-auth-update-user`
- **Purpose**: Sets session from tokens then updates the user profile.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `access_token` | `string` | `true` | input | Access token (sensitive). | "jwt…" |
| `refresh_token` | `string` | `true` | input | Refresh token (sensitive). | "rt…" |
| `attributes` | `string` | `true` | input | JSON user attributes (`email`, `password`, `data`, …). | "{\"data\":{\"display_name\":\"Ada\"}}" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "access_token": "…",
    "refresh_token": "…",
    "attributes": "{\"data\":{\"k\":\"v\"}}"
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
