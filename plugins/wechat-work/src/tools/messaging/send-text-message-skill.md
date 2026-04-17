# 发送应用文本消息 (`wechat-work-send-text-message`)

调用 `POST /cgi-bin/message/send` 通过自建应用向成员发送文本消息（msgtype=text）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 否 | string | 指定接收消息的成员，成员ID列表（多个接收者用'\|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送 |
| toparty | 否 | string | 指定接收消息的部门，部门ID列表，多个接收者用'\|'分隔，最多支持100个 |
| totag | 否 | string | 指定接收消息的标签，标签ID列表，多个接收者用'\|'分隔，最多支持100个 |
| msgtype | 是 | string | 消息类型，固定为 "text" |
| agentid | 是 | int | 企业应用的id |
| text | 是 | obj | { content: string } — 消息内容，最长不超过2048个字节 |
| safe | 否 | int | 0表示可对外分享，1表示不能分享且内容显示水印，默认为0 |
| enable_id_trans | 否 | int | 表示是否开启id转译，0表示否，1表示是，默认0 |
| enable_duplicate_check | 否 | int | 表示是否开启重复消息检查，0表示否，1表示是，默认0 |
| duplicate_check_interval | 否 | int | 重复消息检查的时间间隔，默认1800s，最大不超过4小时 |

> touser、toparty、totag不能同时为空。

## 请求示例

```json
{
  "touser": "UserID1|UserID2",
  "msgtype": "text",
  "agentid": 1,
  "text": {
    "content": "你的快递已到，请携带工卡前往邮件中心领取。"
  }
}
```

## 输出

返回 `{ errcode, errmsg, invaliduser, invalidparty, invalidtag, unlicenseduser, msgid, response_code }`。
