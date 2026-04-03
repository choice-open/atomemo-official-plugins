# Supabase Auth Admin OAuth Update Client Tool Documentation

## Tool

- **Name**: `supabase-auth-admin-oauth-update-client`
- **Purpose**: Patches an OAuth client. Uses **service role** key from the credential (admin API).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `client_id` | `string` | `true` | input | OAuth client id. | "client-uuid" |
| `params` | `string` | `true` | input | JSON body: `client_name`, `redirect_uris`, … | "{\"client_name\":\"Renamed\"}" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "client_id": "…",
    "params": "{\"client_name\":\"New name\"}"
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
