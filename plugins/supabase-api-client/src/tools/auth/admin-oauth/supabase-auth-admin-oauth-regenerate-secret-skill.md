# Supabase Auth Admin OAuth Regenerate Secret Tool Documentation

## Tool

- **Name**: `supabase-auth-admin-oauth-regenerate-secret`
- **Purpose**: Rotates the client secret. Uses **service role** key from the credential (admin API).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `client_id` | `string` | `true` | input | OAuth client id. | "client-uuid" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "client_id": "…"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "client_secret": "…" },
  "error": null,
  "code": null
}
```
