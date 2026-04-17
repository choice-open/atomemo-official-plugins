# 停止企业群发 (`wechat-work-cancel-mass-message`)

调用 `POST /cgi-bin/externalcontact/cancel_groupmsg_send` 停止已创建的企业群发任务。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **msgid**（必填）：群发消息的id。

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
