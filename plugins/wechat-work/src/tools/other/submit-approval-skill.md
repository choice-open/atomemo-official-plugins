# Submit approval (`wechat-work-submit-approval`)

Calls `POST /cgi-bin/oa/apply_event` to submit an approval application.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`
- **creator_userid** (required): Applicant's userid
- **template_id** (required): Approval template ID
- **use_template_approver** (optional): Use template's default approver (1=yes, 0=no)
- **apply_data** (required): JSON object of apply data
- **approver** (optional): JSON array of approvers

## Output

Returns apply_id on success.