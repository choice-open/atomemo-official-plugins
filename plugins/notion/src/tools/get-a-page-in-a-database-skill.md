# notion / get-page

Retrieve a page and its properties from Notion.

## When to Use

Use this tool to fetch a single page's metadata and property values. This returns page properties, not page content. To retrieve the content blocks of a page, use `notion-get-child-blocks` with the page ID as the `block_id`.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `page_id` | `string` | yes | — | The ID of the page to retrieve. A UUID (e.g. `59833787-2cf9-4fdf-8782-e53db20768a5`). |
| `filter_properties` | `array<string>` | no | `[]` | Optional list of property IDs or names to include in the response. When empty, all properties are returned. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified response with flattened properties. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "page_id": "59833787-2cf9-4fdf-8782-e53db20768a5"
}
```

### Example with Filtered Properties

```json
{
  "api_key": "my-notion-credential",
  "page_id": "59833787-2cf9-4fdf-8782-e53db20768a5",
  "filter_properties": ["Name", "Status", "Priority"]
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
  "id": "59833787-2cf9-4fdf-8782-e53db20768a5",
  "object": "page",
  "url": "https://www.notion.so/Launch-feature-X-59833787-2cf9-4fdf-8782-e53db20768a5",
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
    "Assignee": [{ "id": "user-uuid-001", "name": "Alice", "type": "person" }],
    "Due Date": { "start": "2025-08-01", "end": null, "time_zone": null },
    "Tags": ["Engineering", "Q3"],
    "Done": false
  }
}
```

### Output Notes

- When `simplify_output` is `true`, property values are flattened: titles and rich text become plain strings, selects become their name string, multi-selects become arrays of names, people become simplified user objects, dates become `{ start, end, time_zone }`, relations become arrays of page IDs.
- When `simplify_output` is `false`, the tool returns the raw `GetPageResponse` from `@notionhq/client` (`PartialPageObjectResponse | PageObjectResponse`).
- `title_text` is the extracted plain-text title of the page.
- The `parent` object indicates whether this page belongs to a database (`data_source_id`) or another page (`page_id`).
- This endpoint returns properties only. Page body content is not included — use `notion-get-child-blocks` for that.
- Notion limits property responses to 25 references per property. For properties with more than 25 references (e.g. large relation or people fields), some values may be truncated.
