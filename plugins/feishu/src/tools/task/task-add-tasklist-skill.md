# 任务加入清单 Tool Documentation

## Tool

- **Name**: `feishu-task_add_tasklist`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasks/:task_guid/add_tasklist`
- **Purpose**: 任务加入清单。
- **API Doc**: https://open.feishu.cn/document/task-v2/task/add_tasklist

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `user_id_type`：用户 ID 类型（可选，`open_id | union_id | user_id`）。
- `body_json`：请求体 JSON 字符串（必填）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{}"
  }
}
```
