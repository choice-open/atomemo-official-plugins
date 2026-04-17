# List external contacts (`wechat-work-list-external-contacts`)

Calls `GET /externalcontact/list` to get the list of external contacts.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`

## Output

Returns `{ external_userid: string[] }` on success.