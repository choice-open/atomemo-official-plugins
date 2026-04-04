# Supabase Auth Get User Tool Documentation

## Tool

- **Name**: `supabase-auth-get-user`
- **Purpose**: Fetches the user; optional JWT override.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `jwt` | `string` | `false` | input | Optional access token JWT. | "" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred"
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
