# 批量获取员工信息 Tool Documentation

## Tool

- **Name**: `feishu-organization_batch_get_employees`
- **Module**: `organization`
- **Method**: `POST`
- **Path**: `/open-apis/directory/v1/employees/mget`
- **Purpose**: 本接口用于批量根据员工的ID查询员工的详情。
- **API Doc**: https://open.feishu.cn/document/directory-v1/employee/mget

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
    "body_json": "{\"employee_ids\":[\"u273y71\",\"u9ab8c7\"],\"required_fields\":[\"base_info.name.name\",\"base_info.mobile\",\"work_info.job_number\"]}"
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
