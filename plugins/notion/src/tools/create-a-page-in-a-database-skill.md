# notion / create-page-in-database

Create a new entry (page) in a Notion database with property values and optional body content.

## When to Use

Use this tool to add a new row to a Notion database. You can set property values (title, status, date, tags, etc.) and optionally add block content to the page body. To create a standalone page that is not part of a database, use `notion-create-page` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `parent.data_source_id` | `string` | yes | — | The ID of the database to add the entry to. |
| `properties` | `object` | no | — | Property values keyed by property name. Each value must include a `type` field matching the database schema (e.g. `title`, `rich_text`, `number`, `select`, `multi_select`, `date`, `checkbox`, `url`, `email`, `phone_number`, `people`, `files`, `relation`, `status`). |
| `children` | `array<object>` | no | — | Array of block objects to add as the page body content. |
| `icon` | `string` | no | — | An emoji to use as the page icon (e.g. `🎯`). |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified response. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "parent": {
    "data_source_id": "4c0f2e87-1234-4f7c-9c17-1f5acafe0001"
  },
  "properties": {
    "Name": {
      "type": "title",
      "title": [{ "type": "text", "text": { "content": "Launch feature X" } }]
    },
    "Status": {
      "type": "status",
      "status": { "name": "In Progress" }
    },
    "Priority": {
      "type": "select",
      "select": { "name": "High" }
    },
    "Due Date": {
      "type": "date",
      "date": { "start": "2025-08-01" }
    },
    "Tags": {
      "type": "multi_select",
      "multi_select": [{ "name": "Engineering" }, { "name": "Q3" }]
    }
  },
  "icon": "🎯",
  "children": [
    {
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "Implementation plan and milestones." } }]
      }
    }
  ]
}
```

### Property Types Reference

Supported property types: `title`, `rich_text`, `number`, `checkbox`, `url`, `email`, `phone_number`, `select`, `multi_select`, `date`, `people`, `files`, `relation`, `status`.

## Credential

- Credential name: `notion`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `api_key` | `encrypted_string` | yes | Notion internal integration token (starts with `ntn_` or `secret_`). |

## Success Output

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "object": "page",
  "url": "https://www.notion.so/Launch-feature-X-b2c3d4e5f6a78901bcdef12345678901",
  "created_time": "2025-06-15T10:30:00.000Z",
  "last_edited_time": "2025-06-15T10:30:00.000Z",
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
    "Due Date": { "start": "2025-08-01", "end": null, "time_zone": null },
    "Tags": ["Engineering", "Q3"]
  }
}
```

### Output Notes

- When `simplify_output` is `true`, `properties_flat` contains flattened property values: rich text and titles become plain strings, selects become their name, multi-selects become an array of names, dates become `{ start, end, time_zone }`.
- When `simplify_output` is `false`, the tool returns the raw `CreatePageResponse` from `@notionhq/client` (`PageObjectResponse | PartialPageObjectResponse`).
- `parent.type` is `data_source_id` for database entries.
- Property names in the `properties` input must match the database schema exactly (case-sensitive).
- Page body content (blocks) is written during creation but not included in the response.
