# Clear Calendar Tool Documentation

## Tool

- **Name**: `clear-calendar`
- **Purpose**: Permanently delete all events from the primary calendar only (irreversible).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Must be `primary` (readonly in UI). | `"primary"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary"
  }
}
```

## Tool Output Example

```json
{}
```
