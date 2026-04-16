# dingtalk / get-process-instance

Get details for a workflow process instance.

## Input Parameters

| Field                 | Type            | Required | Default | Description                               |
| --------------------- | --------------- | -------- | ------- | ----------------------------------------- |
| `credential_id`       | `credential_id` | yes      | —       | Links to credential `dingtalk-app`.       |
| `process_instance_id` | `string`        | yes      | —       | Workflow process instance ID to retrieve. |

### Example Input
```json
{
  "credential_id": "my-dingtalk-app",
  "process_instance_id": "instance123"
}
```

## Credential

- Credential name: `dingtalk-app`

## Success Output

```json
{
    "result": {
      "attachedProcessInstanceIds": [],
      "bizAction": "NONE",
      "bizData": "{}",
      "businessId": "202604161534000376553",
      "createTime": "2026-04-16T15:34Z",
      "formComponentValues": [
        {
          "componentType": "TextField",
          "id": "TextField-JZ9IVH1K",
          "name": "客户名称",
          "value": "ttt"
        },
        {
          "componentType": "DDSelectField",
          "extValue": "{\"label\":\"选项2\",\"key\":\"option_1\"}",
          "id": "DDSelectField-JZ9IZXWF",
          "name": "预约内容",
          "value": "选项2"
        },
        {
          "componentType": "InnerContactField",
          "extValue": "[{\"nick\":\"某用户\",\"orgUserName\":\"某用户\",\"emplId\":\"093204182627445986\",\"name\":\"某用户\",\"avatar\":\"\",\"ecologicalCorpId\":\"dingbe690074789b06fd4ac5d6980864d335\"}]",
          "id": "InnerContactField-JZ9IZXWH",
          "name": "分配接待人员",
          "value": "某用户"
        }
      ],
      "operationRecords": [
        {
          "date": "2026-04-16T15:34Z",
          "images": [],
          "result": "NONE",
          "showName": "提交申请",
          "type": "START_PROCESS_INSTANCE",
          "userId": "093204182627445986"
        }
      ],
      "originatorDeptId": "-1",
      "originatorDeptName": "Xxx",
      "originatorUserId": "093204182627445986",
      "result": "",
      "status": "RUNNING",
      "tasks": [
        {
          "activityId": "sid-1234_5678",
          "createTime": "2026-04-16T15:34Z",
          "mobileUrl": "aflow.dingtalk.com?procInsId=eNxe43IIT8S4oQBRC_CrhQ00221776324877&taskId=100468167919&businessId=202604161534000376553",
          "pcUrl": "aflow.dingtalk.com?procInsId=eNxe43IIT8S4oQBRC_CrhQ00221776324877&taskId=100468167919&businessId=202604161534000376553",
          "result": "NONE",
          "status": "RUNNING",
          "taskId": 100468167919,
          "userId": "093204182627445986"
        }
      ],
      "title": "某用户提交的客户信息预约"
    },
    "success": true
  }
```

