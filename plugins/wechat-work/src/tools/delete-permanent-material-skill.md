# Delete permanent material (`wechat-work-delete-permanent-material`)

Calls `POST /cgi-bin/material/del_material` to delete a permanent material from WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **media_id** (required): Media ID of the permanent material to delete

## Output

Returns `{ success: true, media_id }` on success.

**Warning**: Deleting a permanent material is irreversible. Make sure you have backed up any important files before deletion.
