# 更新日历 (`wechat-work-update-calendar`)

调用 `POST /cgi-bin/oa/calendar/update` 修改指定日历的信息。注意，更新操作是覆盖式，而不是增量式。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| skip_public_range | 否 | 是否不更新可订阅范围。0-否（默认）；1-是 |
| calendar | 是 | 日历信息 |
| calendar.cal_id | 是 | 日历ID |
| calendar.summary | 是 | 日历标题。1~128字符 |
| calendar.color | 是 | 日历颜色，RGB颜色编码16进制，如 "#0000FF" |
| calendar.description | 否 | 日历描述。0~512字符 |
| calendar.admins | 否 | 管理员userid列表，最多3人 |
| calendar.public_range | 否 | 公开范围（仅公共日历有效） |
| calendar.public_range.userids | 否 | 公开的成员列表，最多1000个 |
| calendar.public_range.partyids | 否 | 公开的部门列表，最多100个 |
| calendar.shares | 否 | 通知范围成员列表，最多2000人 |
| calendar.shares[].userid | 是 | 成员的id |
| calendar.shares[].permission | 否 | 权限：1-可查看 3-仅查看闲忙状态 |

## 请求示例

```json
{
    "calendar": {
        "cal_id": "wcjgewCwAAqeJcPI1d8Pwbjt7nttzAAA",
        "summary": "更新后的日历标题",
        "color": "#0000FF",
        "description": "更新后的描述",
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
| fail_result | 无效的输入内容 |
| fail_result.shares | 无效的日历通知范围成员列表 |
