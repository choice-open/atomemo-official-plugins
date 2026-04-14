# 更新部门 Tool Documentation

## Tool

- **Name**: `feishu-organization_patch_department`
- **Module**: `organization`
- **Method**: `PATCH`
- **Path**: `/open-apis/directory/v1/departments/:department_id`
- **Purpose**: 本接口用于更新部门信息。
- **API Doc**: https://open.feishu.cn/document/directory-v1/department/patch

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `department_id`：路径参数（必填），示例值 `od-1a2b3c4d5e`。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- `body_json`：请求体 JSON 字符串（必填），字段需遵循官方文档定义。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "department_id": "od-1a2b3c4d5e",
    "query_params_json": "{\"department_id_type\":\"open_department_id\"}",
    "body_json": "{\"department\":{\"name\":{\"default_value\":\"产品研发中心\"},\"parent_department_id\":\"0\"}}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "department_id": "od-1a2b3c4d5e",
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
