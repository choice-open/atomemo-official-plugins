# Feishu Calendar Event List Tool Documentation

## Tool

- **Name**: `feishu_calendar_event_list`
- **Skill**: `calendar.event.list`
- **SDK**: `client.calendar.event.list`
- **Purpose**: 调用 `calendar.event.list` 获取日程列表。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `calendar_id` | `string` | `true` | `input` | 日历 ID（path）。 | "cal_xxx" |
| `page_size` | `number` | `false` | `input` | 分页大小（params）。 | "50" |
| `ignore_cancelled` | `boolean` | `false` | `input` | 是否忽略已取消（params）。 | "true" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: List events with default settings

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx"
  }
}
```

### Example 2: List events with pagination

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "params_json": "{\"page_size\":20}"
  }
}
```

### Example 3: List events including cancelled

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "params_json": "{\"ignore_cancelled\":false}"
  }
}
```

### Example 4: Using params_json for multiple options

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "params_json": "{\"page_size\":50,\"ignore_cancelled\":true}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_list",
  "tool": "feishu_calendar_event_list",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"},\"params\":{\"page_size\":50,\"ignore_cancelled\":true}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"events\":[{\"event_id\":\"evt_xxx\",\"summary\":\"会议1\",\"start_time\":\"1704067200\",\"end_time\":\"1704070800\"},{\"event_id\":\"evt_yyy\",\"summary\":\"会议2\"}],\"page_token\":\"next_token\",\"has_more\":true}}"
}
```

### Empty Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_list",
  "tool": "feishu_calendar_event_list",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"events\":[]}}"
}
```