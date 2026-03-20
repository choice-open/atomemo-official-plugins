export default `# twitter / get-me

Get the authenticated user's Twitter profile information.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`twitter_credential\` | \`credential_id\` | yes | — | Links to credential \`twitter-oauth\`. |

### Example Input
\`\`\`json
{
  "twitter_credential": "my-twitter-account"
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
    "id": "123456789",
    "name": "John Doe",
    "username": "johndoe",
    "created_at": "2020-01-15T10:30:00.000Z",
    "description": "Software developer and open source enthusiast",
    "profile_image_url": "https://pbs.twimg.com/profile_images/xxx/photo.jpg",
    "public_metrics": {
      "followers_count": 1500,
      "following_count": 300,
      "tweet_count": 4200,
      "listed_count": 25
    },
    "verified": false
  }
}
\`\`\`
`
