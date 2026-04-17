# Add corp tag (`wechat-work-add-corp-tag`)

Calls `POST /cgi-bin/externalcontact/add_corp_tag` to add enterprise customer tags.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **group_id** (required): Tag group ID.
- **tag_name** (required): Tag name (max 30 chars).
- **sort_order** (optional): Sort order (default 0).

## Output

Returns the created tag ID.