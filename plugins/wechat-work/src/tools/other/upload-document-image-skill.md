# upload-document-image

Upload an image to WeChat Work documents for use in documents.

## When to use

Use this tool when you need to upload an image to be used within WeChat Work documents. The returned URL can be used in document content.

## Parameters

- **media**: Image file content as base64 string.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/image_upload`
- Official docs: https://developer.work.weixin.qq.com/document/145/15121

## Example

```json
{
  "media": "base64-encoded-image-data"
}
```
