# 获取单个审批实例详情 Tool Documentation

## Tool

- **Name**: `feishu-approval_get_instance`
- **Module**: `approval`
- **Method**: `GET`
- **Path**: `/open-apis/approval/v4/instances/:instance_id`
- **Purpose**: 获取单个审批实例的详细信息。
- **API Doc**: https://open.feishu.cn/document/server-docs/approval-v4/instance/get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `instance_id`：审批实例 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
  - 常见字段：`user_id_type`、`locale`

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "instance_id": "81D31358-93AF-92D6-7425-01A5D67C4E71",
    "query_params_json": "{\"user_id_type\":\"user_id\"}"
  }
}
```
