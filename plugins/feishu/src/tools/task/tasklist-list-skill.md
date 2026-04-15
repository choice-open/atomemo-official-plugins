# 获取清单列表 Tool Documentation

## Tool

- **Name**: `feishu-tasklist_list`
- **Module**: `task`
- **Method**: `GET`
- **Path**: `/open-apis/task/v2/tasklists`
- **Purpose**: 获取清单列表。
- **API Doc**: https://open.feishu.cn/document/task-v2/tasklist/list

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `page_size`：分页大小（可选）。
- `page_token`：分页游标（可选）。
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
