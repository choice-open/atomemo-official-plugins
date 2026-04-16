# twitter / get-tweet

Get a tweet by ID with author details.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `twitter_credential` | `credential_id` | yes | — | Links to credential `twitter-oauth`. |
| `tweet_id` | `string` | yes | — | The unique identifier of the tweet. |

### Example Input
```json
{
  "twitter_credential": "my-twitter-account",
  "tweet_id": "1234567890123456789"
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
  "data": {
    "id": "1234567890123456789",
    "text": "Just shipped a new feature! 🎉",
    "author_id": "987654321",
    "conversation_id": "1234567890123456789",
    "created_at": "2024-03-15T14:30:00.000Z",
    "public_metrics": {
      "retweet_count": 12,
      "reply_count": 5,
      "like_count": 48,
      "quote_count": 3,
      "bookmark_count": 2,
      "impression_count": 1500
    },
    "edit_history_tweet_ids": ["1234567890123456789"]
  },
  "includes": {
    "users": [
      {
        "id": "987654321",
        "name": "Jane Smith",
        "username": "janesmith",
        "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg"
      }
    ]
  }
}
```
