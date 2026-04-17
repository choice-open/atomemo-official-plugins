# 创建日历 (`wechat-work-create-calendar`)

调用 `POST /cgi-bin/oa/calendar/add` 通过应用在企业内创建一个日历。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| calendar | 是 | 日历信息 |
| calendar.summary | 是 | 日历标题。1~128字符 |
| calendar.color | 是 | 日历颜色，RGB颜色编码16进制，如 "#0000FF" |
| calendar.description | 否 | 日历描述。0~512字符 |
| calendar.admins | 否 | 管理员userid列表，最多3人，必须在通知范围成员中 |
| calendar.set_as_default | 否 | 是否设为默认日历。0-否；1-是。默认为0 |
| calendar.is_public | 否 | 是否公共日历。0-否；1-是 |
| calendar.public_range | 否 | 公开范围（仅公共日历有效）|
| calendar.public_range.userids | 否 | 公开的成员列表，最多1000个 |
| calendar.public_range.partyids | 否 | 公开的部门列表，最多100个 |
| calendar.is_corp_calendar | 否 | 是否全员日历。0-否；1-是 |
| calendar.shares | 否 | 通知范围成员列表，最多2000人 |
| calendar.shares[].userid | 是 | 成员的id |
| calendar.shares[].permission | 否 | 权限：1-可查看 3-仅查看闲忙状态 |
| agentid | 否 | 仅旧的第三方多应用套件需要填 |

## 请求示例

```json
{
    "calendar": {
        "summary": "测试日历",
        "color": "#FF3030",
        "description": "这是一个测试日历",
        "shares": [
            { "userid": "userid1", "permission": 1 }
        ]
    }
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 错误码 |
| errmsg | 错误码说明 |
| cal_id | 日历ID |
| fail_result | 无效的输入内容 |
| fail_result.shares | 无效的日历通知范围成员列表 |
