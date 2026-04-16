# 钉钉 Atomemo 插件

[钉钉](https://www.dingtalk.com/)是阿里巴巴集团旗下的企业通信与协同平台，在国内被广泛用于即时通讯、视频会议、审批流程和企业管理。

本插件通过一个企业内部应用凭证将 Atomemo 与[钉钉开放平台](https://open.dingtalk.com/)对接，配置完成后即可在 Atomemo 工作流中自动化完成用户查询、审批流程驱动和机器人消息推送等任务。

## 工具列表

### 身份验证

| 工具名称 | 说明 | API 参考 |
|---------|------|---------|
| **获取应用 Access Token** | 使用所选凭证获取当前钉钉应用的 access token，可用于调试或将 token 传给下游工具。 | [获取企业内部应用 access token](https://open.dingtalk.com/document/orgapp/obtain-orgapp-token) |

### 用户

| 工具名称 | 说明 | API 参考 |
|---------|------|---------|
| **获取用户详情** | 根据 `userId` 获取用户完整资料（姓名、头像、部门列表、角色等）。 | [查询用户详情](https://open.dingtalk.com/document/development/query-user-details) |
| **通过手机号获取用户** | 根据手机号查询用户的 `userId`，适用于只有手机号的场景。 | [根据手机号查询 userId](https://open.dingtalk.com/document/development/query-users-by-phone-number) |
| **搜索用户** | 按姓名、拼音或英文名搜索组织内用户，支持分页和精确匹配模式。 | [通讯录搜索用户](https://open.dingtalk.com/document/development/address-book-search-user-id) |

### 审批 / 工作流

| 工具名称 | 说明 | API 参考 |
|---------|------|---------|
| **获取审批实例** | 获取审批实例完整详情，包括表单字段值、操作历史记录和当前任务节点。 | [获取审批实例详情](https://open.dingtalk.com/document/orgapp/obtains-approval-instance-details) |
| **添加审批评论** | 为运行中的审批实例添加文字或图片评论，评论人默认使用凭证中配置的 `user_union_id`。 | [添加审批实例评论](https://open.dingtalk.com/document/orgapp/add-process-instance-comment) |
| **处理审批任务** | 同意（`agree`）或拒绝（`refuse`）某个审批任务节点。钉钉要求按审批节点顺序依次处理。 | [执行审批任务](https://open.dingtalk.com/document/orgapp/execute-process-task) |
| **获取审批附件下载信息** | 获取审批表单附件或评论附件的带时效下载链接。 | [下载审批附件](https://open.dingtalk.com/document/orgapp/download-approval-attachments) |
| **获取审批实例 ID 列表** | 按流程编码查询审批实例 ID 列表，支持时间范围、发起人和状态（`RUNNING`、`TERMINATED`、`COMPLETED`）过滤。 | [获取审批实例 ID 列表](https://open.dingtalk.com/document/development/obtain-an-approval-list-of-instance-ids) |
| **获取审批钉盘空间信息** | 获取用于存储审批附件的钉盘空间 ID（OA 高级版专享功能），上传审批附件前需先调用此接口。 | [获取审批钉盘空间信息](https://open.dingtalk.com/document/development/api-premiumgetattachmentspace) |
| **获取用户可见审批模板** | 分页获取指定用户可见的审批表单模板列表，返回流程编码和模板元数据。 | [获取可见审批表单列表](https://open.dingtalk.com/document/orgapp/obtain-the-list-of-approval-forms-visible-to-the-specified-user) |

### 机器人

| 工具名称 | 说明 | API 参考 |
|---------|------|---------|
| **批量发送机器人消息** | 批量向最多 20 名用户发送人与机器人单聊消息，支持文本、链接、Markdown、操作卡片（单按钮 / 竖排按钮 / 横排按钮）和信息流卡片格式。 | [批量发送单聊消息](https://open.dingtalk.com/document/orgapp/batch-send-a-message-to-a-user-session) |
| **发送群机器人消息** | 向指定 `openConversationId` 的钉钉群聊发送机器人消息，支持与批量发送相同的消息类型。 | [机器人发送群聊消息](https://open.dingtalk.com/document/orgapp/the-robot-sends-a-group-message) |

说明：对于**发送群机器人消息**，建议将 Atomemo 内置的 webhook 触发器节点与该工具节点配合使用，这样可以从钉钉传入事件中拿到可信的 `openConversationId`。

## 凭据

配置一个 `dingtalk-app` 凭据，包含以下字段：

- `corp_id`
- `client_id`
- `client_secret`
- `user_union_id`：可选，作为审批相关操作的默认操作人 unionId

## 身份验证配置

本插件使用钉钉开放平台的企业内部应用认证方式。你需要准备以下信息：

### 1. 创建钉钉企业内部应用

1. 登录 [钉钉开放平台开发者后台](https://open-dev.dingtalk.com/)
2. 创建企业内部应用
3. 在基础信息 - 凭证与基础信息 - 应用凭证 中，获取应用的 `Client ID` 和 `Client Secret`

### 2. 配置 Atomemo 凭据

在 Atomemo 中创建 `dingtalk-app` 凭据：

- **Corp ID**：你的钉钉应用运行的组织 ID，可在 [钉钉开放平台开发者后台](https://open-dev.dingtalk.com/) 获取
- **Client ID**：你的钉钉应用 Client ID
- **Client Secret**：你的钉钉应用 Client Secret
- **操作人 unionId（可选）**：如果已经拿到常用操作人的 unionId，可在此填写，工具会默认复用；也可留空，后续在工具参数中按需覆盖

### 3. 权限配置

确保你的钉钉应用具有相应的权限，在 应用详情 - 开发配置 - 权限管理 中进行配置。
具体权限请详细阅读官方相关 API 文档或者运行时的报错信息。

详细的身份验证流程请参考：[钉钉 API 调用指南](https://open.dingtalk.com/document/development/how-to-call-apis) 和 [获取访问令牌](https://open.dingtalk.com/document/development/api-gettoken)。

## 开发

```bash
bun install
bun run typecheck
bun run test
bun run build
```
