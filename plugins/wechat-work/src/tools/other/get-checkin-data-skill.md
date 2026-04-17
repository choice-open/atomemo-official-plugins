# Get checkin data (`wechat-work-get-checkin-data`)

Calls `POST /cgi-bin/checkin/getcheckindata` to retrieve checkin records.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **starttime** (required): Start Unix timestamp
- **endtime** (required): End Unix timestamp
- **userid** (required): JSON array of userids, e.g., `["user1","user2"]`

## Output

Returns checkin data records on success.