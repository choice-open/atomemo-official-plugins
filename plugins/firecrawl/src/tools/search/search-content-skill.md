# firecrawl / search-content

Search the web through Firecrawl and optionally enrich results with scrape output.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `query` | `string` | yes | - | Search query to send to Firecrawl. |
| `options` | `object` | no | - | Structured search settings. Includes `useCustomBody` to switch to raw JSON request mode. |

### `options` fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `useCustomBody` | `boolean` | no | `false` | When `true`, send `customBody` instead of building the request from the fields below. |
| `limit` | `integer` | no | `5` | Maximum number of search results to return. |
| `sources` | `array<object>` | no | - | Source selectors such as `{ "type": "web" }`, `{ "type": "images" }`, or `{ "type": "news" }`. Web sources can also include `tbs` and `location`. |
| `categories` | `array<object>` | no | - | Optional result categories such as `{ "type": "github" }`, `{ "type": "research" }`, or `{ "type": "pdf" }`. |
| `tbs` | `string` | no | - | Time-based search string used by Firecrawl search. |
| `location` | `string` | no | - | Location hint for search ranking. |
| `country` | `string` | no | `US` | Country code for localized search behavior. |
| `timeout` | `integer` | no | `60000` | Timeout in milliseconds for the search request. |
| `ignoreInvalidURLs` | `boolean` | no | `false` | Skip invalid URLs returned by upstream search sources. |
| `scrapeOptions` | `object` | no | - | Shared scrape settings applied when Firecrawl enriches results with scraped content. |
| `customBody` | `string` | no | `{}` | Raw JSON object string used as the request body when `useCustomBody` is enabled. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "query": "open source vector database comparison",
  "options": {
    "limit": 3,
    "sources": [
      {
        "type": "web"
      },
      {
        "type": "news"
      }
    ],
    "categories": [
      {
        "type": "research"
      }
    ],
    "scrapeOptions": {
      "formats": [
        {
          "type": "markdown"
        }
      ]
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
  "web": [
    {
      "url": "https://example.com/article",
      "title": "Vector DB Comparison",
      "description": "A comparison of open source vector databases."
    }
  ],
  "news": [
    {
      "title": "Vector database funding update",
      "url": "https://news.example.com/vector-db",
      "snippet": "Recent funding activity in the vector database market."
    }
  ]
}
```

### Output Notes
- The installed SDK types `search()` as `Promise<SearchData>`, grouping results under optional `web`, `news`, and `images` arrays rather than a top-level `data` field.
- When `options.useCustomBody` is enabled, `options.customBody` is parsed as JSON and sent directly to Firecrawl.
