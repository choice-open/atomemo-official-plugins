# Feishu Calendar Event Search Tool Documentation

## Tool

- **Name**: `feishu_calendar_event_search`
- **Skill**: `calendar.event.search`
- **SDK**: `client.calendar.event.search`
- **Purpose**: 调用 `calendar.event.search` 搜索日程。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `calendar_id` | `string` | `true` | `input` | 日历 ID（path）。 | "cal_xxx" |
| `query` | `string` | `true` | `input` | 搜索关键词（data.query）。 | "例会" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Search events by keyword

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "query": "例会"
  }
}
```

### Example 2: Search using data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "data_json": "{\"query\":\"会议\"}"
  }
}
```

### Example 3: Using path_json and data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"calendar_id\":\"cal_xxx\"}",
    "data_json": "{\"query\":\"项目\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_search",
  "tool": "feishu_calendar_event_search",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"},\"data\":{\"query\":\"例会\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"events\":[{\"event_id\":\"evt_xxx\",\"summary\":\"周例会\",\"start_time\":\"1704067200\"},{\"event_id\":\"evt_yyy\",\"summary\":\"月度例会\"}]}}"
}
```

### No Results

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_event_search",
  "tool": "feishu_calendar_event_search",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"},\"data\":{\"query\":\"不存在的会议\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"events\":[]}}"
}
```