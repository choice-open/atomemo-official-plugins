# Google Calendar API 功能对照

依据 [Google Calendar API 文档](https://developers.google.com/workspace/calendar) 的对照说明。

## 已实现功能

### Calendars API

| API 方法 | 插件工具 | 说明 |
|---------|---------|------|
| get | get-calendar | 获取日历元数据 |
| insert | create-calendar | 创建次要日历 |
| update | update-calendar | 更新日历元数据 |
| patch | (通过 update) | 使用 patch 语义更新 |
| delete | delete-calendar | 删除次要日历 |
| clear | clear-calendar | 清空主日历所有事件 |

### CalendarList API

| API 方法 | 插件工具 | 说明 |
|---------|---------|------|
| list | list-calendars | 列出用户日历列表 |
| get | get-calendars | 获取日历列表中某日历 |
| insert | insert-calendar-list | 添加日历到列表 |
| update | update-calendar-list | 更新日历列表项 |
| delete | delete-calendars | 从列表移除日历 |

### Events API

| API 方法 | 插件工具 | 说明 |
|---------|---------|------|
| list | list-events | 列出日历事件 |
| insert | create-event | 创建事件 |
| get | get-event | 获取单个事件 |
| update | update-event | 更新事件（使用 patch） |
| delete | delete-event | 删除事件 |
| instances | list-event-instances | 列出重复事件实例 |
| move | move-event | 移动事件到另一日历 |
| quickAdd | quick-add-event | 快速添加事件（文本解析） |

未实现：import、watch

### Settings API

| API 方法 | 插件工具 |
|---------|---------|
| get | get-setting |
| list | list-settings |

### Colors API

| API 方法 | 插件工具 |
|---------|---------|
| get | get-colors |

### FreeBusy API

| API 方法 | 插件工具 |
|---------|---------|
| query | query-freebusy |

## 未实现功能

- **ACL API**：访问控制规则（calendar.acl 相关）
