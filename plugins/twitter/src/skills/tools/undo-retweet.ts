export default `# twitter / undo-retweet

Undo a retweet of a tweet.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`twitter_credential\` | \`credential_id\` | yes | — | Links to credential \`twitter-oauth\`. |
| \`tweet_id\` | \`string\` | yes | — | The unique identifier of the tweet to un-retweet. |

### Example Input
\`\`\`json
{
  "twitter_credential": "my-twitter-account",
  "tweet_id": "1234567890123456789"
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
    "retweeted": false
  }
}
\`\`\`
`
