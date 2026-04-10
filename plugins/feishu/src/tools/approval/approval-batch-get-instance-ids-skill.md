# 批量获取审批实例ID Tool Documentation

## Tool

- **Name**: `feishu-approval_batch_get_instance_ids`
- **Module**: `approval`
- **Method**: `GET`
- **Path**: `/open-apis/approval/v4/instances`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/approval/v4/instances`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `approval_code` | `string` | `true` | `z.string()` |
| `start_time` | `string` | `true` | `z.string()` |
| `end_time` | `string` | `true` | `z.string()` |
| `page_size` | `number` | `false` | `z.number().int().min(1).max(100).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `approval/approval-batch-get-instance-ids.zod.ts`）

```ts
export const approvalBatchGetInstanceIdsQuerySchema = z
  .object({
    approval_code: z.string(),
    start_time: z.string(),
    end_time: z.string(),
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
    "query_params_json": "{\"approval_code\":\"sample\",\"start_time\":\"sample\"}"
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
