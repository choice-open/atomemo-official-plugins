# 更新员工信息 Tool Documentation

## Tool

- **Name**: `feishu-organization_patch_employee`
- **Module**: `organization`
- **Method**: `PATCH`
- **Path**: `/open-apis/directory/v1/employees/:employee_id`
- **Purpose**: 本接口用于更新在职/离职员工的信息、冻结/恢复员工。
- **API Doc**: https://open.feishu.cn/document/directory-v1/employee/patch

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `employee_id`：路径参数（必填），示例值 `u273y71`。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "employee_id": "u273y71",
    "query_params_json": "{\"employee_id_type\":\"employee_id\"}",
    "body_json": "{\"employee\":{\"mobile\":\"+8613811112222\",\"email\":\"zhangsan.updated@example.com\"}}"
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
