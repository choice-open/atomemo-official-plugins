# Feishu Calendar Event Delete Tool Documentation

## Tool

- **Name**: `feishu_calendar_event_delete`
- **Skill**: `calendar.event.delete`
- **SDK**: `client.calendar.event.delete`
- **Purpose**: 调用 `calendar.event.delete` 删除日程。

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

### Example 1: Delete event by ID

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
  "message": "Feishu API invoked successfully: feishu_calendar_event_delete",
  "tool": "feishu_calendar_event_delete",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - Event Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_delete",
  "tool": "feishu_calendar_event_delete",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\",\"event_id\":\"evt_invalid\"}}",
  "response_raw": "{\"code\":99991421,\"msg\":\"event not found\",\"data\":{}}"
}
```