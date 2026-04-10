# 更新群信息 Tool Documentation

## Tool

- **Name**: `feishu-im_patch_chat`
- **Module**: `im`
- **Method**: `PATCH`
- **Path**: `/open-apis/im/v1/chats/:chat_id`
- **Purpose**: Calls Feishu Open API endpoint `PATCH /open-apis/im/v1/chats/:chat_id`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |

### Query Schema（完整定义，来自 `im/zod/im-patch-chat.zod.ts`）

```ts
export const imPatchChatQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
  })
  .strict()
```

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `avatar` | `string` | `false` | `z.string().optional()` |
| `name` | `string` | `false` | `z.string().optional()` |
| `description` | `string` | `false` | `z.string().optional()` |
| `i18n_names` | `object` | `false` | `i18nNameSchema.optional()` |
| `owner_id` | `string` | `false` | `z.string().optional()` |
| `add_member_permission` | `unknown` | `false` | `z .enum(["all_members", "only_owner", "moderator_list", "no_one"]) .optional()` |
| `share_card_permission` | `unknown` | `false` | `z .enum(["allowed", "only_owner", "no_one"]) .optional()` |
| `at_all_permission` | `unknown` | `false` | `z .enum(["all_members", "only_owner", "moderator_list", "no_one"]) .optional()` |
| `edit_permission` | `enum` | `false` | `z.enum(["all_members", "only_owner"]).optional()` |
| `membership_approval` | `unknown` | `false` | `z .enum(["no_approval_required", "approval_required"]) .optional()` |
| `moderation_permission` | `unknown` | `false` | `z .enum(["all_members", "only_owner", "moderator_list"]) .optional()` |
| `hide_member_count_setting` | `enum` | `false` | `z.enum(["all_members", "only_owner"]).optional()` |

### Body Schema（完整定义，来自 `im/zod/im-patch-chat.zod.ts`）

```ts
export const imPatchChatBodySchema = z
  .object({
    avatar: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    i18n_names: i18nNameSchema.optional(),
    owner_id: z.string().optional(),
    add_member_permission: z
      .enum(["all_members", "only_owner", "moderator_list", "no_one"])
      .optional(),
    share_card_permission: z
      .enum(["allowed", "only_owner", "no_one"])
      .optional(),
    at_all_permission: z
      .enum(["all_members", "only_owner", "moderator_list", "no_one"])
      .optional(),
    edit_permission: z.enum(["all_members", "only_owner"]).optional(),
    membership_approval: z
      .enum(["no_approval_required", "approval_required"])
      .optional(),
    moderation_permission: z
      .enum(["all_members", "only_owner", "moderator_list"])
      .optional(),
    hide_member_count_setting: z.enum(["all_members", "only_owner"]).optional(),
  })
  .strict()
```

## Tool Input 示例

### 示例1（成功，最小可用）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "chat_id": "<chat_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "chat_id": "<chat_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\",\"i18n_names\":\"sample\",\"owner_id\":\"sample\",\"add_member_permission\":\"sample\",\"share_card_permission\":\"sample\",\"at_all_permission\":\"sample\",\"edit_permission\":\"sample\",\"membership_approval\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "chat_id": "<chat_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "chat_id": "<chat_id>",
    "query_params_json": "{\"user_id_type\":\"sample\"}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "chat_id": "<chat_id>",
    "query_params_json": "{bad-json",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
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
