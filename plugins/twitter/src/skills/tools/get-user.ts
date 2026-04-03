export default `# twitter / get-user

Get a user's profile by their user ID.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`twitter_credential\` | \`credential_id\` | yes | — | Links to credential \`twitter-oauth\`. |
| \`user_id\` | \`string\` | yes | — | The unique identifier of the user. |

### Example Input
\`\`\`json
{
  "twitter_credential": "my-twitter-account",
  "user_id": "987654321"
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
  "data": {
    "id": "987654321",
    "name": "Jane Smith",
    "username": "janesmith",
    "created_at": "2019-06-20T08:15:00.000Z",
    "description": "Product designer at Acme Corp. Coffee enthusiast.",
    "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg",
    "public_metrics": {
      "followers_count": 2500,
      "following_count": 450,
      "tweet_count": 3100,
      "listed_count": 40
    },
    "verified": false
  }
}
\`\`\`
`
