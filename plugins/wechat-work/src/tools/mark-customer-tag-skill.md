# Mark customer tag (`wechat-work-mark-customer-tag`)

Calls `POST /cgi-bin/externalcontact/mark_tag` to add or remove tags from a customer.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **userid** (required): Userid of the staff who added the external contact.
- **external_userid** (required): External contact's userid.
- **add_tag_ids** (optional): JSON array of tag IDs to add.
- **remove_tag_ids** (optional): JSON array of tag IDs to remove.

## Output

Returns success status.