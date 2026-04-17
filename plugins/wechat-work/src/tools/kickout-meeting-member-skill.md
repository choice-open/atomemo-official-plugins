# Kickout meeting member (`wechat-work-kickout-meeting-member`)

Calls `POST /cgi-bin/meeting/kickout` to remove a member from an ongoing meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to kick member from.
- **userid** (required): User ID to kick out.

## Output

Returns operation result.
