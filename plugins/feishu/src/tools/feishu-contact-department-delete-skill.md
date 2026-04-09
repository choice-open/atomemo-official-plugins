# Feishu Contact Department Delete Tool Documentation

## Tool

- **Name**: `feishu_contact_department_delete`
- **Skill**: `contact.department.delete`
- **SDK**: `client.contact.department.delete`
- **Purpose**: 调用 `contact.department.delete` 删除部门。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `department_id` | `string` | `true` | `input` | 部门 ID（path）。 | "od-xxx" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Delete department by ID

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "od-xxx"
  }
}
```

### Example 2: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"department_id\":\"od-xxx\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_delete",
  "tool": "feishu_contact_department_delete",
  "payload_raw": "{\"path\":{\"department_id\":\"od-xxx\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - Department Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_delete",
  "tool": "feishu_contact_department_delete",
  "payload_raw": "{\"path\":{\"department_id\":\"od_invalid\"}}",
  "response_raw": "{\"code\":99991642,\"msg\":\"department not found\",\"data\":{}}"
}
```

### Error Response - Department Has Subdepartments

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_delete",
  "tool": "feishu_contact_department_delete",
  "payload_raw": "{\"path\":{\"department_id\":\"od-xxx\"}}",
  "response_raw": "{\"code\":99991644,\"msg\":\"department has sub departments, cannot be deleted\",\"data\":{}}"
}
```