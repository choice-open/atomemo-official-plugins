# 删除日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_delete_event`
- **Module**: `calendar`
- **Method**: `DELETE`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id`
- **Purpose**: 删除指定日程。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/delete

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `event_id`：路径参数（必填），日程 ID。
- `need_notification`：是否通知参与人（可选，`true | false`）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "event_id": "8s7k6j5h4g"
  }
}
```
