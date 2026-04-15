# 查询日历列表 Tool Documentation

## Tool

- **Name**: `feishu-calendar_list_calendars`
- **Module**: `calendar`
- **Method**: `GET`
- **Path**: `/open-apis/calendar/v4/calendars`
- **Purpose**: 获取当前身份可见的日历列表。
- **API Doc**: https://open.feishu.cn/document/server-docs/calendar-v4/calendar/list

## 参数说明

- `credential_id`：飞书应用凭据 ID（必填）。
- `page_size`：分页大小（可选）。
- `page_token`：分页游标（可选）。
- `sync_token`：增量同步 token（可选）。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "page_size": "50"
  }
}
```

## Tool Output 示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```
