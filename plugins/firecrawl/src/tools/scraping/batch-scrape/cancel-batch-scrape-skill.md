# firecrawl / cancel-batch-scrape

Cancel a running Firecrawl batch scrape job.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |
| `batchId` | `string` | yes | - | Batch scrape ID to cancel. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account",
  "batchId": "batch_123456789"
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
- The installed `@mendable/firecrawl-js` client types `cancelBatchScrape()` as `Promise<boolean>`, so a successful result is the boolean `true`.
