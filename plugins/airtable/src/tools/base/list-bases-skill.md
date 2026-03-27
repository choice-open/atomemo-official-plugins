# airtable / list-bases

List Airtable bases available to the selected Airtable credential.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `airtable_credential` | `credential_id` | yes | - | Links to credential `airtable`. |
| `return_all` | `boolean` | no | `true` | When `true`, fetches every page of bases available to the credential. When `false`, returns up to `limit` results. |
| `limit` | `integer` | no | `100` | Maximum number of bases to return when `return_all` is `false`. Range: 1-100. |
| `permission_level` | `array<string>` | no | - | Optional permission filter. Allowed values: `none`, `read`, `comment`, `create`, `edit`. |

### Example Input
```json
{
  "airtable_credential": "my-airtable-account",
  "return_all": false,
  "limit": 25,
  "permission_level": ["read", "edit"]
}
```

## Credential

- Credential name: `airtable`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `api_key` | `encrypted_string` | yes | Airtable personal access token used to authenticate API requests. |

## Success Output

```json
{
  "success": true,
  "bases": [
    {
      "id": "appA1B2C3D4E5F6G",
      "name": "Marketing Ops",
      "permissionLevel": "edit"
    },
    {
      "id": "appH7I8J9K0L1M2N",
      "name": "Sales CRM",
      "permissionLevel": "read"
    }
  ],
  "total": 2
}
```

### Output Notes
- `success` is added by this tool's `invoke()` wrapper.
- `bases` follows Airtable's `list-bases` response shape for each base object: `id`, `name`, and `permissionLevel`.
- `total` is the number of bases returned after any permission filtering is applied.
- When `return_all` is `true`, the tool follows Airtable pagination automatically until all pages are collected, so Airtable's `offset` pagination token is not exposed in the tool response.
