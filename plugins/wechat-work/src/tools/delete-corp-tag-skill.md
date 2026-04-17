# Delete corp tag (`wechat-work-delete-corp-tag`)

Calls `POST /cgi-bin/externalcontact/del_corp_tag` to delete enterprise customer tags.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **tag_id** (optional): Tag ID to delete (mutually exclusive with group_id).
- **group_id** (optional): Group ID to delete (mutually exclusive with tag_id).

## Output

Returns success status.