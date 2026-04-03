# Supabase Storage Create Bucket Tool Documentation

## Tool

- **Name**: `supabase-storage-create-bucket`
- **Purpose**: Creates a new storage bucket.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | New bucket id. | "uploads" |
| `public` | `boolean` | `false` | switch | Public bucket flag. | false |
| `file_size_limit` | `string` | `false` | input | Optional size limit string for API. | "5242880" |
| `allowed_mime_types` | `string` | `false` | input | JSON array of allowed MIME types. | "[\"image/*\"]" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "uploads",
    "public": false,
    "allowed_mime_types": "[\"image/png\", \"image/jpeg\"]"
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
