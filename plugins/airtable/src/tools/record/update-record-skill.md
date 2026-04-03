# airtable / update-record

Update an existing Airtable record by record ID.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `airtable_credential` | `credential_id` | yes | - | Links to credential `airtable`. |
| `base_id` | `resource_locator` | yes | - | Airtable base identifier. Supports list selection, Airtable base URLs, or direct base IDs. |
| `table` | `resource_locator` | yes | - | Airtable table identifier. Supports list selection, Airtable table URLs, or direct table IDs. |
| `record_id` | `resource_locator` | yes | - | Airtable record identifier. Supports list selection, Airtable record URLs, or direct record IDs. |
| `fields` | `resource_mapper` | yes | - | Dynamic field mapping for the selected table. Provide the field values to update on the target record. |
| `typecast` | `boolean` | no | `false` | When `true`, asks Airtable to coerce provided values into the destination field types where possible. |

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
  },
  "fields": {
    "__type__": "resource_mapper",
    "mapping_mode": "manual",
    "value": {
      "Status": "Done",
      "Priority": 1,
      "Completed On": "2025-03-27"
    }
  },
  "typecast": true
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
  "record": {
    "id": "recTask000000001",
    "fields": {
      "Task Name": "Launch homepage refresh",
      "Status": "Done",
      "Priority": 1,
      "Completed On": "2025-03-27"
    },
    "createdTime": "2025-03-20T14:15:22.000Z"
  }
}
```

### Output Notes
- `success` is added by this tool's `invoke()` wrapper.
- `record` follows Airtable's update-record response shape, including the returned `id`, `fields`, and `createdTime`.
- Airtable may include unchanged fields in the returned record body.
