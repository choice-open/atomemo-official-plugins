# get-form-statistic

Get submission statistics for a WeChat Work form.

## When to use

Use this tool when you need to retrieve submission statistics of a WeChat Work form (收集表), including view count, submission count, and answer rate.

## Parameters

- **formid**: The form ID to query.

## API Reference

- Endpoint: `POST /cgi-bin/wedoc/get_form_statistic`
- Official docs: https://developer.work.weixin.qq.com/document/145/15115

## Example

```json
{
  "formid": "your-form-id"
}
```
