# 搜索日历 Tool Documentation

## Tool

- **Name**: `feishu-calendar_search_calendars`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/search`
- **Purpose**: 按条件搜索日历。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/search

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `page_size`：分页大小（可选）。
- `page_token`：分页游标（可选）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "page_size": "20",
    "body_json": "{\"query\":\"关键词\"}"
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
