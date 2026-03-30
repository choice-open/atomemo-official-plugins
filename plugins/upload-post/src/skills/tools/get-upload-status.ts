export default `# upload-post / get-upload-status

Query Upload-Post task status by a previously returned request ID.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`credentialId\` | \`credential_id\` | yes | — | Links to credential \`upload-post-api-key\`. |
| \`request_id\` | \`string\` | yes | — | Request ID returned by \`upload_media\`. |

### Example Input
\`\`\`json
{
  "credentialId": "upload-post-prod",
  "request_id": "req_8a5f4d2f"
}
\`\`\`

## Credential

- Credential name: \`upload-post-api-key\`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`api_key\` | \`encrypted_string\` | yes | Upload-Post API key used for authenticated API requests. |

## Success Output

What the user receives on success:

\`\`\`json
{
  "request_id": "req_8a5f4d2f",
  "status": "done"
}
\`\`\`

### Output Notes
- Returns the API status payload as-is. Additional fields may be present depending on Upload-Post response (Inferred).
`
