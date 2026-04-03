# firecrawl / scrape-a-url-and-get-its-content

Scrape a single URL and return its extracted content.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `url` | `string` | yes | - | URL to scrape. |
| `options` | `object` | no | - | Structured scrape settings. Includes `useCustomBody` to switch to raw JSON request mode. |

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
  "url": "https://example.com/docs/getting-started",
  "options": {
    "scrapeOptions": {
      "formats": [
        {
          "type": "markdown"
        },
        {
          "type": "html"
        }
      ],
      "onlyMainContent": true,
      "timeout": 45000
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
  "success": true,
  "data": {
    "markdown": "# Getting Started",
    "metadata": {
      "title": "Getting Started",
      "sourceURL": "https://example.com/docs/getting-started"
    }
  }
}
```

### Output Notes
- Unlike most other tools in this plugin, this tool wraps Firecrawl's scrape response inside `{ "success": true, "data": ... }`.
- When `options.useCustomBody` is enabled, `options.customBody` is parsed as JSON and sent directly to Firecrawl.
