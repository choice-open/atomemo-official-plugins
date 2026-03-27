# firecrawl / cancel-crawl

Cancel a running Firecrawl crawl job by its crawl ID.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `id` | `string` | yes | - | Firecrawl crawl ID to cancel. |

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
true
```

### Output Notes
- The installed `@mendable/firecrawl-js` client types `cancelCrawl()` as `Promise<boolean>`, so a successful result is the boolean `true`.
