# Supabase Auth Sign Up Tool Documentation

## Tool

- **Name**: `supabase-auth-sign-up`
- **Purpose**: Registers a user with email and password.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `email` | `string` | `true` | input | User email. | "user@example.com" |
| `password` | `string` | `true` | input | Password (sensitive). | "••••••••" |
| `options` | `string` | `false` | input | JSON: `emailRedirectTo`, `data`, etc. | "{\"data\":{\"name\":\"Ada\"}}" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "email": "user@example.com",
    "password": "secret",
    "options": "{}"
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
