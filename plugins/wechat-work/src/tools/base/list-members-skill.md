# 获取部门成员 (`wechat-work-list-members`)

调用 `GET /cgi-bin/user/simplelist` 获取企业微信指定部门的成员列表（简略信息）。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **department_id**（必填，integer）：获取的部门id

## 请求参数说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| access_token | 是 | 调用接口凭证 |
| department_id | 是 | 获取的部门id |

> 如需获取该部门及其子部门的所有成员，需先获取该部门下的子部门，然后再获取子部门下的部门成员，逐层递归获取。

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| userlist | 成员列表 |
| userlist[].userid | 成员UserID。对应管理端的账号 |
| userlist[].name | 成员名称 |
| userlist[].department | 成员所属部门列表。列表项为部门ID，32位整型 |
| userlist[].open_userid | 全局唯一。仅第三方应用可获取 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "userlist": [
        {
            "userid": "zhangsan",
            "name": "张三",
            "department": [1, 2],
            "open_userid": "xxxxxx"
        }
    ]
}
```
