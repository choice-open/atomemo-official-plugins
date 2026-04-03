# notion / search-databases

Search for Notion databases accessible to the integration.

## When to Use

Use this tool to find databases by name across all workspaces the integration has access to. This is useful for discovering database IDs before querying them. Results are limited to databases — pages are excluded. To search for pages, use `notion-search-pages` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `query` | `string` | no | — | A text query to search by database title. When omitted, returns all databases accessible to the integration. |
| `return_all` | `boolean` | no | `false` | When `true`, follows pagination to fetch all matching databases. When `false`, returns a single page of results. |
| `page_size` | `integer` | no | `100` | Number of results per page. Range: 1–100. Hidden when `return_all` is `true`. |
| `enable_sort` | `boolean` | no | `false` | When `true`, enables sorting by `last_edited_time`. |
| `sort.direction` | `string` | no | `descending` | Sort direction. Allowed values: `ascending`, `descending`. Only used when `enable_sort` is `true`. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified schema summary. When `false`, returns the full Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "query": "Tasks",
  "return_all": false,
  "page_size": 10
}
```

### Example with Sorting

```json
{
  "api_key": "my-notion-credential",
  "query": "",
  "return_all": true,
  "enable_sort": true,
  "sort": {
    "timestamp": "last_edited_time",
    "direction": "ascending"
  }
}
```

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
      "id": "4c0f2e87-1234-4f7c-9c17-1f5acafe0001",
      "object": "data_source",
      "url": "https://www.notion.so/4c0f2e8712344f7c9c171f5acafe0001",
      "title_text": "Tasks",
      "description_text": "Team task tracker for all projects.",
      "properties_summary": {
        "Name": { "id": "title", "type": "title" },
        "Status": { "id": "abc1", "type": "status" },
        "Assignee": { "id": "def2", "type": "people" },
        "Due Date": { "id": "ghi3", "type": "date" }
      }
    },
    {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "object": "data_source",
      "url": "https://www.notion.so/a1b2c3d4e5f67g8h9i0jk1l2m3n4o5p6",
      "title_text": "Tasks Archive",
      "description_text": null,
      "properties_summary": {
        "Name": { "id": "title", "type": "title" },
        "Archived Date": { "id": "jkl4", "type": "date" }
      }
    }
  ]
}
```

### Output Notes

- This tool always filters results to databases only (`filter.value = "data_source"`), regardless of input.
- When `simplify_output` is `true`, each database includes `title_text`, `description_text`, and `properties_summary` with each property's `id` and `type`.
- When `simplify_output` is `false`, the tool returns the raw `SearchResponse` from `@notionhq/client`; with this tool's fixed filter, full entries are expected to be `DataSourceObjectResponse | PartialDataSourceObjectResponse`.
- The only available sort field is `last_edited_time`. Sorting by other fields is not supported by Notion's search endpoint.
- When `return_all` is `true`, the tool follows pagination automatically until all databases are collected.
- An empty or omitted `query` returns all databases accessible to the integration.
