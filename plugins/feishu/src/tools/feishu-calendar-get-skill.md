# Feishu Calendar Get Tool Documentation

## Tool

- **Name**: `feishu_calendar_get`
- **Skill**: `calendar.get`
- **SDK**: `client.calendar.calendar.get`
- **Purpose**: 调用 `calendar.calendar.get` 查询日历信息。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `calendar_id` | `string` | `true` | `input` | 日历 ID（path）。 | "cal_xxx" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Get calendar by ID

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx"
  }
}
```

### Example 2: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"calendar_id\":\"cal_xxx\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_get",
  "tool": "feishu_calendar_get",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendar_id\":\"cal_xxx\",\"summary\":\"团队日历\",\"description\":\"\",\"permissions\":{\"readers\":[],\"writers\":[]}}}"
}
```

### Error Response - Calendar Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_get",
  "tool": "feishu_calendar_get",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_invalid\"}}",
  "response_raw": "{\"code\":99991420,\"msg\":\"calendar not found\",\"data\":{}}"
}
```