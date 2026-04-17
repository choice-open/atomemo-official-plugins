# 获取客户列表 (`wechat-work-list-external-contacts`)

调用 `GET /cgi-bin/externalcontact/list` 获取指定成员添加的客户列表。客户是指配置了客户联系功能的成员所添加的外部联系人。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **userid**（必填）：企业成员的userid。

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| external_userid | 外部联系人的userid列表 |
