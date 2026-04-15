# 创建共享日历 Tool Documentation

## Tool

- **Name**: `feishu-calendar_create_shared_calendar`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars`
- **Purpose**: 创建日历实体（含共享日历）。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{\"summary\":\"团队日历\",\"description\":\"\",\"permissions\":\"private\"}"
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
