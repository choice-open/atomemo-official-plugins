# firecrawl / batch-scrape

Start a batch scrape job for multiple URLs at once.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `urls` | `string` | yes | - | Newline-delimited list of URLs to scrape in a single batch job. |
| `options` | `object` | no | - | Structured batch-scrape settings. Includes `useCustomBody` to switch to raw JSON request mode. |

### `options` fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `useCustomBody` | `boolean` | no | `false` | When `true`, send `customBody` instead of building the request from the fields below. |
| `parsers` | `array<string>` | no | `["pdf"]` | Parser list for specialized extraction. The plugin currently exposes Firecrawl's `pdf` parser option. |
| `scrapeOptions` | `object` | no | - | Shared scrape settings such as formats, actions, headers, tags, timeouts, location, caching, and proxy behavior. |
| `customBody` | `string` | no | `{}` | Raw JSON object string used as the request body when `useCustomBody` is enabled. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "urls": "https://example.com/page1\nhttps://example.com/page2",
  "options": {
    "scrapeOptions": {
      "formats": [
        {
          "type": "markdown"
        }
      ],
      "onlyMainContent": true
    }
  }
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
  "url": "https://example.com/page1",
  "invalidURLs": []
}
```

### Output Notes
- The plugin splits `urls` on newlines before sending the request unless `options.useCustomBody` is enabled.
- The installed SDK types `startBatchScrape()` as `Promise<BatchScrapeResponse>`, which includes `id`, `url`, and optional `invalidURLs`.
