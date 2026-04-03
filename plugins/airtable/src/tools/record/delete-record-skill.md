# airtable / delete-record

Delete an Airtable record by record ID.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `airtable_credential` | `credential_id` | yes | - | Links to credential `airtable`. |
| `base_id` | `resource_locator` | yes | - | Airtable base identifier. Supports list selection, Airtable base URLs, or direct base IDs. |
| `table` | `resource_locator` | yes | - | Airtable table identifier. Supports list selection, Airtable table URLs, or direct table IDs. |
| `record_id` | `resource_locator` | yes | - | Airtable record identifier. Supports list selection, Airtable record URLs, or direct record IDs. |

### Example Input
```json
{
  "airtable_credential": "my-airtable-account",
  "base_id": {
    "__type__": "resource_locator",
    "mode_name": "id",
    "value": "appA1B2C3D4E5F6G"
  },
  "table": {
    "__type__": "resource_locator",
    "mode_name": "id",
    "value": "tblTasks123456789"
  },
  "record_id": {
    "__type__": "resource_locator",
    "mode_name": "id",
    "value": "recTask000000001"
  }
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
  "id": "recTask000000001",
  "deleted": true
}
```

### Output Notes
- `success` is added by this tool's `invoke()` wrapper.
- `id` and `deleted` follow Airtable's delete-record response shape.
- The delete response is a confirmation object, not the deleted record body.
- `id` is the Airtable record ID that was deleted.
