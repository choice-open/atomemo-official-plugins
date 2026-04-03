# List Events Tool Documentation

## Tool

- **Name**: `list-events`
- **Purpose**: List events via Calendar API v3 `events.list` (supports filters, pagination, incremental sync).

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credential_id` | `credential_id` | `true` | `credential-select` | Credential ID for `google-calendar-oauth2`. | `"cred_xxx"` |
| `calendar_id` | `string` | `true` | `input` | Calendar ID. | `"primary"` |
| `max_results` | `number` | `false` | `number-input` | Max events per page (default 250, max 2500). | `250` |
| `page_token` | `string` | `false` | `input` | `pageToken` from a previous `nextPageToken`. | `"token_xxx"` |
| `sync_token` | `string` | `false` | `input` | Incremental sync; cannot mix with time/search/order filters. | `"sync_xxx"` |
| `time_min` | `string` | `false` | `input` | RFC3339 lower bound (exclusive) on event end time. | `"2026-04-01T00:00:00Z"` |
| `time_max` | `string` | `false` | `input` | RFC3339 upper bound (exclusive) on event start time. | `"2026-04-30T23:59:59Z"` |
| `time_zone` | `string` | `false` | `input` | IANA timezone for response times. | `"Asia/Shanghai"` |
| `q` | `string` | `false` | `input` | Free-text search. | `"standup"` |
| `i_cal_uid` | `string` | `false` | `input` | Filter by iCalUID. | `"uid@google.com"` |
| `single_events` | `boolean` | `false` | `switch` | Expand recurring events into instances. Default false. | `true` |
| `order_by` | `string` | `false` | `select` | `startTime` (needs `single_events`) or `updated`. | `"startTime"` |
| `event_types` | `string` | `false` | `input` | Comma-separated: `birthday`, `default`, `focusTime`, etc. | `"default"` |
| `private_extended_properties` | `string` | `false` | `input` | Comma-separated `name=value` (private). | `"k=v"` |
| `shared_extended_properties` | `string` | `false` | `input` | Comma-separated `name=value` (shared). | `"k=v"` |
| `show_deleted` | `boolean` | `false` | `switch` | Include cancelled events. Default false. | `false` |
| `show_hidden_invitations` | `boolean` | `false` | `switch` | Include hidden invitations. Default false. | `false` |
| `updated_min` | `string` | `false` | `input` | RFC3339 lower bound on last modification time. | `"2026-04-01T00:00:00Z"` |
| `max_attendees` | `number` | `false` | `number-input` | Max attendees per event in the response. | `10` |
| `fields` | `string` | `false` | `input` | Partial response field mask (Google `fields`). | `"items(id,summary)"` |

## Tool Input Example

```json
{
  "parameters": {
    "credential_id": "cred_xxx",
    "calendar_id": "primary",
    "max_results": 50,
    "time_min": "2026-04-01T00:00:00Z",
    "time_max": "2026-04-07T23:59:59Z",
    "single_events": true,
    "order_by": "startTime"
  }
}
```

## Tool Output Example

```json
{
  "kind": "calendar#events",
  "items": [
    {
      "id": "event_id_xxx",
      "summary": "Meeting"
    }
  ],
  "nextPageToken": "next_page_token"
}
```
