# Supabase Storage Download Tool Documentation

## Tool

- **Name**: `supabase-storage-download`
- **Purpose**: Downloads an object and returns a workflow `file_ref`.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | Bucket id. | "avatars" |
| `path` | `string` | `true` | input | Object path. | "user/1.png" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "avatars",
    "path": "user/1.png"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "__type__": "file_ref", "filename": "1.png" },
  "error": null,
  "code": null
}
```
