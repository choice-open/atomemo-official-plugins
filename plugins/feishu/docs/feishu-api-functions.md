# 飞书开放平台 API 功能说明

本文档整理了飞书开放平台的核心 API 功能，按模块分类，包含功能说明、API 路径、HTTP 方法和权限要求。

---

## 一、组织架构（Contact）

组织架构 API 用于管理企业通讯录，包含员工和部门的管理。

### 1.1 员工管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建员工 | `/open-apis/contact/v3/users` | POST | 向通讯录创建一个用户（员工入职），成功创建后系统会以短信或邮件形式向用户发送邀请，用户同意邀请后方可访问企业 | 更新通讯录(contact:contact) |
| 更新员工信息 | `/open-apis/contact/v3/users/{user_id}` | PATCH | 更新通讯录中用户的部分字段信息，如姓名、部门、联系方式等 | 更新通讯录(contact:contact)、更新用户基本信息(contact:user.base) |
| 离职员工 | `/open-apis/contact/v3/users/{user_id}` | DELETE | 将企业通讯录中的用户删除（员工离职），离职后用户将无法再访问企业数据 | 更新通讯录(contact:contact) |
| 批量获取员工信息 | `/open-apis/contact/v3/users/batch_get` | POST | 批量获取多个用户的详细信息，包括用户 ID、姓名、部门、邮箱等 | 获取通讯录基本信息(contact:contact.base:readonly) |
| 批量获取员工列表 | `/open-apis/contact/v3/users/find` | POST | 批量获取符合指定条件的用户列表，支持分页和条件筛选 | 获取通讯录基本信息(contact:contact.base:readonly)、获取通讯录部门组织架构信息(contact:department.organize:readonly) |
| 搜索员工信息 | `/open-apis/contact/v3/users/search` | POST | 根据关键词搜索企业内的员工信息 | 获取通讯录基本信息(contact:contact.base:readonly) |

### 1.2 部门管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建部门 | `/open-apis/contact/v3/departments` | POST | 在通讯录内创建一个部门，只可在应用的通讯录权限范围内的部门下创建部门 | 更新通讯录(contact:contact) |
| 更新部门 | `/open-apis/contact/v3/departments/{department_id}` | PATCH | 更新通讯录中部门的信息，如部门名称、部门负责人等 | 更新通讯录(contact:contact) |
| 删除部门 | `/open-apis/contact/v3/departments/{department_id}` | DELETE | 删除通讯录中的指定部门，删除后部门下的成员将被移至根部门 | 更新通讯录(contact:contact) |
| 批量获取部门信息 | `/open-apis/contact/v3/departments/batch_get` | POST | 批量获取多个部门的详细信息 | 获取通讯录部门组织架构信息(contact:department.organize:readonly)、获取部门基础信息(contact:department.base:readonly) |
| 获取部门列表 | `/open-apis/contact/v3/departments` | GET | 获取通讯录中的部门列表，支持分页和层级获取 | 获取通讯录部门组织架构信息(contact:department.organize:readonly)、获取部门基础信息(contact:department.base:readonly) |
| 搜索部门 | `/open-apis/contact/v3/departments/search` | POST | 根据部门名称关键词搜索部门信息 | 获取通讯录部门组织架构信息(contact:department.organize:readonly)、获取部门基础信息(contact:department.base:readonly) |
| 获取单个用户信息 | `/open-apis/contact/v3/users/:user_id` | GET | 获取指定用户的详细信息，包括用户ID、姓名、部门、邮箱等 | 获取通讯录基本信息(contact:contact.base:readonly)、以应用身份读取通讯录(contact:contact:readonly_as_app) |
| 获取部门直属用户列表 | `/open-apis/contact/v3/users/find_by_department` | GET | 获取指定部门下的直属用户列表 | 获取通讯录基本信息(contact:contact.base:readonly)、获取通讯录部门组织架构信息(contact:department.organize:readonly) |
| 通过手机号或邮箱获取用户ID | `/open-apis/contact/v3/users/batch_get_id` | POST | 通过手机号或邮箱获取用户的open_id | 通过手机号或邮箱获取用户ID(contact:user.id:readonly) |
| 恢复已删除用户 | `/open-apis/contact/v3/users/:user_id/recover` | POST | 恢复已离职的员工 | 更新通讯录(contact:contact) |
| 批量新增用户 | `/open-apis/contact/v2/user/batch_add` | POST | 批量向通讯录新增多个用户 | 更新通讯录(contact:contact) |
| 获取单个部门信息 | `/open-apis/contact/v3/departments/:department_id` | GET | 获取指定部门的详细信息 | 获取通讯录基本信息(contact:contact.base:readonly)、获取通讯录部门组织架构信息(contact:department.organize:readonly) |
| 获取子部门列表 | `/open-apis/contact/v3/departments/:department_id/children` | GET | 获取指定部门的子部门列表，支持递归获取 | 获取通讯录部门组织架构信息(contact:department.organize:readonly)、获取部门基础信息(contact:department.base:readonly) |
| 获取父部门信息 | `/open-apis/contact/v3/departments/:department_id/parent` | GET | 获取指定部门的父部门信息 | 获取通讯录部门组织架构信息(contact:department.organize:readonly) |
| 更新部门所有信息 | `/open-apis/contact/v3/departments/:department_id` | PUT | 更新部门的全部信息，覆盖原有数据 | 更新通讯录(contact:contact) |
| 获取部门群 | `/open-apis/contact/v3/departments/:department_id/groups` | GET | 获取部门对应的部门群信息 | 获取与更新群组信息(im:chat:readonly) |
| 获取通讯录授权范围 | `/open-apis/contact/v1/scope/get` | GET | 获取应用可访问的通讯录范围 | 以应用身份访问通讯录(contact:contact:access_as_app) |

---

## 二、消息（IM）

消息 API 用于发送和管理飞书消息，支持文本、图片、文件等多种消息类型。

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 发送消息 | `/open-apis/im/v1/messages` | POST | 向指定的用户或会话发送消息，支持文本、富文本、图片、文件、视频、音频、卡片等多种消息类型 | 以应用的身份发消息(im:message:send_as_bot) |
| 批量发送消息 | `/open-apis/im/v1/batch_messages` | POST | 批量向多个用户或会话发送消息，支持最多 1000 个接收者 | 以应用的身份发消息(im:message:send_as_bot) |
| 上传图片 | `/open-apis/im/v1/images` | POST | 上传图片到飞书，获取图片的 image_key，用于发送图片消息 | 上传图片和视频文件(im:message:upload_image) |
| 下载图片 | `/open-apis/im/v1/images/{image_key}` | GET | 通过图片的 image_key 下载图片文件 | 无需特殊权限 |
| 上传文件 | `/open-apis/im/v1/files` | POST | 上传文件到飞书，获取文件的 file_key，用于发送文件消息 | 上传图片和视频文件(im:message:upload_image) |
| 下载文件 | `/open-apis/im/v1/files/{file_key}` | GET | 通过文件的 file_key 下载文件 | 无需特殊权限 |
| 创建群聊 | `/open-apis/im/v1/chats` | POST | 创建一个新的群聊 | 获取与更新群组信息(im:chat) |
| 解散群聊 | `/open-apis/im/v1/chats/:chat_id` | DELETE | 解散指定的群聊 | 获取与更新群组信息(im:chat) |
| 获取群列表 | `/open-apis/im/v1/chats` | GET | 获取当前用户或机器人所在的群列表 | 获取群组信息(im:chat:readonly) |
| 获取群信息 | `/open-apis/im/v1/chats/:chat_id` | GET | 获取指定群聊的详细信息 | 获取群组信息(im:chat:readonly) |
| 更新群信息 | `/open-apis/im/v1/chats/:chat_id` | PATCH | 更新群聊的名称、头像、群主等属性 | 获取与更新群组信息(im:chat) |
| 拉用户入群 | `/open-apis/im/v1/chats/:chat_id/members` | POST | 拉用户或机器人加入群聊 | 获取与更新群组信息(im:chat) |
| 移出群成员 | `/open-apis/im/v1/chats/:chat_id/members/:member_id` | DELETE | 将成员移出群聊 | 获取与更新群组信息(im:chat) |

---

## 三、日历（Calendar）

日历 API 用于管理飞书日历和日程，支持共享日历创建、日程预约、忙闲查询等功能。

### 3.1 日历管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建共享日历 | `/open-apis/calendar/v4/calendars` | POST | 创建一个共享日历，用于组织和管理相关日程 | 获取日历、日程及忙闲信息、更新日历及日程信息 |
| 删除共享日历 | `/open-apis/calendar/v4/calendars/{calendar_id}` | DELETE | 删除指定的共享日历 | 更新日历及日程信息 |
| 查询主日历信息 | `/open-apis/calendar/v4/calendars/primary` | GET | 获取当前用户的主日历实体信息 | 获取日历、日程及忙闲信息 |
| 批量获取主日历信息 | `/open-apis/calendar/v4/calendars/primary/batch_get` | POST | 批量获取多个用户的主日历信息 | 获取日历、日程及忙闲信息 |
| 查询日历信息 | `/open-apis/calendar/v4/calendars/{calendar_id}` | GET | 获取指定日历的详细信息 | 获取日历、日程及忙闲信息 |
| 批量查询日历信息 | `/open-apis/calendar/v4/calendars/batch_get` | POST | 批量获取多个日历的详细信息 | 获取日历、日程及忙闲信息 |
| 查询日历列表 | `/open-apis/calendar/v4/calendars` | GET | 获取当前用户可访问的日历列表 | 获取日历、日程及忙闲信息 |
| 更新日历信息 | `/open-apis/calendar/v4/calendars/{calendar_id}` | PATCH | 更新指定日历的标题、描述、颜色等属性 | 更新日历及日程信息 |
| 搜索日历 | `/open-apis/calendar/v4/calendars/search` | POST | 根据关键词搜索日历信息（以应用身份） | 获取日历、日程及忙闲信息 |

### 3.2 日程管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建日程 | `/open-apis/calendar/v4/events` | POST | 创建一个日程，支持设置时间、参与者、会议地点等信息 | 获取日历、日程及忙闲信息、更新日历及日程信息 |
| 删除日程 | `/open-apis/calendar/v4/events/{event_id}` | DELETE | 删除指定的日程，删除后参与者将收到日程取消通知 | 更新日历及日程信息 |
| 更新日程 | `/open-apis/calendar/v4/events/{event_id}` | PATCH | 更新日程的时间、参与者、地点等属性 | 更新日历及日程信息 |
| 获取日程 | `/open-apis/calendar/v4/events/{event_id}` | GET | 获取指定日程的详细信息 | 获取日历、日程及忙闲信息 |
| 获取日程列表 | `/open-apis/calendar/v4/events` | GET | 获取日历下的日程列表，支持按时间范围筛选 | 获取日历、日程及忙闲信息 |
| 搜索日程 | `/open-apis/calendar/v4/events/search` | POST | 根据关键词搜索日程信息 | 获取日历、日程及忙闲信息 |

### 3.3 日历订阅

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 订阅日历 | `/open-apis/calendar/v4/calendars/:calendar_id/subscribe` | POST | 订阅指定的日历 | 更新日历及日程信息 |
| 取消订阅日历 | `/open-apis/calendar/v4/calendars/:calendar_id/unsubscribe` | POST | 取消订阅指定的日历 | 更新日历及日程信息 |

### 3.4 日程参与者

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 获取日程参与者列表 | `/open-apis/calendar/v4/events/:event_id/attendees` | GET | 获取日程的参与者列表 | 获取日历、日程及忙闲信息 |
| 邀请日程参与者 | `/open-apis/calendar/v4/events/:event_id/attendees` | POST | 向日程添加参与者 | 更新日历及日程信息 |
| 移除日程参与者 | `/open-apis/calendar/v4/events/:event_id/attendees/:attendee_id` | DELETE | 移除日程的参与者 | 更新日历及日程信息 |

### 3.5 请假功能

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建请假日程 | `/open-apis/calendar/v4/timeoff_events` | POST | 创建请假类型的日程 | 创建或删除请假日程 |
| 删除请假日程 | `/open-apis/calendar/v4/timeoff_events/:timeoff_event_id` | DELETE | 删除请假日程 | 创建或删除请假日程 |

### 3.6 绑定功能

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建Exchange绑定 | `/open-apis/calendar/v4/exchange_bindings` | POST | 绑定Exchange账户实现日历同步 | 更新日历及日程信息 |
| 查询Exchange绑定状态 | `/open-apis/calendar/v4/exchange_bindings` | GET | 查询Exchange绑定状态 | 获取日历、日程及忙闲信息 |

---

## 四、任务（Task）

任务 API 用于管理飞书任务，支持任务的创建、查询、更新、删除等功能。

### 4.1 任务管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建任务 | `/open-apis/task/v2/tasks` | POST | 创建一个任务，支持设置标题、描述、负责人、截止时间、提醒等信息，可将任务添加到多个清单中 | 查看、创建、更新、删除任务(task:task:write) |
| 获取任务详情 | `/open-apis/task/v2/tasks/:task_guid` | GET | 获取任务的详细信息，包括标题、描述、时间、成员、来源等信息 | 查看任务信息(task:task:read)、查看、创建、更新、删除任务(task:task:write) |
| 更新任务 | `/open-apis/task/v2/tasks/:task_guid` | PATCH | 修改任务的标题、描述、截止时间、状态等信息，完成任务也使用此接口 | 查看、创建、更新、删除任务(task:task:write) |
| 删除任务 | `/open-apis/task/v2/tasks/:task_guid` | DELETE | 删除指定任务，删除后任务将被永久移除 | 查看、创建、更新、删除任务(task:task:write) |
| 完成任务 | `/open-apis/task/v2/tasks/:task_guid/complete` | POST | 将任务状态修改为"已完成"，支持会签任务和或签任务的完成 | 查看、创建、更新、删除任务(task:task:write) |
| 获取任务列表 | `/open-apis/task/v2/tasks` | GET | 获取符合指定条件的任务列表，支持分页和条件筛选 | 查看任务信息(task:task:read)、查看、创建、更新、删除任务(task:task:write) |

### 4.2 任务成员

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 添加任务成员 | `/open-apis/task/v2/tasks/:task_guid/members` | POST | 添加任务的负责人或关注人 | 查看、创建、更新、删除任务(task:task:write) |
| 移除任务成员 | `/open-apis/task/v2/tasks/:task_guid/members/:member_id` | DELETE | 移除任务成员 | 查看、创建、更新、删除任务(task:task:write) |

### 4.3 子任务

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建子任务 | `/open-apis/task/v2/tasks/:task_guid/subtasks` | POST | 创建任务的子任务 | 查看、创建、更新、删除任务(task:task:write) |
| 获取子任务列表 | `/open-apis/task/v2/tasks/:task_guid/subtasks` | GET | 获取任务的子任务列表 | 查看任务信息(task:task:read) |

### 4.4 清单管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建清单 | `/open-apis/task/v2/tasklists` | POST | 创建一个任务清单 | 查看、创建、编辑和删除任务清单(task:tasklist:write) |
| 获取清单列表 | `/open-apis/task/v2/tasklists` | GET | 获取任务清单列表 | 查看任务清单(task:tasklist:read) |

### 4.5 评论管理

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 获取任务评论 | `/open-apis/task/v2/tasks/:task_guid/comments` | GET | 获取任务的评论列表 | 查看任务评论(task:comment:read) |
| 添加任务评论 | `/open-apis/task/v2/tasks/:task_guid/comments` | POST | 为任务添加评论 | 查看、创建、修改和删除任务评论(task:comment:write) |

---

## 五、审批（Approval）

审批 API 用于管理飞书审批流程，支持审批定义的创建、审批实例的发起和处理等功能。

### 5.1 审批实例

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 创建审批实例 | `/open-apis/approval/v4/instances` | POST | 使用指定审批定义(approval_code)创建审批实例，传入表单数据 | 查看、创建、更新、删除审批应用相关信息(approval:approval)、查看、创建、更新、删除原生审批实例相关信息(approval:instance) |
| 获取审批实例详情 | `/open-apis/approval/v4/instances/:instance_id` | GET | 通过审批实例Code获取审批实例的详细信息，包括名称、创建时间、发起人、状态、任务列表等 | 查看、创建、更新、删除审批应用相关信息(approval:approval)、查看、创建、更新、删除原生审批实例相关信息(approval:instance) |
| 查询实例列表 | `/open-apis/approval/v4/instances/query` | POST | 根据条件查询审批实例列表，支持分页和状态筛选 | 查询审批列表(approval:approval.list:readonly) |
| 批量获取审批实例ID | `/open-apis/approval/v4/instances/batch_get_id` | POST | 批量获取指定审批定义内的审批实例ID | 查询审批列表(approval:approval.list:readonly) |

### 5.2 审批任务操作

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 审批任务同意 | `/open-apis/approval/v4/tasks/approve` | POST | 同意审批任务，审批流程将流转到下一个审批人 | 查看、创建、更新、删除审批应用相关信息(approval:approval)、同意/拒绝/退回/加签等原生审批任务操作(approval:task) |
| 审批任务拒绝 | `/open-apis/approval/v4/tasks/reject` | POST | 拒绝审批任务，审批流程将终止并标记为拒绝 | 查看、创建、更新、删除审批应用相关信息(approval:approval)、同意/拒绝/退回/加签等原生审批任务操作(approval:task) |
| 审批任务退回 | `/open-apis/approval/v4/tasks/transfer` | POST | 将审批任务退回给上一节点或申请人 | 查看、创建、更新、删除审批应用相关信息(approval:approval)、同意/拒绝/退回/加签等原生审批任务操作(approval:task) |
| 审批任务加签 | `/open-apis/approval/v4/tasks/add_signer` | POST | 在审批流程中增加审批人，需要当前审批人进行加签操作 | 查看、创建、更新、删除审批应用相关信息(approval:approval)、同意/拒绝/退回/加签等原生审批任务操作(approval:task) |

### 5.3 审批定义

| 功能名称 | API路径 | HTTP方法 | 功能说明 | 权限要求 |
|----------|---------|----------|----------|----------|
| 获取审批定义列表 | `/open-apis/approval/v4/approvals` | GET | 获取企业内的审批定义列表 | 查看、创建、更新、删除审批应用相关信息(approval:approval) |

---

## 六、功能索引

| 序号 | 模块 | 功能名称 | API路径 | HTTP方法 |
|------|------|----------|---------|----------|
| 1 | 组织架构 | 创建员工 | `/open-apis/contact/v3/users` | POST |
| 2 | 组织架构 | 更新员工信息 | `/open-apis/contact/v3/users/{user_id}` | PATCH |
| 3 | 组织架构 | 离职员工 | `/open-apis/contact/v3/users/{user_id}` | DELETE |
| 4 | 组织架构 | 批量获取员工信息 | `/open-apis/contact/v3/users/batch_get` | POST |
| 5 | 组织架构 | 批量获取员工列表 | `/open-apis/contact/v3/users/find` | POST |
| 6 | 组织架构 | 搜索员工信息 | `/open-apis/contact/v3/users/search` | POST |
| 7 | 组织架构 | 创建部门 | `/open-apis/contact/v3/departments` | POST |
| 8 | 组织架构 | 更新部门 | `/open-apis/contact/v3/departments/{department_id}` | PATCH |
| 9 | 组织架构 | 删除部门 | `/open-apis/contact/v3/departments/{department_id}` | DELETE |
| 10 | 组织架构 | 批量获取部门信息 | `/open-apis/contact/v3/departments/batch_get` | POST |
| 11 | 组织架构 | 获取部门列表 | `/open-apis/contact/v3/departments` | GET |
| 12 | 组织架构 | 搜索部门 | `/open-apis/contact/v3/departments/search` | POST |
| 13 | 组织架构 | 获取单个用户信息 | `/open-apis/contact/v3/users/:user_id` | GET |
| 14 | 组织架构 | 获取部门直属用户列表 | `/open-apis/contact/v3/users/find_by_department` | GET |
| 15 | 组织架构 | 通过手机号或邮箱获取用户ID | `/open-apis/contact/v3/users/batch_get_id` | POST |
| 16 | 组织架构 | 恢复已删除用户 | `/open-apis/contact/v3/users/:user_id/recover` | POST |
| 17 | 组织架构 | 批量新增用户 | `/open-apis/contact/v2/user/batch_add` | POST |
| 18 | 组织架构 | 获取单个部门信息 | `/open-apis/contact/v3/departments/:department_id` | GET |
| 19 | 组织架构 | 获取子部门列表 | `/open-apis/contact/v3/departments/:department_id/children` | GET |
| 20 | 组织架构 | 获取父部门信息 | `/open-apis/contact/v3/departments/:department_id/parent` | GET |
| 21 | 组织架构 | 更新部门所有信息 | `/open-apis/contact/v3/departments/:department_id` | PUT |
| 22 | 组织架构 | 获取部门群 | `/open-apis/contact/v3/departments/:department_id/groups` | GET |
| 23 | 组织架构 | 获取通讯录授权范围 | `/open-apis/contact/v1/scope/get` | GET |
| 24 | 消息 | 发送消息 | `/open-apis/im/v1/messages` | POST |
| 25 | 消息 | 批量发送消息 | `/open-apis/im/v1/batch_messages` | POST |
| 26 | 消息 | 上传图片 | `/open-apis/im/v1/images` | POST |
| 27 | 消息 | 下载图片 | `/open-apis/im/v1/images/{image_key}` | GET |
| 28 | 消息 | 上传文件 | `/open-apis/im/v1/files` | POST |
| 29 | 消息 | 下载文件 | `/open-apis/im/v1/files/{file_key}` | GET |
| 30 | 消息 | 创建群聊 | `/open-apis/im/v1/chats` | POST |
| 31 | 消息 | 解散群聊 | `/open-apis/im/v1/chats/:chat_id` | DELETE |
| 32 | 消息 | 获取群列表 | `/open-apis/im/v1/chats` | GET |
| 33 | 消息 | 获取群信息 | `/open-apis/im/v1/chats/:chat_id` | GET |
| 34 | 消息 | 更新群信息 | `/open-apis/im/v1/chats/:chat_id` | PATCH |
| 35 | 消息 | 拉用户入群 | `/open-apis/im/v1/chats/:chat_id/members` | POST |
| 36 | 消息 | 移出群成员 | `/open-apis/im/v1/chats/:chat_id/members/:member_id` | DELETE |
| 37 | 日历 | 创建共享日历 | `/open-apis/calendar/v4/calendars` | POST |
| 38 | 日历 | 删除共享日历 | `/open-apis/calendar/v4/calendars/{calendar_id}` | DELETE |
| 39 | 日历 | 查询主日历信息 | `/open-apis/calendar/v4/calendars/primary` | GET |
| 40 | 日历 | 批量获取主日历信息 | `/open-apis/calendar/v4/calendars/primary/batch_get` | POST |
| 41 | 日历 | 查询日历信息 | `/open-apis/calendar/v4/calendars/{calendar_id}` | GET |
| 42 | 日历 | 批量查询日历信息 | `/open-apis/calendar/v4/calendars/batch_get` | POST |
| 43 | 日历 | 查询日历列表 | `/open-apis/calendar/v4/calendars` | GET |
| 44 | 日历 | 更新日历信息 | `/open-apis/calendar/v4/calendars/{calendar_id}` | PATCH |
| 45 | 日历 | 搜索日历 | `/open-apis/calendar/v4/calendars/search` | POST |
| 46 | 日历 | 创建日程 | `/open-apis/calendar/v4/events` | POST |
| 47 | 日历 | 删除日程 | `/open-apis/calendar/v4/events/{event_id}` | DELETE |
| 48 | 日历 | 更新日程 | `/open-apis/calendar/v4/events/{event_id}` | PATCH |
| 49 | 日历 | 获取日程 | `/open-apis/calendar/v4/events/{event_id}` | GET |
| 50 | 日历 | 获取日程列表 | `/open-apis/calendar/v4/events` | GET |
| 51 | 日历 | 搜索日程 | `/open-apis/calendar/v4/events/search` | POST |
| 52 | 日历 | 订阅日历 | `/open-apis/calendar/v4/calendars/:calendar_id/subscribe` | POST |
| 53 | 日历 | 取消订阅日历 | `/open-apis/calendar/v4/calendars/:calendar_id/unsubscribe` | POST |
| 54 | 日历 | 获取日程参与者列表 | `/open-apis/calendar/v4/events/:event_id/attendees` | GET |
| 55 | 日历 | 邀请日程参与者 | `/open-apis/calendar/v4/events/:event_id/attendees` | POST |
| 56 | 日历 | 移除日程参与者 | `/open-apis/calendar/v4/events/:event_id/attendees/:attendee_id` | DELETE |
| 57 | 日历 | 创建请假日程 | `/open-apis/calendar/v4/timeoff_events` | POST |
| 58 | 日历 | 删除请假日程 | `/open-apis/calendar/v4/timeoff_events/:timeoff_event_id` | DELETE |
| 59 | 日历 | 创建Exchange绑定 | `/open-apis/calendar/v4/exchange_bindings` | POST |
| 60 | 日历 | 查询Exchange绑定状态 | `/open-apis/calendar/v4/exchange_bindings` | GET |
| 61 | 任务 | 创建任务 | `/open-apis/task/v2/tasks` | POST |
| 62 | 任务 | 获取任务详情 | `/open-apis/task/v2/tasks/:task_guid` | GET |
| 63 | 任务 | 更新任务 | `/open-apis/task/v2/tasks/:task_guid` | PATCH |
| 64 | 任务 | 删除任务 | `/open-apis/task/v2/tasks/:task_guid` | DELETE |
| 65 | 任务 | 完成任务 | `/open-apis/task/v2/tasks/:task_guid/complete` | POST |
| 66 | 任务 | 获取任务列表 | `/open-apis/task/v2/tasks` | GET |
| 67 | 任务 | 添加任务成员 | `/open-apis/task/v2/tasks/:task_guid/members` | POST |
| 68 | 任务 | 移除任务成员 | `/open-apis/task/v2/tasks/:task_guid/members/:member_id` | DELETE |
| 69 | 任务 | 创建子任务 | `/open-apis/task/v2/tasks/:task_guid/subtasks` | POST |
| 70 | 任务 | 获取子任务列表 | `/open-apis/task/v2/tasks/:task_guid/subtasks` | GET |
| 71 | 任务 | 创建清单 | `/open-apis/task/v2/tasklists` | POST |
| 72 | 任务 | 获取清单列表 | `/open-apis/task/v2/tasklists` | GET |
| 73 | 任务 | 获取任务评论 | `/open-apis/task/v2/tasks/:task_guid/comments` | GET |
| 74 | 任务 | 添加任务评论 | `/open-apis/task/v2/tasks/:task_guid/comments` | POST |
| 75 | 审批 | 创建审批实例 | `/open-apis/approval/v4/instances` | POST |
| 76 | 审批 | 获取审批实例详情 | `/open-apis/approval/v4/instances/:instance_id` | GET |
| 77 | 审批 | 查询实例列表 | `/open-apis/approval/v4/instances/query` | POST |
| 78 | 审批 | 批量获取审批实例ID | `/open-apis/approval/v4/instances/batch_get_id` | POST |
| 79 | 审批 | 审批任务同意 | `/open-apis/approval/v4/tasks/approve` | POST |
| 80 | 审批 | 审批任务拒绝 | `/open-apis/approval/v4/tasks/reject` | POST |
| 81 | 审批 | 审批任务退回 | `/open-apis/approval/v4/tasks/transfer` | POST |
| 82 | 审批 | 审批任务加签 | `/open-apis/approval/v4/tasks/add_signer` | POST |
| 83 | 审批 | 获取审批定义列表 | `/open-apis/approval/v4/approvals` | GET |

---

## 相关文档

- [飞书开放平台官方文档](https://open.feishu.cn/document/home/index)
- [通讯录 API 概述](https://open.feishu.cn/document/server-docs/contact-v3/resources)
- [消息 API 概述](https://open.feishu.cn/document/server-docs/im-v1/overview)
- [日历 API 概述](https://open.feishu.cn/document/server-docs/calendar-v4/overview)
- [任务 API 概述](https://open.feishu.cn/document/server-docs/task-v1/overview)
- [审批 API 概述](https://open.feishu.cn/document/server-docs/approval-v4/overview)