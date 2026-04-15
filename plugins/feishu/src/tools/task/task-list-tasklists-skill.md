# 列取任务所在清单 Tool Documentation

## Tool

- **Name**: `feishu-task_list_tasklists`
- **Module**: `task`
- **Method**: `GET`
- **Path**: `/open-apis/task/v2/tasks/:task_guid/tasklists`
- **Purpose**: 列取任务所在清单。
- **API Doc**: https://open.feishu.cn/document/task-v2/task/list_tasklists

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `user_id_type`：用户 ID 类型（可选，`open_id | union_id | user_id`）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>"
  }
}
```
