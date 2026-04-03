export default `# jwt-toolkit / jwt-decoder

Decode a JWT token without verifying its signature. Useful for inspecting headers and payload.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`token\` | \`string\` | yes | — | The JWT token string to decode. |

### Example Input
\\\`\\\`\\\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTQyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzExMDAwMDAwLCJleHAiOjE3MTEwMDM2MDAsIm5iZiI6MTcxMDk5OTk5NX0.signature"
}
\\\`\\\`\\\`

## Credential

No credential required.

## Success Output

\\\`\\\`\\\`json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-42",
    "role": "admin",
    "iat": 1711000000,
    "exp": 1711003600,
    "nbf": 1710999995
  },
  "issued_at": "2024-03-21T12:00:00.000Z",
  "expires_at": "2024-03-21T13:00:00.000Z",
  "is_expired": false,
  "not_before": "2024-03-21T11:59:55.000Z"
}
\\\`\\\`\\\`

### Output Notes
- \`issued_at\`, \`expires_at\`, \`not_before\` are human-readable ISO timestamps — only present when the corresponding \`iat\`, \`exp\`, \`nbf\` claims exist in the payload.
- \`is_expired\` is only present when \`exp\` exists. It reflects whether the token is expired at the time of decoding.
`
