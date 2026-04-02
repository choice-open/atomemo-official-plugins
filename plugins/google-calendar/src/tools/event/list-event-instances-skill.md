# List Event Instances Tool Documentation

## Tool

- **Name**: `list-event-instances`
- **Purpose**: List instances of a recurring event (`events.instances`).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID. | `"primary"` |
| `event_id` | `string` | `true` | `input` | Recurring event ID. | `"series_id_xxx"` |
| `use_time_range` | `boolean` | `false` | `switch` | When true, UI shows `time_min` / `time_max`. Default false. | `true` |
| `time_min` | `string` | `false` | `input` | RFC3339 timeMin (event end lower bound, exclusive). | `"2026-04-01T00:00:00Z"` |
| `time_max` | `string` | `false` | `input` | RFC3339 timeMax (event start upper bound, exclusive). | `"2026-04-30T23:59:59Z"` |
| `max_results` | `number` | `false` | `number-input` | Per-page max (default 250, max 2500). | `250` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "event_id": "series_event_id",
    "time_min": "2026-04-01T00:00:00Z",
    "time_max": "2026-04-07T23:59:59Z",
    "max_results": 100
  }
}
```

## Tool Output Example

```json
{
  "kind": "calendar#events",
  "items": [
    {
      "id": "instance_id_xxx",
      "recurringEventId": "series_event_id",
      "start": { "dateTime": "2026-04-01T09:00:00+08:00" }
    }
  ]
}
```
