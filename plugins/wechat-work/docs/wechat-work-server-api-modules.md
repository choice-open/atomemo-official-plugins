# 企业微信服务端 API 全量清单（企业内部开发）

> 来源：企业微信开发者中心 -> 企业内部开发 -> 服务端 API  
> 文档入口：[https://developer.work.weixin.qq.com/document/path/90556](https://developer.work.weixin.qq.com/document/path/90556)  
> 更新时间：2026-04-16
>
> **API核对状态**: 本文档已根据官方API文档进行核对,URL和描述已修正。

## 维护约定

- 按官方目录顺序整理（一级模块 -> 二级模块 -> API）。
- 完成与未完成统一放在同一张表中，仅通过“完成情况”字段标记，不再拆分文档。
- 标记规则：`✅` 已在插件中实现，`⬜` 尚未实现（或仅预留）。
- 本清单用于 `plugins/wechat-work` 的 API 覆盖追踪与后续开发排期。
- 注册状态以 `plugins/wechat-work/src/index.ts` 的 `plugin.addTool(...)` 为准：
  - `已注册`：`plugin.addTool(...)` 未注释，运行时可见。
  - `未注册`：工具实现存在，但 `plugin.addTool(...)` 被注释，运行时不可见。

### 运行时注册状态（2026-04-17）

> 本节用于明确“API 是否已注册为 tool”。  
> 对应 API 仍以各章节表格中的 URL 为准；若同一 API 存在多个 msgtype/tool，则按工具粒度判断注册状态。

#### 已注册 tool（52）

`wechat-work-list-departments`、`wechat-work-list-departments-detail`、`wechat-work-get-department`、`wechat-work-create-department`、`wechat-work-update-department`、`wechat-work-delete-department`、`wechat-work-list-members`、`wechat-work-list-members-detail`、`wechat-work-get-member`、`wechat-work-create-member`、`wechat-work-update-member`、`wechat-work-delete-member`、`wechat-work-send-text-message`、`wechat-work-send-image`、`wechat-work-send-markdown`、`wechat-work-send-news`、`wechat-work-send-text-card-message`、`wechat-work-send-template-card-message`、`wechat-work-upload-media`、`wechat-work-upload-image`、`wechat-work-get-media`、`wechat-work-list-external-contacts`、`wechat-work-get-external-contact`、`wechat-work-batch-get-external-contacts`、`wechat-work-list-tags`、`wechat-work-create-tag`、`wechat-work-update-tag`、`wechat-work-delete-tag`、`wechat-work-add-corp-tag`、`wechat-work-update-corp-tag`、`wechat-work-delete-corp-tag`、`wechat-work-send-customer-message`、`wechat-work-create-mass-message`、`wechat-work-remind-mass-message`、`wechat-work-cancel-mass-message`、`wechat-work-send-welcome-message`、`wechat-work-add-welcome-template`、`wechat-work-list-kf-accounts`、`wechat-work-get-kf-account`、`wechat-work-add-kf-serving`、`wechat-work-send-kf-message`、`wechat-work-send-mail`、`wechat-work-send-schedule-mail`、`wechat-work-send-meeting-mail`、`wechat-work-create-calendar`、`wechat-work-update-calendar`、`wechat-work-delete-calendar`、`wechat-work-create-event`、`wechat-work-update-event`、`wechat-work-create-meeting`、`wechat-work-update-meeting`、`wechat-work-get-meeting-info`

#### 未注册 tool

- 所有在 `plugins/wechat-work/src/index.ts` 中以 `// plugin.addTool(...)` 注释的项均为未注册。
- 典型未注册示例：`wechat-work-revoke-message`、`wechat-work-update-external-contact-remark`、`wechat-work-mark-customer-tag`、`wechat-work-list-kf-serving`、`wechat-work-delete-kf-serving`、`wechat-work-list-calendars`、`wechat-work-get-event`、`wechat-work-delete-event` 等。
- 全量未注册清单请直接以 `src/index.ts` 注释块为准（已按模块分组维护）。

---

## 开发指南

### 基础

#### 部门管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ---------------- | -------------------------------------- | ------------------------------------------- | -------- | ---------- | ---------- |
| 获取子部门ID列表 | GET /cgi-bin/department/simplelist | 获取子部门ID列表（仅返回id,parentid,order） | ✅ | 已注册 | 精简字段版 |
| 获取部门列表 | GET /cgi-bin/department/list | 获取部门列表（含完整信息） | ✅ | 已注册 | 官方名称 |
| 获取单个部门详情 | GET /cgi-bin/department/get?id={id} | 获取单个部门详情 | ✅ | 已注册 | 新增 |
| 创建部门 | POST /cgi-bin/department/create | 创建部门 | ✅ | 已注册 |  |
| 更新部门 | POST /cgi-bin/department/update | 更新部门 | ✅ | 已注册 |  |
| 删除部门 | GET /cgi-bin/department/delete?id={id} | 删除部门 | ✅ | 已注册 |  |

#### 成员管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ---------------- | ---------------------------------------- | ------------------------ | -------- | ---------- | ---- |
| 获取部门成员 | GET /cgi-bin/user/simplelist | 获取部门成员（精简信息） | ✅ | 已注册 |  |
| 获取部门成员详情 | GET /cgi-bin/user/list | 获取部门成员详情列表 | ✅ | 已注册 |  |
| 获取单个成员 | GET /cgi-bin/user/get?userid={userid} | 获取成员详情 | ✅ | 已注册 |  |
| 创建成员 | POST /cgi-bin/user/create | 创建成员 | ✅ | 已注册 |  |
| 更新成员 | POST /cgi-bin/user/update | 更新成员 | ✅ | 已注册 |  |
| 删除成员 | GET /cgi-bin/user/delete?userid={userid} | 删除成员 | ✅ | 已注册 |  |
| 批量删除成员 | POST /cgi-bin/user/batchdelete | 批量删除成员 | ✅ | 未注册 | 新增 |

#### 标签管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ------------ | ---------------------------------- | ------------ | -------- | ---------- | ---- |
| 创建标签 | POST /cgi-bin/tag/create | 创建标签 | ✅ | 已注册 |  |
| 更新标签名字 | POST /cgi-bin/tag/update | 更新标签名字 | ✅ | 已注册 |  |
| 删除标签 | GET /cgi-bin/tag/delete?tagid={id} | 删除标签 | ✅ | 已注册 |  |
| 获取标签成员 | GET /cgi-bin/tag/get?tagid={id} | 获取标签成员 | ✅ | 未注册 |  |
| 增加标签成员 | POST /cgi-bin/tag/addtagusers | 增加标签成员 | ✅ | 未注册 |  |
| 删除标签成员 | POST /cgi-bin/tag/deltagusers | 删除标签成员 | ✅ | 未注册 |  |
| 获取标签列表 | GET /cgi-bin/tag/list | 获取标签列表 | ✅ | 已注册 |  |

#### 异步导入接口

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | -------------------------------- | ------------ | -------- | ---------- |
| 增量更新成员 | POST /cgi-bin/batch/syncuser | 增量导入成员 | ✅ | 未注册 |
| 全量覆盖成员 | POST /cgi-bin/batch/replaceuser | 全量导入成员 | ✅ | 未注册 |
| 全量覆盖部门 | POST /cgi-bin/batch/replaceparty | 全量导入部门 | ✅ | 未注册 |
| 获取异步任务结果 | GET /cgi-bin/batch/getresult | 获取任务结果 | ✅ | 未注册 |

#### 异步导出接口

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | -------------------------------- | ------------ | -------- | ---------- |
| 导出成员 | POST /cgi-bin/export/simple_user | 导出成员 | ✅ | 未注册 |
| 获取导出结果 | GET /cgi-bin/export/get_result | 获取导出结果 | ✅ | 未注册 |

---

### 安全管理

#### 应用管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ------------ | ----------------------------------- | ------------ | -------- | ---------- | ---- |
| 获取应用 | GET /cgi-bin/agent/get?agentid={id} | 获取应用详情 | ✅ | 未注册 |  |
| 设置应用 | POST /cgi-bin/agent/set | 设置应用 | ✅ | 未注册 |  |
| 获取应用列表 | GET /cgi-bin/agent/list | 获取应用列表 | ✅ | 未注册 |  |

---

### 消息接收与发送

#### 应用发送消息到群聊会话

| API | URL | msgtype | 描述 | 完成情况 | 注册状态 | 备注 |
| ---------------- | ---------------------------- | ------------- | ---------------- | -------- | ---------- | ---- |
| 发送文本消息 | POST /cgi-bin/message/send | text | 发送文本消息 | ✅ | 已注册 |  |
| 发送图片消息 | POST /cgi-bin/message/send | image | 发送图片消息 | ✅ | 已注册 |  |
| 发送语音消息 | POST /cgi-bin/message/send | voice | 发送语音消息 | ✅ | 未注册 |  |
| 发送视频消息 | POST /cgi-bin/message/send | video | 发送视频消息 | ✅ | 未注册 | 新增 |
| 发送文件消息 | POST /cgi-bin/message/send | file | 发送文件消息 | ✅ | 未注册 |  |
| 发送Markdown消息 | POST /cgi-bin/message/send | markdown | 发送Markdown消息 | ✅ | 已注册 |  |
| 发送图文消息 | POST /cgi-bin/message/send | news | 发送图文消息 | ✅ | 已注册 |  |
| 发送文本卡片消息 | POST /cgi-bin/message/send | textcard | 发送文本卡片消息 | ✅ | 已注册 |  |
| 发送模板卡片消息 | POST /cgi-bin/message/send | template_card | 发送模板卡片消息 | ✅ | 已注册 |  |
| 撤回应用消息 | POST /cgi-bin/message/revoke | - | 撤回应用消息 | ✅ | 未注册 | 新增 |

#### 家校消息推送

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | -------------------------- | ------------ | -------- | ---------- |
| 家校发送消息 | POST /cgi-bin/message/send | 家校消息推送 | ✅ | 未注册 |

#### 消息推送（原"群机器人"）

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | -------------------------- | ---------------- | -------- | ---------- |
| 机器人发送消息 | POST /cgi-bin/webhook/send | 群机器人发送消息 | ✅ | 未注册 |

#### 智能机器人

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ------------------------ | ------------------ | -------- | ---------- |
| 发送机器人消息 | POST /cgi-bin/robot/send | 智能机器人发送消息 | ✅ | 未注册 |

#### 智能表格自动化创建的群聊

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------- | -------------------------------------------------- | ------------------ | -------- | ---------- |
| 创建群聊 | POST /cgi-bin/smartwork/automated/groupchat/create | 智能表格自动化创群 | ✅ | 未注册 |

---

### 应用管理

#### 素材管理

| API | URL | type参数 | 描述 | 完成情况 | 注册状态 | 备注 |
| ---------------- | ------------------------------------------ | ---------------------- | ---------------- | -------- | ---------- | ---- |
| 上传临时素材 | POST /cgi-bin/media/upload | image/voice/video/file | 上传临时素材 | ✅ | 已注册 |  |
| 上传图片 | POST /cgi-bin/media/uploadimg | - | 上传图片 | ✅ | 已注册 |  |
| 获取临时素材 | GET /cgi-bin/media/get?media_id={id} | - | 获取临时素材 | ✅ | 已注册 | 新增 |
| 获取高清语音素材 | GET /cgi-bin/media/get/jssdk?media_id={id} | - | 获取高清语音素材 | ✅ | 未注册 |  |
| 异步上传临时素材 | POST /cgi-bin/media/upload_async | - | 异步上传临时素材 | ✅ | 未注册 |  |
| 上传永久素材 | POST /cgi-bin/material/add_material | - | 上传永久素材 | ✅ | 未注册 |  |
| 获取永久素材 | GET /cgi-bin/material/get?media_id={id} | - | 获取永久素材 | ✅ | 未注册 |  |
| 删除永久素材 | POST /cgi-bin/material/del_material | - | 删除永久素材 | ✅ | 未注册 |  |
| 获取素材列表 | POST /cgi-bin/material/batchget | - | 获取素材列表 | ✅ | 未注册 |  |

---

## 连接微信

### 客户联系

#### 企业服务人员管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| -------------------------------- | ------------------------------------------------- | -------------------------------- | -------- | ---------- | ---- |
| 获取配置了客户联系功能的成员列表 | GET /cgi-bin/externalcontact/get_follow_user_list | 获取配置了客户联系功能的成员列表 | ✅ | 未注册 |  |
| 获取外部联系人列表 | GET /cgi-bin/externalcontact/list?userid={userid} | 获取外部联系人列表 | ✅ | 已注册 |  |

#### 客户管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ---------------- | --------------------------------------------------------------------- | ---------------- | -------- | ---------- | ---- |
| 获取客户详情 | GET /cgi-bin/externalcontact/get?external_userid={id}&userid={userid} | 获取客户详情 | ✅ | 已注册 |  |
| 批量获取客户详情 | POST /cgi-bin/externalcontact/batchget_by_user | 批量获取客户详情 | ✅ | 已注册 | 新增 |
| 修改客户备注信息 | POST /cgi-bin/externalcontact/remark | 修改客户备注信息 | ✅ | 未注册 |  |

#### 客户标签管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ---------------- | ----------------------------------------------- | ---------------- | -------- | ---------- | ---- |
| 获取企业标签库 | POST /cgi-bin/externalcontact/get_corp_tag_list | 获取企业标签列表 | ✅ | 未注册 |  |
| 添加企业客户标签 | POST /cgi-bin/externalcontact/add_corp_tag | 添加企业客户标签 | ✅ | 已注册 |  |
| 编辑企业客户标签 | POST /cgi-bin/externalcontact/update_corp_tag | 编辑企业客户标签 | ✅ | 已注册 |  |
| 删除企业客户标签 | POST /cgi-bin/externalcontact/del_corp_tag | 删除企业客户标签 | ✅ | 已注册 |  |
| 给客户打标签 | POST /cgi-bin/externalcontact/mark_tag | 给客户打标签 | ✅ | 未注册 |  |

#### 在职继承

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------------ | ----------------------------------------------- | ---------------- | -------- | ---------- |
| 分配在职成员的客户 | POST /cgi-bin/externalcontact/transfer_customer | 分配在职成员客户 | ✅ | 未注册 |
| 查询分配结果 | GET /cgi-bin/externalcontact/transfer_result | 查询分配结果 | ✅ | 未注册 |

#### 离职继承

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------------ | ------------------------------------------------------ | ---------------- | -------- | ---------- |
| 分配离职成员的客户 | POST /cgi-bin/externalcontact/resign/transfer_customer | 分配离职成员客户 | ✅ | 未注册 |
| 查询离职继承结果 | GET /cgi-bin/externalcontact/resign/transfer_result | 查询离职继承结果 | ✅ | 未注册 |

#### 客户群管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| -------------------- | ------------------------------------------------------------- | ------------------ | -------- | ---------- | ---- |
| 获取客户群列表 | POST /cgi-bin/externalcontact/groupchat/list | 获取客户群列表 | ✅ | 未注册 |  |
| 获取客户群详情 | POST /cgi-bin/externalcontact/groupchat/get | 获取客户群详情 | ✅ | 未注册 | 新增 |
| 客户群opengid转换 | POST /cgi-bin/externalcontact/groupchat/opengid_to_chatid | 客户群opengid转换 | ✅ | 未注册 |  |
| 分配在职成员的客户群 | POST /cgi-bin/externalcontact/grouptransfer/transfer_customer | 分配在职成员客户群 | ✅ | 未注册 |  |

#### 联系我与客户入群方式

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | --------------------------------------------- | -------------- | -------- | ---------- |
| 获取联系我方式 | GET /cgi-bin/externalcontact/get_contact_way | 获取联系我方式 | ✅ | 未注册 |
| 配置联系我方式 | POST /cgi-bin/externalcontact/add_contact_way | 配置联系我方式 | ✅ | 未注册 |
| 删除联系我方式 | POST /cgi-bin/externalcontact/del_contact_way | 删除联系我方式 | ✅ | 未注册 |

#### 客户朋友圈

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------------ | ----------------------------------------------- | ------------------ | -------- | ---------- |
| 获取客户朋友圈列表 | POST /cgi-bin/externalcontact/moment/list | 获取客户朋友圈列表 | ✅ | 未注册 |
| 获取客户朋友圈内容 | POST /cgi-bin/externalcontact/get_moment_list | 获取客户朋友圈内容 | ✅ | 未注册 |
| 发布客户朋友圈 | POST /cgi-bin/externalcontact/add_moment_task | 发布客户朋友圈 | ✅ | 未注册 |

#### 获客助手

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------------------------- | ---------------- | -------- | ---------- |
| 获取获客链接 | POST /cgi-bin/externalcontact/intelligence/get_qrcode | 获取获客助手链接 | ✅ | 未注册 |

#### 消息推送

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ------------------------------------------ | -------------- | -------- | ---------- |
| 发送消息给客户 | POST /cgi-bin/externalcontact/message/send | 给客户发送消息 | ✅ | 已注册 |

#### 统计管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ---------------------------------------------------- | ---------------- | -------- | ---------- |
| 获取成员客户数据 | POST /cgi-bin/externalcontact/get_user_behavior_data | 获取成员行为数据 | ✅ | 未注册 |
| 获取企业客户数据 | GET /cgi-bin/externalcontact/get_corp_stat | 获取企业客户统计 | ✅ | 未注册 |

---

### 微信客服

#### 客服账号管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ---------------------------- | ---------------- | -------- | ---------- |
| 添加客服账号 | POST /cgi-bin/kf/account/add | 添加客服账号 | ✅ | 未注册 |
| 获取客服账号列表 | GET /cgi-bin/kf/account/list | 获取客服账号列表 | ✅ | 已注册 |
| 获取客服账号详情 | GET /cgi-bin/kf/account/get | 获取客服账号详情 | ✅ | 已注册 |
| 删除客服账号 | POST /cgi-bin/kf/account/del | 删除客服账号 | ✅ | 未注册 |

#### 接待人员管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ---------------------------- | ---------------- | -------- | ---------- |
| 添加接待人员 | POST /cgi-bin/kf/serving/add | 添加接待人员 | ✅ | 已注册 |
| 获取接待人员列表 | GET /cgi-bin/kf/serving/list | 获取接待人员列表 | ✅ | 未注册 |
| 删除接待人员 | POST /cgi-bin/kf/serving/del | 删除接待人员 | ✅ | 未注册 |

#### 会话分配与消息收发

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------------------ | ------------------------------------ | -------------------- | -------- | ---------- |
| 发送消息 | POST /cgi-bin/kf/send_msg | 发送客服消息 | ✅ | 已注册 |
| 转接会话（变更会话状态） | POST /cgi-bin/kf/service_state/trans | 变更会话状态实现转接 | ✅ | 未注册 |
| 结束会话（变更会话状态） | POST /cgi-bin/kf/service_state/trans | 变更会话状态结束会话 | ✅ | 未注册 |

#### 其他基础信息获取

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ---------------------------------- | -------------------- | -------- | ---------- |
| 获取会话状态 | POST /cgi-bin/kf/service_state/get | 获取当前会话状态 | ✅ | 未注册 |
| 读取消息与事件 | POST /cgi-bin/kf/sync_msg | 读取近三天消息与事件 | ✅ | 未注册 |

#### 统计管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------------------- | ----------------------------------- | -------------------- | -------- | ---------- |
| 获取客户数据统计（企业汇总） | POST /cgi-bin/kf/get_corp_statistic | 获取客服企业汇总统计 | ✅ | 未注册 |

#### 机器人管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | -------------------------- | -------------- | -------- | ---------- |
| 添加机器人 | POST /cgi-bin/kf/robot/add | 添加机器人 | ✅ | 未注册 |
| 获取机器人列表 | GET /cgi-bin/kf/robot/list | 获取机器人列表 | ✅ | 未注册 |
| 删除机器人 | POST /cgi-bin/kf/robot/del | 删除机器人 | ✅ | 未注册 |

---

## 会话内容存档

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ----------------------------------- | ---------------- | -------- | ---------- |
| 开通会话存档 | POST /cgi-bin/msgaudit/check | 开通会话存档 | ✅ | 未注册 |
| 获取会话内容 | POST /cgi-bin/msgaudit/get | 获取会话内容 | ✅ | 未注册 |
| 获取成员会话存档 | POST /cgi-bin/msgaudit/get_per_user | 获取成员会话存档 | ✅ | 未注册 |

---

## 家校沟通

#### 基础接口

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------ | ------------ | -------- | ---------- |
| 获取学校列表 | GET /cgi-bin/school/list | 获取学校列表 | ✅ | 未注册 |

#### 学生与家长管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------------- | ------------ | -------- | ---------- |
| 获取学生列表 | GET /cgi-bin/school/user/list_student | 获取学生列表 | ✅ | 未注册 |
| 获取家长列表 | GET /cgi-bin/school/user/list_guardian | 获取家长列表 | ✅ | 未注册 |
| 创建学生 | POST /cgi-bin/school/user/create_student | 创建学生 | ✅ | 未注册 |
| 创建家长 | POST /cgi-bin/school/user/create_guardian | 创建家长 | ✅ | 未注册 |

#### 部门管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------- | ------------ | -------- | ---------- |
| 获取家校部门 | GET /cgi-bin/school/department/list | 获取家校部门 | ✅ | 未注册 |

---

## 家校应用

#### 健康上报

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ------------------------------------------ | ---------------- | -------- | ---------- |
| 获取健康上报情况 | POST /cgi-bin/school/health/get_report | 获取健康上报情况 | ✅ | 未注册 |
| 导出健康上报数据 | POST /cgi-bin/school/health/export_report | 导出健康上报数据 | ✅ | 未注册 |

#### 上课直播

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------- | -------------------------------- | -------- | -------- | ---------- |
| 创建直播 | POST /cgi-bin/school/live/create | 创建直播 | ✅ | 未注册 |
| 结束直播 | POST /cgi-bin/school/live/stop | 结束直播 | ✅ | 未注册 |

#### 班级收款

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------- | ------------ | -------- | ---------- |
| 创建收款 | POST /cgi-bin/school/payment/create | 创建班级收款 | ✅ | 未注册 |
| 获取收款详情 | GET /cgi-bin/school/payment/get | 获取收款详情 | ✅ | 未注册 |

---

## 政民沟通

#### 配置网格结构

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ---------------------------------- | ------------ | -------- | ---------- |
| 创建网格 | POST /cgi-bin/report/grid/add | 创建网格 | ✅ | 未注册 |
| 获取网格列表 | POST /cgi-bin/report/grid/list | 获取网格列表 | ✅ | 未注册 |

#### 配置事件类别

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------------ | ------------ | -------- | ---------- |
| 创建事件类别 | POST /cgi-bin/report/grid/add_cata | 创建事件类别 | ✅ | 未注册 |
| 获取事件类别 | POST /cgi-bin/report/grid/list_cata | 获取事件类别 | ✅ | 未注册 |

#### 巡查上报

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | -------------------------------------- | ------------ | -------- | ---------- |
| 巡查上报 | POST /cgi-bin/report/patrol/add | 巡查上报 | ✅ | 未注册 |
| 获取巡查记录 | POST /cgi-bin/report/patrol/get_order_list | 获取巡查记录 | ✅ | 未注册 |

#### 居民上报

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------------ | -------- | -------- | ---------- |
| 居民上报 | POST /cgi-bin/report/resident/add | 居民上报 | ✅ | 未注册 |
| 处理上报 | POST /cgi-bin/report/resident/deal | 处理上报 | ✅ | 未注册 |

---

## 办公

### 邮件

#### 发送邮件

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------- | ----------------------- | -------- | -------- | ---------- |
| 发送邮件 | POST /cgi-bin/mail/send | 发送邮件 | ✅ | 已注册 |

#### 获取接收的邮件

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ---------------------- | -------------- | -------- | ---------- |
| 获取收件箱 | GET /cgi-bin/mail/list | 获取收件箱列表 | ✅ | 未注册 |
| 获取邮件详情 | GET /cgi-bin/mail/get | 获取邮件详情 | ✅ | 未注册 |

#### 管理应用邮箱账号

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | -------------------------------------- | ------------ | -------- | ---------- |
| 获取应用邮箱 | GET /cgi-bin/mail/get_app_mail_account | 获取应用邮箱 | ✅ | 未注册 |

#### 管理邮件群组

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------- | ------------ | -------- | ---------- |
| 获取群组列表 | GET /cgi-bin/mail/group/list | 获取群组列表 | ✅ | 未注册 |
| 创建群组 | POST /cgi-bin/mail/group/create | 创建群组 | ✅ | 未注册 |

#### 管理公共邮箱

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------------------ | ------------ | -------- | ---------- |
| 获取公共邮箱 | GET /cgi-bin/mail/common_mail_account/list | 获取公共邮箱 | ✅ | 未注册 |

#### 高级功能账号管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ------------------------------------ | -------------- | -------- | ---------- |
| 获取管理员邮箱 | GET /cgi-bin/mail/admin_mailbox/list | 获取管理员邮箱 | ✅ | 未注册 |

#### 其他邮件客户端登录设置

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ----------------------------------- | -------------- | -------- | ---------- |
| 获取客户端设置 | GET /cgi-bin/mail/client_config/get | 获取客户端设置 | ✅ | 未注册 |

---

### 文档

#### 管理文档

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ------------------------------------- | ---------------------- | -------- | ---------- |
| 新建文档 | POST /cgi-bin/wedoc/create_doc | 新建文档/表格/智能表格 | ✅ | 未注册 |
| 获取文档基础信息 | POST /cgi-bin/wedoc/get_doc_base_info | 获取文档元数据 | ✅ | 未注册 |
| 删除文档 | POST /cgi-bin/wedoc/del_doc | 删除文档 | ✅ | 未注册 |

#### 管理文档内容

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------------- | ------------ | -------- | ---------- |
| 获取文档数据 | POST /cgi-bin/wedoc/document/get | 获取文档内容 | ✅ | 未注册 |
| 编辑文档内容 | POST /cgi-bin/wedoc/document/batch_update | 修改文档内容 | ✅ | 未注册 |

#### 管理表格内容

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------------- | ---------------------------------------------------- | -------------------- | -------- | ---------- |
| 获取表格数据 | POST /cgi-bin/wedoc/spreadsheet/get_sheet_range_data | 获取表格指定范围数据 | ✅ | 未注册 |
| 获取表格行列信息 | POST /cgi-bin/wedoc/spreadsheet/get_sheet_properties | 获取工作表属性 | ✅ | 未注册 |
| 编辑表格内容 | POST /cgi-bin/wedoc/spreadsheet/batch_update | 编辑表格单元格数据 | ✅ | 未注册 |

#### 管理智能表格内容

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------- | --------------------------------------------- | -------------------- | -------- | ---------- |
| 查询子表 | POST /cgi-bin/wedoc/smartsheet/get_sheet | 获取智能表格子表信息 | ✅ | 未注册 |
| 查询记录 | POST /cgi-bin/wedoc/smartsheet/get_records | 查询智能表格记录 | ✅ | 未注册 |
| 添加记录 | POST /cgi-bin/wedoc/smartsheet/add_records | 新增智能表格记录 | ✅ | 未注册 |
| 更新记录 | POST /cgi-bin/wedoc/smartsheet/update_records | 更新智能表格记录 | ✅ | 未注册 |

#### 管理收集表

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------------ | -------------------------------------- | -------------- | -------- | ---------- |
| 获取收集表信息 | POST /cgi-bin/wedoc/get_form_info | 获取收集表配置 | ✅ | 未注册 |
| 收集表统计信息查询 | POST /cgi-bin/wedoc/get_form_statistic | 获取收集表统计 | ✅ | 未注册 |
| 读取收集表答案 | POST /cgi-bin/wedoc/get_form_answer | 读取收集表答案 | ✅ | 未注册 |

#### 接收外部数据到智能表格

| API | URL | 描述 | 完成情况 | 注册状态 |
| --------------------- | ---------------------------------------------- | ---------------------- | -------- | ---------- |
| 通过 Webhook 添加记录 | POST /cgi-bin/wedoc/smartsheet/webhook?key=KEY | 接收外部数据并新增记录 | ✅ | 未注册 |
| 通过 Webhook 更新记录 | POST /cgi-bin/wedoc/smartsheet/webhook?key=KEY | 接收外部数据并更新记录 | ✅ | 未注册 |

#### 高级功能账号管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------------ | ---------------------------------- | ------------------ | -------- | ---------- |
| 获取应用管理员列表 | POST /cgi-bin/agent/get_admin_list | 获取应用管理员列表 | ✅ | 未注册 |

#### 素材管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------------- | ------------------------------------ | ---------------------- | -------- | ---------- |
| 上传文档图片 | POST /cgi-bin/wedoc/image_upload | 上传文档图片 | ✅ | 未注册 |
| 上传临时素材（文件） | POST /cgi-bin/media/upload?type=file | 上传临时素材供文档引用 | ✅ | 未注册 |

---

### 日程

#### 管理日历

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ------------ | ----------------------------- | ------------ | -------- | ---------- | ---- |
| 获取日历列表 | GET /cgi-bin/calendar/list | 获取日历列表 | ✅ | 未注册 |  |
| 创建日历 | POST /cgi-bin/calendar/create | 创建日历 | ✅ | 已注册 | 新增 |
| 更新日历 | POST /cgi-bin/calendar/update | 更新日历 | ✅ | 已注册 | 新增 |
| 删除日历 | POST /cgi-bin/calendar/delete | 删除日历 | ✅ | 已注册 | 新增 |

#### 管理日程

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------- | ------------ | -------- | ---------- |
| 创建日程 | POST /cgi-bin/calendar/add | 创建日程 | ✅ | 已注册 |
| 获取日程详情 | GET /cgi-bin/calendar/get | 获取日程详情 | ✅ | 未注册 |
| 更新日程 | POST /cgi-bin/calendar/update | 更新日程 | ✅ | 已注册 |
| 删除日程 | POST /cgi-bin/calendar/delete | 删除日程 | ✅ | 未注册 |

---

### 会议

#### 预约会议基础管理

| API | URL | 描述 | 完成情况 | 注册状态 | 备注 |
| ------------------ | ---------------------------------------- | ------------------ | -------- | ---------- | ---- |
| 获取成员会议ID列表 | POST /cgi-bin/meeting/get_user_meetingid | 获取成员会议ID列表 | ✅ | 未注册 |  |
| 创建预约会议 | POST /cgi-bin/meeting/create | 创建预约会议 | ✅ | 已注册 |  |
| 修改预约会议 | POST /cgi-bin/meeting/update | 修改预约会议 | ✅ | 已注册 |  |
| 取消预约会议 | POST /cgi-bin/meeting/cancel | 取消预约会议 | ✅ | 未注册 |  |
| 获取会议详情 | POST /cgi-bin/meeting/get_info | 获取会议详情 | ✅ | 已注册 |  |

#### 会议统计管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------- | ------------ | -------- | ---------- |
| 获取会议统计 | POST /cgi-bin/meeting/statistic/get | 获取会议统计 | ✅ | 未注册 |

#### 预约会议高级管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------- | ------------------------------------- | -------- | -------- | ---------- |
| 预约会议 | POST /cgi-bin/meeting/advanced/create | 预约会议 | ✅ | 未注册 |
| 修改会议 | POST /cgi-bin/meeting/advanced/update | 修改会议 | ✅ | 未注册 |

#### 会中控制管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------- | ----------------------------- | -------- | -------- | ---------- |
| 邀请成员 | POST /cgi-bin/meeting/invite | 邀请成员 | ✅ | 未注册 |
| 踢出成员 | POST /cgi-bin/meeting/kickout | 踢出成员 | ✅ | 未注册 |

#### 网络研讨会 (Webinar) 管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ---------------------------- | -------------- | -------- | ---------- |
| 创建研讨会 | POST /cgi-bin/webinar/create | 创建网络研讨会 | ✅ | 未注册 |
| 获取研讨会详情 | GET /cgi-bin/webinar/get | 获取研讨会详情 | ✅ | 未注册 |

#### 电话入会（PSTN）管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------- | ------------ | -------- | ---------- |
| 获取PSTN会议 | GET /cgi-bin/meeting/pstn/get | 获取PSTN会议 | ✅ | 未注册 |

#### Rooms会议室管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ------------------------ | -------------- | -------- | ---------- |
| 获取会议室列表 | GET /cgi-bin/rooms/list | 获取会议室列表 | ✅ | 未注册 |
| 获取会议室详情 | GET /cgi-bin/rooms/get | 获取会议室详情 | ✅ | 未注册 |
| 预约会议室 | POST /cgi-bin/rooms/book | 预约会议室 | ✅ | 未注册 |

#### 会议室连接器（MRA）管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ----------- | --------------------- | ----------- | -------- | ---------- |
| 获取MRA列表 | GET /cgi-bin/mra/list | 获取MRA列表 | ✅ | 未注册 |

#### 会议布局和背景管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------------ | ------------ | -------- | ---------- |
| 设置会议背景 | POST /cgi-bin/meeting/background/set | 设置会议背景 | ✅ | 未注册 |

#### 录制管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------------ | ------------ | -------- | ---------- |
| 获取录制文件 | GET /cgi-bin/meeting/record/get | 获取录制文件 | ✅ | 未注册 |
| 下载录制文件 | GET /cgi-bin/meeting/record/download | 下载录制文件 | ✅ | 未注册 |

#### 高级功能账号管理

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ------------------------------- | -------------- | -------- | ---------- |
| 获取管理员会议 | GET /cgi-bin/meeting/admin_list | 获取管理员会议 | ✅ | 未注册 |

---

### 微盘

#### 管理空间

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------- | ------------ | -------- | ---------- |
| 获取空间信息 | POST /cgi-bin/wedrive/space_info | 获取空间信息 | ✅ | 未注册 |
| 新建空间 | POST /cgi-bin/wedrive/space_create | 新建空间 | ✅ | 未注册 |
| 解散空间 | POST /cgi-bin/wedrive/space_dismiss | 解散空间 | ✅ | 未注册 |
| 获取文件列表 | GET /cgi-bin/wedrive/file_list | 获取文件列表 | ✅ | 未注册 |
| 上传文件 | POST /cgi-bin/wedrive/file_upload | 上传文件 | ✅ | 未注册 |
| 下载文件 | GET /cgi-bin/wedrive/file_download | 下载文件 | ✅ | 未注册 |
| 删除文件 | POST /cgi-bin/wedrive/file_del | 删除文件 | ✅ | 未注册 |

---

### 其他

#### 直播

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------- | ------------ | -------- | ---------- |
| 创建直播 | POST /cgi-bin/live/create | 创建直播 | ✅ | 未注册 |
| 获取直播详情 | GET /cgi-bin/live/get | 获取直播详情 | ✅ | 未注册 |

#### 公费电话

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | -------------------------------- | ------------ | -------- | ---------- |
| 获取通话记录 | POST /cgi-bin/dial/get_dial_record | 获取通话记录 | ✅ | 未注册 |

#### 打卡

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ------------------------------------- | ------------ | -------- | ---------- |
| 获取打卡记录 | POST /cgi-bin/checkin/getcheckindata | 获取打卡记录 | ✅ | 未注册 |
| 获取打卡规则 | GET /cgi-bin/checkin/get_checkin_rule | 获取打卡规则 | ✅ | 未注册 |

#### 审批

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ----------------------------------- | ------------ | -------- | ---------- |
| 获取审批模板 | GET /cgi-bin/oa/get_template | 获取审批模板 | ✅ | 未注册 |
| 提交审批 | POST /cgi-bin/oa/apply_event | 提交审批 | ✅ | 未注册 |
| 获取审批详情 | GET /cgi-bin/oa/get_approval_detail | 获取审批详情 | ✅ | 未注册 |

#### 汇报

| API | URL | 描述 | 完成情况 | 注册状态 |
| ------------ | ---------------------------- | ------------ | -------- | ---------- |
| 获取汇报记录 | GET /cgi-bin/report/get_list | 获取汇报记录 | ✅ | 未注册 |
| 获取汇报详情 | GET /cgi-bin/report/get | 获取汇报详情 | ✅ | 未注册 |

#### 人事助手

##### 花名册

| API | URL | 描述 | 完成情况 | 注册状态 |
| ---------- | -------------------------------- | ---------- | -------- | ---------- |
| 获取花名册 | POST /cgi-bin/hr/get_staff_info | 获取花名册 | ✅ | 未注册 |

#### 会议室

| API | URL | 描述 | 完成情况 | 注册状态 |
| -------------- | ------------------------ | -------------- | -------- | ---------- |
| 获取会议室列表 | GET /cgi-bin/rooms/list | 获取会议室列表 | ✅ | 未注册 |
| 预约会议室 | POST /cgi-bin/rooms/book | 预约会议室 | ✅ | 未注册 |

---

