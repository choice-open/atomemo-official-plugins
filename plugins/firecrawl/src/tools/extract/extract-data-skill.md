# firecrawl / extract-data

Start an asynchronous structured-data extraction job across one or more URLs.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `urls` | `string` | yes | - | Newline-delimited list of URLs to extract from. |
| `options` | `object` | no | - | Structured extract settings. Includes `useCustomBody` to switch to raw JSON request mode. |

### `options` fields

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `useCustomBody` | `boolean` | no | `false` | When `true`, send `customBody` instead of building the request from the fields below. |
| `prompt` | `string` | no | - | Instruction describing what structured information Firecrawl should extract. |
| `schema` | `string` | no | `{}` | JSON object string describing the expected extraction schema. The plugin parses this string into an object before sending it. |
| `enableWebSearch` | `boolean` | no | `false` | Allow Firecrawl to use web search during extraction. |
| `ignoreSitemap` | `boolean` | no | `false` | Skip sitemap hints when expanding the extraction target set. |
| `includeSubdomains` | `boolean` | no | `true` | Allow extraction to cover subdomains. |
| `showSources` | `boolean` | no | `false` | Request source attribution in the extraction result where available. |
| `ignoreInvalidURLs` | `boolean` | no | `true` | Skip invalid URLs instead of failing the request. |
| `scrapeOptions` | `object` | no | - | Shared scrape settings such as formats, actions, headers, tags, timeouts, location, caching, and proxy behavior. |
| `customBody` | `string` | no | `{}` | Raw JSON object string used as the request body when `useCustomBody` is enabled. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "urls": "https://example.com/products/a\nhttps://example.com/products/b",
  "options": {
    "prompt": "Extract product name, price, and availability.",
    "schema": "{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"price\":{\"type\":\"string\"},\"availability\":{\"type\":\"string\"}}}",
    "showSources": true
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
  "success": true,
  "id": "ext_123456789",
  "status": "processing"
}
```

### Output Notes
- The plugin splits `urls` on newlines before sending the request unless `options.useCustomBody` is enabled.
- The installed SDK types `startExtract()` as `Promise<ExtractResponse>`, with optional `success`, `id`, `status`, `data`, `error`, `warning`, `sources`, `expiresAt`, and `creditsUsed` fields.
