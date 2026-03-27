# airtable / get-base-schema

Retrieve the table and field schema for a specific Airtable base.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `airtable_credential` | `credential_id` | yes | - | Links to credential `airtable`. |
| `base_id` | `resource_locator` | yes | - | Airtable base identifier. Supports selecting from a list, pasting a base URL, or entering a base ID such as `appA1B2C3D4E5F6G`. |

### Example Input
```json
{
  "airtable_credential": "my-airtable-account",
  "base_id": {
    "__type__": "resource_locator",
    "mode_name": "id",
    "value": "appA1B2C3D4E5F6G"
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
  "tables": [
    {
      "id": "tblTasks123456789",
      "name": "Tasks",
      "primaryFieldId": "fldTaskName123456",
      "fields": [
        {
          "id": "fldTaskName123456",
          "name": "Task Name",
          "type": "singleLineText"
        },
        {
          "id": "fldStatus12345678",
          "name": "Status",
          "type": "singleSelect",
          "options": {
            "choices": [
              { "name": "Backlog" },
              { "name": "In Progress" },
              { "name": "Done" }
            ]
          }
        }
      ],
      "views": [
        {
          "id": "viwAllTasks123456",
          "name": "All tasks",
          "type": "grid"
        }
      ]
    }
  ],
  "total": 1
}
```

### Output Notes
- `success` is added by this tool's `invoke()` wrapper.
- `tables` follows Airtable's `get-base-schema` response shape, including table metadata, field definitions, and view definitions exposed by Airtable.
- `total` is the number of tables returned for the base.
