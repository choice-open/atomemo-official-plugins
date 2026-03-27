# firecrawl / crawl-a-website

Start an asynchronous website crawl and return Firecrawl's crawl job metadata.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `url` | `string` | yes | - | Starting URL for the crawl job. |
| `requestOptions` | `object` | no | - | Structured crawl request fields. Includes `useCustomBody` to switch between form-based input and raw JSON body mode. |

### `requestOptions` fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `useCustomBody` | `boolean` | no | `false` | When `true`, ignore the structured fields below and send `customBody` as the crawl payload. |
| `prompt` | `string` | no | - | Natural-language crawl guidance for Firecrawl. |
| `limit` | `integer` | no | `10000` | Maximum number of pages to crawl. |
| `delay` | `integer` | no | `123` | Delay between crawl requests in milliseconds. |
| `maxConcurrency` | `integer` | no | `8` | Maximum number of concurrent crawl workers. |
| `excludePaths` | `array<string>` | no | - | Path patterns to skip. |
| `includePaths` | `array<string>` | no | - | Restrict the crawl to specific path patterns. |
| `sitemap` | `string` | no | `include` | Sitemap handling mode. Allowed values: `include`, `skip`. |
| `ignoreQueryParameters` | `boolean` | no | `false` | Treat URLs that only differ by query string as the same page. |
| `allowExternalLinks` | `boolean` | no | `false` | Permit crawling links that leave the starting domain. |
| `allowSubdomains` | `boolean` | no | `false` | Permit crawling subdomains of the starting URL. |
| `scrapeOptions` | `object` | no | - | Shared scrape options such as output formats, headers, actions, timeouts, location, and proxy settings. |
| `customBody` | `string` | no | `{}` | Raw JSON object string sent directly to Firecrawl when `useCustomBody` is enabled. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "url": "https://example.com",
  "requestOptions": {
    "prompt": "Crawl only product and docs pages relevant to pricing.",
    "limit": 250,
    "includePaths": [
      "/docs",
      "/pricing"
    ],
    "excludePaths": [
      "/privacy",
      "/terms"
    ],
    "allowSubdomains": false,
    "scrapeOptions": {
      "formats": [
        {
          "type": "markdown"
        },
        {
          "type": "links"
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
  "id": "crl_123456789",
  "url": "https://example.com"
}
```

### Output Notes
- The installed SDK types `startCrawl()` as `Promise<CrawlResponse>`, which includes `id` and `url`.
- When `requestOptions.useCustomBody` is `true`, the plugin parses `requestOptions.customBody` as JSON and sends that object instead of assembling a request from the individual fields.
