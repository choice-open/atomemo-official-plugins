# 获取部门成员详情 (`wechat-work-list-members-detail`)

调用 `GET /cgi-bin/user/list` 获取企业微信指定部门的成员详细信息。

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
| userlist[].userid | 成员UserID |
| userlist[].name | 成员名称 |
| userlist[].department | 成员所属部门id列表 |
| userlist[].order | 部门内的排序值 |
| userlist[].position | 职务信息 |
| userlist[].mobile | 手机号码 |
| userlist[].gender | 性别。0表示未定义，1表示男性，2表示女性 |
| userlist[].email | 邮箱 |
| userlist[].biz_mail | 企业邮箱 |
| userlist[].is_leader_in_dept | 表示在所在的部门内是否为部门负责人。0-否；1-是 |
| userlist[].direct_leader | 直属上级UserID列表 |
| userlist[].avatar | 头像url |
| userlist[].thumb_avatar | 头像缩略图url |
| userlist[].telephone | 座机 |
| userlist[].alias | 别名 |
| userlist[].status | 激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业 |
| userlist[].address | 地址 |
| userlist[].english_name | 英文名 |
| userlist[].open_userid | 全局唯一。仅第三方应用可获取 |
| userlist[].main_department | 主部门 |
| userlist[].extattr | 扩展属性 |
| userlist[].qr_code | 员工个人二维码 |
| userlist[].external_position | 对外职务 |
| userlist[].external_profile | 成员对外属性 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "userlist": [{
        "userid": "zhangsan",
        "name": "李四",
        "department": [1, 2],
        "order": [1, 2],
        "position": "后台工程师",
        "mobile": "13800000000",
        "gender": "1",
        "email": "zhangsan@gzdev.com",
        "biz_mail": "zhangsan@qyycs2.wecom.work",
        "is_leader_in_dept": [1, 0],
        "direct_leader": ["lisi"],
        "avatar": "http://wx.qlogo.cn/mmopen/...",
        "thumb_avatar": "http://wx.qlogo.cn/mmopen/.../100",
        "telephone": "020-123456",
        "alias": "jackzhang",
        "status": 1,
        "address": "广州市海珠区新港中路",
        "english_name": "jacky",
        "open_userid": "xxxxxx",
        "main_department": 1
    }]
}
```
