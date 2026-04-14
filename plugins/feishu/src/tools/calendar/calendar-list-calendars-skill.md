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
- `query_params_json`：查询参数 JSON 字符串（可选），可含 `user_id_type`、`page_size`、`page_token`、`sync_token` 等。
- 本接口无请求体参数（无需 `body_json`）。

## Tool Input 示例

### 示例1（成功，可直接调试）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{\"user_id_type\":\"open_id\",\"page_size\":20}"
  }
}
```

### 示例2（错误示例）

```json
{
  "parameters": {
    "credential_id": "<your-feishu-credential-id>",
    "query_params_json": "{bad-json"
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
