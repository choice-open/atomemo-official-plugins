# Query Free/Busy Tool Documentation

## Tool

- **Name**: `query-freebusy`
- **Purpose**: Query free/busy intervals for one or more calendars or groups (`freeBusy.query`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `time_min` | `string` | `true` | `input` | Interval start (RFC3339 with offset). | `"2026-04-02T00:00:00Z"` |
| `time_max` | `string` | `true` | `input` | Interval end (RFC3339), after `time_min`. | `"2026-04-02T23:59:59Z"` |
| `items` | `string` | `true` | `input` | Comma-separated calendar or group IDs (`primary`, emails, etc.). | `"primary,user@example.com"` |
| `time_zone` | `string` | `false` | `input` | IANA timezone for the response (optional). | `"Asia/Shanghai"` |
| `group_expansion_max` | `number` | `false` | `number-input` | Max IDs expanded per group (1–100). | `50` |
| `calendar_expansion_max` | `number` | `false` | `number-input` | Max calendars in response (1–50). | `20` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "time_min": "2026-04-02T09:00:00Z",
    "time_max": "2026-04-02T18:00:00Z",
    "items": "primary"
  }
}
```

## Tool Output Example

```json
{
  "kind": "calendar#freeBusy",
  "calendars": {
    "primary": {
      "busy": [{ "start": "2026-04-02T10:00:00Z", "end": "2026-04-02T11:00:00Z" }]
    }
  }
}
```
