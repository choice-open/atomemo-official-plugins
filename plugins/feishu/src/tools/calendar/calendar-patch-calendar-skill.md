# 更新日历信息 Tool Documentation

## Tool

- **Name**: `feishu-calendar_patch_calendar`
- **Module**: `calendar`
- **Method**: `PATCH`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id`
- **Purpose**: 更新指定日历属性。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/patch

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "query_params_json": "{\"user_id_type\":\"open_id\"}",
    "body_json": "{\"summary\":\"新标题\"}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "query_params_json": "{bad-json"
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
