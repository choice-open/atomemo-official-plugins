# firecrawl / map-website

Map a site and return discovered URLs without scraping each page in full.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `url` | `string` | yes | - | Starting URL for sitemap/link discovery. |
| `options` | `object` | no | - | Structured map settings. Includes `useCustomBody` to switch to raw JSON request mode. |

### `options` fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `useCustomBody` | `boolean` | no | `false` | When `true`, send `customBody` instead of building the request from the fields below. |
| `search` | `string` | no | - | Optional search phrase to focus mapped URLs. |
| `sitemap` | `string` | no | `include` | Sitemap handling mode. Allowed values: `skip`, `include`, `only`. |
| `includeSubdomains` | `boolean` | no | `true` | Include URLs discovered on subdomains. |
| `ignoreQueryParameters` | `boolean` | no | `true` | Treat URLs that only differ by query string as the same page. |
| `limit` | `integer` | no | `5000` | Maximum number of URLs to return. |
| `timeout` | `integer` | no | `10000` | Timeout in milliseconds for the map request. |
| `customBody` | `string` | no | `{}` | Raw JSON object string used as the request body when `useCustomBody` is enabled. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "url": "https://example.com",
  "options": {
    "search": "pricing docs",
    "limit": 200,
    "includeSubdomains": false
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
  "links": [
    {
      "url": "https://example.com/",
      "title": "Home"
    },
    {
      "url": "https://example.com/docs",
      "title": "Docs"
    }
  ]
}
```

### Output Notes
- The installed SDK types `map()` as `Promise<MapData>`, where `links` is an array of search-result objects rather than plain strings.
- When `options.useCustomBody` is enabled, `options.customBody` is parsed as JSON and sent directly to Firecrawl.
