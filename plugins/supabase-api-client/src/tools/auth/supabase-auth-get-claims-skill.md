# Supabase Auth Get Claims Tool Documentation

## Tool

- **Name**: `supabase-auth-get-claims`
- **Purpose**: Reads JWT claims via `getClaims`.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `supabase_credential` | `credential_id` | `true` | credential picker | Supabase connection credential bound to `supabase-connection`. | "my_supabase_cred" |
| `jwt` | `string` | `false` | input | Optional JWT (sensitive). | "" |
| `allow_expired` | `boolean` | `false` | switch | Allow expired tokens. | false |

## Tool Input Example

```json
{
  "parameters": {
    "supabase_credential": "my_supabase_cred",
    "allow_expired": false
  }
}
```

## Tool Output Example

```json
{
  "success": true,
  "data": { "session": null, "user": null },
  "error": null,
  "code": null
}
```
