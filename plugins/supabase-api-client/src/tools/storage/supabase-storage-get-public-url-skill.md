# Supabase Storage Get Public URL Tool Documentation

## Tool

- **Name**: `supabase-storage-get-public-url`
- **Purpose**: Builds the public URL for an object (bucket must be public).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | Bucket id. | "public" |
| `path` | `string` | `true` | input | Object path. | "logo.png" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "public",
    "path": "logo.png"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "publicUrl": "https://…" },
  "error": null,
  "code": null
}
```
