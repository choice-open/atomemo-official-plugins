# 更新日程 (`wechat-work-update-event`)

调用 `POST /cgi-bin/oa/schedule/update` 更新企业微信日历中指定的日程。

注意：更新操作是覆盖式，而非增量式。如需增量式更新成员，请使用"新增日程参与者"与"删除日程参与者"接口。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| skip_attendees | 否 | uint32 | 是否不更新参与人。0-否；1-是。默认为0 |
| op_mode | 否 | uint32 | 操作模式，重复日程时有效。0-默认全部修改；1-仅修改此日程；2-修改将来的所有日程 |
| op_start_time | 否 | uint32 | 操作起始时间，op_mode为1或2时有效，须为重复日程的某一次开始时间 |
| schedule | 是 | obj | 日程信息 |
| schedule.schedule_id | 是 | string | 日程ID，创建日程时返回的ID |
| schedule.admins | 否 | string[] | 日程管理员userid列表，管理员必须在共享成员列表中，最多3人 |
| schedule.start_time | 是 | uint32 | 日程开始时间，Unix时间戳 |
| schedule.end_time | 是 | uint32 | 日程结束时间，Unix时间戳 |
| schedule.is_whole_day | 否 | uint32 | 是否更新成全天日程。0-否；1-是 |
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

## 请求示例

```json
{
  "skip_attendees": 0,
  "op_mode": 1,
  "op_start_time": 1571274600,
  "schedule": {
    "schedule_id": "17c7d2bd9f20d652840f72f59e796AAA",
    "admins": ["admin1", "admin2"],
    "start_time": 1571274600,
    "end_time": 1571320210,
    "is_whole_day": 1,
    "attendees": [{ "userid": "userid2" }],
    "summary": "test_summary",
    "description": "test_description",
    "reminders": {
      "is_remind": 1,
      "remind_before_event_secs": 3600,
      "is_repeat": 1,
      "repeat_type": 7,
      "repeat_until": 1606976813,
      "timezone": 8
    },
    "location": "test_place"
  }
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 错误码描述 |
| schedule_id | string | 修改重复日程新产生的日程ID。对于重复日程，如不是修改全部周期，会修剪原重复日程产生新的重复日程 |
