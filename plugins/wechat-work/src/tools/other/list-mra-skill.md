# List MRA (`wechat-work-list-mra`)

Calls `GET /cgi-bin/mra/list` to get list of MRA (Meeting Room Connector) devices.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **status** (optional): Filter by status (0: online, 1: offline).

## Output

Returns MRA device list with status information.
