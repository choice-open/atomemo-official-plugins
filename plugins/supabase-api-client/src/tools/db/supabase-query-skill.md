# Supabase Query Tool Documentation

## Tool

- **Name**: `supabase-query`
- **Purpose**: Runs a PostgREST `select` on a table with optional filters, ordering, pagination, CSV output, or EXPLAIN.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `table` | `string` | `true` | input | Table name. | "posts" |
| `columns` | `string` | `false` | input | Column list or `*` (default `*`). | "id,title" |
| `schema` | `string` | `false` | input | Postgres schema (default `public`). | "public" |
| `filters` | `string` | `false` | input | JSON filters (see plugin filter DSL). | "{\"id\": 1}" |
| `order_by` | `string` | `false` | input | Order as `column` or `column.desc`. | "created_at.desc" |
| `limit` | `integer` | `false` | number-input | Page size (default 100, max 1000). | 50 |
| `offset` | `integer` | `false` | number-input | Row offset (default 0). | 0 |
| `return_mode` | `string` | `false` | select | `multiple` | `single` | `maybeSingle`. | "multiple" |
| `return_format` | `string` | `false` | select | `json` or `csv`. | "json" |
| `explain` | `boolean` | `false` | switch | Return query plan instead of rows. | false |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "table": "posts",
    "columns": "id,title",
    "schema": "public",
    "filters": "{\"status\": \"published\"}",
    "order_by": "created_at.desc",
    "limit": 10,
    "offset": 0,
    "return_mode": "multiple",
    "return_format": "json",
    "explain": false
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": [{ "id": 1 }],
  "error": null,
  "code": null
}
```
