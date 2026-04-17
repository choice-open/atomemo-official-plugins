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

---

## 开发指南

### 基础

#### 部门管理

| API              | URL                                    | 描述                                        | 完成情况 | 备注       |
| ---------------- | -------------------------------------- | ------------------------------------------- | -------- | ---------- |
| 获取子部门ID列表 | GET /cgi-bin/department/simplelist     | 获取子部门ID列表（仅返回id,parentid,order） | ✅       | 精简字段版 |
| 获取部门列表     | GET /cgi-bin/department/list           | 获取部门列表（含完整信息）                  | ✅       | 官方名称   |
| 获取单个部门详情 | GET /cgi-bin/department/get?id={id}    | 获取单个部门详情                            | ✅       | 新增       |
| 创建部门         | POST /cgi-bin/department/create        | 创建部门                                    | ✅       |            |
| 更新部门         | POST /cgi-bin/department/update        | 更新部门                                    | ✅       |            |
| 删除部门         | GET /cgi-bin/department/delete?id={id} | 删除部门                                    | ✅       |            |

#### 成员管理

| API              | URL                                      | 描述                     | 完成情况 | 备注 |
| ---------------- | ---------------------------------------- | ------------------------ | -------- | ---- |
| 获取部门成员     | GET /cgi-bin/user/simplelist             | 获取部门成员（精简信息） | ✅       |      |
| 获取部门成员详情 | GET /cgi-bin/user/list                   | 获取部门成员详情列表     | ✅       |      |
| 获取单个成员     | GET /cgi-bin/user/get?userid={userid}    | 获取成员详情             | ✅       |      |
| 创建成员         | POST /cgi-bin/user/create                | 创建成员                 | ✅       |      |
| 更新成员         | POST /cgi-bin/user/update                | 更新成员                 | ✅       |      |
| 删除成员         | GET /cgi-bin/user/delete?userid={userid} | 删除成员                 | ✅       |      |
| 批量删除成员     | POST /cgi-bin/user/batchdelete           | 批量删除成员             | ✅       | 新增 |

#### 标签管理

| API          | URL                                | 描述         | 完成情况 | 备注 |
| ------------ | ---------------------------------- | ------------ | -------- | ---- |
| 创建标签     | POST /cgi-bin/tag/create           | 创建标签     | ✅       |      |
| 更新标签名字 | POST /cgi-bin/tag/update           | 更新标签名字 | ✅       |      |
| 删除标签     | GET /cgi-bin/tag/delete?tagid={id} | 删除标签     | ✅       |      |
| 获取标签成员 | GET /cgi-bin/tag/get?tagid={id}    | 获取标签成员 | ✅       |      |
| 增加标签成员 | POST /cgi-bin/tag/addtagusers      | 增加标签成员 | ✅       |      |
| 删除标签成员 | POST /cgi-bin/tag/deltagusers      | 删除标签成员 | ✅       |      |
| 获取标签列表 | GET /cgi-bin/tag/list              | 获取标签列表 | ✅       |      |

#### 异步导入接口

| API              | URL                              | 描述         | 完成情况 |
| ---------------- | -------------------------------- | ------------ | -------- | --- |
| 增量更新成员     | POST /cgi-bin/batch/syncuser     | 增量导入成员 | ✅       |     |
| 全量覆盖成员     | POST /cgi-bin/batch/replaceuser  | 全量导入成员 | ✅       |     |
| 全量覆盖部门     | POST /cgi-bin/batch/replaceparty | 全量导入部门 | ✅       |     |
| 获取异步任务结果 | GET /cgi-bin/batch/getresult     | 获取任务结果 | ✅       |     |

#### 异步导出接口

| API          | URL                              | 描述         | 完成情况 |
| ------------ | -------------------------------- | ------------ | -------- |
| 导出成员     | POST /cgi-bin/export/simple_user | 导出成员     | ✅       |
| 获取导出结果 | GET /cgi-bin/export/get_result   | 获取导出结果 | ✅       |

---

### 安全管理

#### 应用管理

| API          | URL                                 | 描述         | 完成情况 | 备注 |
| ------------ | ----------------------------------- | ------------ | -------- | ---- |
| 获取应用     | GET /cgi-bin/agent/get?agentid={id} | 获取应用详情 | ✅       |      |
| 设置应用     | POST /cgi-bin/agent/set             | 设置应用     | ✅       |      |
| 获取应用列表 | GET /cgi-bin/agent/list             | 获取应用列表 | ✅       |      |

---

### 消息接收与发送

#### 应用发送消息到群聊会话

| API              | URL                          | msgtype       | 描述             | 完成情况 | 备注 |
| ---------------- | ---------------------------- | ------------- | ---------------- | -------- | ---- |
| 发送文本消息     | POST /cgi-bin/message/send   | text          | 发送文本消息     | ✅       |      |
| 发送图片消息     | POST /cgi-bin/message/send   | image         | 发送图片消息     | ✅       |      |
| 发送语音消息     | POST /cgi-bin/message/send   | voice         | 发送语音消息     | ✅       |      |
| 发送视频消息     | POST /cgi-bin/message/send   | video         | 发送视频消息     | ✅       | 新增 |
| 发送文件消息     | POST /cgi-bin/message/send   | file          | 发送文件消息     | ✅       |      |
| 发送Markdown消息 | POST /cgi-bin/message/send   | markdown      | 发送Markdown消息 | ✅       |      |
| 发送图文消息     | POST /cgi-bin/message/send   | news          | 发送图文消息     | ✅       |      |
| 发送文本卡片消息 | POST /cgi-bin/message/send   | textcard      | 发送文本卡片消息 | ✅       |      |
| 发送模板卡片消息 | POST /cgi-bin/message/send   | template_card | 发送模板卡片消息 | ✅       |      |
| 撤回应用消息     | POST /cgi-bin/message/revoke | -             | 撤回应用消息     | ✅       | 新增 |

#### 家校消息推送

| API          | URL                        | 描述         | 完成情况 |
| ------------ | -------------------------- | ------------ | -------- |
| 家校发送消息 | POST /cgi-bin/message/send | 家校消息推送 | ✅       |

#### 消息推送（原"群机器人"）

| API            | URL                        | 描述             | 完成情况 |
| -------------- | -------------------------- | ---------------- | -------- |
| 机器人发送消息 | POST /cgi-bin/webhook/send | 群机器人发送消息 | ✅       |

#### 智能机器人

| API            | URL                      | 描述               | 完成情况 |
| -------------- | ------------------------ | ------------------ | -------- |
| 发送机器人消息 | POST /cgi-bin/robot/send | 智能机器人发送消息 | ✅       |

#### 智能表格自动化创建的群聊

| API      | URL                                                | 描述               | 完成情况 |
| -------- | -------------------------------------------------- | ------------------ | -------- |
| 创建群聊 | POST /cgi-bin/smartwork/automated/groupchat/create | 智能表格自动化创群 | ✅       |

---

### 应用管理

#### 素材管理

| API              | URL                                        | type参数               | 描述             | 完成情况 | 备注 |
| ---------------- | ------------------------------------------ | ---------------------- | ---------------- | -------- | ---- |
| 上传临时素材     | POST /cgi-bin/media/upload                 | image/voice/video/file | 上传临时素材     | ✅       |      |
| 上传图片         | POST /cgi-bin/media/uploadimg              | -                      | 上传图片         | ✅       |      |
| 获取临时素材     | GET /cgi-bin/media/get?media_id={id}       | -                      | 获取临时素材     | ✅       | 新增 |
| 获取高清语音素材 | GET /cgi-bin/media/get/jssdk?media_id={id} | -                      | 获取高清语音素材 | ✅       |      |
| 异步上传临时素材 | POST /cgi-bin/media/upload_async           | -                      | 异步上传临时素材 | ✅       |      |
| 上传永久素材     | POST /cgi-bin/material/add_material        | -                      | 上传永久素材     | ✅       |      |
| 获取永久素材     | GET /cgi-bin/material/get?media_id={id}    | -                      | 获取永久素材     | ✅       |      |
| 删除永久素材     | POST /cgi-bin/material/del_material        | -                      | 删除永久素材     | ✅       |      |
| 获取素材列表     | POST /cgi-bin/material/batchget            | -                      | 获取素材列表     | ✅       |      |

---

## 连接微信

### 客户联系

#### 企业服务人员管理

| API                              | URL                                               | 描述                             | 完成情况 | 备注 |
| -------------------------------- | ------------------------------------------------- | -------------------------------- | -------- | ---- |
| 获取配置了客户联系功能的成员列表 | GET /cgi-bin/externalcontact/get_follow_user_list | 获取配置了客户联系功能的成员列表 | ✅       |      |
| 获取外部联系人列表               | GET /cgi-bin/externalcontact/list?userid={userid} | 获取外部联系人列表               | ✅       |      |

#### 客户管理

| API              | URL                                                                   | 描述             | 完成情况 | 备注 |
| ---------------- | --------------------------------------------------------------------- | ---------------- | -------- | ---- |
| 获取客户详情     | GET /cgi-bin/externalcontact/get?external_userid={id}&userid={userid} | 获取客户详情     | ✅       |      |
| 批量获取客户详情 | POST /cgi-bin/externalcontact/batchget_by_user                        | 批量获取客户详情 | ✅       | 新增 |
| 修改客户备注信息 | POST /cgi-bin/externalcontact/remark                                  | 修改客户备注信息 | ✅       |      |

#### 客户标签管理

| API              | URL                                             | 描述             | 完成情况 | 备注 |
| ---------------- | ----------------------------------------------- | ---------------- | -------- | ---- |
| 获取企业标签库   | POST /cgi-bin/externalcontact/get_corp_tag_list | 获取企业标签列表 | ✅       |      |
| 添加企业客户标签 | POST /cgi-bin/externalcontact/add_corp_tag      | 添加企业客户标签 | ✅       |      |
| 编辑企业客户标签 | POST /cgi-bin/externalcontact/update_corp_tag   | 编辑企业客户标签 | ✅       |      |
| 删除企业客户标签 | POST /cgi-bin/externalcontact/del_corp_tag      | 删除企业客户标签 | ✅       |      |
| 给客户打标签     | POST /cgi-bin/externalcontact/mark_tag          | 给客户打标签     | ✅       |      |

#### 在职继承

| API                | URL                                             | 描述             | 完成情况 |
| ------------------ | ----------------------------------------------- | ---------------- | -------- |
| 分配在职成员的客户 | POST /cgi-bin/externalcontact/transfer_customer | 分配在职成员客户 | ✅       |
| 查询分配结果       | GET /cgi-bin/externalcontact/transfer_result    | 查询分配结果     | ✅       |

#### 离职继承

| API                | URL                                                    | 描述             | 完成情况 |
| ------------------ | ------------------------------------------------------ | ---------------- | -------- |
| 分配离职成员的客户 | POST /cgi-bin/externalcontact/resign/transfer_customer | 分配离职成员客户 | ✅       |
| 查询离职继承结果   | GET /cgi-bin/externalcontact/resign/transfer_result    | 查询离职继承结果 | ✅       |

#### 客户群管理

| API                  | URL                                                           | 描述               | 完成情况 | 备注 |
| -------------------- | ------------------------------------------------------------- | ------------------ | -------- | ---- |
| 获取客户群列表       | POST /cgi-bin/externalcontact/groupchat/list                  | 获取客户群列表     | ✅       |      |
| 获取客户群详情       | POST /cgi-bin/externalcontact/groupchat/get                   | 获取客户群详情     | ✅       | 新增 |
| 客户群opengid转换    | POST /cgi-bin/externalcontact/groupchat/opengid_to_chatid     | 客户群opengid转换  | ✅       |      |
| 分配在职成员的客户群 | POST /cgi-bin/externalcontact/grouptransfer/transfer_customer | 分配在职成员客户群 | ✅       |      |

#### 联系我与客户入群方式

| API            | URL                                           | 描述           | 完成情况 |
| -------------- | --------------------------------------------- | -------------- | -------- |
| 获取联系我方式 | GET /cgi-bin/externalcontact/get_contact_way  | 获取联系我方式 | ✅       |
| 配置联系我方式 | POST /cgi-bin/externalcontact/add_contact_way | 配置联系我方式 | ✅       |
| 删除联系我方式 | POST /cgi-bin/externalcontact/del_contact_way | 删除联系我方式 | ✅       |

#### 客户朋友圈

| API                | URL                                             | 描述               | 完成情况 |
| ------------------ | ----------------------------------------------- | ------------------ | -------- |
| 获取客户朋友圈列表 | POST /cgi-bin/externalcontact/moment/list       | 获取客户朋友圈列表 | ✅       |
| 获取客户朋友圈内容 | POST /cgi-bin/externalcontact/get_moment_list   | 获取客户朋友圈内容 | ✅       |
| 发布客户朋友圈     | POST /cgi-bin/externalcontact/add_moment_task   | 发布客户朋友圈     | ✅       |

#### 获客助手

| API          | URL                                                   | 描述             | 完成情况 |
| ------------ | ----------------------------------------------------- | ---------------- | -------- |
| 获取获客链接 | POST /cgi-bin/externalcontact/intelligence/get_qrcode | 获取获客助手链接 | ✅       |

#### 消息推送

| API            | URL                                        | 描述           | 完成情况 |
| -------------- | ------------------------------------------ | -------------- | -------- |
| 发送消息给客户 | POST /cgi-bin/externalcontact/message/send | 给客户发送消息 | ✅       |

#### 统计管理

| API              | URL                                                  | 描述             | 完成情况 |
| ---------------- | ---------------------------------------------------- | ---------------- | -------- |
| 获取成员客户数据 | POST /cgi-bin/externalcontact/get_user_behavior_data | 获取成员行为数据 | ✅       |
| 获取企业客户数据 | GET /cgi-bin/externalcontact/get_corp_stat           | 获取企业客户统计 | ✅       |

---

### 微信客服

#### 客服账号管理

| API              | URL                          | 描述             | 完成情况 |
| ---------------- | ---------------------------- | ---------------- | -------- |
| 添加客服账号     | POST /cgi-bin/kf/account/add | 添加客服账号     | ✅       |
| 获取客服账号列表 | GET /cgi-bin/kf/account/list | 获取客服账号列表 | ✅       |
| 获取客服账号详情 | GET /cgi-bin/kf/account/get  | 获取客服账号详情 | ✅       |
| 删除客服账号     | POST /cgi-bin/kf/account/del | 删除客服账号     | ✅       |

#### 接待人员管理

| API              | URL                          | 描述             | 完成情况 |
| ---------------- | ---------------------------- | ---------------- | -------- |
| 添加接待人员     | POST /cgi-bin/kf/serving/add | 添加接待人员     | ✅       |
| 获取接待人员列表 | GET /cgi-bin/kf/serving/list | 获取接待人员列表 | ✅       |
| 删除接待人员     | POST /cgi-bin/kf/serving/del | 删除接待人员     | ✅       |

#### 会话分配与消息收发

| API                      | URL                                  | 描述                 | 完成情况 |
| ------------------------ | ------------------------------------ | -------------------- | -------- |
| 发送消息                 | POST /cgi-bin/kf/send_msg            | 发送客服消息         | ✅       |
| 转接会话（变更会话状态） | POST /cgi-bin/kf/service_state/trans | 变更会话状态实现转接 | ✅       |
| 结束会话（变更会话状态） | POST /cgi-bin/kf/service_state/trans | 变更会话状态结束会话 | ✅       |

#### 其他基础信息获取

| API            | URL                                | 描述                 | 完成情况 |
| -------------- | ---------------------------------- | -------------------- | -------- |
| 获取会话状态   | POST /cgi-bin/kf/service_state/get | 获取当前会话状态     | ✅       |
| 读取消息与事件 | POST /cgi-bin/kf/sync_msg          | 读取近三天消息与事件 | ✅       |

#### 统计管理

| API                          | URL                                 | 描述                 | 完成情况 |
| ---------------------------- | ----------------------------------- | -------------------- | -------- |
| 获取客户数据统计（企业汇总） | POST /cgi-bin/kf/get_corp_statistic | 获取客服企业汇总统计 | ✅       |

#### 机器人管理

| API            | URL                        | 描述           | 完成情况 |
| -------------- | -------------------------- | -------------- | -------- |
| 添加机器人     | POST /cgi-bin/kf/robot/add | 添加机器人     | ✅       |
| 获取机器人列表 | GET /cgi-bin/kf/robot/list | 获取机器人列表 | ✅       |
| 删除机器人     | POST /cgi-bin/kf/robot/del | 删除机器人     | ✅       |

---

## 会话内容存档

| API              | URL                                 | 描述             | 完成情况 |
| ---------------- | ----------------------------------- | ---------------- | -------- |
| 开通会话存档     | POST /cgi-bin/msgaudit/check        | 开通会话存档     | ✅       |
| 获取会话内容     | POST /cgi-bin/msgaudit/get          | 获取会话内容     | ✅       |
| 获取成员会话存档 | POST /cgi-bin/msgaudit/get_per_user | 获取成员会话存档 | ✅       |

---

## 家校沟通

#### 基础接口

| API          | URL                      | 描述         | 完成情况 |
| ------------ | ------------------------ | ------------ | -------- |
| 获取学校列表 | GET /cgi-bin/school/list | 获取学校列表 | ✅       |

#### 学生与家长管理

| API          | URL                                       | 描述         | 完成情况 |
| ------------ | ----------------------------------------- | ------------ | -------- |
| 获取学生列表 | GET /cgi-bin/school/user/list_student     | 获取学生列表 | ✅       |
| 获取家长列表 | GET /cgi-bin/school/user/list_guardian    | 获取家长列表 | ✅       |
| 创建学生     | POST /cgi-bin/school/user/create_student  | 创建学生     | ✅       |
| 创建家长     | POST /cgi-bin/school/user/create_guardian | 创建家长     | ✅       |

#### 部门管理

| API          | URL                                 | 描述         | 完成情况 |
| ------------ | ----------------------------------- | ------------ | -------- |
| 获取家校部门 | GET /cgi-bin/school/department/list | 获取家校部门 | ✅       |

---

## 家校应用

#### 健康上报

| API              | URL                                        | 描述             | 完成情况 |
| ---------------- | ------------------------------------------ | ---------------- | -------- |
| 获取健康上报情况 | POST /cgi-bin/school/health/get_report   | 获取健康上报情况 | ✅       |
| 导出健康上报数据 | POST /cgi-bin/school/health/export_report | 导出健康上报数据 | ✅       |

#### 上课直播

| API      | URL                              | 描述     | 完成情况 |
| -------- | -------------------------------- | -------- | -------- |
| 创建直播 | POST /cgi-bin/school/live/create | 创建直播 | ✅       |
| 结束直播 | POST /cgi-bin/school/live/stop   | 结束直播 | ✅       |

#### 班级收款

| API          | URL                                 | 描述         | 完成情况 |
| ------------ | ----------------------------------- | ------------ | -------- |
| 创建收款     | POST /cgi-bin/school/payment/create | 创建班级收款 | ✅       |
| 获取收款详情 | GET /cgi-bin/school/payment/get     | 获取收款详情 | ✅       |

---

## 政民沟通

#### 配置网格结构

| API          | URL                                | 描述         | 完成情况 |
| ------------ | ---------------------------------- | ------------ | -------- |
| 创建网格     | POST /cgi-bin/report/grid/add     | 创建网格     | ✅       |
| 获取网格列表 | POST /cgi-bin/report/grid/list    | 获取网格列表 | ✅       |

#### 配置事件类别

| API          | URL                                  | 描述         | 完成情况 |
| ------------ | ------------------------------------ | ------------ | -------- |
| 创建事件类别 | POST /cgi-bin/report/grid/add_cata  | 创建事件类别 | ✅       |
| 获取事件类别 | POST /cgi-bin/report/grid/list_cata  | 获取事件类别 | ✅       |

#### 巡查上报

| API          | URL                                    | 描述         | 完成情况 |
| ------------ | -------------------------------------- | ------------ | -------- |
| 巡查上报     | POST /cgi-bin/report/patrol/add        | 巡查上报     | ✅       |
| 获取巡查记录 | POST /cgi-bin/report/patrol/get_order_list | 获取巡查记录 | ✅       |

#### 居民上报

| API          | URL                                  | 描述     | 完成情况 |
| ------------ | ------------------------------------ | -------- | -------- |
| 居民上报     | POST /cgi-bin/report/resident/add     | 居民上报 | ✅       |
| 处理上报     | POST /cgi-bin/report/resident/deal   | 处理上报 | ✅       |

---

## 办公

### 邮件

#### 发送邮件

| API      | URL                     | 描述     | 完成情况 |
| -------- | ----------------------- | -------- | -------- |
| 发送邮件 | POST /cgi-bin/mail/send | 发送邮件 | ✅       |

#### 获取接收的邮件

| API          | URL                    | 描述           | 完成情况 |
| ------------ | ---------------------- | -------------- | -------- |
| 获取收件箱   | GET /cgi-bin/mail/list | 获取收件箱列表 | ✅       |
| 获取邮件详情 | GET /cgi-bin/mail/get  | 获取邮件详情   | ✅       |

#### 管理应用邮箱账号

| API          | URL                                    | 描述         | 完成情况 |
| ------------ | -------------------------------------- | ------------ | -------- |
| 获取应用邮箱 | GET /cgi-bin/mail/get_app_mail_account | 获取应用邮箱 | ✅       |

#### 管理邮件群组

| API          | URL                             | 描述         | 完成情况 |
| ------------ | ------------------------------- | ------------ | -------- |
| 获取群组列表 | GET /cgi-bin/mail/group/list    | 获取群组列表 | ✅       |
| 创建群组     | POST /cgi-bin/mail/group/create | 创建群组     | ✅       |

#### 管理公共邮箱

| API          | URL                                        | 描述         | 完成情况 |
| ------------ | ------------------------------------------ | ------------ | -------- |
| 获取公共邮箱 | GET /cgi-bin/mail/common_mail_account/list | 获取公共邮箱 | ✅       |

#### 高级功能账号管理

| API            | URL                                  | 描述           | 完成情况 |
| -------------- | ------------------------------------ | -------------- | -------- |
| 获取管理员邮箱 | GET /cgi-bin/mail/admin_mailbox/list | 获取管理员邮箱 | ✅       |

#### 其他邮件客户端登录设置

| API            | URL                                 | 描述           | 完成情况 |
| -------------- | ----------------------------------- | -------------- | -------- |
| 获取客户端设置 | GET /cgi-bin/mail/client_config/get | 获取客户端设置 | ✅       |

---

### 文档

#### 管理文档

| API              | URL                                   | 描述                   | 完成情况 |
| ---------------- | ------------------------------------- | ---------------------- | -------- |
| 新建文档         | POST /cgi-bin/wedoc/create_doc        | 新建文档/表格/智能表格 | ✅       |
| 获取文档基础信息 | POST /cgi-bin/wedoc/get_doc_base_info | 获取文档元数据         | ✅       |
| 删除文档         | POST /cgi-bin/wedoc/del_doc           | 删除文档               | ✅       |

#### 管理文档内容

| API          | URL                                       | 描述         | 完成情况 |
| ------------ | ----------------------------------------- | ------------ | -------- |
| 获取文档数据 | POST /cgi-bin/wedoc/document/get          | 获取文档内容 | ✅       |
| 编辑文档内容 | POST /cgi-bin/wedoc/document/batch_update | 修改文档内容 | ✅       |

#### 管理表格内容

| API              | URL                                                  | 描述                 | 完成情况 |
| ---------------- | ---------------------------------------------------- | -------------------- | -------- |
| 获取表格数据     | POST /cgi-bin/wedoc/spreadsheet/get_sheet_range_data | 获取表格指定范围数据 | ✅       |
| 获取表格行列信息 | POST /cgi-bin/wedoc/spreadsheet/get_sheet_properties | 获取工作表属性       | ✅       |
| 编辑表格内容     | POST /cgi-bin/wedoc/spreadsheet/batch_update         | 编辑表格单元格数据   | ✅       |

#### 管理智能表格内容

| API      | URL                                           | 描述                 | 完成情况 |
| -------- | --------------------------------------------- | -------------------- | -------- |
| 查询子表 | POST /cgi-bin/wedoc/smartsheet/get_sheet      | 获取智能表格子表信息 | ✅       |
| 查询记录 | POST /cgi-bin/wedoc/smartsheet/get_records    | 查询智能表格记录     | ✅       |
| 添加记录 | POST /cgi-bin/wedoc/smartsheet/add_records    | 新增智能表格记录     | ✅       |
| 更新记录 | POST /cgi-bin/wedoc/smartsheet/update_records | 更新智能表格记录     | ✅       |

#### 管理收集表

| API                | URL                                    | 描述           | 完成情况 |
| ------------------ | -------------------------------------- | -------------- | -------- |
| 获取收集表信息     | POST /cgi-bin/wedoc/get_form_info      | 获取收集表配置 | ✅       |
| 收集表统计信息查询 | POST /cgi-bin/wedoc/get_form_statistic | 获取收集表统计 | ✅       |
| 读取收集表答案     | POST /cgi-bin/wedoc/get_form_answer    | 读取收集表答案 | ✅       |

#### 接收外部数据到智能表格

| API                   | URL                                            | 描述                   | 完成情况 |
| --------------------- | ---------------------------------------------- | ---------------------- | -------- |
| 通过 Webhook 添加记录 | POST /cgi-bin/wedoc/smartsheet/webhook?key=KEY | 接收外部数据并新增记录 | ✅       |
| 通过 Webhook 更新记录 | POST /cgi-bin/wedoc/smartsheet/webhook?key=KEY | 接收外部数据并更新记录 | ✅       |

#### 高级功能账号管理

| API                | URL                                | 描述               | 完成情况 |
| ------------------ | ---------------------------------- | ------------------ | -------- |
| 获取应用管理员列表 | POST /cgi-bin/agent/get_admin_list | 获取应用管理员列表 | ✅       |

#### 素材管理

| API                  | URL                                  | 描述                   | 完成情况 |
| -------------------- | ------------------------------------ | ---------------------- | -------- |
| 上传文档图片         | POST /cgi-bin/wedoc/image_upload     | 上传文档图片           | ✅       |
| 上传临时素材（文件） | POST /cgi-bin/media/upload?type=file | 上传临时素材供文档引用 | ✅       |

---

### 日程

#### 管理日历

| API          | URL                           | 描述         | 完成情况 | 备注 |
| ------------ | ----------------------------- | ------------ | -------- | ---- |
| 获取日历列表 | GET /cgi-bin/calendar/list    | 获取日历列表 | ✅       |      |
| 创建日历     | POST /cgi-bin/calendar/create | 创建日历     | ✅       | 新增 |
| 更新日历     | POST /cgi-bin/calendar/update | 更新日历     | ✅       | 新增 |
| 删除日历     | POST /cgi-bin/calendar/delete | 删除日历     | ✅       | 新增 |

#### 管理日程

| API          | URL                           | 描述         | 完成情况 |
| ------------ | ----------------------------- | ------------ | -------- |
| 创建日程     | POST /cgi-bin/calendar/add    | 创建日程     | ✅       |
| 获取日程详情 | GET /cgi-bin/calendar/get     | 获取日程详情 | ✅       |
| 更新日程     | POST /cgi-bin/calendar/update | 更新日程     | ✅       |
| 删除日程     | POST /cgi-bin/calendar/delete | 删除日程     | ✅       |

---

### 会议

#### 预约会议基础管理

| API                | URL                                      | 描述               | 完成情况 | 备注 |
| ------------------ | ---------------------------------------- | ------------------ | -------- | ---- |
| 获取成员会议ID列表 | POST /cgi-bin/meeting/get_user_meetingid | 获取成员会议ID列表 | ✅       |      |
| 创建预约会议       | POST /cgi-bin/meeting/create             | 创建预约会议       | ✅       |      |
| 修改预约会议       | POST /cgi-bin/meeting/update             | 修改预约会议       | ✅       |      |
| 取消预约会议       | POST /cgi-bin/meeting/cancel             | 取消预约会议       | ✅       |      |
| 获取会议详情       | POST /cgi-bin/meeting/get_info           | 获取会议详情       | ✅       |      |

#### 会议统计管理

| API          | URL                                 | 描述         | 完成情况 |
| ------------ | ----------------------------------- | ------------ | -------- |
| 获取会议统计 | POST /cgi-bin/meeting/statistic/get | 获取会议统计 | ✅       |

#### 预约会议高级管理

| API      | URL                                   | 描述     | 完成情况 |
| -------- | ------------------------------------- | -------- | -------- |
| 预约会议 | POST /cgi-bin/meeting/advanced/create | 预约会议 | ✅       |
| 修改会议 | POST /cgi-bin/meeting/advanced/update | 修改会议 | ✅       |

#### 会中控制管理

| API      | URL                           | 描述     | 完成情况 |
| -------- | ----------------------------- | -------- | -------- |
| 邀请成员 | POST /cgi-bin/meeting/invite  | 邀请成员 | ✅       |
| 踢出成员 | POST /cgi-bin/meeting/kickout | 踢出成员 | ✅       |

#### 网络研讨会 (Webinar) 管理

| API            | URL                          | 描述           | 完成情况 |
| -------------- | ---------------------------- | -------------- | -------- |
| 创建研讨会     | POST /cgi-bin/webinar/create | 创建网络研讨会 | ✅       |
| 获取研讨会详情 | GET /cgi-bin/webinar/get     | 获取研讨会详情 | ✅       |

#### 电话入会（PSTN）管理

| API          | URL                           | 描述         | 完成情况 |
| ------------ | ----------------------------- | ------------ | -------- |
| 获取PSTN会议 | GET /cgi-bin/meeting/pstn/get | 获取PSTN会议 | ✅       |

#### Rooms会议室管理

| API            | URL                      | 描述           | 完成情况 |
| -------------- | ------------------------ | -------------- | -------- |
| 获取会议室列表 | GET /cgi-bin/rooms/list  | 获取会议室列表 | ✅       |
| 获取会议室详情 | GET /cgi-bin/rooms/get   | 获取会议室详情 | ✅       |
| 预约会议室     | POST /cgi-bin/rooms/book | 预约会议室     | ✅       |

#### 会议室连接器（MRA）管理

| API         | URL                   | 描述        | 完成情况 |
| ----------- | --------------------- | ----------- | -------- |
| 获取MRA列表 | GET /cgi-bin/mra/list | 获取MRA列表 | ✅       |

#### 会议布局和背景管理

| API          | URL                                  | 描述         | 完成情况 |
| ------------ | ------------------------------------ | ------------ | -------- |
| 设置会议背景 | POST /cgi-bin/meeting/background/set | 设置会议背景 | ✅       |

#### 录制管理

| API          | URL                                  | 描述         | 完成情况 |
| ------------ | ------------------------------------ | ------------ | -------- |
| 获取录制文件 | GET /cgi-bin/meeting/record/get      | 获取录制文件 | ✅       |
| 下载录制文件 | GET /cgi-bin/meeting/record/download | 下载录制文件 | ✅       |

#### 高级功能账号管理

| API            | URL                             | 描述           | 完成情况 |
| -------------- | ------------------------------- | -------------- | -------- |
| 获取管理员会议 | GET /cgi-bin/meeting/admin_list | 获取管理员会议 | ✅       |

---

### 微盘

#### 管理空间

| API          | URL                                 | 描述         | 完成情况 |
| ------------ | ----------------------------------- | ------------ | -------- |
| 获取空间信息 | POST /cgi-bin/wedrive/space_info    | 获取空间信息 | ✅       |
| 新建空间     | POST /cgi-bin/wedrive/space_create  | 新建空间     | ✅       |
| 解散空间     | POST /cgi-bin/wedrive/space_dismiss | 解散空间     | ✅       |
| 获取文件列表 | GET /cgi-bin/wedrive/file_list      | 获取文件列表 | ✅       |
| 上传文件     | POST /cgi-bin/wedrive/file_upload   | 上传文件     | ✅       |
| 下载文件     | GET /cgi-bin/wedrive/file_download  | 下载文件     | ✅       |
| 删除文件     | POST /cgi-bin/wedrive/file_del      | 删除文件     | ✅       |

---

### 其他

#### 直播

| API          | URL                       | 描述         | 完成情况 |
| ------------ | ------------------------- | ------------ | -------- |
| 创建直播     | POST /cgi-bin/live/create | 创建直播     | ✅       |
| 获取直播详情 | GET /cgi-bin/live/get     | 获取直播详情 | ✅       |

#### 公费电话

| API          | URL                              | 描述         | 完成情况 |
| ------------ | -------------------------------- | ------------ | -------- |
| 获取通话记录 | POST /cgi-bin/dial/get_dial_record | 获取通话记录 | ✅       |

#### 打卡

| API          | URL                                   | 描述         | 完成情况 |
| ------------ | ------------------------------------- | ------------ | -------- |
| 获取打卡记录 | POST /cgi-bin/checkin/getcheckindata  | 获取打卡记录 | ✅       |
| 获取打卡规则 | GET /cgi-bin/checkin/get_checkin_rule | 获取打卡规则 | ✅       |

#### 审批

| API          | URL                                 | 描述         | 完成情况 |
| ------------ | ----------------------------------- | ------------ | -------- |
| 获取审批模板 | GET /cgi-bin/oa/get_template        | 获取审批模板 | ✅       |
| 提交审批     | POST /cgi-bin/oa/apply_event        | 提交审批     | ✅       |
| 获取审批详情 | GET /cgi-bin/oa/get_approval_detail | 获取审批详情 | ✅       |

#### 汇报

| API          | URL                          | 描述         | 完成情况 |
| ------------ | ---------------------------- | ------------ | -------- |
| 获取汇报记录 | GET /cgi-bin/report/get_list | 获取汇报记录 | ✅       |
| 获取汇报详情 | GET /cgi-bin/report/get      | 获取汇报详情 | ✅       |

#### 人事助手

##### 花名册

| API        | URL                              | 描述       | 完成情况 |
| ---------- | -------------------------------- | ---------- | -------- |
| 获取花名册 | POST /cgi-bin/hr/get_staff_info | 获取花名册 | ✅       |

#### 会议室

| API            | URL                      | 描述           | 完成情况 |
| -------------- | ------------------------ | -------------- | -------- |
| 获取会议室列表 | GET /cgi-bin/rooms/list  | 获取会议室列表 | ✅       |
| 预约会议室     | POST /cgi-bin/rooms/book | 预约会议室     | ✅       |

---

