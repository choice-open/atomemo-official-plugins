# List meeting rooms (`wechat-work-list-rooms`)

Calls `GET /cgi-bin/rooms/list` to get a list of meeting rooms.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **offset** (optional): Offset for pagination.
- **limit** (optional): Number of rooms to return.

## Output

Returns list of meeting rooms with their details.