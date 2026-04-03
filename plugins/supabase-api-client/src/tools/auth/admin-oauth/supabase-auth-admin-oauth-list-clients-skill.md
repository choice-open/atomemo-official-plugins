# Supabase Auth Admin OAuth List Clients Tool Documentation

## Tool

- **Name**: `supabase-auth-admin-oauth-list-clients`
- **Purpose**: Lists OAuth clients with pagination. Uses **service role** key from the credential (admin API).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `page` | `integer` | `false` | number-input | Page number (default 1). | 1 |
| `per_page` | `integer` | `false` | number-input | Page size (default 50). | 50 |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "page": 1,
    "per_page": 50
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "clients": [] },
  "error": null,
  "code": null
}
```
