# Download meeting record (`wechat-work-download-meeting-record`)

Calls `GET /cgi-bin/meeting/record/download` to get download URL for a meeting recording file.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to download recording.
- **record_id** (optional): Specific record ID if multiple recordings exist.

## Output

Returns download URL and file size.
