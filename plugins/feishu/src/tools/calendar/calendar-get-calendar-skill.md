# 查询日历信息 Tool Documentation

## Tool

- **Name**: `feishu-calendar_get_calendar`
- **Module**: `calendar`
- **Method**: `GET`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id`
- **Purpose**: 获取指定日历详情。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/get

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- 本接口无查询参数。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn"
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
