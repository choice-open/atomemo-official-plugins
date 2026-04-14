# 删除部门 Tool Documentation

## Tool

- **Name**: `feishu-organization_delete_department`
- **Module**: `organization`
- **Method**: `DELETE`
- **Path**: `/open-apis/directory/v1/departments/:department_id`
- **Purpose**: 本接口用于删除部门。
- **API Doc**: https://open.feishu.cn/document/directory-v1/department/delete

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `department_id`：路径参数（必填），示例值 `od-1a2b3c4d5e`。
- `query_params_json`：查询参数 JSON 字符串（可选）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "department_id": "od-1a2b3c4d5e",
    "query_params_json": "{\"department_id_type\":\"open_department_id\"}"
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
