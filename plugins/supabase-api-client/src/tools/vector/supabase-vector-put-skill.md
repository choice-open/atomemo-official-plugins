# Supabase Vector Put Tool Documentation

## Tool

- **Name**: `supabase-vector-put`
- **Purpose**: Upserts vectors (batch) into an index.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `index_name` | `string` | `true` | input | Index name. | "embeddings-1536" |
| `vectors` | `string` | `true` | input | JSON array of `{ key, data: { float32 }, metadata? }` (max 500). | "[{\"key\":\"a\",\"data\":{\"float32\":[0.1]}}]" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "index_name": "idx1",
    "vectors": "[{\"key\":\"doc-1\",\"data\":{\"float32\":[0.1,0.2]}}]"
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
