# Handle report (`wechat-work-handle-report`)

Calls `POST /report/resident/deal` to handle (accept, assign, reject, or complete) a report.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **order_id** (required): The order ID to handle
- **action_type** (required): Action type (2-Accept, 3-Assign, 4-Transfer, 5-Complete, 6-Reject, 7-Processing)
- **assign_userid** (optional): User ID to assign (required for action type 3 or 4)
- **process_desc** (optional): Description of the handling process
- **image_urls** (optional): Comma-separated process image URLs

## Output

Returns `{ success: true }` on success.
