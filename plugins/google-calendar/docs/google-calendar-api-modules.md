# Google Calendar API 模块功能文档

> 基于 [Google Calendar API 官方文档](https://developers.google.com/calendar/api/guides/overview) 整理

本文档描述 Google Calendar API 的完整能力。各 API 方法表格中的「插件实现」列：✅ 表示已实现对应工具，❌ 表示未实现。工具与 API 详细对照见 [docs/README.md](./README.md#插件工具与-api-对照)。

## 概述

Google Calendar API 是一个 RESTful API，可通过 HTTP 请求或 Google 客户端库访问，可暴露 Google Calendar 网页版的大部分功能。

---

## 核心术语


| 术语                      | 说明                                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event（事件）**           | 日历上的单个事件，包含标题、开始/结束时间、与会者等信息。可为单次事件或[重复事件](https://developers.google.com/workspace/calendar/api/concepts/events-calendars#recurring_events)。 |
| **Calendar（日历）**        | 事件的集合，包含描述、默认时区等元数据。                                                                                                                         |
| **Calendar List（日历列表）** | 用户日历列表中显示的所有日历，包含用户特定属性（如颜色、新事件通知）。                                                                                                          |
| **Setting（设置）**         | 用户在 Calendar UI 中的偏好设置，如时区。                                                                                                                  |
| **ACL**                 | 访问控制规则，授予用户（或用户组）对日历的特定访问级别。                                                                                                                 |


---

## 资源类型与数据模型

### 五大资源类型


| 资源类型                      | 说明              | 集合                                    |
| ------------------------- | --------------- | ------------------------------------- |
| **Event Resource**        | 单个日历事件          | Events Collection（特定日历下的所有事件）         |
| **Calendars Resource**    | 单个日历的元数据        | Calendars Collection                  |
| **CalendarList Resource** | 用户日历列表中单个日历的元数据 | CalendarList Collection（特定用户的所有日历列表项） |
| **Settings Resource**     | 用户偏好设置          | Settings Collection（特定用户的所有设置）        |
| **ACL Resource**          | 访问控制规则          | ACL Collection（特定日历下的所有 ACL 规则）       |


---

## 1. Events（事件）API

### 事件类型

- **单次事件**：只发生一次
- **重复事件**：按预定计划重复
- **全天事件** vs ** timed 事件**（指定具体时间）
- **特殊类型**：生日事件、来自 Gmail 的事件

### 事件属性


| 类别   | 属性                                                                        |
| ---- | ------------------------------------------------------------------------- |
| 基本信息 | `summary`、`description`、`location`、`colorId`                              |
| 时间   | `start`、`end`、`timeZone`、`recurrence`                                     |
| 人员   | `organizer`、`attendees`、`creator`                                         |
| 会议   | `conferenceData`、`hangoutLink`                                            |
| 提醒   | `reminders`                                                               |
| 可见性  | `visibility`、`transparency`                                               |
| 扩展   | `extendedProperties`（private/shared）、`attachments`                        |
| 工作相关 | `workingLocationProperties`、`outOfOfficeProperties`、`focusTimeProperties` |


### API 方法

| 方法                 | 说明                | 插件实现 |
| ------------------ | ----------------- | ---- |
| `events.delete`    | 删除事件              | ✅   |
| `events.get`       | 根据日历 ID 获取事件      | ✅   |
| `events.import`    | 导入事件（添加现有事件的私有副本） | ❌   |
| `events.insert`    | 创建事件              | ✅   |
| `events.instances` | 获取指定重复事件的所有实例     | ✅   |
| `events.list`      | 列出指定日历的事件         | ✅   |
| `events.move`      | 将事件移动到另一日历        | ✅   |
| `events.patch`     | 部分更新事件            | ✅   |
| `events.quickAdd`  | 根据简单文本创建事件        | ✅   |
| `events.update`    | 完整更新事件            | ❌   |
| `events.watch`     | 监听事件变更            | ❌   |


---

## 2. Calendars（日历）API

### 日历属性


| 属性                     | 说明               |
| ---------------------- | ---------------- |
| `id`                   | 日历标识符（通常为电子邮件地址） |
| `summary`              | 日历标题             |
| `description`          | 日历描述             |
| `location`             | 地理位置             |
| `timeZone`             | 默认时区（IANA 格式）    |
| `conferenceProperties` | 允许的会议解决方案类型      |
| `dataOwner`            | 日历拥有者邮箱（仅次要日历）   |


### 主日历 vs 次要日历

- **主日历**：与用户账户关联，每个账户自动创建，ID 通常与主邮箱一致，不可删除
- **次要日历**：可显式创建、修改、删除和共享

### API 方法

| 方法                 | 说明            | 插件实现 |
| ------------------ | ------------- | ---- |
| `calendars.clear`  | 清空主日历（删除所有事件） | ✅   |
| `calendars.delete` | 删除次要日历        | ✅   |
| `calendars.get`    | 获取日历元数据       | ✅   |
| `calendars.insert` | 创建次要日历        | ✅   |
| `calendars.patch`  | 部分更新日历元数据     | ✅   |
| `calendars.update` | 完整更新日历元数据     | ❌   |


---

## 3. CalendarList（日历列表）API

### Calendars vs CalendarList


| 操作               | Calendars 集合 | CalendarList 集合      |
| ---------------- | ------------ | -------------------- |
| `insert`         | 创建新的次要日历     | 将现有日历加入用户列表          |
| `delete`         | 删除次要日历       | 从用户列表中移除日历           |
| `get`            | 获取日历元数据      | 获取元数据 + 用户自定义（颜色、提醒） |
| `patch`/`update` | 修改日历元数据      | 修改用户特定属性             |


### CalendarListEntry 属性


| 属性                                                | 说明                                         |
| ------------------------------------------------- | ------------------------------------------ |
| `accessRole`                                      | 用户的访问角色：freeBusyReader、reader、writer、owner |
| `colorId` / `backgroundColor` / `foregroundColor` | 日历颜色                                       |
| `defaultReminders`                                | 用户默认提醒                                     |
| `notificationSettings`                            | 新事件通知设置                                    |
| `primary`                                         | 是否为主日历                                     |
| `selected`                                        | 是否在 UI 中显示                                 |
| `summaryOverride`                                 | 用户自定义日历名称                                  |


### API 方法

| 方法                     | 说明          | 插件实现 |
| ---------------------- | ----------- | ---- |
| `calendarList.delete`  | 从用户列表中移除日历  | ✅   |
| `calendarList.get`     | 获取日历列表中的日历项 | ✅   |
| `calendarList.insert`  | 将现有日历加入用户列表 | ✅   |
| `calendarList.list`    | 列出用户日历列表    | ✅   |
| `calendarList.patch`   | 部分更新日历列表项   | ✅   |
| `calendarList.update`  | 完整更新日历列表项   | ❌   |
| `calendarList.watch`   | 监听日历列表变更    | ❌   |


---

## 4. Settings（设置）API

### 支持的用户设置


| 设置 ID                         | 说明          | 可选值                                       |
| ----------------------------- | ----------- | ----------------------------------------- |
| `timezone`                    | 用户时区        | IANA 时区                                   |
| `locale`                      | 用户语言环境      | in, ca, cs, da, de, en_GB, zh_CN, zh_TW 等 |
| `dateFieldOrder`              | 日期显示顺序      | MDY, DMY, YMD                             |
| `format24HourTime`            | 24 小时制      | true, false                               |
| `defaultEventLength`          | 默认事件时长（分钟）  | 正整数                                       |
| `weekStart`                   | 周起始日        | 0(日), 1(一), 6(六)                          |
| `hideWeekends`                | 隐藏周末        | true, false                               |
| `showDeclinedEvents`          | 显示已拒绝事件     | true, false                               |
| `hideInvitations`             | 隐藏待响应邀请     | true, false                               |
| `remindOnRespondedEventsOnly` | 仅对已响应事件发送提醒 | true, false                               |
| `useKeyboardShortcuts`        | 键盘快捷键       | true, false                               |


### API 方法

| 方法               | 说明       | 插件实现 |
| ---------------- | -------- | ---- |
| `settings.get`   | 获取单个用户设置 | ✅   |
| `settings.list`  | 获取用户所有设置 | ✅   |
| `settings.watch` | 监听设置变更   | ❌   |


> **注意**：Settings 为只读，用户需通过 Calendar UI 修改。

---

## 5. ACL（访问控制）API

### 角色类型


| 角色               | 权限             |
| ---------------- | -------------- |
| `none`           | 无访问权限          |
| `freeBusyReader` | 仅读忙闲信息         |
| `reader`         | 只读日历，私密事件详情隐藏  |
| `writer`         | 读写日历，可查看私密事件详情 |
| `owner`          | 管理权限，可修改他人访问级别 |


### 范围类型


| scope.type | 说明     |
| ---------- | ------ |
| `default`  | 公开范围   |
| `user`     | 限定单个用户 |
| `group`    | 限定用户组  |
| `domain`   | 限定域    |


### API 方法

| 方法           | 说明           | 插件实现 |
| ------------ | ------------ | ---- |
| `acl.delete` | 删除 ACL 规则    | ❌   |
| `acl.get`    | 获取 ACL 规则    | ❌   |
| `acl.insert` | 创建 ACL 规则    | ❌   |
| `acl.list`   | 列出日历的 ACL 规则 | ❌   |
| `acl.patch`  | 部分更新 ACL 规则  | ❌   |
| `acl.update` | 完整更新 ACL 规则  | ❌   |
| `acl.watch`  | 监听 ACL 变更    | ❌   |


---

## 6. Colors（颜色）API

提供日历和事件的全局颜色调色板定义。

### API 方法

| 方法           | 说明           | 插件实现 |
| ------------ | ------------ | ---- |
| `colors.get` | 获取日历和事件的颜色定义 | ✅   |


---

## 7. FreeBusy（忙闲）API

### API 方法

| 方法               | 说明          | 插件实现 |
| ---------------- | ----------- | ---- |
| `freebusy.query` | 查询一组日历的忙闲信息 | ✅   |


---

## 重复事件（Recurrence）

### RRULE 主要组件

- `FREQ`：频率（DAILY、WEEKLY、MONTHLY 等）
- `INTERVAL`：间隔
- `BYDAY`：星期（SU, MO, TU 等）
- `UNTIL`：结束日期
- `COUNT`：重复次数
- `RDATE`：额外日期
- `EXDATE`：排除日期

### 实例与例外

- 重复事件的每次出现称为 **instance**
- 与父事件不同的 instance 称为 **exception**
- 可单独修改或取消某个 instance

---

## 参考链接

- [Calendar API 概览](https://developers.google.com/calendar/api/guides/overview)
- [日历与事件概念](https://developers.google.com/calendar/api/concepts/events-calendars)
- [Events 参考](https://developers.google.com/calendar/api/v3/reference/events)
- [Calendars 参考](https://developers.google.com/calendar/api/v3/reference/calendars)
- [CalendarList 参考](https://developers.google.com/calendar/api/v3/reference/calendarList)
- [Settings 参考](https://developers.google.com/calendar/api/v3/reference/settings)
- [ACL 参考](https://developers.google.com/calendar/api/v3/reference/acl)

