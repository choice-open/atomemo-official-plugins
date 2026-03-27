# firecrawl / list-active-crawls

List crawl jobs that are still active for the authenticated Firecrawl account.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | yes | - | Links to credential `firecrawl`. |

### Example Input
```json
{
  "credentialId": "my-firecrawl-account"
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
  "crawls": [
    {
      "id": "crl_123456789",
      "teamId": "team_123",
      "url": "https://example.com",
      "options": {
        "limit": 250
      }
    }
  ]
}
```

### Output Notes
- The installed SDK types each active crawl with `id`, `teamId`, `url`, and optional `options`; it does not guarantee a `status` field here.
