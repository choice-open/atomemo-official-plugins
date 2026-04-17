# 提醒成员群发 (`wechat-work-remind-mass-message`)

调用 `POST /cgi-bin/externalcontact/remind_groupmsg_send` 提醒成员完成群发任务。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **msgid**（必填）：群发消息的id。

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
