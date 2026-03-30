# airtable / create-record

Create a new record in an Airtable table.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `airtable_credential` | `credential_id` | yes | - | Links to credential `airtable`. |
| `base_id` | `resource_locator` | yes | - | Airtable base identifier. Supports list selection, Airtable base URLs, or direct base IDs. |
| `table` | `resource_locator` | yes | - | Airtable table identifier. Supports list selection, Airtable table URLs, or direct table IDs. |
| `fields` | `resource_mapper` | yes | - | Dynamic field mapping for the selected table. Provide field names and values that match the table schema. |
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
  "fields": {
    "__type__": "resource_mapper",
    "mapping_mode": "manual",
    "value": {
      "Task Name": "Publish Q2 campaign brief",
      "Status": "Backlog",
      "Priority": 2,
      "Due Date": "2025-04-15",
      "Owner": ["usrMarketingMgr"]
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
    "id": "recTask000000099",
    "fields": {
      "Task Name": "Publish Q2 campaign brief",
      "Status": "Backlog",
      "Priority": 2,
      "Due Date": "2025-04-15",
      "Owner": ["usrMarketingMgr"]
    },
    "createdTime": "2025-03-27T09:30:00.000Z"
  }
}
```

### Output Notes
- `success` is added by this tool's `invoke()` wrapper.
- `record` follows Airtable's create-record response shape and includes the generated record ID, returned `fields`, and `createdTime`.
