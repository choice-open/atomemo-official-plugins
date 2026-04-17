# 删除企业客户标签 (`wechat-work-delete-corp-tag`)

调用 `POST /cgi-bin/externalcontact/del_corp_tag` 删除客户标签库中的标签，或删除整个标签组。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| tag_id | 否 | string[] | 标签的id列表 |
| group_id | 否 | string[] | 标签组的id列表 |
| agentid | 否 | int | 授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数 |

注意：tag_id和group_id不可同时为空。如果一个标签组下所有的标签均被删除，则标签组会被自动删除。

## 请求示例

```json
{
  "tag_id": ["TAG_ID_1", "TAG_ID_2"],
  "group_id": ["GROUP_ID_1", "GROUP_ID_2"]
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
