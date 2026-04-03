# Supabase Auth Sign In With OTP Tool Documentation

## Tool

- **Name**: `supabase-auth-sign-in-with-otp`
- **Purpose**: Sends a magic link / OTP to an email.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `email` | `string` | `true` | input | Destination email. | "user@example.com" |
| `options` | `string` | `false` | input | JSON options (`emailRedirectTo`, `shouldCreateUser`, …). | "{}" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "email": "user@example.com",
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
