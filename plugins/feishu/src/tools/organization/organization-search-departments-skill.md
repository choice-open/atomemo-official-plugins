# 搜索部门 Tool Documentation

## Tool

- **Name**: `feishu-organization_search_departments`
- **Module**: `organization`
- **Method**: `POST`
- **Path**: `/open-apis/directory/v1/departments/search`
- **Purpose**: 本接口用于搜索部门信息，通过部门名称等关键词搜索部门信息，返回符合条件的部门列表。
- **API Doc**: https://open.feishu.cn/document/directory-v1/department/search

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `department_id_type`：部门 ID 类型（可选），与官方查询参数 `department_id_type` 一致，支持值：`open_department_id`、`department_id`。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "department_id_type": "open_department_id",
    "body_json": "{\"query\":\"产品\",\"required_fields\":[\"name\",\"parent_department_id\"],\"page_request\":{\"page_size\":20,\"page_token\":\"\"}}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "body_json": "{bad-json"
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
