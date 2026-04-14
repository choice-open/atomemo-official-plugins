# 删除共享日历 Tool Documentation

## Tool

- **Name**: `feishu-calendar_delete_calendar`
- **Module**: `calendar`
- **Method**: `DELETE`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id`
- **Purpose**: 删除指定日历。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/delete

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "query_params_json": "{\"user_id_type\":\"open_id\"}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
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
