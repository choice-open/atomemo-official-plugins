# Feishu Calendar Search Tool Documentation

## Tool

- **Name**: `feishu_calendar_search`
- **Skill**: `calendar.search`
- **SDK**: `client.calendar.calendar.search`
- **Purpose**: 调用 `calendar.calendar.search` 搜索日历。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `query` | `string` | `true` | `input` | 搜索关键词（data.query）。 | "团队" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Search calendars by keyword

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "query": "团队"
  }
}
```

### Example 2: Using data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"query\":\"项目\"}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"data\":{\"query\":\"会议\"}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_search",
  "tool": "feishu_calendar_search",
  "payload_raw": "{\"data\":{\"query\":\"团队\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendars\":[{\"calendar_id\":\"cal_xxx\",\"summary\":\"团队日历\"}]}}"
}
```

### No Results

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_search",
  "tool": "feishu_calendar_search",
  "payload_raw": "{\"data\":{\"query\":\"不存在的日历\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendars\":[]}}"
}
```