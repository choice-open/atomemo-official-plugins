# edit-document-content

Edit the content of a WeChat Work document in batch.

## When to use

Use this tool when you need to modify content in a WeChat Work document. Supports batch operations for inserting, replacing, or deleting content.

## Parameters

- **docid**: The document ID to edit. You can get this from the document URL or by using the create-wedoc tool.
- **operations**: JSON array of edit operations. Each operation should follow the WeChat Work document editing format.

## Operation Format

Each operation is an object with the following structure:

```json
{
  "cmd": "insert|replace|delete",
  "id": "paragraph_id",
  "data": {
    "type": "text",
    "text": "content"
  },
  "index": 0
}
```

- **cmd**: Operation type - insert (插入), replace (替换), delete (删除)
- **id**: The element ID to operate on
- **data**: Content data for insert/replace operations
- **index**: Position for insert operations

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/document/batch_update`
- Official docs: https://developer.work.weixin.qq.com/document/145/15105

## Example

```json
{
  "docid": "your-document-id",
  "operations": [
    {
      "cmd": "insert",
      "id": "root",
      "data": {
        "type": "text",
        "text": "New paragraph content"
      },
      "index": 0
    }
  ]
}
```
