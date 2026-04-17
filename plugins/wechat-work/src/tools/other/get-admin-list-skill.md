# get-admin-list

Get the list of administrators for a WeChat Work application.

## When to use

Use this tool when you need to retrieve the list of administrators configured for a specific WeChat Work application.

## Parameters

- **agentid**: The application agent ID. You can get this from the WeChat Work admin console.

## API Reference

- Endpoint: `POST /cgi-bin/agent/get_admin_list`
- Official docs: https://developer.work.weixin.qq.com/document/145/15120

## Example

```json
{
  "agentid": "your-agent-id"
}
```
