# 创建日程 (`wechat-work-create-event`)

调用 `POST /cgi-bin/oa/schedule/add` 在企业微信日历中创建一个日程。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| schedule | 是 | obj | 日程信息 |
| schedule.admins | 否 | string[] | 日程管理员userid列表，管理员必须在共享成员列表中，最多3人 |
| schedule.start_time | 是 | uint32 | 日程开始时间，Unix时间戳 |
| schedule.end_time | 是 | uint32 | 日程结束时间，Unix时间戳 |
| schedule.is_whole_day | 否 | uint32 | 是否设置为全天日程。0-否；1-是 |
| schedule.attendees | 否 | obj[] | 日程参与者列表，最多1000人 |
| schedule.attendees.userid | 是 | string | 日程参与者ID，不多于64字节 |
| schedule.summary | 否 | string | 日程标题，0~128字符，不填默认显示为"新建事件" |
| schedule.description | 否 | string | 日程描述，不多于1000个字符 |
| schedule.reminders | 否 | obj | 提醒相关信息 |
| schedule.reminders.is_remind | 否 | int32 | 是否需要提醒。0-否；1-是 |
| schedule.reminders.remind_before_event_secs | 否 | uint32 | 日程开始前多少秒提醒，is_remind=1时有效。支持：0/300/900/3600/86400 |
| schedule.reminders.remind_time_diffs | 否 | int32[] | 提醒时间与开始时间差值，可指定多个，与remind_before_event_secs仅一个生效 |
| schedule.reminders.is_repeat | 否 | int32 | 是否重复日程。0-否；1-是 |
| schedule.reminders.repeat_type | 否 | uint32 | 重复类型，is_repeat=1时有效。0-每日；1-每周；2-每月；5-每年；7-工作日 |
| schedule.reminders.repeat_until | 否 | uint32 | 重复结束时刻，Unix时间戳，不填或0表示一直重复 |
| schedule.reminders.is_custom_repeat | 否 | uint32 | 是否自定义重复。0-否；1-是 |
| schedule.reminders.repeat_interval | 否 | uint32 | 重复间隔，仅自定义重复时有效 |
| schedule.reminders.repeat_day_of_week | 否 | uint32[] | 每周周几重复，取值1~7 |
| schedule.reminders.repeat_day_of_month | 否 | uint32[] | 每月哪几天重复，取值1~31 |
| schedule.reminders.timezone | 否 | uint32 | 时区UTC偏移量，默认8，取值-12~+12 |
| schedule.location | 否 | string | 日程地址，不多于128个字符 |
| schedule.cal_id | 否 | string | 日程所属日历ID，不多于64字节。不填则插入应用默认日历，第三方应用必须指定 |
| agentid | 否 | uint32 | 授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数 |

## 请求示例

```json
{
  "schedule": {
    "admins": ["admin1", "admin2"],
    "start_time": 1571274600,
    "end_time": 1571320210,
    "is_whole_day": 1,
    "attendees": [{ "userid": "userid2" }],
    "summary": "需求评审会议",
    "description": "2.0版本需求初步评审",
    "reminders": {
      "is_remind": 1,
      "remind_before_event_secs": 3600,
      "is_repeat": 1,
      "repeat_type": 7,
      "repeat_until": 1606976813,
      "timezone": 8
    },
    "location": "广州国际媒体港10楼1005会议室",
    "cal_id": "wcjgewCwAAqeJcPI1d8Pwbjt7nttzAAA"
  },
  "agentid": 1000014
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 错误码描述 |
| schedule_id | string | 日程ID |
