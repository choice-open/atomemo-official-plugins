# 获取清单详情 Tool Documentation

## Tool

- **Name**: `feishu-tasklist_get`
- **Module**: `task`
- **Method**: `GET`
- **Path**: `/open-apis/task/v2/tasklists/:tasklist_guid`
- **Purpose**: 获取清单详情。
- **API Doc**: https://open.feishu.cn/document/task-v2/tasklist/get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>"
  }
}
```
