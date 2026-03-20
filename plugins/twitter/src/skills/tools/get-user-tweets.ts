export default `# twitter / get-user-tweets

Get tweets posted by a specific user.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`twitter_credential\` | \`credential_id\` | yes | — | Links to credential \`twitter-oauth\`. |
| \`user_id\` | \`string\` | yes | — | The unique identifier of the user. |
| \`max_results\` | \`integer\` | no | \`10\` | Number of results per page. Range: 1–100. |
| \`pagination_token\` | \`string\` | no | — | Token for fetching the next page of results. |

### Example Input
\`\`\`json
{
  "twitter_credential": "my-twitter-account",
  "user_id": "987654321",
  "max_results": 20
}
\`\`\`

## Credential

- Credential name: \`twitter-oauth\`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`client_id\` | \`string\` | yes | Twitter App Client ID. |
| \`client_secret\` | \`encrypted_string\` | yes | Twitter App Client Secret. |
| \`access_token\` | \`encrypted_string\` | no | OAuth 2.0 access token (auto-filled after authorization). |
| \`refresh_token\` | \`encrypted_string\` | no | OAuth 2.0 refresh token (auto-filled after authorization). |

## Success Output

\`\`\`json
{
  "data": [
    {
      "id": "1234567890123456789",
      "text": "Working on something exciting today!",
      "author_id": "987654321",
      "conversation_id": "1234567890123456789",
      "created_at": "2024-03-15T14:30:00.000Z",
      "public_metrics": {
        "retweet_count": 8,
        "reply_count": 3,
        "like_count": 42,
        "quote_count": 1,
        "bookmark_count": 5,
        "impression_count": 2000
      }
    }
  ],
  "includes": {
    "users": [
      {
        "id": "987654321",
        "name": "Jane Smith",
        "username": "janesmith",
        "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg"
      }
    ]
  },
  "meta": {
    "newest_id": "1234567890123456789",
    "oldest_id": "1234567890123456780",
    "result_count": 10,
    "next_token": "7140w9efigrh..."
  }
}
\`\`\`

### Output Notes
- \`meta.next_token\` can be passed as \`pagination_token\` to fetch the next page.
- \`includes.users\` contains expanded author data for all tweets in the response.
`
