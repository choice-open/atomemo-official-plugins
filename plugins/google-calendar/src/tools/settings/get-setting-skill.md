# Get Setting Tool Documentation

## Tool

- **Name**: `get-setting`
- **Purpose**: Get a single user setting by ID.

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `setting_id` | `string` | `true` | `input` | Setting key (e.g. `timezone`, `locale`, `weekStart`). | `"timezone"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "setting_id": "timezone"
  }
}
```

## Tool Output Example

```json
{
  "id": "timezone",
  "value": "Asia/Shanghai"
}
```
