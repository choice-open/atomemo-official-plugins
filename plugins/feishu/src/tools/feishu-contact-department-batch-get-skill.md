# Feishu Contact Department Batch Get Tool Documentation

## Tool

- **Name**: `feishu_contact_department_batch_get`
- **Skill**: `contact.department.batch.get`
- **SDK**: `client.contact.department.batch`
- **Purpose**: 调用 `contact.department.batch` 批量获取部门。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `department_id_type` | `string` | `false` | `input` | 部门 ID 类型（params）。 | "department_id" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Batch get departments by department_ids

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"department_id_type\":\"department_id\"}",
    "data_json": "{\"department_ids\":[\"od-xxx\",\"od-yyy\",\"od-zzz\"]}"
  }
}
```

### Example 2: Batch get with open_department_id

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "params_json": "{\"department_id_type\":\"open_department_id\"}",
    "data_json": "{\"department_ids\":[\"od_xxx\",\"od_yyy\"]}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"params\":{\"department_id_type\":\"department_id\"},\"data\":{\"department_ids\":[\"od-xxx\"]}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_batch_get",
  "tool": "feishu_contact_department_batch_get",
  "payload_raw": "{\"params\":{\"department_id_type\":\"department_id\"},\"data\":{\"department_ids\":[\"od-xxx\",\"od-yyy\"]}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"department_list\":[{\"department_id\":\"od-xxx\",\"name\":\"研发部\"},{\"department_id\":\"od-yyy\",\"name\":\"产品部\"}]}}"
}
```

### Error Response - Empty Department IDs

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_batch_get",
  "tool": "feishu_contact_department_batch_get",
  "payload_raw": "{\"data\":{\"department_ids\":[]}}",
  "response_raw": "{\"code\":99991603,\"msg\":\"department_ids is empty\",\"data\":{}}"
}
```