# Google Calendar Tools 参数说明与示例

本文档按模块列出：

- 调用的 tool
- 参数说明（表格）
- tool 示例（紧跟参数表）

## 使用约定

- `credential_id` 需替换为你自己的凭证 ID。
- 时间参数使用 RFC3339（如 `2026-03-30T09:00:00+08:00`）。
- `calendar_id` 常见值：`primary` 或 `xxx@group.calendar.google.com`。

---

## 模块与 tools

| 模块 | Tools |
| --- | --- |
| Calendars | `get-calendar`, `create-calendar`, `update-calendar`, `delete-calendar`, `clear-calendar` |
| CalendarList | `list-calendars`, `get-calendar-list`, `insert-calendar-list`, `update-calendar-list`, `delete-calendar-list` |
| Events | `list-events`, `create-event`, `get-event`, `update-event`, `delete-event`, `list-event-instances`, `move-event`, `quick-add-event` |
| Settings | `get-setting`, `list-settings` |
| Colors | `get-colors` |
| FreeBusy | `query-freebusy` |

---

## Calendars

### `get-calendar`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID，常用 `primary` |

```json
{
  "tool": "get-calendar",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary"
  }
}
```

### `create-calendar`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `summary` | string | 是 | 日历标题 |
| `description` | string | 否 | 日历描述 |
| `location` | string | 否 | 地理位置 |
| `timeZone` | string | 否 | IANA 时区，如 `Asia/Shanghai` |

```json
{
  "tool": "create-calendar",
  "input": {
    "credential_id": "your_credential_id",
    "summary": "Team Ops Calendar",
    "timeZone": "Asia/Shanghai"
  }
}
```

### `update-calendar`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 要更新的日历 ID |
| `summary` | string | 否 | 新标题 |
| `description` | string | 否 | 新描述 |
| `location` | string | 否 | 新位置 |
| `timeZone` | string | 否 | 新时区 |

```json
{
  "tool": "update-calendar",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "your_secondary_calendar_id@group.calendar.google.com",
    "summary": "Team Ops Calendar (Updated)",
    "description": "Calendar for team operations"
  }
}
```

### `delete-calendar`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 要删除的次要日历 ID |

```json
{
  "tool": "delete-calendar",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "your_secondary_calendar_id@group.calendar.google.com"
  }
}
```

### `clear-calendar`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 要清空的日历 ID（常用 `primary`） |

```json
{
  "tool": "clear-calendar",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary"
  }
}
```

---

## CalendarList

### `list-calendars`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |

```json
{
  "tool": "list-calendars",
  "input": {
    "credential_id": "your_credential_id"
  }
}
```

### `get-calendar-list`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 列表项对应日历 ID |

```json
{
  "tool": "get-calendar-list",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary"
  }
}
```

### `insert-calendar-list`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 要加入列表的现有日历 ID |
| `selected` | boolean | 否 | 是否在 UI 中显示 |
| `colorId` | string | 否 | 颜色 ID（1-11） |

```json
{
  "tool": "insert-calendar-list",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "your_shared_calendar_id@group.calendar.google.com",
    "selected": true,
    "colorId": "5"
  }
}
```

### `update-calendar-list`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 要更新的列表项日历 ID |
| `summaryOverride` | string | 否 | 覆盖显示名 |
| `colorId` | string | 否 | 颜色 ID（1-11） |
| `selected` | boolean | 否 | 是否显示在 UI |

```json
{
  "tool": "update-calendar-list",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "team@example.com",
    "summaryOverride": "团队共享日历",
    "colorId": "10",
    "selected": true
  }
}
```

### `delete-calendar-list`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 要移除的日历 ID |

```json
{
  "tool": "delete-calendar-list",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "your_shared_calendar_id@group.calendar.google.com"
  }
}
```

---

## Events

### `list-events`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `max_results` | integer | 否 | 返回数量上限 |
| `page_token` | string | 否 | 分页令牌 |
| `sync_token` | string | 否 | 增量同步令牌 |
| `time_min` | string | 否 | 开始时间下限（RFC3339） |
| `time_max` | string | 否 | 开始时间上限（RFC3339） |
| `time_zone` | string | 否 | 返回时间时区 |
| `q` | string | 否 | 关键字搜索 |
| `single_events` | boolean | 否 | 是否展开重复事件 |
| `order_by` | string | 否 | 排序（`startTime`/`updated`） |
| `fields` | string | 否 | 部分字段返回 |

```json
{
  "tool": "list-events",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "time_min": "2026-03-01T00:00:00+08:00",
    "time_max": "2026-03-31T23:59:59+08:00",
    "single_events": true,
    "order_by": "startTime",
    "max_results": 100
  }
}
```

### `create-event`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `summary` | string | 是 | 事件标题 |
| `is_all_day_event` | boolean | 否 | 是否全天事件 |
| `start_datetime` | string | 条件必填 | 定时事件开始时间 |
| `end_datetime` | string | 条件必填 | 定时事件结束时间 |
| `start_date` | string | 条件必填 | 全天事件开始日期（yyyy-mm-dd） |
| `end_date` | string | 条件必填 | 全天事件结束日期（不含） |
| `timezone` | string | 否 | IANA 时区 |
| `send_updates` | string | 否 | 通知策略：`none/all/externalOnly` |
| `description` | string | 否 | 描述 |
| `location` | string | 否 | 地点 |
| `attendees` | string | 否 | 逗号分隔邮箱 |
| `recurrence` | string | 否 | RRULE 文本 |

```json
{
  "tool": "create-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "summary": "架构评审会",
    "is_all_day_event": false,
    "start_datetime": "2026-03-28T14:00:00+08:00",
    "end_datetime": "2026-03-28T15:00:00+08:00",
    "timezone": "Asia/Shanghai",
    "attendees": "a@example.com,b@example.com",
    "send_updates": "all"
  }
}
```

### `get-event`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `event_id` | string | 是 | 事件 ID |
| `max_attendees` | integer | 否 | 返回参与者上限 |
| `time_zone` | string | 否 | 返回时间时区 |

```json
{
  "tool": "get-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_event_id"
  }
}
```

### `update-event`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `event_id` | string | 是 | 事件 ID |
| `summary` | string | 否 | 新标题 |
| `is_all_day_event` | boolean | 否 | 是否改为全天事件 |
| `start_datetime` | string | 否 | 定时事件开始 |
| `end_datetime` | string | 否 | 定时事件结束 |
| `start_date` | string | 否 | 全天事件开始 |
| `end_date` | string | 否 | 全天事件结束（不含） |
| `send_updates` | string | 否 | 通知策略 |
| `description` | string | 否 | 新描述 |
| `location` | string | 否 | 新地点 |

```json
{
  "tool": "update-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_event_id",
    "summary": "架构评审会（改期）",
    "is_all_day_event": false,
    "start_datetime": "2026-03-28T16:00:00+08:00",
    "end_datetime": "2026-03-28T17:00:00+08:00",
    "send_updates": "all"
  }
}
```

### `delete-event`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `event_id` | string | 是 | 事件 ID |
| `send_updates` | string | 否 | 通知策略：`none/all/externalOnly` |

```json
{
  "tool": "delete-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_event_id",
    "send_updates": "none"
  }
}
```

### `list-event-instances`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `event_id` | string | 是 | 重复事件 ID |
| `use_time_range` | boolean | 否 | 是否按时间范围过滤 |
| `time_min` | string | 否 | 起始时间（RFC3339） |
| `time_max` | string | 否 | 结束时间（RFC3339） |
| `max_results` | integer | 否 | 返回上限 |

```json
{
  "tool": "list-event-instances",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_recurring_event_id",
    "use_time_range": true,
    "time_min": "2026-04-01T00:00:00+08:00",
    "time_max": "2026-04-30T23:59:59+08:00"
  }
}
```

### `move-event`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 当前日历 ID |
| `event_id` | string | 是 | 事件 ID |
| `destination_calendar_id` | string | 是 | 目标日历 ID |
| `send_updates` | string | 否 | 通知策略 |

```json
{
  "tool": "move-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_event_id",
    "destination_calendar_id": "target_calendar_id@group.calendar.google.com",
    "send_updates": "externalOnly"
  }
}
```

### `quick-add-event`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `calendar_id` | string | 是 | 日历 ID |
| `text` | string | 是 | 自然语言文本 |
| `send_updates` | string | 否 | 通知策略 |

```json
{
  "tool": "quick-add-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "text": "后天下午三点和运营团队复盘",
    "send_updates": "none"
  }
}
```

---

## Settings

### `get-setting`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `setting_id` | string | 是 | 设置键，如 `timezone` |

```json
{
  "tool": "get-setting",
  "input": {
    "credential_id": "your_credential_id",
    "setting_id": "timezone"
  }
}
```

### `list-settings`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |

```json
{
  "tool": "list-settings",
  "input": {
    "credential_id": "your_credential_id"
  }
}
```

---

## Colors

### `get-colors`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |

```json
{
  "tool": "get-colors",
  "input": {
    "credential_id": "your_credential_id"
  }
}
```

---

## FreeBusy

### `query-freebusy`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `credential_id` | credential_id | 是 | Google OAuth2 凭证 ID |
| `time_min` | string | 是 | 查询起始时间（RFC3339） |
| `time_max` | string | 是 | 查询结束时间（RFC3339） |
| `items` | string | 是 | 日历/群组 ID，逗号分隔 |
| `time_zone` | string | 否 | 响应时间时区 |
| `group_expansion_max` | integer | 否 | 群组展开上限 |
| `calendar_expansion_max` | integer | 否 | 日历展开上限 |

```json
{
  "tool": "query-freebusy",
  "input": {
    "credential_id": "your_credential_id",
    "time_min": "2026-03-30T09:00:00+08:00",
    "time_max": "2026-03-30T18:00:00+08:00",
    "items": "primary,teammate1@example.com,teammate2@example.com",
    "time_zone": "Asia/Shanghai"
  }
}
```

---

## 更多例子（进阶场景）

### 1) `list-events`：仅返回必要字段（减少响应体）

```json
{
  "tool": "list-events",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "time_min": "2026-04-01T00:00:00+08:00",
    "time_max": "2026-04-30T23:59:59+08:00",
    "single_events": true,
    "order_by": "startTime",
    "fields": "items(id,summary,start,end),nextPageToken,nextSyncToken"
  }
}
```

### 2) `list-events`：关键字搜索（标题/描述/地点）

```json
{
  "tool": "list-events",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "q": "review",
    "max_results": 20
  }
}
```

### 3) `list-events`：分页（第二页）

```json
{
  "tool": "list-events",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "max_results": 50,
    "page_token": "from_previous_response_nextPageToken"
  }
}
```

### 4) `list-events`：增量同步（sync token）

```json
{
  "tool": "list-events",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "sync_token": "from_previous_response_nextSyncToken"
  }
}
```

### 5) `create-event`：创建每周重复事件（RRULE）

```json
{
  "tool": "create-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "summary": "每周例会",
    "is_all_day_event": false,
    "start_datetime": "2026-04-07T10:00:00+08:00",
    "end_datetime": "2026-04-07T11:00:00+08:00",
    "timezone": "Asia/Shanghai",
    "recurrence": "RRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=10",
    "send_updates": "all"
  }
}
```

### 6) `update-event`：改为全天事件

```json
{
  "tool": "update-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_event_id",
    "summary": "线下活动（全天）",
    "is_all_day_event": true,
    "start_date": "2026-05-01",
    "end_date": "2026-05-02",
    "send_updates": "all"
  }
}
```

### 7) `move-event`：迁移到团队共享日历，不通知内部成员

```json
{
  "tool": "move-event",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "primary",
    "event_id": "your_event_id",
    "destination_calendar_id": "team-shared@group.calendar.google.com",
    "send_updates": "externalOnly"
  }
}
```

### 8) `query-freebusy`：控制展开上限

```json
{
  "tool": "query-freebusy",
  "input": {
    "credential_id": "your_credential_id",
    "time_min": "2026-04-08T09:00:00+08:00",
    "time_max": "2026-04-08T18:00:00+08:00",
    "items": "engineering@example.com,primary",
    "time_zone": "Asia/Shanghai",
    "group_expansion_max": 50,
    "calendar_expansion_max": 20
  }
}
```

### 9) `get-setting`：读取语言设置

```json
{
  "tool": "get-setting",
  "input": {
    "credential_id": "your_credential_id",
    "setting_id": "locale"
  }
}
```

### 10) `insert-calendar-list`：把共享日历加入个人列表并默认显示

```json
{
  "tool": "insert-calendar-list",
  "input": {
    "credential_id": "your_credential_id",
    "calendar_id": "shared-project@group.calendar.google.com",
    "selected": true,
    "colorId": "7"
  }
}
```

---

## 常见问题

- `calendar_id` 不确定：先调用 `list-calendars`。
- `event_id` 不确定：先调用 `list-events` 或从创建事件返回中读取。
- 全天事件时，`end_date` 需为结束日的下一天（不含边界）。
- 使用 `sync_token` 时，避免混用时间过滤与全文搜索参数。
