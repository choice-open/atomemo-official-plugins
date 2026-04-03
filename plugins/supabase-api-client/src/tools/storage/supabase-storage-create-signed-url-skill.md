# Supabase Storage Create Signed URL Tool Documentation

## Tool

- **Name**: `supabase-storage-create-signed-url`
- **Purpose**: Creates a time-limited signed URL for a private object.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `bucket` | `string` | `true` | input | Bucket id. | "private" |
| `path` | `string` | `true` | input | Object path. | "report.pdf" |
| `expires_in` | `integer` | `false` | number-input | TTL seconds (default 3600, max 86400). | 600 |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "bucket": "private",
    "path": "report.pdf",
    "expires_in": 600
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "signedUrl": "https://…" },
  "error": null,
  "code": null
}
```
