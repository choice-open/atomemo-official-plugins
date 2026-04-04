# Supabase Storage Upload Tool Documentation

## Tool

- **Name**: `supabase-storage-upload`
- **Purpose**: Uploads a file to a storage bucket (via `file_ref` or inline content).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | Bucket id. | "avatars" |
| `path` | `string` | `true` | input | Object path (directory when using file_ref; include filename when using file_content). | "folder/photo.png" |
| `file` | `file_ref` | `false` | file picker | Workflow file reference (mutually exclusive with file_content). | null |
| `file_content` | `string` | `false` | textarea | Plain or base64 file bytes. | "SGVsbG8=" |
| `content_type` | `string` | `false` | input | MIME type when using file_content. | "image/png" |
| `upsert` | `boolean` | `false` | switch | Overwrite if exists. | false |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "public-assets",
    "path": "docs/readme.txt",
    "file_content": "SGVsbG8=",
    "content_type": "text/plain",
    "upsert": true
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "path": "docs/readme.txt", "id": "…" },
  "error": null,
  "code": null
}
```
