# 上传文件 Tool Documentation

## Tool

- **Name**: `feishu-im_upload_file`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/files`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/im/v1/files`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `page_size` | `number` | `false` | `z.number().int().min(1).max(100).optional()` |
| `page_token` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `im/zod/im-actions.zod.ts`）

```ts
export const imActionQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    page_size: z.number().int().min(1).max(100).optional(),
    page_token: z.string().optional(),
  }
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
    "query_params_json": "{\"user_id_type\":\"sample\",\"page_size\":20}",
    "body_json": "{\"key\":\"value\"}"
  }
}
```

### 示例2（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"key\":\"value\"}"
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
