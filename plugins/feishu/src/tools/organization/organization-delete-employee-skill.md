# 离职员工 Tool Documentation

## Tool

- **Name**: `feishu-organization_delete_employee`
- **Module**: `organization`
- **Method**: `DELETE`
- **Path**: `/open-apis/directory/v1/employees/:employee_id`
- **Purpose**: 本接口用于离职员工。
- **API Doc**: https://open.feishu.cn/document/directory-v1/employee/delete

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `employee_id`：路径参数（必填），示例值 `u273y71`。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "employee_id": "u273y71",
    "query_params_json": "{\"employee_id_type\":\"employee_id\"}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "employee_id": "u273y71",
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
