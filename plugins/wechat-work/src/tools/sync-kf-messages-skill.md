# Sync KF messages (`wechat-work-sync-kf-messages`)

Calls `POST /cgi-bin/kf/sync_msg` to sync customer service messages and events from the last 3 days.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **cursor** (optional): Cursor for pagination.
- **limit** (optional): Number of messages to retrieve (default 100, max 1000).

## Output

Returns the message list and next cursor.