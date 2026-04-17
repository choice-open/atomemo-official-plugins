# Get staff info (`wechat-work-get-staff-info`)

Calls `POST /cgi-bin/hr/get_staff_info` to retrieve staff roster (HR) information for a specific employee.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **userid** (required): The employee's userid.
- **get_all** (optional): Whether to get all fields (default: false).
- **fieldids** (optional): JSON array of field IDs to retrieve. Format: `[{"fieldid":11004,"sub_idx":0}]`. Required when `get_all` is false.

## Output

Returns an array of field information, each containing:
- **fieldid**: Field ID
- **sub_idx**: Sub-index for repeatable fields
- **result**: Result status
- **value_type**: Value type (1: string, 2: photo, 3: number, 4: mobile, 5: text, 6: webview, 7: date, 8: department, 9: user, 10: file)
- **value_***: Field value based on value_type

## Notes

- The employee must be within the visible range of the application.
- Field IDs can be obtained via the "Get staff field configuration" API.
