# Supabase Storage Remove Tool Documentation

## Tool

- **Name**: `supabase-storage-remove`
- **Purpose**: Deletes objects by path from a bucket.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | Bucket id. | "avatars" |
| `paths` | `string` | `true` | textarea | JSON array of object paths. | ["a.png","b.png"] |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "avatars",
    "paths": "[\"old/1.png\", \"old/2.png\"]"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": [],
  "error": null,
  "code": null
}
```
