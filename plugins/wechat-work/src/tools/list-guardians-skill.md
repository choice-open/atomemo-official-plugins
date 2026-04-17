# List guardians (`wechat-work-list-guardians`)

Calls `GET /school/user/list_guardian` to retrieve the list of guardians (parents) in a school.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): The school ID
- **student_userid** (optional): Filter by specific student's userid to get related guardians
- **offset** (optional): Offset for pagination, default 0
- **limit** (optional): Maximum number of results, default 100, max 1000

## Output

Returns `{ guardians: Array<{ userid, name, mobile, students }>, offset, limit, total }` on success.
