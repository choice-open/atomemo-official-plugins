# 创建日程 Tool Documentation

## Tool

- **Name**: `feishu-calendar_create_event`
- **Module**: `calendar`
- **Method**: `POST`
- **Path**: `/open-apis/calendar/v4/calendars/:calendar_id/events`
- **Purpose**: 在指定日历下创建日程。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar-event/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `calendar_id`：路径参数（必填），日历 ID。
- `idempotency_key`：幂等键（可选），32-128 字符，用于避免重复创建。
- `user_id_type`：用户 ID 类型（可选），支持 `open_id`、`union_id`、`user_id`。
- `body_json`：请求体 JSON 字符串（必填），包含以下字段：
  - `summary`（可选）：日程标题，最大1000字符
  - `start_time`（**必填**）：开始时间，包含 `timestamp`（秒级时间戳）或 `date`（全天事件，RFC 3339格式）
  - `end_time`（**必填**）：结束时间
  - `description`（可选）：描述，最大40960字符，支持HTML标签
  - `location`（可选）：地点，包含 `name` 和 `address`
  - `visibility`（可选）：可见性，`default`、`public`、`private`，默认 `default`
  - `free_busy_status`（可选）：忙碌状态，`busy`、`free`，默认 `busy`
  - `reminders`（可选）：提醒列表

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
    "user_id_type": "open_id",
    "body_json": "{\"summary\":\"周会\",\"start_time\":{\"timestamp\":\"1704067200\",\"timezone\":\"Asia/Shanghai\"},\"end_time\":{\"timestamp\":\"1704070800\",\"timezone\":\"Asia/Shanghai\"}}"
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
