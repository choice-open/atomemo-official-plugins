# List admin mailboxes (`wechat-work-list-admin-mailboxes`)

Calls `GET /cgi-bin/mail/admin_mailbox/list` to get the list of admin mailboxes.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **offset** (optional): Offset for pagination.
- **limit** (optional): Number of items per page (default 100).

## Output

Returns the list of admin mailboxes.