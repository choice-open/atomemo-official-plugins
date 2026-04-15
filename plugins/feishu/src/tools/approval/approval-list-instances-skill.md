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
- `approval_code`：审批定义 Code（必填）。
- `start_time`：开始时间（必填，毫秒时间戳）。
- `end_time`：结束时间（必填，毫秒时间戳）。
- `page_size`：分页大小（可选）。
- `page_token`：分页游标（可选）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "approval_code": "4202AD96-9EC1-4284-9C48-B923CDC4F30B",
    "start_time": "1743091200000",
    "end_time": "1743098400000",
    "page_size": "20"
  }
}
```
