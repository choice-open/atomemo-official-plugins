# Batch delete members (`wechat-work-batch-delete-members`)

Calls `POST /cgi-bin/user/batchdelete` to batch delete members from WeChat Work.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **userid_list** (required): JSON array of userids to delete (max 200).
- **party_id_list** (optional): JSON array of department IDs to delete (members under department will be deleted).

## Output

Returns success status on successful deletion.