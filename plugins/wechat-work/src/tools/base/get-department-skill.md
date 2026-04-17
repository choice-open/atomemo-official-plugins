# 获取单个部门详情 (`wechat-work-get-department`)

调用 `GET /cgi-bin/department/get` 获取企业微信中单个部门的详细信息。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **id**（必填，integer）：部门id

## 请求参数说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| access_token | 是 | 调用接口凭证 |
| id | 是 | 部门id |

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| department | 部门详情对象 |
| department.id | 部门id |
| department.name | 部门名称 |
| department.name_en | 英文名称 |
| department.department_leader | 部门负责人的UserID列表 |
| department.parentid | 父部门id。根部门为1 |
| department.order | 在父部门中的次序值。order值大的排序靠前 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "department": {
        "id": 2,
        "name": "广州研发中心",
        "name_en": "RDGZ",
        "department_leader": ["zhangsan", "lisi"],
        "parentid": 1,
        "order": 10
    }
}
```
