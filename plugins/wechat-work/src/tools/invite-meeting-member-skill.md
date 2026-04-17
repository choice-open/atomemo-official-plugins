# Invite meeting member (`wechat-work-invite-meeting-member`)

Calls `POST /cgi-bin/meeting/invite` to invite members to an ongoing meeting.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **meeting_id** (required): Meeting ID to invite members to.
- **userids** (optional): JSON array of user IDs to invite.
- **partyids** (optional): JSON array of department IDs to invite.

## Output

Returns operation result and invalid user/department IDs if any.
