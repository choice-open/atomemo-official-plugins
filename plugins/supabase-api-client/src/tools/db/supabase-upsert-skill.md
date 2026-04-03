# Supabase Upsert Tool Documentation

## Tool

- **Name**: `supabase-upsert`
- **Purpose**: Upserts rows (insert or update on conflict).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `table` | `string` | `true` | input | Table name. | "posts" |
| `rows` | `string` | `true` | textarea | JSON array/object of rows. | "[{\"id\": 1, \"title\": \"A\"}]" |
| `schema` | `string` | `false` | input | Schema (default `public`). | "public" |
| `on_conflict` | `string` | `false` | input | Conflict columns for upsert. | "id" |
| `returning` | `string` | `false` | select | `minimal` or `representation`. | "minimal" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "table": "posts",
    "rows": "[{\"slug\": \"a\", \"title\": \"A\"}]",
    "on_conflict": "slug",
    "returning": "representation"
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
