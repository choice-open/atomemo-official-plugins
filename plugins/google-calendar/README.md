# Google Calendar Atomemo Plugin

将 Google Calendar 集成到 Atomemo 工作流中。

## 功能

### Events（事件）API
- **列出事件**：按时间范围列出日历事件
- **创建事件**：在日历上创建新事件
- **获取事件**：根据 ID 获取单个事件
- **更新事件**：更新现有事件
- **删除事件**：删除日历事件
- **列出事件实例**：列出重复事件的所有实例
- **移动事件**：将事件移动到另一日历
- **快速添加事件**：根据自然语言文本创建事件（如「明天下午2点开会」）

### Calendars（日历）API
- **获取日历**：获取日历元数据
- **创建日历**：创建新的次要日历
- **更新日历**：更新日历元数据
- **删除日历**：删除次要日历
- **清空日历**：删除日历中的所有事件

### CalendarList（日历列表）API
- **列出日历**：获取用户日历列表
- **获取日历列表项**：从用户日历列表中获取单个日历
- **添加日历到列表**：将现有日历添加到用户日历列表
- **更新日历列表项**：更新用户特定的日历列表属性（颜色、显示名等）
- **从列表移除日历**：从用户日历列表中移除日历

### Settings（设置）API
- **获取设置**：获取单个用户设置（如 timezone、locale）
- **列出设置**：列出所有用户设置

### Colors（颜色）API
- **获取颜色**：获取日历和事件的颜色定义

### FreeBusy（忙闲）API
- **查询忙闲**：查询指定时间范围内日历的忙闲状态

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
