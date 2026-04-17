# 删除成员 (`wechat-work-delete-member`)

调用 `GET /cgi-bin/user/delete` 从企业微信中删除成员。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **userid**（必填，string）：成员UserID。对应管理端的账号

## 请求参数说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| access_token | 是 | 调用接口凭证 |
| userid | 是 | 成员UserID。对应管理端的账号 |

> 若是绑定了腾讯企业邮，则会同时删除邮箱账号。

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "deleted"
}
```
