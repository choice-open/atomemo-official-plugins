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
- `query_params_json`：查询参数 JSON 字符串（可选），如 `page_size/page_token/sync_token`。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "query_params_json": "{"page_size":20}"
  }
}
```
