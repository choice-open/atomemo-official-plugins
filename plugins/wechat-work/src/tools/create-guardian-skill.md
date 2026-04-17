# Create guardian (`wechat-work-create-guardian`)

Calls `POST /school/user/create_guardian` to create a new guardian (parent) in a school.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **school_id** (required): The school ID
- **guardian_name** (required): Guardian's full name
- **mobile** (required): Guardian's mobile phone number
- **student_userid** (optional): The student userid to associate with this guardian
- **student_relation** (optional): Relationship to the student ("father", "mother", "guardian", "other")

## Output

Returns `{ errcode, errmsg, guardian_userid_list: Array<{ userid }> }` on success.
