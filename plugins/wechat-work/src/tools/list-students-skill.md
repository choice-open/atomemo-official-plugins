# List students (`wechat-work-list-students`)

Calls `GET /school/user/list_student` to retrieve the list of students in a school.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): The school ID
- **department_id** (optional): Filter by department (class) ID
- **fetch_child** (optional): Whether to recursively fetch students from child departments (default: false)
- **offset** (optional): Offset for pagination, default 0
- **limit** (optional): Maximum number of results, default 100, max 1000

## Output

Returns `{ students: Array<{ userid, name, student_no, parents, department_ids, mobile }>, offset, limit, total }` on success.
