# Get Colors Tool Documentation

## Tool

- **Name**: `get-colors`
- **Purpose**: Get calendar and event color definitions (IDs for UI and API).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx"
  }
}
```

## Tool Output Example

```json
{
  "calendar": {
    "1": { "background": "#ac725e", "foreground": "#1d1d1d" }
  },
  "event": {
    "1": { "background": "#a4bdfc", "foreground": "#1d1d1d" }
  }
}
```
