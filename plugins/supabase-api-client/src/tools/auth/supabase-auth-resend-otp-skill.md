# Supabase Auth Resend OTP Tool Documentation

## Tool

- **Name**: `supabase-auth-resend-otp`
- **Purpose**: Resends signup or change OTP/SMS.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `type` | `string` | `true` | select | `signup` | `email_change` | `sms` | `phone_change`. | "signup" |
| `email` | `string` | `false` | input | Required for signup/email_change. | "user@example.com" |
| `phone` | `string` | `false` | input | Required for sms/phone_change. | "+10000000000" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "type": "signup",
    "email": "user@example.com"
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
