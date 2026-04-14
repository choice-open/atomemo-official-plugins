# 同意审批任务 Tool Documentation

## Tool

- **Name**: `feishu-approval_approve_task`
- **Module**: `approval`
- **Method**: `POST`
- **Path**: `/open-apis/approval/v4/tasks/approve`
- **Purpose**: 对单个审批任务执行同意操作。
- **API Doc**: https://open.feishu.cn/document/server-docs/approval-v4/task/approve

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
  - `user_id_type`（可选）：`open_id` | `union_id` | `user_id`（默认 `open_id`）
- `body_json`：请求体 JSON 字符串（必填）。
  - 必填字段：`approval_code`、`instance_code`、`user_id`、`task_id`
  - 可选字段：`comment`、`form`

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"approval_code\":\"7C468A54-8745-2245-9675-08B7C63E7A85\",\"instance_code\":\"81D31358-93AF-92D6-7425-01A5D67C4E71\",\"user_id\":\"f7cb567e\",\"task_id\":\"12345\",\"comment\":\"OK\"}"
  }
}
```
