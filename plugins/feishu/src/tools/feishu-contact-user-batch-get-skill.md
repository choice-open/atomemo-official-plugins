# Feishu Contact User Batch Get Tool Documentation

## Tool

- **Name**: `feishu_contact_user_batch_get`
- **Skill**: `contact.user.batch.get`
- **SDK**: `client.contact.user.batch`
- **Purpose**: 调用 `contact.user.batch` 批量获取用户信息。

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

### Example 1: Batch get users by open_ids

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"user_id_type\":\"open_id\"}",
    "data_json": "{\"user_ids\":[\"ou_xxx\",\"ou_yyy\",\"ou_zzz\"]}"
  }
}
```

### Example 2: Batch get users by user_ids

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"user_id_type\":\"user_id\"}",
    "data_json": "{\"user_ids\":[\"user_id_1\",\"user_id_2\"]}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"params\":{\"user_id_type\":\"open_id\"},\"data\":{\"user_ids\":[\"ou_xxx\",\"ou_yyy\"]}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_batch_get",
  "tool": "feishu_contact_user_batch_get",
  "payload_raw": "{\"params\":{\"user_id_type\":\"open_id\"},\"data\":{\"user_ids\":[\"ou_xxx\",\"ou_yyy\"]}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"user_list\":[{\"user_id\":\"ou_xxx\",\"name\":\"张三\"},{\"user_id\":\"ou_yyy\",\"name\":\"李四\"}]}}"
}
```

### Error Response - Invalid User ID

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_batch_get",
  "tool": "feishu_contact_user_batch_get",
  "payload_raw": "{\"data\":{\"user_ids\":[]}}",
  "response_raw": "{\"code\":99991603,\"msg\":\"user_ids is empty\",\"data\":{}}"
}
```