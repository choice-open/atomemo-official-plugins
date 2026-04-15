# 获取日程列表 Tool Documentation

## Tool

- **Name**: `feishu-calendar_list_events`
- **Module**: `calendar`
- **Method**: `GET`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events`
- **Purpose**: 分页或增量获取某日历下的日程。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/list

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `page_size`：分页大小（可选）。
- `anchor_time`：时间锚点（可选，秒时间戳）。
- `page_token`：分页游标（可选）。
- `sync_token`：增量同步 token（可选）。
- `start_time`：开始时间（可选，秒时间戳）。
- `end_time`：结束时间（可选，秒时间戳）。
- `user_id_type`：用户 ID 类型（可选，`open_id | union_id | user_id`）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "page_size": "50",
    "user_id_type": "open_id"
  }
}
```
