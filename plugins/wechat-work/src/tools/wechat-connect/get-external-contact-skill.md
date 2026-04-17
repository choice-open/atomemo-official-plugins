# 获取客户详情 (`wechat-work-get-external-contact`)

调用 `GET /cgi-bin/externalcontact/get` 根据外部联系人的userid，拉取客户详情。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **external_userid**（必填）：外部联系人的userid，注意不是企业成员的账号。
- **cursor**（选填）：上次请求返回的next_cursor，当客户在企业内的跟进人超过500人时需要使用cursor参数进行分页获取。

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| external_contact | 客户基本信息（external_userid, name, type, gender, avatar, corp_name, corp_full_name, unionid, position, external_profile等） |
| follow_user | 跟进人列表（userid, remark, description, createtime, tags, remark_corp_name, remark_mobiles, oper_userid, add_way, state, wechat_channels等） |
| next_cursor | 分页的cursor，当跟进人多于500人时返回 |
