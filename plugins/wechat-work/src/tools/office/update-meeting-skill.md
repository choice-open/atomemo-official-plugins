# 修改预约会议 (`wechat-work-update-meeting`)

调用 `POST /cgi-bin/meeting/update` 修改企业微信中已有的预约会议。仅允许修改预约状态下的会议。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| meetingid | 是 | string | 会议ID，仅允许修改预约状态下的会议 |
| title | 否 | string | 会议标题，最多40字节或20个utf8字符 |
| meeting_start | 否 | uint32 | 会议开始时间的Unix时间戳，需大于当前时间。修改时须同时指定meeting_duration |
| meeting_duration | 否 | uint32 | 会议持续时间（秒），最小300秒，最大86399秒。修改时须同时指定meeting_start |
| description | 否 | string | 会议描述，最多500个字节或utf8字符 |
| location | 否 | string | 会议地点，最多128个字符 |
| remind_time | 否 | uint32 | 指定会议开始前多久提醒成员，相对于meeting_start前的秒数，默认为0 |
| agentid | 否 | uint32 | 授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数 |
| invitees | 否 | obj | 邀请参会成员 { userid: string[] }，普通企业最多100人，付费企业最多300人 |
| cal_id | 否 | string | 会议所属日历ID，不多于64字节 |
| settings | 否 | obj | 会议配置，详见Settings说明 |
| reminders | 否 | obj | 重复会议相关配置，详见Reminders说明 |

### Settings说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| password | string | 入会密码，仅可输入4-6位纯数字 |
| enable_waiting_room | bool | 是否开启等候室。true:开启；false:不开启。默认不开 |
| allow_enter_before_host | bool | 是否允许成员在主持人进会前加入。true:允许；false:不允许。默认允许 |
| remind_scope | uint32 | 会议开始时来电提醒方式，1-不提醒；2-仅提醒主持人；3-提醒所有成员入；4-指定部分人响铃。默认提醒所有成员 |
| enable_enter_mute | uint32 | 成员入会时静音。1:开启；0:关闭；2:超过6人自动开启。默认超过6人自动开启 |
| enable_screen_watermark | bool | 是否开启屏幕水印。true:开启；false:不开启。默认不开启 |
| hosts | obj | 会议主持人列表 { userid: string[] }，主持人员最多10个 |
| ring_users | obj | 指定响铃的成员列表 { userid: string[] } |

### Reminders说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| is_repeat | uint32 | 是否是周期性会议，1-周期性；0-非周期性。默认为0 |
| repeat_type | uint32 | 周期性会议重复类型，0-每天；1-每周；2-每月；7-每个工作日。默认为0 |
| repeat_until | uint32 | 重复结束时刻。每天/工作日/每周最多重复200次；每两周/每月最多重复50次 |
| repeat_interval | uint32 | 重复间隔，目前仅repeat_type=1时支持，且值不能大于2 |
| remind_before | uint32[] | 会议开始前多久提醒（秒）。支持：0-会议开始时提醒；300-5分钟前；900-15分钟前；3600-一小时前；86400-一天前 |

## 请求示例

```json
{
  "meetingid": "hyxxx",
  "title": "新建会议",
  "meeting_start": 1600000000,
  "meeting_duration": 3600,
  "description": "新建会议描述",
  "location": "广州媒体港",
  "invitees": {
    "userid": ["lisi", "wangwu"]
  },
  "settings": {
    "remind_scope": 1,
    "password": "1234",
    "enable_waiting_room": false,
    "allow_enter_before_host": true,
    "enable_enter_mute": 1,
    "enable_screen_watermark": false,
    "hosts": {
      "userid": ["lisi", "wangwu"]
    },
    "ring_users": {
      "userid": ["zhangsan", "lis"]
    }
  },
  "cal_id": "wcjgewCwAAqeJcPI1d8Pwbjt7nttzAAA",
  "reminders": {
    "is_repeat": 1,
    "repeat_type": 0,
    "repeat_until": 1606976813,
    "repeat_interval": 1,
    "remind_before": [0, 900]
  }
}
```

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 对返回码的文本描述内容 |
| excess_users | string[] | 参会人中包含无效会议账号的userid列表 |
