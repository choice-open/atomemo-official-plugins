# Supabase Auth Exchange Code For Session Tool Documentation

## Tool

- **Name**: `supabase-auth-exchange-code-for-session`
- **Purpose**: Exchanges an auth code (PKCE) for a session.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `code` | `string` | `true` | input | Authorization code from redirect. | "abc123" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "code": "abc123"
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
