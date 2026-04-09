# Feishu Priority Tools Usage

本文说明 `feishu-priority-tools` 中每个优先功能 tool 的调用方式。  
所有 tool 都使用飞书官方 SDK 内建方法（`client.<module>.<resource>.<method>`），不使用 `client.request`。

## 通用参数

每个 tool 均包含以下参数：

- `credentialId`：飞书应用凭证（`app_id` / `app_secret`）
- `payload_json`：完整 SDK payload（可选，优先级最高）
- `params_json`：SDK `params` 字段（可选）
- `path_json`：SDK `path` 字段（可选）
- `data_json`：SDK `data` 字段（可选）
- 若 tool 提供了结构化字段（例如 `calendar_id`、`event_id`、`receive_id_type`），这些字段会自动映射到对应 `params/path/data`
- 对于带 `*_json` 后缀的结构化字段（如 `emails_json`、`calendar_ids_json`），会先按 JSON 解析再注入 payload（适合数组/对象）
- 部分字段已启用数字转换（如 `page_size`），输入 `"50"` 会按数值 `50` 注入
- 部分字段已启用布尔转换（如 `fetch_child`、`ignore_cancelled`），输入 `"true"`/`"false"` 会按布尔注入

### 字段类型速查

| 字段类型 | 配置 | 输入示例 | 注入结果 |
| --- | --- | --- | --- |
| 字符串 | `valueType: "string"` | `ou_xxx` | `"ou_xxx"` |
| JSON | `valueType: "json"` | `["ou_xxx","ou_yyy"]` | `["ou_xxx","ou_yyy"]` |
| 数字 | `valueType: "number"` | `50` | `50` |
| 布尔 | `valueType: "boolean"` | `true` | `true` |

### 接口级必填校验（已启用）

以下 tool 在调用 SDK 前会做额外校验并提前报错：

- `feishu_contact_user_create`：`data.name`
- `feishu_im_message_send`：`params.receive_id_type`、`data.receive_id`、`data.msg_type`、`data.content`
- `feishu_calendar_event_create`：`path.calendar_id`、`data.summary`

校验错误统一格式：`VALIDATION_ERROR: Missing required field: <section>.<key>`

说明：当前 33 个 tool 均已绑定独立 `validatePayload` 规则；无额外强校验的接口使用独立空规则占位，便于后续逐个增强。

### 必填字段矩阵（当前实现）

| Tool | 必填字段 |
| --- | --- |
| `feishu_contact_user_create` | `data.name` |
| `feishu_contact_user_update` | `path.user_id` |
| `feishu_contact_user_resign` | `path.user_id` |
| `feishu_contact_user_batch_get` | `data.user_ids` |
| `feishu_contact_user_search` | `data.emails` 或 `data.mobiles` |
| `feishu_contact_department_create` | `data.name` |
| `feishu_contact_department_update` | `path.department_id` |
| `feishu_contact_department_delete` | `path.department_id` |
| `feishu_contact_department_batch_get` | `data.department_ids` |
| `feishu_contact_department_search` | `data.query` |
| `feishu_im_message_send` | `params.receive_id_type`、`data.receive_id`、`data.msg_type`、`data.content` |
| `feishu_im_message_batch_send` | `path.message_id` |
| `feishu_im_image_download` | `path.image_key` |
| `feishu_im_file_download` | `path.file_key` |
| `feishu_im_image_upload` | `data.image` 或 `data.image_key` |
| `feishu_im_file_upload` | `data.file` / `data.file_name` / `data.file_type` 至少一个 |
| `feishu_calendar_shared_create` | `data.summary` |
| `feishu_calendar_shared_delete` | `path.calendar_id` |
| `feishu_calendar_get` | `path.calendar_id` |
| `feishu_calendar_update` | `path.calendar_id` |
| `feishu_calendar_search` | `data.query` |
| `feishu_calendar_primary_batch_get` | `data.user_ids` |
| `feishu_calendar_batch_get` | `data.calendar_ids` |
| `feishu_calendar_event_create` | `path.calendar_id`、`data.summary` |
| `feishu_calendar_event_delete` | `path.calendar_id`、`path.event_id` |
| `feishu_calendar_event_update` | `path.calendar_id`、`path.event_id` |
| `feishu_calendar_event_get` | `path.calendar_id`、`path.event_id` |
| `feishu_calendar_event_list` | `path.calendar_id` |
| `feishu_calendar_event_search` | `path.calendar_id`、`data.query` |

当 `payload_json` 不为空时，会覆盖 `params_json` / `path_json` / `data_json`。

推荐优先使用结构化字段；复杂请求再使用 JSON 字段。

### 结构化字段覆盖情况（已补齐常用参数）

- `contact.user.*`：`name`、`mobile`、`user_id`、`department_id`、`page_size` 等
- `contact.department.*`：`department_id`、`department_name`、`parent_department_id` 等
- `im.message.send`：`receive_id_type`、`receive_id`、`msg_type`、`content`
- `im.message.batch_send`：`message_id`、`receive_id_type`
- `im.image.download` / `im.file.download`：`image_key` / `file_key`
- `calendar.calendar.*`：`calendar_id`、`summary`、`query`、`page_size` 等
- `calendar.event.*`：`calendar_id`、`event_id`、`summary`、`query`、`page_size`

---

## 组织架构（contact）

### 1) 创建员工

- Tool: `feishu_contact_user_create`
- SDK: `client.contact.user.create`
- 示例：

```json
{
  "data_json": "{\"name\":\"张三\",\"mobile\":\"13800000000\",\"department_ids\":[\"od-xxx\"]}"
}
```

### 2) 更新员工信息

- Tool: `feishu_contact_user_update`
- SDK: `client.contact.user.patch`
- 示例：

```json
{
  "path_json": "{\"user_id\":\"ou_xxx\"}",
  "data_json": "{\"name\":\"张三-更新\"}"
}
```

### 3) 离职员工

- Tool: `feishu_contact_user_resign`
- SDK: `client.contact.user.delete`
- 示例：

```json
{
  "path_json": "{\"user_id\":\"ou_xxx\"}"
}
```

### 4) 批量获取员工信息

- Tool: `feishu_contact_user_batch_get`
- SDK: `client.contact.user.batch`
- 示例：

```json
{
  "params_json": "{\"user_id_type\":\"open_id\"}",
  "data_json": "{\"user_ids\":[\"ou_xxx\",\"ou_yyy\"]}"
}
```

### 5) 批量获取员工列表

- Tool: `feishu_contact_user_list`
- SDK: `client.contact.user.list`
- 示例：

```json
{
  "params_json": "{\"department_id\":\"0\",\"page_size\":50}"
}
```

### 6) 搜索员工信息

- Tool: `feishu_contact_user_search`
- SDK: `client.contact.user.batchGetId`
- 示例：

```json
{
  "data_json": "{\"emails\":[\"user@example.com\"]}"
}
```

### 7) 创建部门

- Tool: `feishu_contact_department_create`
- SDK: `client.contact.department.create`

### 8) 更新部门

- Tool: `feishu_contact_department_update`
- SDK: `client.contact.department.patch`

### 9) 删除部门

- Tool: `feishu_contact_department_delete`
- SDK: `client.contact.department.delete`

### 10) 批量获取部门信息

- Tool: `feishu_contact_department_batch_get`
- SDK: `client.contact.department.batch`

### 11) 获取部门列表

- Tool: `feishu_contact_department_list`
- SDK: `client.contact.department.list`

### 12) 搜索部门

- Tool: `feishu_contact_department_search`
- SDK: `client.contact.department.search`

---

## 消息（im）

### 1) 发送消息

- Tool: `feishu_im_message_send`
- SDK: `client.im.message.create`
- 示例：

```json
{
  "params_json": "{\"receive_id_type\":\"open_id\"}",
  "data_json": "{\"receive_id\":\"ou_xxx\",\"msg_type\":\"text\",\"content\":\"{\\\"text\\\":\\\"hello\\\"}\"}"
}
```

### 2) 批量发送消息

- Tool: `feishu_im_message_batch_send`
- SDK: `client.im.message.forward`

### 3) 上传图片

- Tool: `feishu_im_image_upload`
- SDK: `client.im.image.create`

### 4) 下载图片

- Tool: `feishu_im_image_download`
- SDK: `client.im.image.get`

### 5) 上传文件

- Tool: `feishu_im_file_upload`
- SDK: `client.im.file.create`

### 6) 下载文件

- Tool: `feishu_im_file_download`
- SDK: `client.im.file.get`

---

## 日历（calendar.calendar）

### 1) 创建共享日历

- Tool: `feishu_calendar_shared_create`
- SDK: `client.calendar.calendar.create`

### 2) 删除共享日历

- Tool: `feishu_calendar_shared_delete`
- SDK: `client.calendar.calendar.delete`

### 3) 查询主日历信息

- Tool: `feishu_calendar_primary_get`
- SDK: `client.calendar.calendar.primary`

### 4) 批量获取主日历信息

- Tool: `feishu_calendar_primary_batch_get`
- SDK: `client.calendar.calendar.primarys`

### 5) 查询日历信息

- Tool: `feishu_calendar_get`
- SDK: `client.calendar.calendar.get`

### 6) 批量查询日历信息

- Tool: `feishu_calendar_batch_get`
- SDK: `client.calendar.calendar.mget`

### 7) 查询日历列表

- Tool: `feishu_calendar_list`
- SDK: `client.calendar.calendar.list`

### 8) 更新日历信息

- Tool: `feishu_calendar_update`
- SDK: `client.calendar.calendar.patch`

### 9) 搜索日历

- Tool: `feishu_calendar_search`
- SDK: `client.calendar.calendar.search`

---

## 日程（calendar.event）

### 1) 创建日程

- Tool: `feishu_calendar_event_create`
- SDK: `client.calendar.event.create`

### 2) 删除日程

- Tool: `feishu_calendar_event_delete`
- SDK: `client.calendar.event.delete`

### 3) 更新日程

- Tool: `feishu_calendar_event_update`
- SDK: `client.calendar.event.patch`

### 4) 获取日程

- Tool: `feishu_calendar_event_get`
- SDK: `client.calendar.event.get`

### 5) 获取日程列表

- Tool: `feishu_calendar_event_list`
- SDK: `client.calendar.event.list`

### 6) 搜索日程

- Tool: `feishu_calendar_event_search`
- SDK: `client.calendar.event.search`

---

## 注意事项

- 字段结构、必填项、权限范围、频控限制以飞书开放平台文档为准。
- `payload_json` 建议仅用于复杂场景；常规场景优先使用 `params_json` / `path_json` / `data_json`，可读性更高。
- 文件上传下载相关接口可能涉及 `multipart/form-data` 或二进制流，建议先在 API Explorer 验证后再接入生产流程。
