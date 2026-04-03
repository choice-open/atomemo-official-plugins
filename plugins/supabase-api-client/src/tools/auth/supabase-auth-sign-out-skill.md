# Supabase Auth Sign Out Tool Documentation

## Tool

- **Name**: `supabase-auth-sign-out`
- **Purpose**: Signs out the current session.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `scope` | `string` | `false` | select | `local` or `global` (default local). | "local" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "scope": "local"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": null,
  "error": null,
  "code": null
}
```
