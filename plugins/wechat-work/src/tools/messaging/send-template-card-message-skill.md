# 发送应用模板卡片消息 (`wechat-work-send-template-card-message`)

调用 `POST /cgi-bin/message/send` 通过自建应用向成员发送模板卡片消息（msgtype=template_card）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 否 | string | 成员ID列表（多个接收者用'\|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送 |
| toparty | 否 | string | 部门ID列表，多个接收者用'\|'分隔，最多支持100个 |
| totag | 否 | string | 标签ID列表，多个接收者用'\|'分隔，最多支持100个 |
| msgtype | 是 | string | 消息类型，固定为 "template_card" |
| agentid | 是 | int | 企业应用的id |
| template_card | 是 | obj | 模板卡片对象，必须包含 card_type |
| template_card.card_type | 是 | string | 模板卡片类型：text_notice/news_notice/button_interaction/vote_interaction/multiple_interaction |
| enable_id_trans | 否 | int | 表示是否开启id转译，0表示否，1表示是，默认0 |
| enable_duplicate_check | 否 | int | 表示是否开启重复消息检查，0表示否，1表示是，默认0 |
| duplicate_check_interval | 否 | int | 重复消息检查的时间间隔，默认1800s，最大不超过4小时 |

> touser、toparty、totag不能同时为空。template_card 内部字段根据 card_type 不同而不同，详见官方文档 https://developer.work.weixin.qq.com/document/path/90236

## 请求示例（文本通知型）

```json
{
  "touser": "UserID1|UserID2",
  "msgtype": "template_card",
  "agentid": 1,
  "template_card": {
    "card_type": "text_notice",
    "main_title": {
      "title": "欢迎使用企业微信",
      "desc": "您的好友正在邀请您加入企业微信"
    },
    "card_action": {
      "type": 1,
      "url": "https://work.weixin.qq.com"
    }
  }
}
```

## 输出

返回 `{ errcode, errmsg, invaliduser, invalidparty, invalidtag, unlicenseduser, msgid, response_code }`。

其中 response_code 仅按钮交互型、投票选择型和多项选择型以及填写了 action_menu 字段的文本通知型、图文展示型返回，72小时内有效，且只能使用一次。
