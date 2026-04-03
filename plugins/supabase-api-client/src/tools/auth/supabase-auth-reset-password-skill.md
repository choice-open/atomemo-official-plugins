# Supabase Auth Reset Password Tool Documentation

## Tool

- **Name**: `supabase-auth-reset-password`
- **Purpose**: Sends a password recovery email.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `email` | `string` | `true` | input | Account email. | "user@example.com" |
| `redirect_to` | `string` | `false` | input | Recovery redirect URL. | "https://app.example.com/reset" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "email": "user@example.com",
    "redirect_to": "https://app.example.com/reset"
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
