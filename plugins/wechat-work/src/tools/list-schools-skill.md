# List schools (`wechat-work-list-schools`)

Calls `GET /school/list` to retrieve the list of schools in WeChat Work education module.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`

## Output

Returns `{ school_list: Array<{ school_name, school_id, principal_userid, jointype, create_time, visible_upgrade_switches }> }` on success.
