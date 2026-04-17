# Get smartsheet info (`wechat-work-get-smartsheet`)

Calls `POST /cgi-bin/wedoc/smartsheet/get_sheet` to query information about a smartsheet tab.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **sheet_id** (required): The smartsheet tab ID to query.

## Output

Returns smartsheet tab info:
- **sheet_id**: Tab ID
- **title**: Tab title
- **write_cnt**: Number of editable users
- **columns**: Column definitions (column_id, column_name, type)
