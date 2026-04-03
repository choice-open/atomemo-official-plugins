# firecrawl / get-batch-scrape-status

Retrieve status, progress, and results for a Firecrawl batch scrape job.

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
  "id": "batch_123456789",
  "status": "completed",
  "total": 2,
  "completed": 2,
  "data": [
    {
      "markdown": "# Page 1",
      "metadata": {
        "sourceURL": "https://example.com/page1"
      }
    }
  ]
}
```

### Output Notes
- The installed SDK types `getBatchScrapeStatus()` as `Promise<BatchScrapeJob>`, which includes `id`, `status`, `total`, `completed`, and a `data` array of scraped `Document` objects.
