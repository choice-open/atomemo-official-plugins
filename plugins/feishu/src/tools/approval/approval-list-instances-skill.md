# 批量获取审批实例 ID Tool Documentation

## Tool

- **Name**: `feishu-approval_batch_get_instance_ids`
- **Module**: `approval`
- **Method**: `GET`
- **Path**: `/open-apis/approval/v4/instances`
- **Purpose**: 按筛选条件批量获取审批实例 ID 列表。
- **API Doc**: https://open.feishu.cn/document/server-docs/approval-v4/instance/list

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
  - 可传任意官方支持的查询字段，例如：`approval_code`、`user_id`、`start_time`、`end_time`、`page_size`、`page_token`。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"approval_code\":\"4202AD96-9EC1-4284-9C48-B923CDC4F30B\",\"page_size\":20}"
  }
}
```
