# 更新部门 (`wechat-work-update-department`)

调用 `POST /cgi-bin/department/update` 更新企业微信中已有部门的信息。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| id | 是 | int | 部门id |
| name | 否 | string | 部门名称。长度限制为1~64个UTF-8字符，字符不能包括\:*?"<>｜ |
| name_en | 否 | string | 英文名称，需要在管理后台开启多语言支持才能生效。长度限制为1~64个字符，字符不能包括\:*?"<>｜ |
| parentid | 否 | int | 父部门id |
| order | 否 | int | 在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32) |

> 如果非必须的字段未指定，则不更新该字段。

## 请求示例

```json
{
    "id": 2,
    "name": "广州研发中心",
    "name_en": "RDGZ",
    "parentid": 1,
    "order": 1
}
```

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "updated"
}
```
