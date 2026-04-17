# 发送应用图片消息 (`wechat-work-send-image-message`)

调用 `POST /cgi-bin/message/send` 通过自建应用向成员发送图片消息（msgtype=image）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 否 | string | 成员ID列表（多个接收者用'\|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送 |
| toparty | 否 | string | 部门ID列表，多个接收者用'\|'分隔，最多支持100个 |
| totag | 否 | string | 标签ID列表，多个接收者用'\|'分隔，最多支持100个 |
| msgtype | 是 | string | 消息类型，固定为 "image" |
| agentid | 是 | int | 企业应用的id |
| image | 是 | obj | { media_id: string } — 图片媒体文件id，可以调用上传临时素材接口获取 |
| safe | 否 | int | 0表示可对外分享，1表示不能分享且内容显示水印，默认为0 |
| enable_duplicate_check | 否 | int | 表示是否开启重复消息检查，0表示否，1表示是，默认0 |
| duplicate_check_interval | 否 | int | 重复消息检查的时间间隔，默认1800s，最大不超过4小时 |

> touser、toparty、totag不能同时为空。

## 请求示例

```json
{
  "touser": "UserID1|UserID2",
  "msgtype": "image",
  "agentid": 1,
  "image": {
    "media_id": "MEDIA_ID"
  }
}
```

## 输出

返回 `{ errcode, errmsg, invaliduser, invalidparty, invalidtag, unlicenseduser, msgid, response_code }`。
