# Supabase RPC Tool Documentation

## Tool

- **Name**: `supabase-rpc`
- **Purpose**: Calls a Postgres function exposed via PostgREST `rpc`.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `function_name` | `string` | `true` | input | Database function name. | "get_profile" |
| `args` | `string` | `false` | textarea | JSON object of named arguments. | "{\"user_id\": \"uuid\"}" |
| `schema` | `string` | `false` | input | Schema (default `public`). | "public" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "function_name": "add_numbers",
    "args": "{\"a\": 1, \"b\": 2}",
    "schema": "public"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": 3,
  "error": null,
  "code": null
}
```
