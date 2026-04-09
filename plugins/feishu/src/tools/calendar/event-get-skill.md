# Feishu Calendar Event Get Tool Documentation

## Tool

- **Name**: `feishu_calendar_event_get`
- **Skill**: `calendar.event.get`
- **SDK**: `client.calendar.event.get`
- **Purpose**: 调用 `calendar.event.get` 获取日程详情。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `calendar_id` | `string` | `true` | `input` | 日历 ID（path）。 | "cal_xxx" |
| `event_id` | `string` | `true` | `input` | 日程 ID（path）。 | "evt_xxx" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Get event details

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "event_id": "evt_xxx"
  }
}
```

### Example 2: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_xxx\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_get",
  "tool": "feishu_calendar_event_get",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"event_id\":\"evt_xxx\",\"summary\":\"项目例会\",\"description\":\"\",\"start_time\":\"1704067200\",\"end_time\":\"1704070800\",\"attendees\":[{\"id\":\"ou_xxx\",\"type\":\"user\"}]}}"
}
```

### Error Response - Event Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_get",
  "tool": "feishu_calendar_event_get",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_invalid\"}}",
  "response_raw": "{\"code\":99991421,\"msg\":\"event not found\",\"data\":{}}"
}
```