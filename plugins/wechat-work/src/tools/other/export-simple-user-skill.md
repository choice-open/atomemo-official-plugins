# Export members - simplified (`wechat-work-export-simple-user`)

Calls `POST /cgi-bin/export/simple_user` to export member information in simplified format.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **type** (required): Member type - `1` for active members, `2` for resigned members.
- **userid** (optional): Specific user ID to export. If empty, exports all members matching the type.
- **full_export** (optional): Whether to export all fields. Defaults to `true`.
- **cursor** (optional): Pagination cursor for retrieving subsequent pages.
- **limit** (optional): Maximum records per page (1-10000, default 10000).

## Output

Returns `job_id` for tracking the export task. Use `get-export-result` to retrieve results.
