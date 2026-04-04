# Supabase Auth Admin OAuth Create Client Tool Documentation

## Tool

- **Name**: `supabase-auth-admin-oauth-create-client`
- **Purpose**: Creates an OAuth client. Uses **service role** key from the credential (admin API).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `client_name` | `string` | `true` | input | Human-readable client name. | "My App" |
| `redirect_uris` | `string` | `true` | input | JSON array of redirect URIs. | "[\"https://app/cb\"]" |
| `client_uri` | `string` | `false` | input | Client home page URL. | "https://app.example.com" |
| `grant_types` | `string` | `false` | input | JSON array of grant types. | "" |
| `response_types` | `string` | `false` | input | JSON array of response types. | "" |
| `scope` | `string` | `false` | input | Space-delimited scopes string. | "openid email" |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "client_name": "CLI",
    "redirect_uris": "[\"http://127.0.0.1/cb\"]"
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
