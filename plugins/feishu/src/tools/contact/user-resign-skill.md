# Feishu Contact User Resign Tool Documentation

## Tool

- **Name**: `feishu_contact_user_resign`
- **Skill**: `contact.user.resign`
- **SDK**: `client.contact.user.delete`
- **Purpose**: 调用 `contact.user.delete` 办理员工离职。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `user_id` | `string` | `true` | `input` | 用户 ID（path.user_id）。 | "ou_xxx" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Resign user by open_id

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "user_id": "ou_7d8a6e6df7621556ce0d21922b676706ccs"
  }
}
```

### Example 2: Resign user using path_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"user_id\":\"ou_xxx\"}"
  }
}
```

### Example 3: Resign user by employee_id

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"user_id\":\"emp_12345\"}",
    "params_json": "{\"user_id_type\":\"employee_id\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_resign",
  "tool": "feishu_contact_user_resign",
  "payload_raw": "{\"path\":{\"user_id\":\"ou_xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - User Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_resign",
  "tool": "feishu_contact_user_resign",
  "payload_raw": "{\"path\":{\"user_id\":\"ou_invalid\"}}",
  "response_raw": "{\"code\":99991603,\"msg\":\"user not found\",\"data\":{}}"
}
```

### Error Response - Already Resigned

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_resign",
  "tool": "feishu_contact_user_resign",
  "payload_raw": "{\"path\":{\"user_id\":\"ou_xxx\"}}",
  "response_raw": "{\"code\":99991668,\"msg\":\"user already disabled\",\"data\":{}}"
}
```