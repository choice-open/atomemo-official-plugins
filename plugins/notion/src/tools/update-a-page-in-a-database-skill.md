# notion / update-page-in-database

Update properties and metadata of an existing Notion page.

## When to Use

Use this tool to modify the property values of an existing page — typically a database entry. You can update any writable property (title, status, date, tags, etc.), change the page icon, or archive/unarchive the page. To add or modify page body content (blocks), use `notion-append-blocks` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `page_id` | `string` | yes | — | The ID of the page to update. A UUID (e.g. `59833787-2cf9-4fdf-8782-e53db20768a5`). |
| `properties` | `object` | no | — | Property values to update, keyed by property name. Each value must include a `type` field matching the database schema. Only the specified properties are changed — omitted properties are left untouched. |
| `icon` | `string` | no | — | An emoji to set as the page icon (e.g. `✅`). |
| `archived` | `boolean` | no | — | Set to `true` to archive the page, `false` to unarchive it. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified response. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "page_id": "59833787-2cf9-4fdf-8782-e53db20768a5",
  "properties": {
    "Status": {
      "type": "status",
      "status": { "name": "Done" }
    },
    "Priority": {
      "type": "select",
      "select": { "name": "Low" }
    },
    "Tags": {
      "type": "multi_select",
      "multi_select": [{ "name": "Completed" }, { "name": "Q3" }]
    }
  },
  "icon": "✅"
}
```

### Example: Archive a Page

```json
{
  "api_key": "my-notion-credential",
  "page_id": "59833787-2cf9-4fdf-8782-e53db20768a5",
  "archived": true
}
```

### Property Types Reference

Supported property types for update: `title`, `rich_text`, `number`, `checkbox`, `url`, `email`, `phone_number`, `select`, `multi_select`, `date`, `people`, `files`, `relation`, `status`.

Read-only properties that cannot be updated: `formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`.

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
  "url": "https://www.notion.so/Launch-feature-X-59833787",
  "created_time": "2025-03-20T14:15:22.000Z",
  "last_edited_time": "2025-06-15T11:00:00.000Z",
  "archived": false,
  "in_trash": false,
  "parent": {
    "type": "data_source_id",
    "id": "4c0f2e87-1234-4f7c-9c17-1f5acafe0001"
  },
  "title_text": "Launch feature X",
  "properties_flat": {
    "Name": "Launch feature X",
    "Status": "Done",
    "Priority": "Low",
    "Tags": ["Completed", "Q3"],
    "Due Date": { "start": "2025-08-01", "end": null, "time_zone": null },
    "Done": true
  }
}
```

### Output Notes

- The response contains the full updated page, not just the changed properties.
- When `simplify_output` is `true`, `properties_flat` contains all page properties with flattened values, reflecting the updates.
- When `simplify_output` is `false`, the tool returns the raw `UpdatePageResponse` from `@notionhq/client` (`PageObjectResponse | PartialPageObjectResponse`).
- Only the properties included in the `properties` input are changed. Omitted properties retain their existing values.
- Property names must match the database schema exactly (case-sensitive).
- Setting `archived` to `true` moves the page to the trash. Setting it to `false` restores it.
- Read-only properties (`formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`) are silently ignored if included in the update.
