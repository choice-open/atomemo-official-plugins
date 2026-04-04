# Supabase Vector List Indexes Tool Documentation

## Tool

- **Name**: `supabase-vector-list-indexes`
- **Purpose**: Lists indexes in a vector bucket.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `prefix` | `string` | `false` | input | Name prefix filter. | "emb" |
| `max_results` | `integer` | `false` | number-input | Max results (default 100). | 50 |
| `next_token` | `string` | `false` | input | Continuation token. | "" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "prefix": "",
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
