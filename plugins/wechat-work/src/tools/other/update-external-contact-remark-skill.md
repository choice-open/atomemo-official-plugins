# Update external contact remark (`wechat-work-update-external-contact-remark`)

Calls `POST /cgi-bin/externalcontact/remark` to update the remark of an external contact.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **userid** (required): Userid of the staff who added the external contact.
- **external_userid** (required): External contact's userid.
- **remark** (optional): New remark for the external contact (max 500 chars).
- **description** (optional): Description of the external contact (max 500 chars).
- **add_remark_media_id** (optional): Media ID of the remark image.
- **remark_corp_name** (optional): Corp name of the external contact.
- **remark_corp_full_name** (optional): Full corp name of the external contact.

## Output

Returns success status.