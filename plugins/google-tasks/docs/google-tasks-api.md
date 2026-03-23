# Google Tasks API v1 参考文档

> 服务端点：`https://tasks.googleapis.com`
>
> Discovery 文档：`https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest`
>
> OAuth 权限范围：
> - `https://www.googleapis.com/auth/tasks` — 读写
> - `https://www.googleapis.com/auth/tasks.readonly` — 只读

---

## TaskLists（任务列表）

### 资源字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `kind` | string | 固定值 `"tasks#taskList"`（只读） |
| `id` | string | 任务列表标识符 |
| `etag` | string | 资源 ETag |
| `title` | string | 标题，最长 1024 字符 |
| `updated` | string | 最后修改时间，RFC 3339 格式（只读） |
| `selfLink` | string | 指向该资源的 URL（只读） |

### 方法

| 方法 | HTTP | 端点 | 说明 |
|------|------|------|------|
| list | `GET` | `/tasks/v1/users/@me/lists` | 获取用户的所有任务列表 |
| get | `GET` | `/tasks/v1/users/@me/lists/{tasklist}` | 获取指定任务列表 |
| insert | `POST` | `/tasks/v1/users/@me/lists` | 创建新任务列表 |
| update | `PUT` | `/tasks/v1/users/@me/lists/{tasklist}` | 全量更新任务列表 |
| patch | `PATCH` | `/tasks/v1/users/@me/lists/{tasklist}` | 部分更新任务列表 |
| delete | `DELETE` | `/tasks/v1/users/@me/lists/{tasklist}` | 删除任务列表 |

---

## Tasks（任务）

### 资源字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `kind` | string | 固定值 `"tasks#task"`（只读） |
| `id` | string | 任务标识符 |
| `etag` | string | 资源 ETag |
| `title` | string | 标题，最长 1024 字符 |
| `notes` | string | 备注，最长 8192 字符（从 Docs 分配的任务不支持备注） |
| `status` | string | 状态：`"needsAction"` 或 `"completed"` |
| `due` | string | 计划日期，RFC 3339 格式（仅日期部分有效，时间部分会被丢弃） |
| `completed` | string | 完成日期，RFC 3339 格式（未完成时省略） |
| `updated` | string | 最后修改时间，RFC 3339 格式（只读） |
| `selfLink` | string | 指向该资源的 URL（只读） |
| `parent` | string | 父任务 ID，顶层任务省略此字段（只读，通过 move 方法修改） |
| `position` | string | 同级任务间的排序位置（只读，通过 move 方法修改） |
| `deleted` | boolean | 是否已删除，默认 `false` |
| `hidden` | boolean | 是否已隐藏（清除已完成任务时标记），默认 `false`（只读） |
| `links[]` | array | 关联链接集合（只读） |
| `links[].type` | string | 链接类型：`"email"`, `"generic"`, `"chat_message"`, `"keep_note"` 等 |
| `links[].description` | string | 链接描述 |
| `links[].link` | string | 链接 URL |
| `webViewLink` | string | Google Tasks Web UI 的绝对链接（只读） |
| `assignmentInfo` | object | 任务分配信息，来源于 Docs / Chat Spaces（只读） |
| `assignmentInfo.linkToTask` | string | 指向原始任务的绝对链接（只读） |
| `assignmentInfo.surfaceType` | enum | 来源类型：`CONTEXT_TYPE_UNSPECIFIED`, `GMAIL`, `DOCUMENT`, `SPACE` |
| `assignmentInfo.driveResourceInfo` | object | Drive 文件信息（含 `driveFileId`, `resourceKey`）（只读） |
| `assignmentInfo.spaceInfo` | object | Chat Space 信息（含 `space`，格式 `"spaces/{space}"`）（只读） |

### 方法

| 方法 | HTTP | 端点 | 说明 |
|------|------|------|------|
| list | `GET` | `/tasks/v1/lists/{tasklist}/tasks` | 获取任务列表中的所有任务 |
| get | `GET` | `/tasks/v1/lists/{tasklist}/tasks/{task}` | 获取指定任务 |
| insert | `POST` | `/tasks/v1/lists/{tasklist}/tasks` | 创建新任务 |
| update | `PUT` | `/tasks/v1/lists/{tasklist}/tasks/{task}` | 全量更新任务 |
| patch | `PATCH` | `/tasks/v1/lists/{tasklist}/tasks/{task}` | 部分更新任务 |
| delete | `DELETE` | `/tasks/v1/lists/{tasklist}/tasks/{task}` | 删除任务 |
| move | `POST` | `/tasks/v1/lists/{tasklist}/tasks/{task}/move` | 移动任务位置（可指定 `parent` 和 `previous` 参数） |
| clear | `POST` | `/tasks/v1/lists/{tasklist}/clear` | 清除任务列表中所有已完成的任务 |

### tasks.list 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `completedMin` | string | 过滤：完成日期不早于此值（RFC 3339） |
| `completedMax` | string | 过滤：完成日期不晚于此值（RFC 3339） |
| `dueMin` | string | 过滤：截止日期不早于此值（RFC 3339） |
| `dueMax` | string | 过滤：截止日期不晚于此值（RFC 3339） |
| `updatedMin` | string | 过滤：修改时间不早于此值（RFC 3339） |
| `showCompleted` | boolean | 是否包含已完成的任务，默认 `true` |
| `showDeleted` | boolean | 是否包含已删除的任务，默认 `false` |
| `showHidden` | boolean | 是否包含已隐藏的任务，默认 `true` |
| `showAssigned` | boolean | 是否包含分配的任务，默认 `true` |
| `maxResults` | integer | 每页返回的最大任务数 |
| `pageToken` | string | 分页 token |

### tasks.insert 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `parent` | string | 父任务 ID（创建子任务时使用） |
| `previous` | string | 前一个兄弟任务 ID（指定位置） |

### tasks.move 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `parent` | string | 目标父任务 ID（移至顶层时留空） |
| `previous` | string | 目标前一个兄弟任务 ID |
| `destinationTasklist` | string | 目标任务列表 ID（跨列表移动时使用） |

---

## 限制

- 每个任务列表最多 **20,000** 个非隐藏任务
- 所有任务列表合计最多 **100,000** 个任务
- `title` 最长 1024 字符
- `notes` 最长 8192 字符

---

## 总计

- **TaskLists：6 个方法** — list / get / insert / update / patch / delete
- **Tasks：8 个方法** — list / get / insert / update / patch / delete / move / clear
- **共 14 个 API 方法**
