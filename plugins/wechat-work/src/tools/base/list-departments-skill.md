# 获取子部门ID列表 (`wechat-work-list-departments`)

调用 `GET /cgi-bin/department/simplelist` 获取企业微信组织架构中的子部门ID列表。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **id**（选填，integer）：部门id。获取指定部门及其下的子部门（以及子部门的子部门等等，递归）。如果不填，默认获取全量组织架构

## 请求参数说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| access_token | 是 | 调用接口凭证 |
| id | 否 | 部门id。获取指定部门及其下的子部门（以及子部门的子部门等等，递归）。如果不填，默认获取全量组织架构 |

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| department_id | 部门列表数据 |
| department_id[].id | 部门id |
| department_id[].parentid | 父部门id。根部门为1 |
| department_id[].order | 在父部门中的次序值。order值大的排序靠前。值范围是[0, 2^32) |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "department_id": [
        {
            "id": 2,
            "parentid": 1,
            "order": 10
        },
        {
            "id": 3,
            "parentid": 2,
            "order": 40
        }
    ]
}
```
