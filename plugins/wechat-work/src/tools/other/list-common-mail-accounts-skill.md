# List common mail accounts (`wechat-work-list-common-mail-accounts`)

Calls `GET /cgi-bin/mail/common_mail_account/list` to get the list of common mail accounts.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **offset** (optional): Offset for pagination.
- **limit** (optional): Number of items per page (default 100).

## Output

Returns the list of common mail accounts.