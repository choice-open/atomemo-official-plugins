# Feishu Calendar Event Update Tool Documentation

## Tool

- **Name**: `feishu_calendar_event_update`
- **Skill**: `calendar.event.update`
- **SDK**: `client.calendar.event.patch`
- **Purpose**: 调用 `calendar.event.patch` 更新日程。

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

### Example 1: Update event summary

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "event_id": "evt_xxx",
    "data_json": "{\"summary\":\"更新后的会议标题\"}"
  }
}
```

### Example 2: Update event time

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "event_id": "evt_xxx",
    "data_json": "{\"start_time\":\"1704153600\",\"end_time\":\"1704157200\"}"
  }
}
```

### Example 3: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_xxx\"}",
    "data_json": "{\"summary\":\"新标题\",\"description\":\"会议描述\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_update",
  "tool": "feishu_calendar_event_update",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_xxx\"},\"data\":{\"summary\":\"新标题\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - Event Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_update",
  "tool": "feishu_calendar_event_update",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_invalid\"}}",
  "response_raw": "{\"code\":99991421,\"msg\":\"event not found\",\"data\":{}}"
}
```