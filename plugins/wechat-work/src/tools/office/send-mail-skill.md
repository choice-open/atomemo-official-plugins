# 发送普通邮件 (`wechat-work-send-mail`)

调用 `POST /cgi-bin/exmail/app/compose_send` 通过企业微信邮件服务发送普通邮件，支持附件能力。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| to | 是 | obj | 收件人，to.emails 和 to.userids 至少传一个 |
| to.emails | 否 | string[] | 收件人，邮箱地址 |
| to.userids | 否 | string[] | 收件人，企业内成员的userid |
| cc | 否 | obj | 抄送 |
| cc.emails | 否 | string[] | 抄送人，邮箱地址 |
| cc.userids | 否 | string[] | 抄送人，企业内成员的userid |
| bcc | 否 | obj | 密送 |
| bcc.emails | 否 | string[] | 密送人，邮箱地址 |
| bcc.userids | 否 | string[] | 密送人，企业内成员的userid |
| subject | 是 | string | 标题 |
| content | 是 | string | 内容 |
| attachment_list | 否 | obj[] | 附件相关 |
| attachment_list[].file_name | 是 | string | 文件名 |
| attachment_list[].content | 是 | string | 文件内容（base64编码），所有附件加正文的大小不允许超过50M, 且附件个数不能超过200个 |
| content_type | 否 | string | 内容类型 html，text（默认是html） |
| enable_id_trans | 否 | uint32 | 表示是否开启id转译，0表示否，1表示是，默认0 |

## 请求示例

```json
{
    "to": {
        "emails": ["word@example.com"],
        "userids": ["william"]
    },
    "cc": {
        "emails": [],
        "userids": ["panyy"]
    },
    "bcc": {
        "emails": ["zoro@example.com"],
        "userids": []
    },
    "subject": "这是标题",
    "content": "这是邮件正文",
    "attachment_list": [
        {
            "file_name": "a.txt",
            "content": "BASE64_CONTENT"
        }
    ],
    "content_type": "html",
    "enable_id_trans": 0
}
```

## 输出

返回 `{ success: true }`。
