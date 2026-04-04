# Supabase Vector List Tool Documentation

## Tool

- **Name**: `supabase-vector-list`
- **Purpose**: Lists vectors in an index with pagination.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `index_name` | `string` | `true` | input | Index name. | "embeddings-1536" |
| `max_results` | `integer` | `false` | number-input | Page size (default 500). | 100 |
| `next_token` | `string` | `false` | input | Continuation token. | "" |
| `return_data` | `boolean` | `false` | switch | Include vector data. | false |
| `return_metadata` | `boolean` | `false` | switch | Include metadata. | false |
| `segment_count` | `integer` | `false` | number-input | Optional segment count (1–16). | 4 |
| `segment_index` | `integer` | `false` | number-input | Optional segment index. | 0 |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "index_name": "idx1",
    "max_results": 100
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
