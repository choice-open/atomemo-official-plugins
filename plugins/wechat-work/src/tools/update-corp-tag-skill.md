# Update corp tag (`wechat-work-update-corp-tag`)

Calls `POST /cgi-bin/externalcontact/update_corp_tag` to edit an enterprise customer tag.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **tag_id** (required): Tag ID to update.
- **tag_name** (optional): New tag name (max 30 chars).
- **sort_order** (optional): New sort order.

## Output

Returns success status.