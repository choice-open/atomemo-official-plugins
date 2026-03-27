# notion / get-database

Retrieve metadata and schema for a Notion database.

## When to Use

Use this tool to inspect a database's structure — its title, description, and property schema (column definitions). This is useful for understanding which properties exist before querying or creating entries. To fetch actual rows from a database, use `notion-query-data-source` instead.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `database_id` | `string` | yes | — | The ID of the Notion database to retrieve. A 32-character UUID (e.g. `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`). |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified schema summary. When `false`, returns the full Notion database object. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "database_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
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
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "object": "database",
  "url": "https://www.notion.so/a1b2c3d4e5f67g8h9i0jk1l2m3n4o5p6",
  "title_text": "Project Tracker",
  "description_text": "Track all active projects and their status.",
  "properties_summary": {
    "Name": { "id": "title", "type": "title" },
    "Status": { "id": "abc1", "type": "status" },
    "Priority": { "id": "def2", "type": "select" },
    "Assignee": { "id": "ghi3", "type": "people" },
    "Due Date": { "id": "jkl4", "type": "date" },
    "Tags": { "id": "mno5", "type": "multi_select" },
    "Notes": { "id": "pqr6", "type": "rich_text" },
    "Done": { "id": "stu7", "type": "checkbox" }
  }
}
```

### Output Notes

- When `simplify_output` is `true`, `properties_summary` contains each property's `id` and `type` only, without full configuration details.
- `title_text` and `description_text` are extracted plain-text versions of the database title and description.
- When `simplify_output` is `false`, the tool returns the raw `GetDatabaseResponse` from `@notionhq/client` (`PartialDatabaseObjectResponse | DatabaseObjectResponse`), including complete property configurations when a full `DatabaseObjectResponse` is returned.
- The database must be shared with the integration to be accessible.
