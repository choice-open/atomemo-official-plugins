# Feishu Calendar Primary Batch Get Tool Documentation

## Tool

- **Name**: `feishu_calendar_primary_batch_get`
- **Skill**: `calendar.primary.batch.get`
- **SDK**: `client.calendar.calendar.primarys`
- **Purpose**: 调用 `calendar.calendar.primarys` 批量查询主日历。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `user_id_type` | `string` | `false` | `input` | 用户 ID 类型（params）。 | "open_id" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Batch get primary calendars for users

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"user_id_type\":\"open_id\"}",
    "data_json": "{\"user_ids\":[\"ou_xxx\",\"ou_yyy\",\"ou_zzz\"]}"
  }
}
```

### Example 2: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"params\":{\"user_id_type\":\"open_id\"},\"data\":{\"user_ids\":[\"ou_user1\",\"ou_user2\"]}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_primary_batch_get",
  "tool": "feishu_calendar_primary_batch_get",
  "payload_raw": "{\"params\":{\"user_id_type\":\"open_id\"},\"data\":{\"user_ids\":[\"ou_xxx\",\"ou_yyy\"]}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendars\":[{\"calendar_id\":\"primary_xxx\",\"owner\":{\"id\":\"ou_xxx\",\"type\":\"user\"}},{\"calendar_id\":\"primary_yyy\",\"owner\":{\"id\":\"ou_yyy\",\"type\":\"user\"}}]}}"
}
```

### Error Response - Empty user IDs

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_primary_batch_get",
  "tool": "feishu_calendar_primary_batch_get",
  "payload_raw": "{\"data\":{\"user_ids\":[]}}",
  "response_raw": "{\"code\":99991403,\"msg\":\"user_ids is empty\",\"data\":{}}"
}
```