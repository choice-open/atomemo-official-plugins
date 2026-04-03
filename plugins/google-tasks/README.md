# Atomemo Plugin - google-tasks

Google Tasks 官方插件，支持通过 OAuth2 凭证管理任务列表与任务。

## 功能实现状态

### 凭证

- [x] `google-tasks-oauth2`（OAuth2 授权、换取 token、刷新 token）

### TaskLists（任务列表）

- [x] `list-task-lists`：列出任务列表（API: `tasklists.list`）
- [x] `get-task-list`：获取任务列表详情（API: `tasklists.get`）
- [x] `create-task-list`：创建任务列表（API: `tasklists.insert`）
- [x] `replace-task-list`：全量替换任务列表（API: `tasklists.update`）
- [x] `update-task-list`：更新任务列表标题（API: `tasklists.patch`）
- [x] `delete-task-list`：删除任务列表（API: `tasklists.delete`）

### Tasks（任务）

- [x] `list-tasks`：列出任务（API: `tasks.list`）
- [x] `get-task`：获取任务详情（API: `tasks.get`）
- [x] `create-task`：创建任务（API: `tasks.insert`）
- [x] `replace-task`：全量替换任务（API: `tasks.update`）
- [x] `update-task`：更新任务（API: `tasks.patch`）
- [x] `delete-task`：删除任务（API: `tasks.delete`）
- [x] `move-task`：移动任务（API: `tasks.move`）
- [x] `clear-completed-tasks`：清除已完成任务（API: `tasks.clear`）

## Development

- Install dependencies:

```bash
bun install
```

- Run the unit tests:

```bash
bun run test
```

- Build the library:

```bash
bun run build
```