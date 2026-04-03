# Supabase Storage List Files Tool Documentation

## Tool

- **Name**: `supabase-storage-list-files`
- **Purpose**: Lists objects under a prefix in a bucket.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | Bucket id. | "avatars" |
| `path` | `string` | `false` | input | Folder prefix. | "user_1/" |
| `limit` | `integer` | `false` | number-input | Max entries (default 100). | 100 |
| `offset` | `integer` | `false` | number-input | Pagination offset. | 0 |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "avatars",
    "path": "",
    "limit": 50,
    "offset": 0
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": [{ "name": "a.png" }],
  "error": null,
  "code": null
}
```
