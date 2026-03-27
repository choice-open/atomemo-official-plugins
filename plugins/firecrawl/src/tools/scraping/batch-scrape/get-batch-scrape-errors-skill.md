# firecrawl / get-batch-scrape-errors

Fetch the error list for a Firecrawl batch scrape job.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `batchId` | `string` | yes | - | Batch scrape ID to inspect. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "batchId": "batch_123456789"
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
  "errors": [
    {
      "id": "err_456",
      "url": "https://example.com/missing",
      "error": "404 Not Found"
    }
  ],
  "robotsBlocked": []
}
```

### Output Notes
- The installed SDK types this response as `CrawlErrorsResponse`, with `errors` and `robotsBlocked` fields.
