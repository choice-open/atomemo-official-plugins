# get-document-data

Get the content of a WeChat Work document.

## When to use

Use this tool when you need to retrieve the full content of a WeChat Work document (not just metadata). This is useful for:

- Reading document content for analysis
- Processing document data in workflows
- Retrieving document details for editing

## Parameters

- **docid**: The document ID to retrieve. You can get this from the document URL or by using the create-wedoc tool.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/document/get`
- Official docs: https://developer.work.weixin.qq.com/document/145/15104

## Example

```json
{
  "docid": "your-document-id"
}
```
