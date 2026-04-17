# 发送应用图文消息 (`wechat-work-send-news-message`)

调用 `POST /cgi-bin/message/send` 通过自建应用向成员发送图文消息（msgtype=news）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 否 | string | 成员ID列表（多个接收者用'\|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送 |
| toparty | 否 | string | 部门ID列表，多个接收者用'\|'分隔，最多支持100个 |
| totag | 否 | string | 标签ID列表，多个接收者用'\|'分隔，最多支持100个 |
| msgtype | 是 | string | 消息类型，固定为 "news" |
| agentid | 是 | int | 企业应用的id |
| news.articles | 是 | obj[] | 图文消息，一个图文消息支持1到8条图文 |
| news.articles[].title | 是 | string | 标题，不超过128个字节，超过会自动截断 |
| news.articles[].description | 否 | string | 描述，不超过512个字节，超过会自动截断 |
| news.articles[].url | 否 | string | 点击后跳转的链接，最长2048字节 |
| news.articles[].picurl | 否 | string | 图文消息的图片链接，支持JPG、PNG格式 |
| news.articles[].appid | 否 | string | 小程序appid |
| news.articles[].pagepath | 否 | string | 点击消息卡片后的小程序页面 |
| enable_id_trans | 否 | int | 表示是否开启id转译，0表示否，1表示是，默认0 |
| enable_duplicate_check | 否 | int | 表示是否开启重复消息检查，0表示否，1表示是，默认0 |
| duplicate_check_interval | 否 | int | 重复消息检查的时间间隔，默认1800s，最大不超过4小时 |

> touser、toparty、totag不能同时为空。

## 请求示例

```json
{
  "touser": "UserID1|UserID2",
  "msgtype": "news",
  "agentid": 1,
  "news": {
    "articles": [
      {
        "title": "中秋节礼品领取",
        "description": "今年中秋节公司有豪礼相送",
        "url": "https://example.com",
        "picurl": "https://example.com/pic.png"
      }
    ]
  }
}
```

## 输出

返回 `{ errcode, errmsg, invaliduser, invalidparty, invalidtag, unlicenseduser, msgid, response_code }`。
