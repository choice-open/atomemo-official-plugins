# 发送会议邮件 (`wechat-work-send-meeting-mail`)

调用 `POST /cgi-bin/exmail/app/compose_send` 通过企业微信邮件服务发送会议邮件。

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
| subject | 是 | string | 邮件标题，同时也是会议标题 |
| content | 是 | string | 邮件正文，同时是会议描述 |
| attachment_list | 否 | obj[] | 附件相关 |
| attachment_list[].file_name | 是 | string | 文件名 |
| attachment_list[].content | 是 | string | 文件内容（base64编码），所有附件加正文不超过50M，附件不超过200个 |
| content_type | 否 | string | 内容类型 html，text（默认是html） |
| schedule | 是 | obj | 会议相关数据，发会议邮件必填 |
| schedule.schedule_id | 否 | string | 会议ID，修改/取消会议必须带上 |
| schedule.method | 否 | string | 会议方法：request-请求（默认），cancel-取消会议 |
| schedule.location | 否 | string | 地点 |
| schedule.start_time | 是 | int | 会议开始时间，Unix时间戳 |
| schedule.end_time | 是 | int | 会议结束时间，Unix时间戳 |
| schedule.reminders | 否 | obj | 重复和提醒相关 |
| schedule.reminders.is_remind | 否 | int | 是否有提醒 0-不提醒 1-提醒 |
| schedule.reminders.remind_before_event_mins | 否 | int | 会议开始前多少分钟提醒 |
| schedule.reminders.timezone | 否 | int | 时区，UTC偏移量，默认东八区 |
| schedule.reminders.is_repeat | 否 | int | 是否重复 0-否 1-是 |
| schedule.reminders.repeat_type | 否 | int | 重复类型：0-每日 1-每周 2-每月 5-每年 |
| schedule.reminders.repeat_until | 否 | int | 重复结束时刻，Unix时间戳 |
| meeting | 是 | obj | 会议相关，会议邮件必填 |
| meeting.hosts | 否 | obj | 会议主持人 { userids: string[] }，最多10个 |
| meeting.meeting_admins | 是 | obj | 会议管理员 { userids: string[] }，仅可指定1人 |
| meeting.option | 否 | obj | 会议设置 |
| meeting.option.password | 否 | string | 入会密码，4-6位纯数字 |
| meeting.option.auto_record | 否 | int | 是否自动录制 0-未开启 1-本地录制 2-云录制 |
| meeting.option.enable_waiting_room | 否 | bool | 是否开启等候室 |
| meeting.option.allow_enter_before_host | 否 | bool | 是否允许成员在主持人进会前加入 |
| meeting.option.enter_restraint | 否 | int | 限制入会 0-所有人 2-仅企业内部 |
| meeting.option.enable_screen_watermark | 否 | bool | 是否开启屏幕水印 |
| meeting.option.enable_enter_mute | 否 | int | 入会静音 0-关闭 1-开启 2-超6人自动 |
| meeting.option.remind_scope | 否 | int | 开始时提醒 1-不提醒 2-仅主持人 3-所有成员 |
| meeting.option.water_mark_type | 否 | int | 水印类型 0-单排 1-多排 |
| enable_id_trans | 否 | uint32 | 是否开启id转译，0-否 1-是，默认0 |

## 请求示例

```json
{
    "to": {
        "emails": ["user@example.com"],
        "userids": ["william"]
    },
    "subject": "会议标题",
    "content": "会议描述",
    "schedule": {
        "method": "request",
        "location": "会议室B",
        "start_time": 1669278600,
        "end_time": 1669282200
    },
    "meeting": {
        "meeting_admins": { "userids": ["zoro"] },
        "option": {
            "password": "123456",
            "enable_waiting_room": true
        }
    }
}
```

## 输出

返回 `{ errcode: 0, errmsg: "ok" }`。
