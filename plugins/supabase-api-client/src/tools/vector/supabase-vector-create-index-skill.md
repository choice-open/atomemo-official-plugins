# Supabase Vector Create Index Tool Documentation

## Tool

- **Name**: `supabase-vector-create-index`
- **Purpose**: Creates a vector index in a bucket.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `index_name` | `string` | `true` | input | Index name. | "embeddings-1536" |
| `data_type` | `string` | `true` | select | Vector element type (currently float32). | "float32" |
| `dimension` | `integer` | `true` | number-input | Embedding dimension. | 1536 |
| `distance_metric` | `string` | `true` | select | `cosine` | `euclidean` | `dotproduct`. | "cosine" |
| `metadata_configuration` | `string` | `false` | input | Optional JSON metadata index config. | "" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "index_name": "idx1",
    "data_type": "float32",
    "dimension": 1536,
    "distance_metric": "cosine"
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
