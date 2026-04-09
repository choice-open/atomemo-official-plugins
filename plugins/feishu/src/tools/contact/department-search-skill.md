# Feishu Contact Department Search Tool Documentation

## Tool

- **Name**: `feishu_contact_department_search`
- **Skill**: `contact.department.search`
- **SDK**: `client.contact.department.search`
- **Purpose**: 调用 `contact.department.search` 搜索部门。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `department_name` | `string` | `false` | `input` | 搜索关键词（data.query）。 | "研发" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Search departments by name

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "department_name": "研发"
  }
}
```

### Example 2: Search using data_json

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"query\":\"产品\"}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"data\":{\"query\":\"技术\"}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_search",
  "tool": "feishu_contact_department_search",
  "payload_raw": "{\"data\":{\"query\":\"研发\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"department_list\":[{\"department_id\":\"od-xxx\",\"name\":\"研发部\"},{\"department_id\":\"od-yyy\",\"name\":\"研发一组\"}]}}"
}
```

### No Results

```json
{
  "message": "Feishu API invoked successfully: feishu_contact_department_search",
  "tool": "feishu_contact_department_search",
  "payload_raw": "{\"data\":{\"query\":\"不存在的部门\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"department_list\":[]}}"
}
```