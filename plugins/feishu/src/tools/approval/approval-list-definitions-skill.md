# 获取审批定义列表 Tool Documentation

## Tool

- **Name**: `feishu-approval_list_definitions`
- **Module**: `approval`
- **Method**: `GET`
- **Path**: `/open-apis/approval/v4/approvals`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/approval/v4/approvals`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `page_size` | `number` | `false` | `z.number().int().min(1).max(100).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `approval/zod/approval-list-definitions.zod.ts`）

```ts
export const approvalListDefinitionsQuerySchema = z
  .object({
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"page_size\":20,\"page_token\":\"sample\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json"
  }
}
```

## Tool Output 示例

### 成功

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

### 失败（参数错误示意）

```json
{
  "code": 400,
  "msg": "invalid parameter",
  "data": {}
}
```
