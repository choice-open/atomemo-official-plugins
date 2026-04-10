# 获取审批实例详情 Tool Documentation

## Tool

- **Name**: `feishu-approval_get_instance`
- **Module**: `approval`
- **Method**: `GET`
- **Path**: `/open-apis/approval/v4/instances/:instance_id`
- **Purpose**: Calls Feishu Open API endpoint `GET /open-apis/approval/v4/instances/:instance_id`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `locale` | `enum` | `false` | `z.enum(["zh-CN", "en-US", "ja-JP"]).optional()` |
| `user_id` | `string` | `false` | `z.string().optional()` |
| `user_id_type` | `enum` | `false` | `z.enum(["open_id", "union_id", "user_id"]).optional()` |

### Query Schema（完整定义，来自 `approval/approval-get-instance.zod.ts`）

```ts
export const approvalGetInstanceQuerySchema = z
  .object({
    locale: z.enum(["zh-CN", "en-US", "ja-JP"]).optional(),
    user_id: z.string().optional(),
    user_id_type: z.enum(["open_id", "union_id", "user_id"]).optional(),
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
    "instance_id": "<instance_id>",
    "query_params_json": "{\"locale\":\"sample\",\"user_id\":\"sample\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "instance_id": "<instance_id>",
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
