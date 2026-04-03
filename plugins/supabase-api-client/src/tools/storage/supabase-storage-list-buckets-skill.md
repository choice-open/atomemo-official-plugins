# Supabase Storage List Buckets Tool Documentation

## Tool

- **Name**: `supabase-storage-list-buckets`
- **Purpose**: Lists storage buckets for the project.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `limit` | `integer` | `false` | number-input | Max buckets (default 100). | 100 |
| `offset` | `integer` | `false` | number-input | Pagination offset. | 0 |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "limit": 100,
    "offset": 0
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": [{ "name": "avatars", "public": false }],
  "error": null,
  "code": null
}
```
