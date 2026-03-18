# Google Calendar Atomemo Plugin

将 Google Calendar 集成到 Atomemo 工作流中。

## 功能

- **列出日历**：获取用户日历列表
- **列出事件**：按时间范围列出日历事件
- **创建事件**：在日历上创建新事件
- **获取事件**：根据 ID 获取单个事件
- **更新事件**：更新现有事件
- **删除事件**：删除日历事件

## 凭证配置

本插件使用 Google OAuth2 凭证，采用 Atomemo 内置 OAuth 流程，用户无需手动获取 Token。

### 配置步骤

1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建或选择项目
2. 启用 **Google Calendar API**
3. 在「凭据」中创建 **OAuth 2.0 客户端 ID**
   - 应用类型：Web 应用 或 桌面应用
   - 若为 Web 应用，需配置 Atomemo 提供的**授权重定向 URI**
4. 在 Atomemo 中创建「Google 日历 OAuth2」凭证
5. 填入 **Client ID** 和 **Client Secret**
6. 点击「授权」按钮，按提示完成 Google 账号授权

## 开发

```bash
bun install
bun run build
bun run ./dist    # 连接 Plugin Hub 进行测试
```

## 测试

```bash
bun run test
```
