# 添加企业客户标签 (`wechat-work-add-corp-tag`)

调用 `POST /cgi-bin/externalcontact/add_corp_tag` 向客户标签库中添加新的标签组和标签，每个企业最多可配置10000个企业标签。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| group_id | 否 | string | 标签组id |
| group_name | 否 | string | 标签组名称，最长为30个字符 |
| order | 否 | uint32 | 标签组次序值。order值大的排序靠前。有效的值范围是[0, 2^32) |
| tag | 是 | obj[] | 标签列表 |
| tag[].name | 是 | string | 添加的标签名称，最长为30个字符 |
| tag[].order | 否 | uint32 | 标签次序值。order值大的排序靠前。有效的值范围是[0, 2^32) |
| agentid | 否 | int | 授权方安装的应用agentid。仅旧的第三方多应用套件需要填此参数 |

注意：如果要向指定的标签组下添加标签，需要填写group_id参数；如果要创建一个全新的标签组以及标签，则需要通过group_name参数指定新标签组名称。如果填写了group_id参数，则group_name和标签组的order参数会被忽略。不支持创建空标签组。

## 请求示例

```json
{
  "group_id": "GROUP_ID",
  "group_name": "GROUP_NAME",
  "order": 1,
  "tag": [
    { "name": "TAG_NAME_1", "order": 1 },
    { "name": "TAG_NAME_2", "order": 2 }
  ]
}
```

## 输出

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| tag_group | 标签组信息，包含 group_id, group_name, create_time, order, tag[] |
