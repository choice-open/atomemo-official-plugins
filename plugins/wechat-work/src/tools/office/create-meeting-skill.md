# 创建预约会议 (`wechat-work-create-meeting`)

调用 `POST /cgi-bin/meeting/create` 在企业微信中创建一个预约会议。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| admin_userid | 是 | string | 会议管理员userid |
| title | 是 | string | 会议标题，1~255位字符 |
| meeting_start | 否 | uint32 | 会议开始时间的Unix时间戳，需大于当前时间 |
| meeting_duration | 否 | uint32 | 会议持续时间（秒），最小300秒，最大86399秒 |
| description | 否 | string | 会议描述，最多500个字节或utf8字符 |
| location | 否 | string | 会议地点，最长18个汉字或36个英文字母 |
| agentid | 否 | uint32 | 授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数 |
| invitees | 否 | obj | 邀请参会成员 { userid: string[] }，普通企业最多100人，付费企业最多300人 |
| guests | 否 | obj[] | 会议嘉宾列表 [{ area, phone_number, guest_name }] |
| settings | 否 | obj | 会议配置，详见Settings说明 |
| cal_id | 否 | string | 会议所属日历ID，不多于64字节 |
| reminders | 否 | obj | 周期性相关配置，详见Reminders说明 |

### Settings说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| password | string | 入会密码，4-6位纯数字 |
| enable_waiting_room | bool | 是否开启等候室，默认不开 |
| allow_enter_before_host | bool | 是否允许主持人前加入，默认允许 |
| enable_enter_mute | uint32 | 入会静音。1-开启；0-关闭；2-超过6人自动开启 |
| allow_unmute_self | bool | 允许参会者取消静音 |
| mute_all | bool | 全体静音，需配合allow_unmute_self=false |
| allow_external_user | bool | 是否允许外部成员入会，默认允许 |
| enable_screen_watermark | bool | 是否开启屏幕水印 |
| watermark_type | uint32 | 水印样式。0-单排；1-多排 |
| auto_record_type | string | 自动录制类型。none/local/cloud |
| attendee_join_auto_record | bool | 有人入会时立即云录制 |
| enable_host_pause_auto_record | bool | 允许主持人暂停云录制 |
| enable_interpreter | bool | 同声传译开关 |
| enable_enroll | bool | 是否激活报名 |
| enable_host_key | bool | 是否开启主持人密钥 |
| host_key | string | 主持人密钥，6位数字 |
| hosts | obj | 会议主持人 { userid: string[] }，最多10个 |
| remind_scope | uint32 | 来电提醒。1-不提醒；2-仅主持人；3-所有成员；4-指定部分人 |
| ring_users | obj | 指定响铃成员 { userid: string[] } |

### Reminders说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| is_repeat | uint32 | 是否周期性会议。1-是；0-否 |
| repeat_type | uint32 | 重复类型。0-每日；1-每周；2-每月；7-工作日 |
| is_custom_repeat | uint32 | 是否自定义重复。0-否；1-是 |
| repeat_interval | uint32 | 重复间隔 |
| repeat_day_of_week | uint32[] | 每周周几重复，取值1~7 |
| repeat_day_of_month | uint32[] | 每月哪几天重复，取值1~31 |
| repeat_until_type | uint32 | 结束类型。0-按日期；1-按次数 |
| repeat_until_count | uint32 | 限定次数 |
| repeat_until | uint32 | 结束时刻 |
| remind_before | uint32[] | 会议前提醒秒数。支持：0/300/900/3600/86400 |

## 请求示例

```json
{
  "admin_userid": "zhangsan",
  "title": "新建会议",
  "meeting_start": 1600000000,
  "meeting_duration": 3600,
  "description": "新建会议描述",
  "location": "广州媒体港",
  "invitees": {
    "userid": ["lisi", "wangwu"]
  },
  "settings": {
    "password": "1234",
    "enable_waiting_room": false,
    "allow_enter_before_host": true,
    "enable_enter_mute": 1,
    "allow_external_user": false,
    "hosts": {
      "userid": ["lisi", "wangwu"]
    },
    "remind_scope": 4,
    "ring_users": {
      "userid": ["lisi"]
    }
  },
  "reminders": {
    "is_repeat": 1,
    "repeat_type": 0,
    "repeat_until": 1606976813,
    "remind_before": [0, 900]
  }
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 对返回码的文本描述内容 |
| meetingid | string | 会议ID |
| excess_users | string[] | 无效会议账号的userid列表 |
| meeting_code | string | 会议号 |
| meeting_link | string | 入会链接 |
