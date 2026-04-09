# Feishu Contact Department Update Tool Documentation

## Tool

- **Name**: `feishu_contact_department_update`
- **Skill**: `contact.department.update`
- **SDK**: `client.contact.department.patch`
- **Purpose**: 调用 `contact.department.patch` 更新部门。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `department_id` | `string` | `true` | `input` | 部门 ID（path）。 | "od-xxx" |
| `department_name` | `string` | `false` | `input` | 部门名称（data.name）。 | "研发一部" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Update department name

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "od-xxx",
    "department_name": "研发一部"
  }
}
```

### Example 2: Update department using data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_id": "od-xxx",
    "data_json": "{\"name\":\"新产品部\",\"order\":10}"
  }
}
```

### Example 3: Using path_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "path_json": "{\"department_id\":\"od-xxx\"}",
    "data_json": "{\"name\":\"更新后名称\"}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_update",
  "tool": "feishu_contact_department_update",
  "payload_raw": "{\"path\":{\"department_id\":\"od-xxx\"},\"data\":{\"name\":\"研发一部\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{}}"
}
```

### Error Response - Department Not Found

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_update",
  "tool": "feishu_contact_department_update",
  "payload_raw": "{\"path\":{\"department_id\":\"od_invalid\"},\"data\":{\"name\":\"新名称\"}}",
  "response_raw": "{\"code\":99991642,\"msg\":\"department not found\",\"data\":{}}"
}
```