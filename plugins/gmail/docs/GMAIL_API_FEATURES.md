# Gmail API 功能清单

> 基于 [Google Gmail API 官方文档](https://developers.google.com/workspace/gmail/api/reference/rest) 整理  
> 参考来源：https://developers.google.com/workspace/gmail

**图例**：✅ = 已实现为 Atomemo Tool | ❌ = 未实现

## 概述

Gmail API 允许开发者以编程方式查看和管理 Gmail 邮箱数据，包括线程、邮件和标签等。

- **服务端点**：`https://gmail.googleapis.com`
- **发现文档**：https://gmail.googleapis.com/$discovery/rest?version=v1

---

## 一、用户 (users)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| getProfile | GET | 获取当前用户的 Gmail 个人资料 | ✅ |
| watch | POST | 为用户邮箱设置或更新推送通知监视 | ✅ |
| stop | POST | 停止接收指定用户邮箱的推送通知 | ✅ |

---

## 二、草稿 (users.drafts)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建新草稿（带 DRAFT 标签） | ✅ |
| delete | DELETE | 立即永久删除指定草稿 | ✅ |
| get | GET | 获取指定草稿 | ✅ |
| list | GET | 列出用户邮箱中的草稿 | ✅ |
| send | POST | 将指定草稿发送给收件人（To/Cc/Bcc） | ✅ |
| update | PUT | 替换草稿内容 | ✅ |

---

## 三、历史记录 (users.history)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| list | GET | 列出指定邮箱的所有变更历史 | ✅ |

---

## 四、标签 (users.labels)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建新标签 | ✅ |
| delete | DELETE | 立即永久删除指定标签，并从所有邮件和线程中移除 | ✅ |
| get | GET | 获取指定标签 | ✅ |
| list | GET | 列出用户邮箱中的所有标签 | ✅ |
| patch | PATCH | 部分更新指定标签 | ❌ |
| update | PUT | 更新指定标签 | ✅ |

---

## 五、邮件 (users.messages)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| batchDelete | POST | 根据邮件 ID 批量删除多条邮件 | ✅ |
| batchModify | POST | 批量修改指定邮件的标签 | ✅ |
| delete | DELETE | 立即永久删除指定邮件 | ✅ |
| get | GET | 获取指定邮件 | ✅ |
| import | POST | 将邮件导入用户邮箱（类似 SMTP 接收，含扫描和分类） | ❌ |
| insert | POST | 直接将邮件插入用户邮箱（类似 IMAP APPEND，绕过大部分扫描和分类） | ❌ |
| list | GET | 列出用户邮箱中的邮件 | ✅ |
| modify | POST | 修改指定邮件的标签 | ✅ |
| send | POST | 将指定邮件发送给收件人（To/Cc/Bcc） | ✅ |
| trash | POST | 将指定邮件移至垃圾箱 | ✅ |
| untrash | POST | 将指定邮件从垃圾箱移回 | ✅ |

---

## 六、邮件附件 (users.messages.attachments)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| get | GET | 获取指定邮件的附件 | ✅ |

---

## 七、线程 (users.threads)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| delete | DELETE | 立即永久删除指定线程 | ✅ |
| get | GET | 获取指定线程 | ✅ |
| list | GET | 列出用户邮箱中的线程 | ✅ |
| modify | POST | 修改应用于线程的标签 | ✅ |
| trash | POST | 将指定线程移至垃圾箱 | ✅ |
| untrash | POST | 将指定线程从垃圾箱移回 | ✅ |

---

## 八、用户设置 (users.settings)

### 8.1 基础设置

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| getAutoForwarding | GET | 获取指定账号的自动转发设置 | ❌ |
| updateAutoForwarding | PUT | 更新指定账号的自动转发设置 | ❌ |
| getImap | GET | 获取 IMAP 设置 | ❌ |
| updateImap | PUT | 更新 IMAP 设置 | ❌ |
| getLanguage | GET | 获取语言设置 | ❌ |
| updateLanguage | PUT | 更新语言设置 | ❌ |
| getPop | GET | 获取 POP 设置 | ❌ |
| updatePop | PUT | 更新 POP 设置 | ❌ |
| getVacation | GET | 获取假期自动回复设置 | ✅ |
| updateVacation | PUT | 更新假期自动回复设置 | ✅ |

### 8.2 委派 (users.settings.delegates)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 添加委派（验证状态直接设为 accepted，无需验证邮件） | ❌ |
| delete | DELETE | 移除指定委派并撤销验证 | ❌ |
| get | GET | 获取指定委派 | ❌ |
| list | GET | 列出指定账号的委派列表 | ✅ |

### 8.3 过滤器 (users.settings.filters)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建过滤器 | ❌ |
| delete | DELETE | 立即永久删除指定过滤器 | ❌ |
| get | GET | 获取指定过滤器 | ❌ |
| list | GET | 列出用户的邮件过滤器 | ✅ |

### 8.4 转发地址 (users.settings.forwardingAddresses)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建转发地址 | ❌ |
| delete | DELETE | 删除指定转发地址并撤销验证 | ❌ |
| get | GET | 获取指定转发地址 | ❌ |
| list | GET | 列出指定账号的转发地址 | ✅ |

### 8.5 发件人别名 (users.settings.sendAs)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建自定义「发件人」别名 | ❌ |
| delete | DELETE | 删除指定发件人别名 | ❌ |
| get | GET | 获取指定发件人别名 | ❌ |
| list | GET | 列出账号的发件人别名 | ✅ |
| patch | PATCH | 部分更新指定发件人别名 | ❌ |
| update | PUT | 更新发件人别名 | ❌ |
| verify | POST | 向指定发件人别名地址发送验证邮件 | ❌ |

### 8.6 S/MIME 配置 (users.settings.sendAs.smimeInfo)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| delete | DELETE | 删除指定发件人别名的 S/MIME 配置 | ❌ |
| get | GET | 获取指定发件人别名的 S/MIME 配置 | ❌ |
| insert | POST | 为指定发件人别名插入（上传）S/MIME 配置 | ❌ |
| list | GET | 列出指定发件人别名的 S/MIME 配置 | ❌ |
| setDefault | POST | 设置指定发件人别名的默认 S/MIME 配置 | ❌ |

### 8.7 客户端加密 - 身份 (users.settings.cse.identities)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建并配置授权从用户账号发送邮件的客户端加密身份 | ❌ |
| delete | DELETE | 删除客户端加密身份 | ❌ |
| get | GET | 获取客户端加密身份配置 | ❌ |
| list | GET | 列出已认证用户的客户端加密身份 | ❌ |
| patch | PATCH | 将不同密钥对关联到现有客户端加密身份 | ❌ |

### 8.8 客户端加密 - 密钥对 (users.settings.cse.keypairs)

| 方法 | HTTP | 说明 | 已实现 |
|------|------|------|--------|
| create | POST | 创建并上传客户端加密 S/MIME 公钥证书链和私钥元数据 | ❌ |
| disable | POST | 停用客户端加密密钥对 | ❌ |
| enable | POST | 启用已停用的客户端加密密钥对 | ❌ |
| get | GET | 获取现有客户端加密密钥对 | ❌ |
| list | GET | 列出已认证用户的客户端加密密钥对 | ❌ |
| obliterate | POST | 立即永久删除客户端加密密钥对 | ❌ |

---

## 九、功能分类汇总

### 邮件管理
- ✅ 创建、发送、管理草稿（不含 update）
- ✅ 获取、修改、删除、批量删除邮件
- ✅ 批量修改邮件标签
- ❌ 导入/插入邮件
- ✅ 移至垃圾箱/从垃圾箱恢复
- ✅ 获取邮件附件

### 邮箱组织
- ✅ 创建、更新、删除标签（不含 patch）
- ✅ 管理线程（获取、列表、修改标签、移至垃圾箱）
- ✅ 访问邮箱历史，追踪变更

### 推送通知
- ✅ 设置或更新用户邮箱的推送通知监视
- ✅ 停止推送通知

### 设置管理
- ❌ 自动转发
- ❌ IMAP/POP 设置
- ❌ 语言设置
- ✅ 假期自动回复
- ✅ 委派（仅 list）
- ✅ 过滤器（仅 list）
- ✅ 转发地址（仅 list）
- ✅ 发件人别名（仅 list）
- ❌ S/MIME 配置
- ❌ 客户端加密（CSE）身份与密钥对

---

## 十、相关 Google 文档链接

- [Gmail API 指南](https://developers.google.com/workspace/gmail/api/guides)
- [Gmail API REST 参考](https://developers.google.com/workspace/gmail/api/reference/rest)
- [Gmail API 发布说明](https://developers.google.com/workspace/gmail/docs/release-notes)
- [Gmail API 客户端库](https://developers.google.com/workspace/gmail/api/downloads)
- [发送邮件指南](https://developers.google.com/workspace/gmail/api/guides/sending)
- [Postmaster Tools API](https://developers.google.com/workspace/gmail/postmaster) - 批量邮件指标与监控
- [AMP for Gmail](https://developers.google.com/workspace/gmail/ampemail) - 动态交互邮件内容
- [Gmail Add-ons](https://developers.google.com/workspace/add-ons/gmail) - Gmail 插件开发
