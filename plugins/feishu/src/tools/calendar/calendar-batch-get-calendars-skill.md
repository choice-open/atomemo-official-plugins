# 批量查询日历信息 Tool Documentation

## Tool

- **Name**: `feishu-calendar_batch_get_calendars`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/mget`
- **Purpose**: 根据日历 ID 列表批量获取日历。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/batch_get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `body_json`：请求体 JSON 字符串（必填），通常包含 `calendar_ids` 数组。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{\"calendar_ids\":[\"feishu.cn_xxx@group.calendar.feishu.cn\"]}"
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
