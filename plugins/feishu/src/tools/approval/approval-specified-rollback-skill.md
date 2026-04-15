# 退回审批任务 Tool Documentation

## Tool

- **Name**: `feishu-approval_specified_rollback`
- **Module**: `approval`
- **Method**: `POST`
- **Path**: `/open-apis/approval/v4/instances/specified_rollback`
- **Purpose**: 从当前审批任务退回到已审批的一个或多个任务节点。
- **API Doc**: https://open.feishu.cn/document/server-docs/approval-v4/instance/specified_rollback

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `user_id_type`：用户 ID 类型（可选）：`open_id` | `union_id` | `user_id`（默认 `open_id`）
- `body_json`：请求体 JSON 字符串（必填）。
  - 必填字段：`user_id`、`task_id`、`task_def_key_list`（`string[]`，长度 1~100）
  - 可选字段：`reason`、`extra`（灰度参数）

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id_type": "open_id",
    "body_json": "{\"user_id\":\"893g4c45\",\"task_id\":\"7026591166355210260\",\"reason\":\"申请事项填写不具体，请重新填写\",\"task_def_key_list\":[\"START\",\"APPROVAL_27997_285502\"]}"
  }
}
```
