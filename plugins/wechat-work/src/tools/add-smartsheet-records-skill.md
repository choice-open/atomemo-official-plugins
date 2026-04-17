# Add smartsheet records (`wechat-work-add-smartsheet-records`)

Calls `POST /cgi-bin/wedoc/smartsheet/add_records` to add new records to a smartsheet tab.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **sheet_id** (required): The smartsheet tab ID.
- **records** (required): JSON array of record objects to add. Each record should match the smartsheet column structure.

## Output

Returns result for each record:
- **row_id**: ID of the created row
- **errcode/errmsg**: Status for each record
