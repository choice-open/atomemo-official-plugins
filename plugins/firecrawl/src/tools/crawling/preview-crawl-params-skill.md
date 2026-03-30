# firecrawl / preview-crawl-params

Ask Firecrawl to suggest crawl parameters for a URL based on a natural-language prompt.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `url` | `string` | yes | - | Website URL to analyze. |
| `prompt` | `string` | yes | - | Instruction telling Firecrawl how to shape the crawl configuration. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "url": "https://example.com",
  "prompt": "Suggest a crawl config that focuses on blog posts and skips legal pages."
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
  "includePaths": [
    "/blog"
  ],
  "excludePaths": [
    "/privacy",
    "/terms"
  ]
}
```

### Output Notes
- The installed SDK types `crawlParamsPreview()` as `Promise<Record<string, unknown>>`, so the preview payload is intentionally open-ended.
