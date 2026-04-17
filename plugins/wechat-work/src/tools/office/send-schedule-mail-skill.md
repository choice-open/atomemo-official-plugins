# 发送日程邮件 (`wechat-work-send-schedule-mail`)

调用 `POST /cgi-bin/exmail/app/compose_send` 通过企业微信邮件服务发送日程邮件。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| to | 是 | obj | 收件人，to.emails 和 to.userids 至少传一个 |
| to.emails | 否 | string[] | 收件人，邮箱地址 |
| to.userids | 否 | string[] | 收件人，企业内成员的userid |
| cc | 否 | obj | 抄送 |
| cc.emails | 否 | string[] | 抄送人，邮箱地址 |
| cc.userids | 否 | string[] | 抄送人，企业内成员的userid |
| bcc | 否 | obj | 密送 |
| bcc.emails | 否 | string[] | 密送人，邮箱地址 |
| bcc.userids | 否 | string[] | 密送人，企业内成员的userid |
| subject | 是 | string | 邮件标题，同时也是日程标题 |
| content | 是 | string | 邮件正文，也是日程描述 |
| attachment_list | 否 | obj[] | 附件相关 |
| attachment_list[].file_name | 是 | string | 文件名 |
| attachment_list[].content | 是 | string | 文件内容（base64编码），所有附件加正文不超过50M，附件不超过200个 |
| content_type | 否 | string | 内容类型 html，text（默认是html） |
| schedule | 是 | obj | 日程相关，发日程邮件必填 |
| schedule.schedule_id | 否 | string | 日程ID，修改/取消日程必须带上 |
| schedule.method | 否 | string | 日程方法：request-请求（默认），cancel-取消日程 |
| schedule.location | 否 | string | 地点 |
| schedule.start_time | 是 | int | 日程开始时间，Unix时间戳 |
| schedule.end_time | 是 | int | 日程结束时间，Unix时间戳 |
| schedule.reminders | 否 | obj | 重复和提醒相关 |
| schedule.reminders.is_remind | 否 | int | 是否有提醒 0-不提醒 1-提醒 |
| schedule.reminders.remind_before_event_mins | 否 | int | 日程开始前多少分钟提醒 |
| schedule.reminders.timezone | 否 | int | 时区，UTC偏移量，默认东八区，取值-12~+12 |
| schedule.reminders.is_repeat | 否 | int | 是否重复 0-否 1-是 |
| schedule.reminders.is_custom_repeat | 否 | int | 是否自定义重复 0-否 1-是 |
| schedule.reminders.repeat_type | 否 | int | 重复类型：0-每日 1-每周 2-每月 5-每年 |
| schedule.reminders.repeat_interval | 否 | int | 重复间隔 |
| schedule.reminders.repeat_day_of_week | 否 | int[] | 每周周几重复，取值1~7 |
| schedule.reminders.repeat_day_of_month | 否 | int[] | 每月哪几天重复，取值1~31 |
| schedule.reminders.repeat_month_of_year | 否 | int[] | 每年哪几个月重复，取值1~12 |
| schedule.reminders.repeat_until | 否 | int | 重复结束时刻，Unix时间戳 |
| schedule.schedule_admins | 否 | obj | 管理员 { userids: string[] }，上限3个 |
| enable_id_trans | 否 | uint32 | 是否开启id转译，0-否 1-是，默认0 |

## 请求示例

```json
{
    "to": {
        "emails": ["user@example.com"],
        "userids": ["william"]
    },
    "subject": "日程标题",
    "content": "日程描述",
    "schedule": {
        "method": "request",
        "location": "会议室A",
        "start_time": 1669278600,
        "end_time": 1669282200,
        "reminders": {
            "is_remind": 1,
            "remind_before_event_mins": 15
        }
    }
}
```

## 输出

返回 `{ errcode: 0, errmsg: "ok" }`。
