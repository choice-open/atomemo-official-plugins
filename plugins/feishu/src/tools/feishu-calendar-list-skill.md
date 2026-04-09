# Feishu Calendar List Tool Documentation

## Tool

- **Name**: `feishu_calendar_list`
- **Skill**: `calendar.list`
- **SDK**: `client.calendar.calendar.list`
- **Purpose**: 调用 `calendar.calendar.list` 查询日历列表。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `page_size` | `number` | `false` | `input` | 分页大小（params）。 | "50" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: List calendars with default page size

```json
{
  "parameters": {
    "credentialId": "your_credential_id"
  }
}
```

### Example 2: List calendars with custom page size

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"page_size\":20}"
  }
}
```

### Example 3: Using params_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"page_size\":100,\"page_token\":\"token_xxx\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_list",
  "tool": "feishu_calendar_list",
  "payload_raw": "{\"params\":{\"page_size\":50}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendars\":[{\"calendar_id\":\"cal_xxx\",\"summary\":\"团队日历\"},{\"calendar_id\":\"cal_yyy\",\"summary\":\"个人日历\"}],\"page_token\":\"next_token\",\"has_more\":true}}"
}
```

### Empty Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_list",
  "tool": "feishu_calendar_list",
  "payload_raw": "{}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendars\":[]}}"
}
```