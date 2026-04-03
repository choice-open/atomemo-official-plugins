# Supabase Auth Sign In Anonymously Tool Documentation

## Tool

- **Name**: `supabase-auth-sign-in-anonymously`
- **Purpose**: Creates or continues an anonymous user session.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |

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
