# 获取会议详情 (`wechat-work-get-meeting-info`)

调用 `POST /cgi-bin/meeting/get_info` 获取企业微信指定会议的详情内容。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| meetingid | 否 | string | 会议ID。meetingid 和 meeting_code 必须填一个 |
| meeting_code | 否 | string | 入会码。meetingid 和 meeting_code 必须填一个 |
| sub_meetingid | 否 | string | 周期性会议子会议ID |

## 请求示例

```json
{
  "meetingid": "XXXXXXXXX",
  "meeting_code": "meetingcodexxx",
  "sub_meetingid": "submeeting"
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 对返回码的文本描述内容 |
| admin_userid | string | 会议管理员的userId |
| title | string | 会议标题 |
| meeting_start | uint32 | 会议开始时间的Unix时间戳 |
| meeting_duration | uint32 | 会议时长（秒） |
| description | string | 会议描述 |
| location | string | 会议地点 |
| main_department | uint32 | 发起人所在部门 |
| status | uint32 | 会议状态。1-待开始；2-会议中；3-已结束；4-已取消；5-已过期 |
| meeting_type | uint32 | 会议类型。0-一次性；1-周期性；2-微信专属；3-Rooms投屏；5-个人会议号；6-网络研讨会 |
| attendees | obj | 参会成员，含 member[] 和 tmp_external_user[] |
| guests | obj[] | 会议嘉宾列表 [{ area, phone_number, guest_name }] |
| settings | obj | 会议配置，含 password, enable_waiting_room, hosts, remind_scope 等 |
| reminders | obj | 重复会议配置，含 is_repeat, repeat_type, remind_before 等 |
| meeting_code | string | 会议号 |
| meeting_link | string | 入会链接 |
| has_vote | bool | 是否有投票 |
| sub_meetings | obj[] | 周期性子会议列表 |
| has_more_sub_meeting | uint32 | 是否有更多子会议特例。0-无；1-有 |
| remain_sub_meetings | uint32 | 剩余子会议场数 |
| current_sub_meetingid | string | 当前子会议ID |
| sub_repeat_list | obj[] | 周期性会议分段信息 |
| cal_id | string | 会议所属日历ID |
