# Supabase Auth Verify OTP Tool Documentation

## Tool

- **Name**: `supabase-auth-verify-otp`
- **Purpose**: Verifies an email/SMS OTP or magic link token.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `type` | `string` | `true` | select | One of `email`, `sms`, `phone_change`, `email_change`, `magiclink`, `recovery`. | "email" |
| `token_hash` | `string` | `false` | input | Token hash from redirect (if used). | "" |
| `token` | `string` | `false` | input | OTP code or token string. | "123456" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "type": "email",
    "token": "123456"
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
