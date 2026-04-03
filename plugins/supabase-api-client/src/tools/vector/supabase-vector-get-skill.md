# Supabase Vector Get Tool Documentation

## Tool

- **Name**: `supabase-vector-get`
- **Purpose**: Fetches vectors by key from an index.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |
| `index_name` | `string` | `true` | input | Index name. | "embeddings-1536" |
| `keys` | `string` | `true` | input | JSON array of keys. | ["k1","k2"] |
| `return_data` | `boolean` | `false` | switch | Include vector data (default true). | true |
| `return_metadata` | `boolean` | `false` | switch | Include metadata. | false |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1",
    "index_name": "idx1",
    "keys": "[\"doc-1\"]"
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
