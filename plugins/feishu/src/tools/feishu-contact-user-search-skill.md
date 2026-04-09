# Feishu Contact User Search Tool Documentation

## Tool

- **Name**: `feishu_contact_user_search`
- **Skill**: `contact.user.search`
- **SDK**: `client.contact.user.batchGetId`
- **Purpose**: 调用 `contact.user.batchGetId` 按邮箱/手机号等批量解析用户。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `emails_json` | `string` | `false` | `input` | 邮箱数组 JSON 字符串（data.emails）。 | "[\"a@b.com\"]" |
| `mobiles_json` | `string` | `false` | `input` | 手机号数组 JSON 字符串（data.mobiles）。 | "[\"13800000000\"]" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Search by emails

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "emails_json": "[\"zhangsan@example.com\",\"lisi@example.com\"]"
  }
}
```

### Example 2: Search by mobiles

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "mobiles_json": "[\"13800000000\",\"13900000000\"]"
  }
}
```

### Example 3: Search by both email and mobile

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "emails_json": "[\"user@example.com\"]",
    "mobiles_json": "[\"13800000000\"]"
  }
}
```

### Example 4: Using data_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"emails\":[\"test@example.com\"],\"mobiles\":[\"13700000000\"]}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_search",
  "tool": "feishu_contact_user_search",
  "payload_raw": "{\"data\":{\"emails\":[\"zhangsan@example.com\"]}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"user_list\":[{\"user_id\":\"ou_xxx\",\"name\":\"张三\",\"email\":\"zhangsan@example.com\"}]}}"
}
```

### Error Response - No Search Criteria

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_search",
  "tool": "feishu_contact_user_search",
  "payload_raw": "{\"data\":{}}",
  "response_raw": "{\"code\":99991603,\"msg\":\"emails and mobiles cannot be both empty\",\"data\":{}}"
}
```