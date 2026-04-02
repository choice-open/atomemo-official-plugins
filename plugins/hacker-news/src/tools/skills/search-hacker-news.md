# hacker-news / search-hacker-news

Search Hacker News stories and comments through the Algolia API.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `results_per_page` | `integer` | no | `100` | Maximum number of results to return per page. Range: 1-100. |
| `search_by_date` | `boolean` | no | `false` | When `true`, calls Algolia's `search_by_date` endpoint instead of `search`. |
| `keyword` | `string` | no | `""` | Search query text. |
| `tags` | `array<string>` | no | `[]` | Optional Hacker News tags. Allowed values: `story`, `comment`, `poll`, `pollopt`, `show_hn`, `ask_hn`, `front_page`. |
| `page` | `integer` | no | `0` | Zero-based result page for Algolia pagination. |
| `author` | `string` | no | `""` | Optional Hacker News username. Internally mapped to Algolia tag syntax `author_USERNAME`. |
| `story_id` | `integer` | no | - | Optional Hacker News story ID. Internally mapped to Algolia tag syntax `story_ID`. |
| `numeric_filters` | `string` | no | `""` | Optional raw Algolia `numericFilters` string, such as `created_at_i>1700000000` or `points>100`. |

### Example Input

```json
{
  "keyword": "YC",
  "tags": ["story"],
  "search_by_date": true,
  "results_per_page": 1,
  "page": 0
}
```

## Credential

- No credential is required.

## Success Output

```json
{
  "query": "YC",
  "tags": ["story"],
  "total": 28560,
  "count": 1,
  "items": [
    {
      "id": "47612289",
      "type": "story",
      "title": "Please stop flagging everything going against Israel",
      "url": null,
      "author": "throwaw12",
      "created_at": "2026-04-02T10:03:02Z",
      "points": 5,
      "comment_count": 3,
      "text": "Another post got flagged: https://news.ycombinator.com/item?id=47612053",
      "story_id": 47612289
    }
  ]
}
```

### Output Notes

- `query` echoes the search text sent to Algolia.
- `tags` includes only the user-selected Hacker News tag filters, not derived helper tags such as `author_USERNAME`.
- `items` are normalized Algolia hits with common fields such as `id`, `type`, `title`, `author`, `points`, `comment_count`, and `text`.
