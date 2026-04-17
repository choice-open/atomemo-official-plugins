# 获取客服账号列表 (`wechat-work-list-kf-accounts`)

调用 `POST /cgi-bin/kf/account/list` 获取客服账号列表，包括客服账号的客服ID、名称和头像。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **offset**（选填）：分页偏移量，默认为0。
- **limit**（选填）：预期请求的数据量，默认为100，取值范围 1~100。

## 输出

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errcode | int32 | 返回码 |
| errmsg | string | 错误码描述 |
| account_list | obj[] | 账号信息列表 |
| account_list[].open_kfid | string | 客服账号ID |
| account_list[].name | string | 客服名称 |
| account_list[].avatar | string | 客服头像URL |
| account_list[].manage_privilege | bool | 当前调用接口的应用身份，是否有该客服账号的管理权限 |
