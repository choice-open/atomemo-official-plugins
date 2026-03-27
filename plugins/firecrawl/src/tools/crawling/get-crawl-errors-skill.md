# firecrawl / get-crawl-errors

Fetch the error list for a crawl job so failed pages can be inspected separately.

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
  "errors": [
    {
      "id": "err_123",
      "url": "https://example.com/broken",
      "error": "Navigation timeout exceeded"
    }
  ],
  "robotsBlocked": []
}
```

### Output Notes
- The installed SDK types this response as `CrawlErrorsResponse`, with `errors` and `robotsBlocked` fields.
