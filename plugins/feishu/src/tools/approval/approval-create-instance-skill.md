# 创建审批实例 Tool Documentation

## Tool

- **Name**: `feishu-approval_create_instance`
- **Module**: `approval`
- **Method**: `POST`
- **Path**: `/open-apis/approval/v4/instances`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/approval/v4/instances`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `approval/zod/approval-create-instance.zod.ts`）

```ts
export const approvalCreateInstanceQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `approval_code` | `string` | `true` | `z.string()` |
| `user_id` | `string` | `false` | `z.string().optional()` |
| `open_id` | `string` | `false` | `z.string().optional()` |
| `department_id` | `string` | `false` | `z.string().optional()` |
| `form` | `string` | `true` | `z.string()` |
| `node_approver_user_id_list` | `array` | `false` | `z.array(nodeApproverSchema).optional()` |
| `node_approver_open_id_list` | `array` | `false` | `z.array(nodeApproverSchema).optional()` |
| `node_cc_user_id_list` | `array` | `false` | `z.array(nodeCcSchema).optional()` |
| `node_cc_open_id_list` | `array` | `false` | `z.array(nodeCcSchema).optional()` |
| `uuid` | `string` | `false` | `z.string().optional()` |
| `allow_resubmit` | `boolean` | `false` | `z.boolean().optional()` |
| `allow_submit_again` | `boolean` | `false` | `z.boolean().optional()` |
| `cancel_bot_notification` | `string` | `false` | `z.string().optional()` |
| `forbid_revoke` | `boolean` | `false` | `z.boolean().optional()` |
| `i18n_resources` | `array` | `false` | `z.array(i18nResourceSchema).optional()` |
| `title` | `string` | `false` | `z.string().optional()` |
| `title_display_method` | `number` | `false` | `z.number().int().optional()` |
| `node_auto_approval_list` | `array` | `false` | `z.array(nodeAutoApprovalSchema).optional()` |

### Body Schema（完整定义，来自 `approval/zod/approval-create-instance.zod.ts`）

```ts
export const approvalCreateInstanceBodySchema = z
  .object({
    approval_code: z.string(),
    user_id: z.string().optional(),
    open_id: z.string().optional(),
    department_id: z.string().optional(),
    form: z.string(),
    node_approver_user_id_list: z.array(nodeApproverSchema).optional(),
    node_approver_open_id_list: z.array(nodeApproverSchema).optional(),
    node_cc_user_id_list: z.array(nodeCcSchema).optional(),
    node_cc_open_id_list: z.array(nodeCcSchema).optional(),
    uuid: z.string().optional(),
    allow_resubmit: z.boolean().optional(),
    allow_submit_again: z.boolean().optional(),
    cancel_bot_notification: z.string().optional(),
    forbid_revoke: z.boolean().optional(),
    i18n_resources: z.array(i18nResourceSchema).optional(),
    title: z.string().optional(),
    title_display_method: z.number().int().optional(),
    node_auto_approval_list: z.array(nodeAutoApprovalSchema).optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"approval_code\":\"sample\",\"form\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"approval_code\":\"sample\",\"user_id\":\"sample\",\"open_id\":\"sample\",\"department_id\":\"sample\",\"form\":\"sample\",\"node_approver_user_id_list\":[],\"node_approver_open_id_list\":[],\"node_cc_user_id_list\":[],\"node_cc_open_id_list\":[],\"uuid\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"approval_code\":\"sample\",\"form\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"approval_code\":\"sample\",\"form\":\"sample\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"approval_code\":\"sample\",\"form\":\"sample\"}"
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
