# 发送应用文本卡片消息 (`wechat-work-send-text-card-message`)

调用 `POST /cgi-bin/message/send` 通过自建应用向成员发送文本卡片消息（msgtype=textcard）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 否 | string | 成员ID列表（多个接收者用'\|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送 |
| toparty | 否 | string | 部门ID列表，多个接收者用'\|'分隔，最多支持100个 |
| totag | 否 | string | 标签ID列表，多个接收者用'\|'分隔，最多支持100个 |
| msgtype | 是 | string | 消息类型，固定为 "textcard" |
| agentid | 是 | int | 企业应用的id |
| textcard.title | 是 | string | 标题，不超过128个字符，超过会自动截断（支持id转译） |
| textcard.description | 是 | string | 描述，不超过512个字符，超过会自动截断（支持id转译）。支持div标签的class属性：gray(灰色)、highlight(高亮)、normal(默认黑色) |
| textcard.url | 是 | string | 点击后跳转的链接，最长2048字节，请确保包含了协议头(http/https) |
| textcard.btntxt | 否 | string | 按钮文字，默认为"详情"，不超过4个文字，超过自动截断 |
| enable_id_trans | 否 | int | 表示是否开启id转译，0表示否，1表示是，默认0 |
| enable_duplicate_check | 否 | int | 表示是否开启重复消息检查，0表示否，1表示是，默认0 |
| duplicate_check_interval | 否 | int | 重复消息检查的时间间隔，默认1800s，最大不超过4小时 |

> touser、toparty、totag不能同时为空。

## 请求示例

```json
{
  "touser": "UserID1|UserID2",
  "msgtype": "textcard",
  "agentid": 1,
  "textcard": {
    "title": "领奖通知",
    "description": "<div class=\"gray\">2016年9月26日</div><div class=\"normal\">恭喜你抽中iPhone 7一台</div>",
    "url": "https://example.com",
    "btntxt": "更多"
  }
}
```

## 输出

返回 `{ errcode, errmsg, invaliduser, invalidparty, invalidtag, unlicenseduser, msgid, response_code }`。
