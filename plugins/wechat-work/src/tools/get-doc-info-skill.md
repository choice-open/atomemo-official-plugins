# Get document info (`wechat-work-get-doc-info`)

Calls `POST /cgi-bin/wedoc/get_doc_base_info` to retrieve basic information about a document.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **docid** (required): The document ID to query.

## Output

Returns document base info:
- **docid**: Document ID
- **title**: Document title
- **create_time**: Creation timestamp
- **latest_time**: Last modified timestamp
- **author**: Document creator info (userid and name)
