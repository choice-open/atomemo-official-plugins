# Feishu Calendar Primary Get Tool Documentation

## Tool

- **Name**: `feishu_calendar_primary_get`
- **Skill**: `calendar.primary.get`
- **SDK**: `client.calendar.calendar.primary`
- **Purpose**: 调用 `calendar.calendar.primary` 查询主日历。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Get primary calendar

```json
{
  "parameters": {
    "credentialId": "your_credential_id"
  }
}
```

### Example 2: With user_id_type

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"user_id_type\":\"open_id\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_primary_get",
  "tool": "feishu_calendar_primary_get",
  "payload_raw": "{}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendar_id\":\"primary_xxx\",\"summary\":\"张三的主日历\",\"owner\":{\"id\":\"ou_xxx\",\"type\":\"user\"}}}"
}
```