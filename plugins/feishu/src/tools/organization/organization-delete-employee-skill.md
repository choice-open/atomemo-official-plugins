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
- `employee_id_type`：员工 ID 类型（可选），与官方查询参数 `employee_id_type` 一致，支持值：`open_id`、`employee_id`、`union_id`。
- 飞书官方接口支持可选请求体 `options`（用于资源接收者配置），但当前 Tool 未暴露 `body_json` 参数，因此本 Tool 调用时不支持传请求体。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "employee_id": "u273y71",
    "employee_id_type": "employee_id"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "employee_id": ""
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
