# 获取部门列表 Tool Documentation

## Tool

- **Name**: `feishu-organization_list_departments`
- **Module**: `organization`
- **Method**: `POST`
- **Path**: `/open-apis/directory/v1/departments/filter`
- **Purpose**: 本接口用于依据指定条件，批量获取符合条件的部门详情列表。
- **API Doc**: https://open.feishu.cn/document/directory-v1/department/filter

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
    "body_json": "{\"filter\":{\"conditions\":[{\"field\":\"parent_department_id\",\"operator\":\"eq\",\"value\":\"\\\"0\\\"\"}]},\"required_fields\":[\"name\",\"parent_department_id\"],\"page_request\":{\"page_size\":20,\"page_token\":\"\"}}"
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
