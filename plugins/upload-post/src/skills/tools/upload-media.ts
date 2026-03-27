export default `# upload-post / upload-media

Submit a media URL to Upload-Post for multi-platform publishing.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`credentialId\` | \`credential_id\` | yes | — | Links to credential \`upload-post-api-key\`. |
| \`user\` | \`string\` | yes | — | Upload-Post profile identifier used to route the post to a related profile. |
| \`platforms\` | \`array<string>\` | yes | — | One or more target platforms. Allowed values: \`tiktok\`, \`instagram\`, \`youtube\`, \`facebook\`, \`linkedin\`, \`x\`, \`threads\`, \`pinterest\`, \`reddit\`, \`bluesky\`. |
| \`title\` | \`string\` | no | — | Post title/caption text sent when provided. |
| \`media_url\` | \`string\` | yes | — | Public URL of the media to publish. |
| \`media_type\` | \`string\` | no | \`"video"\` | Media category selector. Allowed values: \`video\`, \`image\`. |

### Cross-field Rules
- If \`media_type\` is \`image\`, \`platforms\` cannot include \`youtube\`.

### Example Input
\`\`\`json
{
  "credentialId": "upload-post-prod",
  "user": "brand_profile_main",
  "platforms": ["instagram", "x", "threads"],
  "title": "New product teaser drops today",
  "media_url": "https://cdn.example.com/media/teaser-2026-03-27.jpg",
  "media_type": "image"
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
  "message": "submitted",
  "total_platforms": 3
}
\`\`\`
`
