# twitter / get-user-by-username

Get a user's profile by their username.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `twitter_credential` | `credential_id` | yes | — | Links to credential `twitter-oauth`. |
| `username` | `string` | yes | — | Twitter username without the @ symbol. |

### Example Input
```json
{
  "twitter_credential": "my-twitter-account",
  "username": "elonmusk"
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
    "id": "44196397",
    "name": "Elon Musk",
    "username": "elonmusk",
    "created_at": "2009-06-02T20:12:29.000Z",
    "description": "Mars & Cars, Chips & Dips",
    "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg",
    "public_metrics": {
      "followers_count": 180000000,
      "following_count": 800,
      "tweet_count": 35000,
      "listed_count": 120000
    },
    "verified": false
  }
}
```
