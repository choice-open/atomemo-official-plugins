# notion / append-blocks

Append child blocks to an existing Notion block (page or other block with children).

## When to Use

Use this tool to add content (paragraphs, headings, lists, toggles, etc.) to an existing Notion page or block. This is the primary way to write content into Notion pages after they have been created.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `block_id` | `string` | yes | — | The ID of the parent block (or page) to append children to. Accepts a 32-character Notion ID or a full Notion URL. |
| `children` | `array<object>` | yes | — | Array of block objects to append. Each object must include a `type` field (e.g. `paragraph`, `heading_1`, `bulleted_list_item`) and the corresponding typed content. |
| `after` | `string` | no | — | The ID of an existing child block. New blocks are inserted after this block. If omitted, blocks are appended at the end. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns a simplified response with plain-text content and flat metadata. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "block_id": "12e7a091-f37e-8056-b127-f648e0e9dca3",
  "children": [
    {
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{ "type": "text", "text": { "content": "Meeting Notes" } }]
      }
    },
    {
      "type": "paragraph",
      "paragraph": {
        "rich_text": [{ "type": "text", "text": { "content": "Discussed Q3 roadmap priorities." } }]
      }
    },
    {
      "type": "bulleted_list_item",
      "bulleted_list_item": {
        "rich_text": [{ "type": "text", "text": { "content": "Launch feature X by August" } }]
      }
    }
  ]
}
```

### Block Type Reference

Supported block types include: `paragraph`, `heading_1`, `heading_2`, `heading_3`, `bulleted_list_item`, `numbered_list_item`, `toggle`, `quote`, `callout`, `divider`, `code`, `equation`, `bookmark`, `image`, `video`, `file`, `audio`, `pdf`, `table`, `table_row`, `column_list`, `column`, `breadcrumb`, `link_preview`, `synced_block`, `template`, `child_page`, `child_database`.

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
  "type": "block",
  "has_more": false,
  "next_cursor": null,
  "results": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "object": "block",
      "type": "heading_2",
      "has_children": false,
      "created_time": "2025-06-15T10:30:00.000Z",
      "last_edited_time": "2025-06-15T10:30:00.000Z",
      "plain_text": "Meeting Notes",
      "content": {
        "type": "heading_2",
        "rich_text_text": "Meeting Notes",
        "is_toggleable": false,
        "color": "default"
      }
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "object": "block",
      "type": "paragraph",
      "has_children": false,
      "created_time": "2025-06-15T10:30:00.000Z",
      "last_edited_time": "2025-06-15T10:30:00.000Z",
      "plain_text": "Discussed Q3 roadmap priorities.",
      "content": {
        "type": "paragraph",
        "rich_text_text": "Discussed Q3 roadmap priorities.",
        "color": "default"
      }
    }
  ]
}
```

### Output Notes

- The response is a list of the newly appended blocks.
- When `simplify_output` is `true`, each block includes `plain_text` (extracted text content) and `content` (type-specific fields with rich text flattened to `rich_text_text`).
- When `simplify_output` is `false`, the tool returns the raw `AppendBlockChildrenResponse` from `@notionhq/client`; its `results` are typed as `Array<PartialBlockObjectResponse | BlockObjectResponse>`.
