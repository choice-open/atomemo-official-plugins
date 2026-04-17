# Batch get external contacts (`wechat-work-batch-get-external-contacts`)

Calls `POST /cgi-bin/externalcontact/batchget_by_user` to batch get external contact details for multiple customers.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **userid** (required): The userid of the staff who added the external contacts.
- **external_userid** (optional): JSON array of external userids to get (max 100).
- **limit** (optional): Number of results per page (default: 100, max: 100).
- **cursor** (optional): Pagination cursor for fetching next page.

## Output

Returns external contact details for the specified users.
