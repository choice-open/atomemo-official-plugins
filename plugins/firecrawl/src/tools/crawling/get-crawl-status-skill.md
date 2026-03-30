# firecrawl / get-crawl-status

Retrieve the current status and progress information for a crawl job.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `id` | `string` | yes | - | Firecrawl crawl ID to inspect. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "id": "crl_123456789"
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
  "id": "crl_123456789",
  "status": "completed",
  "total": 42,
  "completed": 42,
  "data": [
    {
      "markdown": "# Example page",
      "metadata": {
        "sourceURL": "https://example.com/page"
      }
    }
  ]
}
```

### Output Notes
- The installed SDK types `getCrawlStatus()` as `Promise<CrawlJob>`, which includes `id`, `status`, `total`, `completed`, and a `data` array of scraped `Document` objects.
- Completed crawl-status responses may also include crawled data, depending on Firecrawl's response shape at the time of the request.
