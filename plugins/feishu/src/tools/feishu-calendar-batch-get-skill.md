# Feishu Calendar Batch Get Tool Documentation

## Tool

- **Name**: `feishu_calendar_batch_get`
- **Skill**: `calendar.batch.get`
- **SDK**: `client.calendar.calendar.mget`
- **Purpose**: 调用 `calendar.calendar.mget` 批量查询日历。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `calendar_ids_json` | `string` | `false` | `input` | 日历 ID 数组 JSON（data.calendar_ids）。 | "[\"cal_xxx\"]" |
| `calendar_id_type` | `string` | `false` | `input` | 日历 ID 类型（params）。 | "calendar_id" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Batch get calendars by IDs

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_ids_json": "[\"cal_xxx\",\"cal_yyy\",\"cal_zzz\"]",
    "calendar_id_type": "calendar_id"
  }
}
```

### Example 2: Using data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "calendar_id_type": "calendar_id",
    "data_json": "{\"calendar_ids\":[\"cal_1\",\"cal_2\"]}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"params\":{\"calendar_id_type\":\"calendar_id\"},\"data\":{\"calendar_ids\":[\"cal_xxx\"]}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_batch_get",
  "tool": "feishu_calendar_batch_get",
  "payload_raw": "{\"params\":{\"calendar_id_type\":\"calendar_id\"},\"data\":{\"calendar_ids\":[\"cal_xxx\",\"cal_yyy\"]}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendars\":[{\"calendar_id\":\"cal_xxx\",\"summary\":\"日历1\"},{\"calendar_id\":\"cal_yyy\",\"summary\":\"日历2\"}]}}"
}
```

### Error Response - Empty calendar IDs

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_batch_get",
  "tool": "feishu_calendar_batch_get",
  "payload_raw": "{\"data\":{\"calendar_ids\":[]}}",
  "response_raw": "{\"code\":99991403,\"msg\":\"calendar_ids is empty\",\"data\":{}}"
}
```