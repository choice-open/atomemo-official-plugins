# 移除清单成员 Tool Documentation

## Tool

- **Name**: `feishu-tasklist_remove_members`
- **Module**: `task`
- **Method**: `POST`
- **Path**: `/open-apis/task/v2/tasklists/:tasklist_guid/remove_members`
- **Purpose**: 移除清单成员。
- **API Doc**: https://open.feishu.cn/document/task-v2/tasklist/remove_members

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
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
