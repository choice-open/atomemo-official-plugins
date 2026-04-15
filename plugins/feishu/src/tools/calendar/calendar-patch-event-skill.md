# 更新日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_patch_event`
- **Module**: `calendar`
- **Method**: `PATCH`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id`
- **Purpose**: 更新指定日程。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/patch

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `event_id`：路径参数（必填），日程 ID。
- `user_id_type`：用户 ID 类型（可选，`open_id | union_id | user_id`）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "event_id": "8s7k6j5h4g",
    "user_id_type": "open_id",
    "body_json": "{\"summary\":\"更新后的周会\"}"
  }
}
```
