# Google Calendar 插件文档

## 文档索引

| 文档 | 说明 |
|------|------|
| [google-calendar-api-modules.md](./google-calendar-api-modules.md) | Google Calendar API 模块功能完整说明，包含各资源类型、API 方法、属性及参考链接 |
| [TOOL_USAGE_EXAMPLES.md](./TOOL_USAGE_EXAMPLES.md) | 所有已实现 Tool 的最小可运行调用示例（按模块分类） |

## 插件工具与 API 对照

本插件已实现以下工具，与 Google Calendar API 的对应关系如下：

### Events（事件）API

| 工具 | 对应 API | 说明 |
|------|----------|------|
| list-events | `events.list` | 列出指定日历的事件 |
| create-event | `events.insert` | 创建新事件 |
| get-event | `events.get` | 根据 ID 获取单个事件 |
| update-event | `events.patch` | 更新事件 |
| delete-event | `events.delete` | 删除事件 |
| list-event-instances | `events.instances` | 列出重复事件的所有实例 |
| move-event | `events.move` | 将事件移动到另一日历 |
| quick-add-event | `events.quickAdd` | 根据自然语言文本创建事件 |

### Calendars（日历）API

| 工具 | 对应 API | 说明 |
|------|----------|------|
| get-calendar | `calendars.get` | 获取日历元数据 |
| create-calendar | `calendars.insert` | 创建次要日历 |
| update-calendar | `calendars.patch` | 部分更新日历元数据 |
| delete-calendar | `calendars.delete` | 删除次要日历 |
| clear-calendar | `calendars.clear` | 清空日历（删除所有事件） |

### CalendarList（日历列表）API

| 工具 | 对应 API | 说明 |
|------|----------|------|
| list-calendars | `calendarList.list` | 列出用户日历列表 |
| get-calendar-list | `calendarList.get` | 获取日历列表中的单个日历项 |
| insert-calendar-list | `calendarList.insert` | 将现有日历加入用户列表 |
| update-calendar-list | `calendarList.patch` | 部分更新日历列表项（颜色、显示名等） |
| delete-calendar-list | `calendarList.delete` | 从用户列表中移除日历 |

### Settings（设置）API

| 工具 | 对应 API | 说明 |
|------|----------|------|
| get-setting | `settings.get` | 获取单个用户设置 |
| list-settings | `settings.list` | 列出所有用户设置 |

### Colors（颜色）API

| 工具 | 对应 API | 说明 |
|------|----------|------|
| get-colors | `colors.get` | 获取日历和事件的颜色定义 |

### FreeBusy（忙闲）API

| 工具 | 对应 API | 说明 |
|------|----------|------|
| query-freebusy | `freebusy.query` | 查询一组日历的忙闲信息 |

### 未实现的 API

以下 API 方法当前未提供对应工具：
- **Events**：`events.import`、`events.update`、`events.watch`
- **ACL**：全部（acl 相关工具）
- **Settings**：`settings.watch`

---

## 快速参考

### 七大 API 模块

1. **Events** - 事件的增删改查、重复事件、与会者、会议等
2. **Calendars** - 日历元数据、主/次要日历、创建与删除
3. **CalendarList** - 用户日历列表、颜色、提醒、通知
4. **Settings** - 用户偏好（时区、语言、日期格式等）
5. **ACL** - 访问控制、共享与权限
6. **Colors** - 日历/事件颜色调色板
7. **FreeBusy** - 忙闲查询

### 官方文档

- [Google Calendar API 概览](https://developers.google.com/calendar/api/guides/overview)
- [API v3 参考](https://developers.google.com/calendar/api/v3/reference)
