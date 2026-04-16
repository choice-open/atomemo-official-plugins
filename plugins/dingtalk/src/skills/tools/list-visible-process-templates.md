# dingtalk / list-visible-process-templates

List workflow templates visible to a DingTalk user.

## Input Parameters

| Field           | Type            | Required | Default | Description                                               |
| --------------- | --------------- | -------- | ------- | --------------------------------------------------------- |
| `credential_id` | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.                       |
| `user_id`       | `string`        | no       | —       | DingTalk user ID. Defaults to credential `user_union_id`. |
| `max_results`   | `integer`       | no       | `100`   | Page size (1–100).                                        |
| `next_token`    | `integer`       | no       | `0`     | Pagination token.                                         |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "user_id": "user123",
  "max_results": 100,
  "next_token": 0
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
  "result": {
    "processList": [
      {
        "iconUrl": "https://img.alicdn.com/imgextra/i4/O1CN01YAC0Pa1LM7OrwrIdZ_!!6000000001284-0-tps-480-480.jpg",
        "name": "客户信息预约",
        "processCode": "PROC-8F049F69-A5AE-4B0F-BD70-A1E0844B773D",
        "url": "https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&back=native&swfrom=corp&corpid=dingbe690074789b06fd4ac5d6980864d335&processCode=PROC-8F049F69-A5AE-4B0F-BD70-A1E0844B773D#/custom"
      }
    ]
  }
}
```

