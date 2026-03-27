# notion / search-pages

Search for Notion pages accessible to the integration.

## When to Use

Use this tool to find pages by title or content across all workspaces the integration has access to. By default, results may include both pages and databases. Enable the `enable_filter` toggle to restrict results to pages only. To search for databases specifically, use `notion-search-databases` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `query` | `string` | no | — | A text query to search by page title. When omitted, returns all pages accessible to the integration. |
| `return_all` | `boolean` | no | `false` | When `true`, follows pagination to fetch all matching results. When `false`, returns a single page of results. |
| `page_size` | `integer` | no | `100` | Number of results per page. Range: 1–100. Hidden when `return_all` is `true`. |
| `enable_filter` | `boolean` | no | `false` | When `true`, restricts results to pages only (excludes databases). |
| `enable_sort` | `boolean` | no | `false` | When `true`, enables sorting by `last_edited_time`. |
| `sort.direction` | `string` | no | `descending` | Sort direction. Allowed values: `ascending`, `descending`. Only used when `enable_sort` is `true`. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns simplified pages with flattened properties. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "query": "Meeting notes",
  "enable_filter": true,
  "return_all": false,
  "page_size": 20
}
```

### Example: List All Pages Sorted by Last Edit

```json
{
  "api_key": "my-notion-credential",
  "enable_filter": true,
  "return_all": true,
  "enable_sort": true,
  "sort": {
    "timestamp": "last_edited_time",
    "direction": "descending"
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
      "id": "59833787-2cf9-4fdf-8782-e53db20768a5",
      "object": "page",
      "url": "https://www.notion.so/Meeting-notes-2025-06-10-59833787",
      "created_time": "2025-06-10T09:00:00.000Z",
      "last_edited_time": "2025-06-10T10:45:00.000Z",
      "archived": false,
      "in_trash": false,
      "parent": {
        "type": "page_id",
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      },
      "title_text": "Meeting notes 2025-06-10",
      "properties_flat": {
        "title": "Meeting notes 2025-06-10"
      }
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "object": "page",
      "url": "https://www.notion.so/Meeting-notes-2025-06-09-b2c3d4e5",
      "created_time": "2025-06-09T09:00:00.000Z",
      "last_edited_time": "2025-06-09T11:00:00.000Z",
      "archived": false,
      "in_trash": false,
      "parent": {
        "type": "data_source_id",
        "id": "4c0f2e87-1234-4f7c-9c17-1f5acafe0001"
      },
      "title_text": "Meeting notes 2025-06-09",
      "properties_flat": {
        "Name": "Meeting notes 2025-06-09",
        "Date": { "start": "2025-06-09", "end": null, "time_zone": null },
        "Tags": ["Weekly", "Engineering"]
      }
    }
  ]
}
```

### Output Notes

- When `enable_filter` is `false` (the default), results may include both pages and databases. Set `enable_filter` to `true` to return pages only.
- When `simplify_output` is `true`, each page includes `title_text` and `properties_flat` with flattened values.
- When `simplify_output` is `false`, the tool returns the raw `SearchResponse` from `@notionhq/client`; its `results` are typed as `Array<PageObjectResponse | PartialPageObjectResponse | PartialDataSourceObjectResponse | DataSourceObjectResponse>`.
- Pages under a parent page will have minimal properties (usually just `title`). Pages in a database will have richer `properties_flat` matching the database schema.
- The only available sort field is `last_edited_time`. Sorting by other fields is not supported by Notion's search endpoint.
- When `return_all` is `true`, the tool follows pagination automatically.
- Notion's search is eventually consistent — recently created or edited pages may take a moment to appear in search results.
