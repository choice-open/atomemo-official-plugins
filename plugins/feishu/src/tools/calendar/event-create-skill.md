# Feishu Calendar Event Create Tool Documentation

## Tool

- **Name**: `feishu_calendar_event_create`
- **Skill**: `calendar.event.create`
- **SDK**: `client.calendar.event.create`
- **Purpose**: 调用 `calendar.event.create` 创建日程。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `calendar_id` | `string` | `true` | `input` | 日历 ID（path）。 | "cal_xxx" |
| `summary` | `string` | `true` | `input` | 日程标题（data.summary）。 | "项目例会" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Create simple event

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "summary": "项目例会"
  }
}
```

### Example 2: Create event with description

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "data_json": "{\"summary\":\"周例会\",\"description\":\"每周一上午10点\"}"
  }
}
```

### Example 3: Create event with time range

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "data_json": "{\"summary\":\"会议\",\"start_time\":\"1704067200\",\"end_time\":\"1704070800\"}"
  }
}
```

### Example 4: Using path_json and data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"calendar_id\":\"cal_xxx\"}",
    "data_json": "{\"summary\":\"团队同步会\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_create",
  "tool": "feishu_calendar_event_create",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"},\"data\":{\"summary\":\"项目例会\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"event_id\":\"evt_xxx\"}}"
}
```

### Error Response - Calendar not found

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_create",
  "tool": "feishu_calendar_event_create",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_invalid\"},\"data\":{\"summary\":\"例会\"}}",
  "response_raw": "{\"code\":99991420,\"msg\":\"calendar not found\",\"data\":{}}"
}
```