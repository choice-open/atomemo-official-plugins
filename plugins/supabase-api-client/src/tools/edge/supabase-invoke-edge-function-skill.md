# Supabase Invoke Edge Function Tool Documentation

## Tool

- **Name**: `supabase-invoke-edge-function`
- **Purpose**: Invokes a Supabase Edge Function via `functions.invoke`.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `use_service_role_key` | `boolean` | `false` | switch | Use service role key for the client (default true). | true |
| `function_name` | `string` | `true` | input | Edge function name. | "hello-world" |
| `body` | `string` | `false` | textarea | JSON request body. | "{\"name\": \"Ada\"}" |
| `method` | `string` | `false` | select | HTTP method (default POST). | "POST" |
| `headers` | `string` | `false` | textarea | JSON object of request headers. | "{\"x-custom\": \"1\"}" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "use_service_role_key": true,
    "function_name": "hello-world",
    "body": "{\"q\": \"test\"}",
    "method": "POST",
    "headers": "{}"
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "message": "ok" },
  "error": null,
  "code": null
}
```
