# Atomemo Plugin - feishu

用于在 Atomemo 中对接飞书能力的插件，当前提供：

- 凭证：`feishu-app-credential`（`app_id` + `app_secret`）
- 工具：`send_feishu_webhook_message`（发送飞书群机器人文本消息）
- 工具：`send_feishu_app_text_message`（通过飞书应用向 `open_id` 发送文本消息）

## 开发

```bash
bun install
bun run build
```

## 本地调试

```bash
atomemo plugin refresh-key
bun run ./dist
```