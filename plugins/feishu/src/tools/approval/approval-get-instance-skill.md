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
- `user_id`：发起审批的用户 ID（可选，ID 类型由 `user_id_type` 指定）。
- `user_id_type`：用户 ID 类型（可选），可填 `user_id` / `open_id` / `union_id`。
- `locale`：返回语言（可选），例如 `zh-CN`。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "instance_id": "81D31358-93AF-92D6-7425-01A5D67C4E71",
    "user_id": "f7cb567e",
    "user_id_type": "user_id",
    "locale": "zh-CN"
  }
}
```
