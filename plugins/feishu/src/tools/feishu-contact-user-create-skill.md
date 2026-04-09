# Feishu Contact User Create Tool Documentation

## Tool

- **Name**: `feishu_contact_user_create`
- **Skill**: `contact.user.create`
- **SDK**: `client.contact.user.create`
- **Purpose**: 调用自建应用 `contact.user.create` 创建员工。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | `true` | `input` | 员工姓名。 | "张三" |
| `mobile` | `string` | `false` | `input` | 手机号。 | "13800000000" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Create user with name and mobile only

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "name": "张三",
    "mobile": "13800000000"
  }
}
```

### Example 2: Create user with department

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "name": "李四",
    "mobile": "13900000000",
    "data_json": "{\"department_id_list\":[\"od-xxx\"]}"
  }
}
```

### Example 3: Create user with email

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "name": "王五",
    "data_json": "{\"email\":\"wangwu@example.com\"}"
  }
}
```

### Example 4: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"data\":{\"name\":\"赵六\",\"mobile\":\"13700000000\",\"email\":\"zhaoliu@example.com\"}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_create",
  "tool": "feishu_contact_user_create",
  "payload_raw": "{\"data\":{\"name\":\"张三\",\"mobile\":\"13800000000\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"user_id\":\"ou_xxx\"}}"
}
```

### Error Response - Duplicate Mobile

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_create",
  "tool": "feishu_contact_user_create",
  "payload_raw": "{\"data\":{\"name\":\"张三\",\"mobile\":\"13800000000\"}}",
  "response_raw": "{\"code\":99991663,\"msg\":\"手机号已存在\",\"data\":{}}"
}
```