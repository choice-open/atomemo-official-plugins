# twitter / get-followers

Get a list of users who follow a specific user.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `twitter_credential` | `credential_id` | yes | — | Links to credential `twitter-oauth`. |
| `user_id` | `string` | yes | — | The unique identifier of the user whose followers to retrieve. |
| `max_results` | `integer` | no | `10` | Number of results per page. Range: 1–100. |
| `pagination_token` | `string` | no | — | Token for fetching the next page of results. |

### Example Input
```json
{
  "twitter_credential": "my-twitter-account",
  "user_id": "987654321",
  "max_results": 20
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
      "id": "111222333",
      "name": "Alice Johnson",
      "username": "alicej",
      "created_at": "2021-03-10T12:00:00.000Z",
      "description": "Tech writer and blogger",
      "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg",
      "public_metrics": {
        "followers_count": 800,
        "following_count": 200,
        "tweet_count": 1500,
        "listed_count": 10
      },
      "verified": false
    }
  ],
  "meta": {
    "result_count": 10,
    "next_token": "a9sd8fhw..."
  }
}
```

### Output Notes
- `meta.next_token` can be passed as `pagination_token` to fetch the next page.
