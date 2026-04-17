# 获取部门列表 (`wechat-work-list-departments-detail`)

调用 `GET /cgi-bin/department/list` 获取企业微信组织架构中的部门列表（包含名称等详情）。

> 由于该接口性能较低，建议换用获取子部门ID列表与获取单个部门详情。

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
| department | 部门列表数据 |
| department[].id | 部门id |
| department[].name | 部门名称 |
| department[].name_en | 英文名称 |
| department[].department_leader | 部门负责人的UserID列表 |
| department[].parentid | 父部门id。根部门为1 |
| department[].order | 在父部门中的次序值。order值大的排序靠前。值范围是[0, 2^32) |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "department": [
        {
            "id": 2,
            "name": "广州研发中心",
            "name_en": "RDGZ",
            "department_leader": ["zhangsan", "lisi"],
            "parentid": 1,
            "order": 10
        },
        {
            "id": 3,
            "name": "邮箱产品部",
            "name_en": "mail",
            "department_leader": ["lisi", "wangwu"],
            "parentid": 2,
            "order": 40
        }
    ]
}
```
