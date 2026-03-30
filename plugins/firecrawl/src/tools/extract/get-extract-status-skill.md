# firecrawl / get-extract-status

Retrieve status and results for a previously started Firecrawl extract job.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `id` | `string` | yes | - | Extract job ID to inspect. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "id": "ext_123456789"
}
```

## Credential

- Credential name: `firecrawl`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `api_key` | `encrypted_string` | yes | Firecrawl API key used to authenticate requests. The plugin expects a value that starts with `fc-`. |

## Success Output

```json
{
  "success": true,
  "id": "ext_123456789",
  "status": "completed",
  "data": [
    {
      "name": "Example Product",
      "price": "$99",
      "availability": "In stock"
    }
  ],
  "expiresAt": "2026-03-27T12:00:00.000Z"
}
```

### Output Notes
- The installed SDK types `getExtractStatus()` as `Promise<ExtractResponse>`, so `data` remains `unknown` at the SDK level and depends on the schema/prompt you used when starting the job.
