# twitter / search-tweets

Search recent tweets matching a query.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `twitter_credential` | `credential_id` | yes | — | Links to credential `twitter-oauth`. |
| `query` | `string` | yes | — | Search query for tweets. Supports Twitter search operators (e.g. `from:username`, `#hashtag`, `"exact phrase"`). |
| `max_results` | `integer` | no | `10` | Number of results per page. Range: 1–100. |
| `pagination_token` | `string` | no | — | Token for fetching the next page of results. |

### Example Input
```json
{
  "twitter_credential": "my-twitter-account",
  "query": "from:elonmusk AI",
  "max_results": 10
}
```

## Credential

- Credential name: `twitter-oauth`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `client_id` | `string` | yes | Twitter App Client ID. |
| `client_secret` | `encrypted_string` | yes | Twitter App Client Secret. |
| `access_token` | `encrypted_string` | no | OAuth 2.0 access token (auto-filled after authorization). |
| `refresh_token` | `encrypted_string` | no | OAuth 2.0 refresh token (auto-filled after authorization). |

## Success Output

```json
{
  "data": [
    {
      "id": "1234567890123456789",
      "text": "AI is transforming how we build software",
      "author_id": "987654321",
      "conversation_id": "1234567890123456789",
      "created_at": "2024-03-15T14:30:00.000Z",
      "public_metrics": {
        "retweet_count": 120,
        "reply_count": 45,
        "like_count": 890,
        "quote_count": 30,
        "bookmark_count": 55,
        "impression_count": 50000
      }
    }
  ],
  "includes": {
    "users": [
      {
        "id": "987654321",
        "name": "Elon Musk",
        "username": "elonmusk",
        "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg"
      }
    ]
  },
  "meta": {
    "newest_id": "1234567890123456789",
    "oldest_id": "1234567890123456780",
    "result_count": 10,
    "next_token": "b26v89c19zqg8o3fpdgk..."
  }
}
```

### Output Notes
- `meta.next_token` can be passed as `pagination_token` to fetch the next page.
- `includes.users` contains expanded author data for all tweets in the response.
