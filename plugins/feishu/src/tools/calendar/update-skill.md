# Feishu Calendar Update Tool Documentation

## Tool

- **Name**: `feishu_calendar_update`
- **Skill**: `calendar.update`
- **SDK**: `client.calendar.calendar.patch`
- **Purpose**: 调用 `calendar.calendar.patch` 更新日历。

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

### Example 1: Update calendar summary

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "data_json": "{\"summary\":\"新的日历名称\"}"
  }
}
```

### Example 2: Update calendar description

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id": "cal_xxx",
    "data_json": "{\"description\":\"日历描述信息\"}"
  }
}
```

### Example 3: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"calendar_id\":\"cal_xxx\"}",
    "data_json": "{\"summary\":\"更新后的标题\",\"description\":\"更新后的描述\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_update",
  "tool": "feishu_calendar_update",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_xxx\"},\"data\":{\"summary\":\"新的日历名称\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - Calendar Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_update",
  "tool": "feishu_calendar_update",
  "payload_raw": "{\"path\":{\"calendar_id\":\"cal_invalid\"}}",
  "response_raw": "{\"code\":99991420,\"msg\":\"calendar not found\",\"data\":{}}"
}
```