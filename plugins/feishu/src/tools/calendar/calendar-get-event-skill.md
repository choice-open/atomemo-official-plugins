# 获取日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_get_event`
- **Module**: `calendar`
- **Method**: `GET`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events/:event_id`
- **Purpose**: 获取指定日程详情。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `event_id`：路径参数（必填），日程 ID。
- `need_meeting_settings`：是否返回会前设置（可选，`true | false`）。
- `need_attendee`：是否返回参与人信息（可选，`true | false`）。
- `max_attendee_num`：返回最大参与人数（可选）。
- `user_id_type`：用户 ID 类型（可选，`open_id | union_id | user_id`）。
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
