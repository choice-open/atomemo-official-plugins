export default `# twitter / create-tweet

Create a new tweet, optionally as a reply or quote tweet.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`twitter_credential\` | \`credential_id\` | yes | — | Links to credential \`twitter-oauth\`. |
| \`text\` | \`string\` | yes | — | The text content of the tweet. |
| \`reply_to_tweet_id\` | \`string\` | no | — | Tweet ID to reply to. |
| \`quote_tweet_id\` | \`string\` | no | — | Tweet ID to quote. |

### Cross-field Rules
- \`reply_to_tweet_id\` and \`quote_tweet_id\` are independent — you can set one, both, or neither.

### Example Input
\`\`\`json
{
  "twitter_credential": "my-twitter-account",
  "text": "Hello from Atomemo! 🚀",
  "reply_to_tweet_id": null,
  "quote_tweet_id": null
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
    "id": "1234567890123456789",
    "text": "Hello from Atomemo! 🚀",
    "edit_history_tweet_ids": ["1234567890123456789"]
  }
}
\`\`\`
`
