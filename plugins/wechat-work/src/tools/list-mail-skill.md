# List mail (`wechat-work-list-mail`)

Calls `GET /cgi-bin/mail/list` to get the inbox email list.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **begin_time** (optional): Start time in Unix timestamp.
- **end_time** (optional): End time in Unix timestamp.
- **limit** (optional): Number of items per page (default 50).
- **cursor** (optional): Cursor for pagination.

## Output

Returns the list of emails with metadata.