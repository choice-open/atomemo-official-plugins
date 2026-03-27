# notion / create-page

Create a standalone Notion page under an existing parent page.

## When to Use

Use this tool to create a new page as a child of another page. This is for standalone pages — not database entries. To create a row in a Notion database, use `notion-create-page-in-database` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `parent.page_id` | `string` | yes | — | The ID of the parent page under which the new page will be created. |
| `title` | `string` | no | — | The title of the new page. |
| `children` | `array<object>` | no | — | Array of block objects to add as the page body content. Each object must include a `type` field and the corresponding typed content. |
| `icon` | `string` | no | — | An emoji to use as the page icon (e.g. `📋`). |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified response. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "parent": {
    "page_id": "59833787-2cf9-4fdf-8782-e53db20768a5"
  },
  "title": "Weekly Planning",
  "icon": "📋",
  "children": [
    {
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "Goals for this week." } }]
      }
    }
  ]
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
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "object": "page",
  "url": "https://www.notion.so/Weekly-Planning-a1b2c3d4e5f67890abcdef1234567890",
  "created_time": "2025-06-15T10:30:00.000Z",
  "last_edited_time": "2025-06-15T10:30:00.000Z",
  "archived": false,
  "in_trash": false,
  "parent": {
    "type": "page_id",
    "id": "59833787-2cf9-4fdf-8782-e53db20768a5"
  },
  "title_text": "Weekly Planning",
  "properties_flat": {
    "title": "Weekly Planning"
  }
}
```

### Output Notes

- When `simplify_output` is `true`, the response includes `title_text` (extracted plain text title) and `properties_flat` (flattened property values).
- When `simplify_output` is `false`, the tool returns the raw `CreatePageResponse` from `@notionhq/client` (`PageObjectResponse | PartialPageObjectResponse`).
- `parent.type` is always `page_id` for standalone pages.
- The `url` field provides a direct link to the newly created page.
- Page content (blocks) is written during creation but is not included in the response. Use `notion-get-child-blocks` to retrieve it.
