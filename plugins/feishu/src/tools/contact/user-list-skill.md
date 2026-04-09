# Feishu Contact User List Tool Documentation

## Tool

- **Name**: `feishu_contact_user_list`
- **Skill**: `contact.user.list`
- **SDK**: `client.contact.user.list`
- **Purpose**: 调用 `contact.user.list` 分页获取用户列表。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `department_id` | `string` | `false` | `input` | 部门 ID（params）。根部门为 "0"。 | "0" |
| `department_id_type` | `string` | `false` | `input` | 部门 ID 类型（params）。支持 open_department_id/department_id。 | "open_department_id" |
| `page_size` | `number` | `false` | `input` | 分页大小（params，数字）。 | "50" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: List all users in root department

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "0",
    "department_id_type": "open_department_id"
  }
}
```

### Example 2: List users with pagination

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "0",
    "params_json": "{\"page_size\":20}"
  }
}
```

### Example 3: List users including sub-departments

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "od-xxx",
    "params_json": "{\"fetch_child\":true}"
  }
}
```

### Example 4: Using params_json for more options

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "0",
    "params_json": "{\"page_size\":50,\"fetch_child\":true,\"user_id_type\":\"open_id\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_list",
  "tool": "feishu_contact_user_list",
  "payload_raw": "{\"params\":{\"department_id\":\"0\",\"page_size\":50,\"fetch_child\":true}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"user_list\":[{\"user_id\":\"ou_xxx\",\"name\":\"张三\",\"department_id_list\":[\"od-xxx\"]},{\"user_id\":\"ou_yyy\",\"name\":\"李四\"}],\"page_token\":\"next_token\",\"has_more\":true}}"
}
```

### Pagination Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_user_list",
  "tool": "feishu_contact_user_list",
  "payload_raw": "{\"params\":{\"department_id\":\"0\",\"page_size\":10}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"user_list\":[...],\"page_token\":\"token_xxx\",\"has_more\":true}}"
}
```