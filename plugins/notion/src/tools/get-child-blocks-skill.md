# notion / get-child-blocks

Retrieve the child blocks (content) of a Notion block or page.

## When to Use

Use this tool to read the content of a Notion page or any block that has children. Every Notion page is also a block, so passing a page ID as `block_id` returns the page's top-level content blocks. This is the primary way to read page content — `notion-get-page` only returns properties, not body content.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `api_key` | `credential_id` | yes | — | Links to credential `notion`. |
| `block_id` | `string` | yes | — | The ID of the block or page whose children to retrieve. |
| `return_all` | `boolean` | no | `false` | When `true`, follows pagination to fetch all child blocks. When `false`, returns a single page of results. |
| `page_size` | `integer` | no | `100` | Number of blocks per page. Range: 1–100. Hidden when `return_all` is `true`. |
| `simplify_output` | `boolean` | no | `true` | When `true`, returns simplified blocks with plain-text content. When `false`, returns the raw Notion API response. |

### Example Input

```json
{
  "api_key": "my-notion-credential",
  "block_id": "12e7a091-f37e-8056-b127-f648e0e9dca3",
  "return_all": true
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
      "plain_text": "Project Overview",
      "content": {
        "type": "heading_2",
        "rich_text_text": "Project Overview",
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
      "plain_text": "This project aims to improve onboarding.",
      "content": {
        "type": "paragraph",
        "rich_text_text": "This project aims to improve onboarding.",
        "color": "default"
      }
    },
    {
      "id": "c3d4e5f6-a789-0123-cdef-123456789012",
      "object": "block",
      "type": "toggle",
      "has_children": true,
      "created_time": "2025-06-15T10:30:00.000Z",
      "last_edited_time": "2025-06-15T10:30:00.000Z",
      "plain_text": "Click to expand details",
      "content": {
        "type": "toggle",
        "rich_text_text": "Click to expand details",
        "color": "default"
      }
    }
  ]
}
```

### Output Notes

- When `simplify_output` is `true`, each block includes `plain_text` (extracted text content) and `content` (type-specific fields with rich text flattened to `rich_text_text`).
- When `simplify_output` is `false`, the tool returns the raw `ListBlockChildrenResponse` from `@notionhq/client`; its `results` are typed as `Array<PartialBlockObjectResponse | BlockObjectResponse>`.
- `has_children` indicates whether a block has nested child blocks. Use this tool recursively with the block's ID to retrieve nested content.
- When `return_all` is `true`, the tool follows Notion's pagination automatically. `has_more` will be `false` and `next_cursor` will be `null` in the final response.
- When `return_all` is `false` and more results exist, `has_more` is `true` and `next_cursor` contains the pagination token (though this tool does not accept a `start_cursor` input — set `return_all` to `true` for complete results).
- This tool only retrieves direct children, not deeply nested blocks. To get nested content, call this tool again with each child block's ID where `has_children` is `true`.
