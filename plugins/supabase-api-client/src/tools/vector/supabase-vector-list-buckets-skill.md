# Supabase Vector List Buckets Tool Documentation

## Tool

- **Name**: `supabase-vector-list-buckets`
- **Purpose**: Lists vector buckets in the project.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `prefix` | `string` | `false` | input | Name prefix filter. | "" |
| `max_results` | `integer` | `false` | number-input | Max results (default 100). | 50 |
| `next_token` | `string` | `false` | input | Continuation token. | "" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "max_results": 50
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": {},
  "error": null,
  "code": null
}
```
