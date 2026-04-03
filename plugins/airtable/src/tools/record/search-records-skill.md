# airtable / search-records

Search Airtable records in a table with optional formula filters, view scoping, field selection, sorting, and pagination controls.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `airtable_credential` | `credential_id` | yes | - | Links to credential `airtable`. |
| `base_id` | `resource_locator` | yes | - | Airtable base identifier. Supports list selection, Airtable base URLs, or direct base IDs. |
| `table` | `resource_locator` | yes | - | Airtable table identifier. Supports list selection, Airtable table URLs, or direct table IDs. |
| `filter_by_formula` | `string` | no | - | Airtable formula used to filter matching records. |
| `return_all` | `boolean` | no | `true` | When `true`, fetches every page of matching records. When `false`, returns up to `limit` results. |
| `limit` | `integer` | no | `100` | Maximum number of records to return when `return_all` is `false`. Range: 1-100. |
| `view` | `string` | no | - | Optional Airtable view name or ID used to scope the search. |
| `output_fields` | `array<string>` | no | - | Optional list of field names to include in the returned records. |
| `sort` | `array<object>` | no | - | Optional sort rules. Each item must include `field` and may include `direction` (`asc` or `desc`). |

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
  "filter_by_formula": "AND({Status}='In Progress', {Priority}<=2)",
  "return_all": false,
  "limit": 10,
  "view": "viwActiveTasks123",
  "output_fields": ["Task Name", "Status", "Priority", "Owner"],
  "sort": [
    {
      "field": "Priority",
      "direction": "asc"
    },
    {
      "field": "Task Name",
      "direction": "asc"
    }
  ]
}
```

### Query Notes
- Airtable formulas follow Airtable's formula syntax, for example `AND({Status}='Active', {Region}='EMEA')`.
- `sort` is applied in array order, so the first rule is the primary sort and later rules are tie-breakers.

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
  "records": [
    {
      "id": "recTask000000001",
      "fields": {
        "Task Name": "Launch homepage refresh",
        "Status": "In Progress",
        "Priority": 1,
        "Owner": ["usrDesignLead"]
      },
      "createdTime": "2025-03-20T14:15:22.000Z"
    },
    {
      "id": "recTask000000014",
      "fields": {
        "Task Name": "Prepare launch checklist",
        "Status": "In Progress",
        "Priority": 2,
        "Owner": ["usrProjectMgr"]
      },
      "createdTime": "2025-03-22T09:00:00.000Z"
    }
  ],
  "total": 2
}
```

### Output Notes
- `success` is added by this tool's `invoke()` wrapper.
- Each item in `records` follows Airtable's `list-records` response shape: `id`, `fields`, and `createdTime`.
- `total` is the number of records returned in this response.
- When `return_all` is `true`, the tool follows Airtable pagination automatically until all matching records are collected, so Airtable's `offset` pagination token is not exposed in the tool response.
- When `output_fields` is provided, Airtable only returns those fields in each record's `fields` object.
