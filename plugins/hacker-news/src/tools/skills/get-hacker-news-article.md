# hacker-news / get-hacker-news-article

Fetch a Hacker News item by ID and optionally include its comment tree.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `article_id` | `string` | yes | `""` | Hacker News item ID to fetch. |
| `include_comments` | `boolean` | no | `false` | When `true`, includes the normalized comment tree for the item. |

### Example Input

```json
{
  "article_id": "8863",
  "include_comments": true
}
```

## Credential

- No credential is required.

## Success Output

```json
{
  "item": {
    "id": 8863,
    "type": "story",
    "title": "My YC app: Dropbox - Throw away your USB drive",
    "url": "http://www.getdropbox.com/u/2/screencast.html",
    "author": "dhouston",
    "created_at": "2007-04-04T19:16:40.000Z",
    "points": 104,
    "text": null,
    "parent_id": null,
    "children_count": 32
  },
  "comments": [
    {
      "id": 8865,
      "author": "dhouston",
      "text": "oh, and a mac port is coming :)",
      "created_at": "2007-04-04T19:22:55.000Z",
      "parent_id": 8863,
      "children_count": 1,
      "children": [
        {
          "id": 9007,
          "author": "vlad",
          "text": "Drew, this is awesome! All of the features you mentioned are exactly what people need.",
          "created_at": "2007-04-05T01:48:11.000Z",
          "parent_id": 8865,
          "children_count": 0,
          "children": []
        }
      ]
    }
  ]
}
```

### Output Notes

- `item` is always returned and contains normalized metadata for the requested Hacker News item.
- `comments` is only returned when `include_comments` is `true`.
- Comment entries are recursive and each child uses the same normalized shape.
