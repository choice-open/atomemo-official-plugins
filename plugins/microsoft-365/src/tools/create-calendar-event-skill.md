# Create calendar event

## Tool

- **Name**: `create-calendar-event`
- **Purpose**:
  - Schedule a **one-off** (non-recurring) item on the signed-in user’s **default** Outlook calendar using Microsoft Graph **`POST /me/events`**.
  - Optionally add a **Microsoft Teams** join link by setting `teams_online_meeting` (maps to `isOnlineMeeting` and `onlineMeetingProvider: teamsForBusiness` on the event).
  - Optionally **invite people** with `attendees` (email list); they are added as required attendees and Exchange sends invitations per your tenant policy.
  - Use `body` and `location` for agenda notes and a human-readable location label; combine Teams + attendees when you need a booked slot, a Teams bridge, and invited participants in one step.

## Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `credential_id` | credential_id | yes | Microsoft 365 OAuth2 credential with a valid `access_token`. |
| `subject` | string | yes | Event title. |
| `start_datetime` | string | yes | Start local time for `time_zone`, e.g. `2025-04-02T10:00:00` (no `Z` suffix when using a named zone). |
| `end_datetime` | string | yes | End local time, same format as `start_datetime`. |
| `time_zone` | string | no | IANA or Windows time zone name; defaults to `UTC` if empty. |
| `location` | string | no | Location display name. |
| `teams_online_meeting` | boolean | no | When `true`, sets `isOnlineMeeting` and `onlineMeetingProvider: teamsForBusiness`. Default `false`. |
| `attendees` | string | no | Invitees as comma-, semicolon-, or whitespace-separated email addresses. **UI:** only shown when `teams_online_meeting` is `true`. |
| `body` | string | no | Plain-text body. |

## Example

```json
{
  "parameters": {
    "credential_id": "<credential id>",
    "subject": "Team sync",
    "start_datetime": "2025-04-03T14:00:00",
    "end_datetime": "2025-04-03T15:00:00",
    "time_zone": "UTC",
    "location": "Building A",
    "teams_online_meeting": true,
    "attendees": "ada@contoso.com, bob@contoso.com",
    "body": "Agenda: …"
  }
}
```

## Output

Returns Graph `event` fields including `id`, `webLink`, `start`, `end`, `onlineMeetingUrl`, and `onlineMeeting` (e.g. `joinUrl`) when applicable.
