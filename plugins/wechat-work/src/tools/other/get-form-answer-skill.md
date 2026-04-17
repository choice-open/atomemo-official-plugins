# get-form-answer

Read answers submitted to a WeChat Work form.

## When to use

Use this tool when you need to retrieve answers submitted to a WeChat Work form (收集表). Supports pagination with limit and offset.

## Parameters

- **formid**: The form ID to query.
- **limit**: Maximum number of records to return (default 100).
- **offset**: Number of records to skip (default 0).

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/get_form_answer`
- Official docs: https://developer.work.weixin.qq.com/document/145/15116

## Example

```json
{
  "formid": "your-form-id",
  "limit": 50,
  "offset": 0
}
```
