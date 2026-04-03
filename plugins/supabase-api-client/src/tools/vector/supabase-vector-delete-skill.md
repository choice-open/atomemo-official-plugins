# Supabase Vector Delete Tool Documentation

## Tool

- **Name**: `supabase-vector-delete`
- **Purpose**: Deletes vectors by key (batch, max 500).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `index_name` | `string` | `true` | input | Index name. | "embeddings-1536" |
| `keys` | `string` | `true` | input | JSON array of keys. | ["a","b"] |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "index_name": "idx1",
    "keys": "[\"stale-1\"]"
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
