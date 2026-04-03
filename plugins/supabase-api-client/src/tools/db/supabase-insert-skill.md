# Supabase Insert Tool Documentation

## Tool

- **Name**: `supabase-insert`
- **Purpose**: Inserts one or more rows into a table.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `table` | `string` | `true` | input | Table name. | "posts" |
| `rows` | `string` | `true` | textarea | JSON array of objects or single object. | "[{\"title\": \"Hi\"}]" |
| `schema` | `string` | `false` | input | Schema (default `public`). | "public" |
| `returning` | `string` | `false` | select | `minimal` or `representation`. | "minimal" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "table": "posts",
    "rows": "[{\"title\": \"Hello\"}]",
    "schema": "public",
    "returning": "representation"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": [{ "id": 1, "title": "Hello" }],
  "count": 1,
  "error": null,
  "code": null
}
```
