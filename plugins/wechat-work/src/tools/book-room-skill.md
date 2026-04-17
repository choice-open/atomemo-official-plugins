# Book meeting room (`wechat-work-book-room`)

Calls `POST /cgi-bin/rooms/book` to book a meeting room.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **room_id** (required): Room ID to book.
- **start_time** (required): Start time (Unix timestamp).
- **end_time** (required): End time (Unix timestamp).
- **booker_id** (optional): User ID of the booker.
- **title** (optional): Booking title.
- **description** (optional): Booking description.

## Output

Returns booking result.