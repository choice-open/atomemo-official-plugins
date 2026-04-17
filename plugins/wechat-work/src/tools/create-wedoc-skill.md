# Create WeDoc (`wechat-work-create-wedoc`)

Calls `POST /cgi-bin/wedoc/create_doc` to create a new document, spreadsheet, or smartsheet.

## Parameters

- **wechat_work_credential** (required): `credential_id` for `wechat-work`.
- **doc_type** (required): Document type - `1` for document, `2` for spreadsheet, `3` for smartsheet.
- **title** (required): Title of the new document.

## Output

Returns the created document info:
- **docid**: Document ID (use this ID for further operations like get-doc-info, delete-wedoc, etc.)
