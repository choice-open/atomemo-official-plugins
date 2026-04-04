# Supabase Update Tool Documentation

## Tool

- **Name**: `supabase-update`
- **Purpose**: Updates rows matched by filters.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `table` | `string` | `true` | input | Table name. | "posts" |
| `values` | `string` | `true` | textarea | JSON object of column updates. | "{\"title\": \"Updated\"}" |
| `filters` | `string` | `true` | input | JSON filters to target rows. | "{\"id\": 1}" |
| `schema` | `string` | `false` | input | Schema (default `public`). | "public" |
| `returning` | `string` | `false` | select | `minimal` or `representation`. | "minimal" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "table": "posts",
    "values": "{\"title\": \"New title\"}",
    "filters": "{\"id\": 1}",
    "schema": "public",
    "returning": "minimal"
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
