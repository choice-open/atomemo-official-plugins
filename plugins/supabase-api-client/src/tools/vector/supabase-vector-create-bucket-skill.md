# Supabase Vector Create Bucket Tool Documentation

## Tool

- **Name**: `supabase-vector-create-bucket`
- **Purpose**: Creates a vector bucket.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `vector_bucket_name` | `string` | `true` | input | Vector bucket name. | "my-vector-bucket" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "vector_bucket_name": "vb1"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "vectorBucketName": "vb1" },
  "error": null,
  "code": null
}
```
