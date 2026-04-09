# Feishu Contact Department List Tool Documentation

## Tool

- **Name**: `feishu_contact_department_list`
- **Skill**: `contact.department.list`
- **SDK**: `client.contact.department.list`
- **Purpose**: 调用 `contact.department.list` 获取部门列表。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `parent_department_id` | `string` | `false` | `input` | 父部门 ID（params）。 | "0" |
| `fetch_child` | `boolean` | `false` | `input` | 是否递归子部门。 | "true" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: List root departments

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "parent_department_id": "0"
  }
}
```

### Example 2: List sub-departments without recursion

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "parent_department_id": "od-xxx",
    "params_json": "{\"fetch_child\":false}"
  }
}
```

### Example 3: List all departments recursively

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "parent_department_id": "0",
    "params_json": "{\"fetch_child\":true,\"page_size\":100}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_list",
  "tool": "feishu_contact_department_list",
  "payload_raw": "{\"params\":{\"parent_department_id\":\"0\",\"fetch_child\":true}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"department_list\":[{\"department_id\":\"od-xxx\",\"name\":\"研发部\",\"parent_department_id\":\"0\"},{\"department_id\":\"od-yyy\",\"name\":\"产品部\",\"parent_department_id\":\"0\"}]}}"
}
```

### Pagination Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_list",
  "tool": "feishu_contact_department_list",
  "payload_raw": "{\"params\":{\"parent_department_id\":\"0\",\"page_size\":50}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"department_list\":[...],\"page_token\":\"next_token\",\"has_more\":true}}"
}
```