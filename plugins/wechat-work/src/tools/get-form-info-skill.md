# get-form-info

Get configuration information of a WeChat Work form.

## When to use

Use this tool when you need to retrieve configuration details of a WeChat Work form (收集表), including title, description, creation time, expiration time, status, and submission count.

## Parameters

- **formid**: The form ID to query.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/get_form_info`
- Official docs: https://developer.work.weixin.qq.com/document/145/15114

## Example

```json
{
  "formid": "your-form-id"
}
```
