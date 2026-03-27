# notion / query-database

Query pages in a Notion database with optional filters, sorting, and pagination.

## When to Use

Use this tool to search and list entries in a Notion database. You can apply Notion filter objects to narrow results, sort by properties or timestamps, and paginate through large datasets. To retrieve the database schema rather than its rows, use `notion-get-database` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `data_source_id` | `string` | yes | — | The ID of the database to query (e.g. `4c0f2e87-1234-4f7c-9c17-1f5acafe0001`). |
| `filter_properties` | `array<string>` | no | `[]` | Optional list of property IDs or names to include in the response. When empty, all properties are returned. |
| `return_all` | `boolean` | no | `false` | When `true`, follows pagination to fetch all matching pages. When `false`, returns a single page of results. |
| `page_size` | `integer` | no | `100` | Number of results per page. Range: 1–100. Hidden when `return_all` is `true`. |
| `sorts` | `array<object>` | no | — | Sort rules. Each rule has: `property` (string, property name), `timestamp` (enum: `created_time` or `last_edited_time`), and `direction` (enum: `ascending` or `descending`, default `descending`). Rules are applied in order. |
| `filter` | `string` (JSON) | no | `{}` | A Notion filter object as a JSON string. Supports compound filters with `and`/`or` and property-specific conditions. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns simplified pages with flattened properties. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "data_source_id": "4c0f2e87-1234-4f7c-9c17-1f5acafe0001",
  "filter": "{\"and\": [{\"property\": \"Status\", \"status\": {\"equals\": \"In Progress\"}}, {\"property\": \"Priority\", \"select\": {\"equals\": \"High\"}}]}",
  "sorts": [
    { "property": "Due Date", "direction": "ascending" }
  ],
  "return_all": false,
  "page_size": 10
}
```

### Filter Syntax

Filters use the Notion filter object format as a JSON string. Examples:

- **Single property filter:** `{"property": "Status", "status": {"equals": "Done"}}`
- **Compound AND filter:** `{"and": [{"property": "Status", "status": {"equals": "Active"}}, {"property": "Priority", "select": {"equals": "High"}}]}`
- **Compound OR filter:** `{"or": [{"property": "Tags", "multi_select": {"contains": "Urgent"}}, {"property": "Due Date", "date": {"before": "2025-07-01"}}]}`
- **Checkbox filter:** `{"property": "Done", "checkbox": {"equals": true}}`
- **Text contains:** `{"property": "Name", "rich_text": {"contains": "launch"}}`

### Sort Rules

- Sort by property: `{ "property": "Priority", "direction": "ascending" }`
- Sort by timestamp: `{ "timestamp": "last_edited_time", "direction": "descending" }`
- Multiple sort rules are applied in order — the first rule is the primary sort.

## Credential

- Credential name: `notion`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `api_key` | `encrypted_string` | yes | Notion internal integration token (starts with `ntn_` or `secret_`). |

## Success Output

```json
{
  "object": "list",
  "type": "page_or_data_source",
  "has_more": false,
  "next_cursor": null,
  "results": [
    {
      "id": "59833787-2cf9-4fdf-8782-e53db20768a5",
      "object": "page",
      "url": "https://www.notion.so/Launch-feature-X-59833787",
      "created_time": "2025-03-20T14:15:22.000Z",
      "last_edited_time": "2025-06-10T08:22:00.000Z",
      "archived": false,
      "in_trash": false,
      "parent": {
        "type": "data_source_id",
        "id": "4c0f2e87-1234-4f7c-9c17-1f5acafe0001"
      },
      "title_text": "Launch feature X",
      "properties_flat": {
        "Name": "Launch feature X",
        "Status": "In Progress",
        "Priority": "High",
        "Due Date": { "start": "2025-08-01", "end": null, "time_zone": null }
      }
    }
  ]
}
```

### Output Notes

- When `simplify_output` is `true`, each page in `results` has `title_text` and `properties_flat` with flattened values.
- When `simplify_output` is `false`, the tool returns the raw `QueryDataSourceResponse` from `@notionhq/client`; its `results` are typed as `Array<PageObjectResponse | PartialPageObjectResponse | PartialDataSourceObjectResponse | DataSourceObjectResponse>`.
- When `return_all` is `true`, the tool follows Notion pagination automatically until all matching pages are collected. `has_more` will be `false` in the final response.
- An empty filter (`{}`) or omitted filter returns all pages in the database.
- `filter_properties` limits which properties appear in the response — it does not filter which pages are returned (use `filter` for that).
- The `filter` parameter must be valid JSON. Invalid JSON will throw an error.
