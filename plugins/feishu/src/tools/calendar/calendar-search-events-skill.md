# 搜索日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_search_events`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events/search`
- **Purpose**: 在指定日历下按条件搜索日程。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/search

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "body_json": "{"query":"周会"}"
  }
}
```
