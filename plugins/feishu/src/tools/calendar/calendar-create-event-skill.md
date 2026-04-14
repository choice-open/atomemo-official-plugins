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
- `query_params_json`：查询参数 JSON 字符串（可选）。常用参数：
  - `user_id_type`：用户ID类型，支持 `open_id`、`union_id`、`user_id`，默认 `open_id`
  - `idempotency_key`：幂等键，32-128字符，用于避免重复创建
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
  “parameters”: {
    “credential_id”: “<your-feishu-credential-id>”,
    “calendar_id”: “feishu.cn_xxx@group.calendar.feishu.cn”,
    “query_params_json”: “{\n\t\"user_id_type\": \"open_id\"\n}”,
    “body_json”: “{\n\t\"summary\": \"周会\",\n\t\"start_time\": {\n\t\t\"timestamp\": \"1704067200\",\n\t\t\"timezone\": \"Asia/Shanghai\"\n\t},\n\t\"end_time\": {\n\t\t\"timestamp\": \"1704070800\",\n\t\t\"timezone\": \"Asia/Shanghai\"\n\t}\n}”
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
