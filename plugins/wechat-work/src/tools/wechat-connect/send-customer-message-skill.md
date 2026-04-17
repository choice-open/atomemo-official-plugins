# 创建企业群发 (`wechat-work-send-customer-message`)

调用 `POST /cgi-bin/externalcontact/add_msg_template` 添加企业群发消息的任务并通知成员发送给相关客户或客户群。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| chat_type | 否 | string | 群发任务的类型，默认为single，表示发送给客户，group表示发送给客户群 |
| external_userid | 否 | string[] | 客户的externaluserid列表，仅在chat_type为single时有效，最多1万个 |
| chat_id_list | 否 | string[] | 客户群id列表，仅在chat_type为group时有效，最多2000个 |
| tag_filter | 否 | obj | 标签筛选 { group_list: [{ tag_list: string[] }] } |
| sender | 否 | string | 发送企业群发消息的成员userid，当类型为发送给客户群时必填 |
| allow_select | 否 | bool | 是否允许成员在待发送客户列表中重新进行选择，默认为false |
| text.content | 否 | string | 消息文本内容，最多4000个字节 |
| attachments | 否 | obj[] | 附件，最多支持添加9个附件 |

## 请求示例

```json
{
  "chat_type": "single",
  "external_userid": ["woAJ2GCAAAXtWyujaWJHDDGi0mACAAAA"],
  "sender": "zhangsan",
  "text": { "content": "文本消息内容" },
  "attachments": [
    { "msgtype": "image", "image": { "media_id": "MEDIA_ID" } }
  ]
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| fail_list | 无效或无法发送的external_userid或chatid列表 |
| msgid | 企业群发消息的id，可用于获取群发消息发送结果 |
