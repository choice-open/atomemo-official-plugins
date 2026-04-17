# Create student (`wechat-work-create-student`)

Calls `POST /school/user/create_student` to create a new student in a school.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): The school ID
- **student_name** (required): Student's full name
- **student_no** (optional): Student ID number
- **mobile** (optional): Student's mobile phone number
- **department_ids** (optional): Department (class) IDs, comma-separated, e.g., "1,2,3"
- **guardian_userid** (optional): Guardian userid to link
- **guardian_relation** (optional): Relationship ("father", "mother", "guardian", "other")

## Output

Returns `{ errcode, errmsg, student_userid_list: Array<{ userid, student_no }> }` on success.
