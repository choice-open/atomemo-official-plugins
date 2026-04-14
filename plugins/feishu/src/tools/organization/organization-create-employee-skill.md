# 创建员工 Tool Documentation

## Tool

- **Name**: `feishu-organization_create_employee`
- **Module**: `organization`
- **Method**: `POST`
- **Path**: `/open-apis/directory/v1/employees`
- **Purpose**: 本接口用于在企业下创建员工。
- **API Doc**: https://open.feishu.cn/document/directory-v1/employee/create

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"employee_id_type\":\"employee_id\"}",
    "body_json": "{\"employee\":{\"name\":{\"name\":{\"default_value\":\"张三\"}},\"mobile\":\"+8613011111111\",\"email\":\"zhangsan@example.com\",\"department_ids\":[\"od-1a2b3c4d5e\"]}}"
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
