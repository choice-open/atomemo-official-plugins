# 批量获取部门信息 Tool Documentation

## Tool

- **Name**: `feishu-organization_batch_get_departments`
- **Module**: `organization`
- **Method**: `POST`
- **Path**: `/open-apis/directory/v1/departments/mget`
- **Purpose**: 本接口用于批量根据部门ID查询部门详情。
- **API Doc**: https://open.feishu.cn/document/directory-v1/department/mget

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
    "query_params_json": "{\"department_id_type\":\"open_department_id\"}",
    "body_json": "{\"department_ids\":[\"od-1a2b3c4d5e\",\"od-9f8e7d6c5b\"],\"required_fields\":[\"name\",\"parent_department_id\"]}"
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
