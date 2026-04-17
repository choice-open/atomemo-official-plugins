# upload-document-media

Upload temporary media file for use in WeChat Work documents.

## When to use

Use this tool when you need to upload a file to be used within WeChat Work documents. The returned media_id can be used to reference the file in documents.

## Parameters

- **file_url**: URL of the file to upload.
- **filename**: Original filename with extension (max 20MB).

## API Reference

- Endpoint: `POST /cgi-bin/media/upload?type=file`
- Official docs: https://developer.work.weixin.qq.com/document/145/15122

## Example

```json
{
  "file_url": "https://example.com/document.pdf",
  "filename": "document.pdf"
}
```
