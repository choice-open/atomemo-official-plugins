# Get meeting room details (`wechat-work-get-room`)

Calls `GET /cgi-bin/rooms/get` to get details of a specific meeting room.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **room_id** (required): Room ID to get details for.

## Output

Returns room details including name, capacity, building, floor, etc.