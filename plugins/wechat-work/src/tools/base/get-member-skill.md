# 读取成员 (`wechat-work-get-member`)

调用 `GET /cgi-bin/user/get` 获取企业微信中指定成员的详细信息。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **userid**（必填，string）：成员UserID。对应管理端的账号，企业内必须唯一。不区分大小写，长度为1~64个字节

## 请求参数说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| access_token | 是 | 调用接口凭证 |
| userid | 是 | 成员UserID。对应管理端的账号，企业内必须唯一。不区分大小写，长度为1~64个字节 |

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| userid | 成员UserID |
| name | 成员名称 |
| department | 成员所属部门id列表 |
| order | 部门内的排序值 |
| position | 职务信息 |
| mobile | 手机号码 |
| gender | 性别。0表示未定义，1表示男性，2表示女性 |
| email | 邮箱 |
| biz_mail | 企业邮箱 |
| is_leader_in_dept | 表示在所在的部门内是否为部门负责人 |
| direct_leader | 直属上级UserID列表 |
| avatar | 头像url |
| thumb_avatar | 头像缩略图url |
| telephone | 座机 |
| alias | 别名 |
| status | 激活状态: 1=已激活，2=已禁用，4=未激活，5=退出企业 |
| address | 地址 |
| open_userid | 全局唯一。仅第三方应用可获取 |
| main_department | 主部门 |
| extattr | 扩展属性 |
| qr_code | 员工个人二维码 |
| external_position | 对外职务 |
| external_profile | 成员对外属性 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "ok",
    "userid": "zhangsan",
    "name": "张三",
    "department": [1, 2],
    "order": [1, 2],
    "position": "后台工程师",
    "mobile": "13800000000",
    "gender": "1",
    "email": "zhangsan@qq.com",
    "biz_mail": "zhangsan@tencent.com",
    "is_leader_in_dept": [1, 0],
    "direct_leader": ["lisi"],
    "avatar": "http://wx.qlogo.cn/mmopen/...",
    "thumb_avatar": "http://wx.qlogo.cn/mmopen/.../100",
    "telephone": "020-123456",
    "alias": "jackzhang",
    "address": "广州市海珠区新港中路",
    "open_userid": "xxxxxx",
    "main_department": 1,
    "status": 1,
    "qr_code": "https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=xxx",
    "external_position": "产品经理",
    "external_profile": {
        "external_corp_name": "企业简称"
    }
}
```
