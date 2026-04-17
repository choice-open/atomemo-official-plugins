# 创建部门 (`wechat-work-create-department`)

调用 `POST /cgi-bin/department/create` 在企业微信中创建新部门。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| name | 是 | string | 部门名称。同一个层级的部门名称不能重复。长度限制为1~64个UTF-8字符，字符不能包括\:*?"<>｜ |
| name_en | 否 | string | 英文名称。同一个层级的部门名称不能重复。需要在管理后台开启多语言支持才能生效。长度限制为1~64个字符 |
| parentid | 是 | int | 父部门id，32位整型 |
| order | 否 | int | 在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32) |
| id | 否 | int | 部门id，32位整型，指定时必须大于1。若不填该参数，将自动生成id |

## 请求示例

```json
{
    "name": "广州研发中心",
    "name_en": "RDGZ",
    "parentid": 1,
    "order": 1,
    "id": 2
}
```

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| id | 创建的部门id |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "created",
    "id": 2
}
```
