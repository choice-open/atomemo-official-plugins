# 钉钉 Atomemo 插件

通过一个企业内部应用凭据，在 Atomemo 中使用钉钉能力。

## 包含功能

- 身份验证：获取应用 access token
- 用户：获取用户详情、通过手机号获取用户、搜索用户
- 审批：获取实例详情、添加评论、获取附件下载信息、获取实例 ID 列表、获取审批空间信息、更新实例、获取用户可见模板
- 机器人：批量发送单聊机器人消息、发送 DING、撤回 DING、下载机器人消息文件



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
