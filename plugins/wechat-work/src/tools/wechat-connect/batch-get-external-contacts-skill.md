# 批量获取客户详情 (`wechat-work-batch-get-external-contacts`)

调用 `POST /cgi-bin/externalcontact/batch/get_by_user` 批量获取指定成员添加的客户信息列表。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| userid_list | 是 | string[] | 企业成员的userid列表，字符串类型，最多支持100个 |
| cursor | 否 | string | 用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填 |
| limit | 否 | int | 返回的最大记录数，整型，最大值100，默认值50，超过最大值时取最大值 |

## 请求示例

```json
{
  "userid_list": ["zhangsan", "lisi"],
  "cursor": "",
  "limit": 100
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| external_contact_list | 客户列表，每项包含 external_contact（客户基本信息）和 follow_info（跟进信息） |
| next_cursor | 分页游标，再下次请求时填写以获取之后分页的记录，如果已经没有更多的数据则返回空 |
| fail_info | 失败信息，如 unlicensed_userid_list |
