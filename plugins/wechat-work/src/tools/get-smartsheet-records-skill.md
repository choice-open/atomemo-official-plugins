# Get smartsheet records (`wechat-work-get-smartsheet-records`)

Calls `POST /cgi-bin/wedoc/smartsheet/get_records` to query records from a smartsheet tab.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **sheet_id** (required): The smartsheet tab ID.
- **filter** (optional): JSON filter conditions for querying specific records.
- **limit** (optional): Maximum number of records to return (default 100).
- **offset** (optional): Number of records to skip for pagination (default 0).

## Output

Returns query results:
- **total**: Total number of matching records
- **records**: Array of record objects
