# List external contact tags (`wechat-work-list-external-contact-tags`)

Calls `POST /externalcontact/get_corp_tag_list` to get enterprise external contact tags.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **tag_id** (optional): Tag IDs (JSON array)
- **group_id** (optional): Tag group IDs (JSON array)

## Output

Returns `{ errcode, errmsg, tag_group }` on success.