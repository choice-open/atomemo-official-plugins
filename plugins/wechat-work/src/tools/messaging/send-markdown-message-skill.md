# 发送应用Markdown消息 (`wechat-work-send-markdown-message`)

调用 `POST /cgi-bin/message/send` 通过自建应用向成员发送Markdown消息（msgtype=markdown）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| touser | 否 | string | 成员ID列表（多个接收者用'\|'分隔，最多支持1000个）。指定为"@all"则向全部成员发送 |
| toparty | 否 | string | 部门ID列表，多个接收者用'\|'分隔，最多支持100个 |
| totag | 否 | string | 标签ID列表，多个接收者用'\|'分隔，最多支持100个 |
| msgtype | 是 | string | 消息类型，固定为 "markdown" |
| agentid | 是 | int | 企业应用的id |
| markdown | 是 | obj | { content: string } — markdown内容，最长不超过2048个字节，必须是utf8编码 |
| enable_duplicate_check | 否 | int | 表示是否开启重复消息检查，0表示否，1表示是，默认0 |
| duplicate_check_interval | 否 | int | 重复消息检查的时间间隔，默认1800s，最大不超过4小时 |

> touser、toparty、totag不能同时为空。目前仅支持markdown语法的子集，微工作台不支持展示markdown消息。

## 请求示例

```json
{
  "touser": "UserID1|UserID2",
  "msgtype": "markdown",
  "agentid": 1,
  "markdown": {
    "content": "您的会议室已经预定，稍后会同步到`邮箱`\n>**事项详情**\n>事项：开会"
  }
}
```

## 输出

返回 `{ errcode, errmsg, invaliduser, invalidparty, invalidtag, unlicenseduser, msgid, response_code }`。
