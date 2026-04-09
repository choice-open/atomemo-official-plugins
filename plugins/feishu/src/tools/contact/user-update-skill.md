# Feishu Contact User Update Tool Documentation

## Tool

- **Name**: `feishu_contact_user_update`
- **Skill**: `contact.user.update`
- **SDK**: `client.contact.user.patch`
- **Purpose**: 调用 `contact.user.patch` 更新员工信息。

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

### Example 1: Update user name

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "user_id": "ou_xxx",
    "data_json": "{\"name\":\"新名字\"}"
  }
}
```

### Example 2: Update user department

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "user_id": "ou_xxx",
    "data_json": "{\"department_id_list\":[\"od-yyy\"]}"
  }
}
```

### Example 3: Update user email and job title

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "user_id": "ou_xxx",
    "data_json": "{\"email\":\"newemail@example.com\",\"job_title\":\"高级工程师\"}"
  }
}
```

### Example 4: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"user_id\":\"ou_xxx\"}",
    "data_json": "{\"name\":\"更新名字\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_update",
  "tool": "feishu_contact_user_update",
  "payload_raw": "{\"path\":{\"user_id\":\"ou_xxx\"},\"data\":{\"name\":\"新名字\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - User Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_update",
  "tool": "feishu_contact_user_update",
  "payload_raw": "{\"path\":{\"user_id\":\"ou_invalid\"},\"data\":{\"name\":\"新名字\"}}",
  "response_raw": "{\"code\":99991603,\"msg\":\"user not found\",\"data\":{}}"
}
```