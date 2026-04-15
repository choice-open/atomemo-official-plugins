# 批量获取主日历信息 Tool Documentation

## Tool

- **Name**: `feishu-calendar_batch_get_primary`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/primarys`
- **Purpose**: 批量获取主日历；路径中 `primarys` 为接口原文。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-primary/batch_get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `user_id_type`：用户 ID 类型（可选，`open_id | union_id | user_id`）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "user_id_type": "open_id",
    "body_json": "{\"user_ids\":[\"ou_xxxxxxxxxxxxxxxxxxxxxxxxxx\"]}"
  }
}
```

## Tool Output 示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```
