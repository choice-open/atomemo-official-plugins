# 批量查询员工列表 Tool Documentation

## Tool

- **Name**: `feishu-organization_batch_get_employee_list`
- **Module**: `organization`
- **Method**: `POST`
- **Path**: `/open-apis/directory/v1/employees/filter`
- **Purpose**: 本接口用于依据指定条件，批量获取符合条件的员工详情列表。
- **API Doc**: https://open.feishu.cn/document/directory-v1/employee/filter

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填），用于传入 `filter`、`page_request` 和 `required_fields`。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"employee_id_type\":\"employee_id\"}",
    "body_json": "{\"filter\":{\"conditions\":[{\"field\":\"employment_status\",\"operator\":\"eq\",\"value\":\"\\\"active\\\"\"}]},\"required_fields\":[\"employee.base_info.employee_id\",\"employee.base_info.name\"],\"page_request\":{\"page_size\":20}}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json"
  }
}
```

## Tool Output 示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```
