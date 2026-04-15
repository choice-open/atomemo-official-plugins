# 删除任务 Tool Documentation

## Tool

- **Name**: `feishu-task_delete`
- **Module**: `task`
- **Method**: `DELETE`
- **Path**: `/open-apis/task/v2/tasks/:task_guid`
- **Purpose**: 删除任务。
- **API Doc**: https://open.feishu.cn/document/task-v2/task/delete

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- 本接口无查询参数。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>"
  }
}
```
