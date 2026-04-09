# Feishu Contact Department Create Tool Documentation

## Tool

- **Name**: `feishu_contact_department_create`
- **Skill**: `contact.department.create`
- **SDK**: `client.contact.department.create`
- **Purpose**: 调用 `contact.department.create` 创建部门。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `department_name` | `string` | `true` | `input` | 部门名称（data.name）。 | "研发部" |
| `parent_department_id` | `string` | `false` | `input` | 父部门 ID。 | "0" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Create department at root level

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_name": "研发部"
  }
}
```

### Example 2: Create sub-department

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_name": "后端组",
    "parent_department_id": "od-xxx"
  }
}
```

### Example 3: Create department with data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"name\":\"产品部\",\"parent_department_id\":\"0\",\"order\":1}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_create",
  "tool": "feishu_contact_department_create",
  "payload_raw": "{\"data\":{\"name\":\"研发部\",\"parent_department_id\":\"0\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"department_id\":\"od_new123\"}}"
}
```

### Error Response - Duplicate Department Name

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_create",
  "tool": "feishu_contact_department_create",
  "payload_raw": "{\"data\":{\"name\":\"研发部\",\"parent_department_id\":\"0\"}}",
  "response_raw": "{\"code\":99991642,\"msg\":\"department name already exists\",\"data\":{}}"
}
```