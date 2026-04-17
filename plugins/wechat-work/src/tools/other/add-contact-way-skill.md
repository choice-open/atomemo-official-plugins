# Add contact way (`wechat-work-add-contact-way`)

Calls `POST /cgi-bin/externalcontact/add_contact_way` to configure a contact way.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **type** (required): Contact way type (1: single customer, 2: group).
- **scene** (required): Scene (1: QR code, 2: phone, 3: meeting).
- **style** (optional): Style (1-9).
- **remark** (optional): Remark.
- **question_list** (optional): JSON array of {question, answer}.
- **add_user_tags** (optional): JSON array of tag IDs to add.
- **contact_user** (optional): JSON array of userids for customer service.
- **contact_type** (optional): Contact type (1: by user, 2: by phone).
- **phone** (optional): Phone number list (for phone scene).
- **skip_verify** (optional): Whether to skip verification (true/false).
- **state** (optional): Custom state parameter.
- **group_chat_id** (optional): Group chat ID for group contact way.
- **expire_time** (optional): Expire time (Unix timestamp).
- **unionid** (optional): WeChat unionid.

## Output

Returns the config_id.