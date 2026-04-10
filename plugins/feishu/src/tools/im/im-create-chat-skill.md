# 创建群聊 Tool Documentation

## Tool

- **Name**: `feishu-im_create_chat`
- **Module**: `im`
- **Method**: `POST`
- **Path**: `/open-apis/im/v1/chats`
- **Purpose**: Calls Feishu Open API endpoint `POST /open-apis/im/v1/chats`.

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| `user_id_type` | `object` | `false` | `feishuUserIdTypeSchema.optional()` |
| `set_bot_manager` | `boolean` | `false` | `z.boolean().optional()` |
| `uuid` | `string` | `false` | `z.string().optional()` |

### Query Schema（完整定义，来自 `im/zod/im-create-chat.zod.ts`）

```ts
export const imCreateChatQuerySchema = z
  .object({
    user_id_type: feishuUserIdTypeSchema.optional(),
    set_bot_manager: z.boolean().optional(),
    uuid: z.string().optional(),
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
| `user_id_list` | `array` | `false` | `z.array(z.string()).optional()` |
| `bot_id_list` | `array` | `false` | `z.array(z.string()).optional()` |
| `group_message_type` | `enum` | `false` | `z.enum(["chat", "thread"]).optional()` |
| `chat_mode` | `enum` | `false` | `z.enum(["group", "topic", "p2p"]).optional()` |
| `chat_type` | `enum` | `false` | `z.enum(["private", "public"]).optional()` |
| `chat_tag` | `string` | `false` | `z.string().optional()` |
| `external` | `boolean` | `false` | `z.boolean().optional()` |
| `join_message_visibility` | `unknown` | `false` | `z .enum(["only_owner", "all_members", "not_anyone"]) .optional()` |
| `leave_message_visibility` | `unknown` | `false` | `z .enum(["only_owner", "all_members", "not_anyone"]) .optional()` |
| `membership_approval` | `unknown` | `false` | `z .enum(["no_approval_required", "approval_required"]) .optional()` |
| `restricted_mode_setting` | `object` | `false` | `restrictedModeSettingSchema.optional()` |
| `urgent_setting` | `enum` | `false` | `z.enum(["only_owner", "all_members"]).optional()` |
| `video_conference_setting` | `enum` | `false` | `z.enum(["only_owner", "all_members"]).optional()` |
| `add_member_permission` | `unknown` | `false` | `z .enum(["all_members", "only_owner", "moderator_list", "no_one"]) .optional()` |
| `share_card_permission` | `unknown` | `false` | `z .enum(["allowed", "only_owner", "no_one"]) .optional()` |
| `at_all_permission` | `unknown` | `false` | `z .enum(["all_members", "only_owner", "moderator_list", "no_one"]) .optional()` |
| `edit_permission` | `enum` | `false` | `z.enum(["all_members", "only_owner"]).optional()` |
| `moderation_permission` | `unknown` | `false` | `z .enum(["all_members", "only_owner", "moderator_list"]) .optional()` |
| `hide_member_count_setting` | `enum` | `false` | `z.enum(["all_members", "only_owner"]).optional()` |

### Body Schema（完整定义，来自 `im/zod/im-create-chat.zod.ts`）

```ts
export const imCreateChatBodySchema = z
  .object({
    avatar: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    i18n_names: i18nNameSchema.optional(),
    owner_id: z.string().optional(),
    user_id_list: z.array(z.string()).optional(),
    bot_id_list: z.array(z.string()).optional(),
    group_message_type: z.enum(["chat", "thread"]).optional(),
    chat_mode: z.enum(["group", "topic", "p2p"]).optional(),
    chat_type: z.enum(["private", "public"]).optional(),
    chat_tag: z.string().optional(),
    external: z.boolean().optional(),
    join_message_visibility: z
      .enum(["only_owner", "all_members", "not_anyone"])
      .optional(),
    leave_message_visibility: z
      .enum(["only_owner", "all_members", "not_anyone"])
      .optional(),
    membership_approval: z
      .enum(["no_approval_required", "approval_required"])
      .optional(),
    restricted_mode_setting: restrictedModeSettingSchema.optional(),
    urgent_setting: z.enum(["only_owner", "all_members"]).optional(),
    video_conference_setting: z.enum(["only_owner", "all_members"]).optional(),
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
    "query_params_json": "{\"user_id_type\":\"sample\",\"set_bot_manager\":true}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
  }
}
```

### 示例2（成功，完整字段）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"set_bot_manager\":true,\"uuid\":\"sample\"}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\",\"i18n_names\":\"sample\",\"owner_id\":\"sample\",\"user_id_list\":[],\"bot_id_list\":[],\"group_message_type\":\"sample\",\"chat_mode\":\"sample\",\"chat_type\":\"sample\"}"
  }
}
```

### 示例3（成功，过滤/分页）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"sample\",\"set_bot_manager\":true}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
  }
}
```

### 示例4（错误，缺少必填参数）

```json
{
  "parameters": {
    "query_params_json": "{\"user_id_type\":\"sample\",\"set_bot_manager\":true}",
    "body_json": "{\"avatar\":\"sample\",\"name\":\"sample\",\"description\":\"sample\"}"
  }
}
```

### 示例5（错误，参数类型/格式非法）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
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
