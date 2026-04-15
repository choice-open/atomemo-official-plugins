# 创建审批实例 Tool Documentation

## Tool

- **Name**: `feishu-approval_create_instance`
- **Module**: `approval`
- **Method**: `POST`
- **Path**: `/open-apis/approval/v4/instances`
- **Purpose**: 使用审批定义 Code 创建原生审批实例。
- **API Doc**: https://open.feishu.cn/document/server-docs/approval-v4/instance/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `body_json`：请求体 JSON 字符串（必填），字段遵循官方文档。
  - 必填字段：`approval_code`、`form`
  - 至少二选一：`user_id` / `open_id`
  - 常见可选字段：`department_id`、`node_approver_user_id_list`、`node_approver_open_id_list`、`node_cc_user_id_list`、`node_cc_open_id_list`、`uuid`、`allow_resubmit`、`allow_submit_again`、`cancel_bot_notification`、`forbid_revoke`、`i18n_resources`、`title`、`title_display_method`、`node_auto_approval_list`

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{\"approval_code\":\"4202AD96-9EC1-4284-9C48-B923CDC4F30B\",\"user_id\":\"59a92c4a\",\"form\":\"[{\\\"id\\\":\\\"111\\\",\\\"type\\\":\\\"input\\\",\\\"value\\\":\\\"11111\\\"}]\"}"
  }
}
```
