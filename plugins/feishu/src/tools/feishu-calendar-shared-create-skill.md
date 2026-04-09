# Feishu Calendar Shared Create Tool Documentation

## Tool

- **Name**: `feishu_calendar_shared_create`
- **Skill**: `calendar.shared.create`
- **SDK**: `client.calendar.calendar.create`
- **Purpose**: 调用 `calendar.calendar.create` 创建共享日历。

## Parameters

| Name | Type | Required | UI Component | Description | Example |
| --- | --- | --- | --- | --- | --- |
| `summary` | `string` | `true` | `input` | 日历标题（data.summary）。 | "团队日历" |
| `credentialId` | `credential_id` | `true` | `credential-select` | 飞书应用凭证，绑定 `feishu-app-credential`。 | — |
| `payload_json` | `string` | `false` | `textarea` | 完整 SDK payload（填写则覆盖 params/path/data JSON）。 | "{\"params\":{},\"path\":{},\"data\":{}}" |
| `params_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `params`。 | "{\"user_id_type\":\"open_id\"}" |
| `path_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `path`。 | "{\"user_id\":\"ou_xxx\"}" |
| `data_json` | `string` | `false` | `textarea` | 合并到 SDK 请求 `data`。 | "{\"name\":\"张三\"}" |

## Tool Input Example

### Example 1: Create simple shared calendar

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "summary": "团队日历"
  }
}
```

### Example 2: Create calendar with description

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "data_json": "{\"summary\":\"项目日历\",\"description\":\"用于共享项目进度\"}"
  }
}
```

### Example 3: Using payload_json directly

```json
{
  "parameters": {
    "credentialId": "your_credential_id",
    "payload_json": "{\"data\":{\"summary\":\"部门日历\",\"description\":\"部门日程共享\"}}"
  }
}
```

## Tool Output Example

### Success Response

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_shared_create",
  "tool": "feishu_calendar_shared_create",
  "payload_raw": "{\"data\":{\"summary\":\"团队日历\"}}",
  "response_raw": "{\"code\":0,\"msg\":\"success\",\"data\":{\"calendar_id\":\"cal_xxx\"}}"
}
```

### Error Response - Duplicate calendar name

```json
{
  "message": "Feishu API invoked successfully: feishu_calendar_shared_create",
  "tool": "feishu_calendar_shared_create",
  "payload_raw": "{\"data\":{\"summary\":\"已存在的日历\"}}",
  "response_raw": "{\"code\":99991420,\"msg\":\"calendar already exists\",\"data\":{}}"
}
```