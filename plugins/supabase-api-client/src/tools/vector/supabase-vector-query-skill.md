# Supabase Vector Query Tool Documentation

## Tool

- **Name**: `supabase-vector-query`
- **Purpose**: Similarity search in a vector index.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `index_name` | `string` | `true` | input | Index name. | "embeddings-1536" |
| `query_vector` | `string` | `true` | input | JSON like `{"float32":[...]}`. | "{\"float32\":[0.1,0.2]}" |
| `top_k` | `integer` | `false` | number-input | Neighbors to return (default 10). | 5 |
| `filter` | `string` | `false` | input | Optional metadata filter string. | "" |
| `return_distance` | `boolean` | `false` | switch | Include distances. | true |
| `return_metadata` | `boolean` | `false` | switch | Include metadata. | false |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "index_name": "idx1",
    "query_vector": "{\"float32\": [0.01, 0.02]}",
    "top_k": 5
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
