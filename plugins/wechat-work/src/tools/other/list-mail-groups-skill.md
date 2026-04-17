# List mail groups (`wechat-work-list-mail-groups`)

Calls `GET /cgi-bin/mail/group/list` to get the list of mail groups.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **offset** (optional): Offset for pagination.
- **limit** (optional): Number of items per page (default 100).

## Output

Returns the list of mail groups.