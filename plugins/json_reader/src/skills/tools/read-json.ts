export default `# json_reader / read-json

Parse an uploaded file as a JSON object. Automatically detects and strips BOM headers (UTF-8, UTF-16 LE/BE, UTF-32 LE/BE) before parsing.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`file\` | \`file_ref\` | yes | — | The file to parse as JSON. Must contain valid JSON content. |

### Example Input
\`\`\`json
{
  "file": "<file_ref:uploaded-data.json>"
}
\`\`\`

## Credential

No credential required.

## Success Output

Returns the parsed JSON value directly — the shape depends on the file content.

\`\`\`json
{
  "hello": "world",
  "num": 42
}
\`\`\`
`
