# 更新成员 (`wechat-work-update-member`)

调用 `POST /cgi-bin/user/update` 更新企业微信中已有成员的信息。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| userid | 是 | string | 成员UserID。企业内必须唯一。不区分大小写，长度为1~64个字节 |
| name | 否 | string | 成员名称。长度为1~64个utf8字符 |
| alias | 否 | string | 别名。长度为1-64个utf8字符 |
| mobile | 否 | string | 手机号码。企业内必须唯一 |
| department | 否 | int[] | 成员所属部门id列表，不超过100个 |
| order | 否 | int[] | 部门内的排序值，默认为0。当有传入department时有效。数量必须和department一致 |
| position | 否 | string | 职务信息。长度为0~128个utf8字符 |
| gender | 否 | string | 性别。1表示男性，2表示女性 |
| email | 否 | string | 邮箱。长度6~64个字节，且为有效的email格式。企业内必须唯一 |
| biz_mail | 否 | string | 企业邮箱。长度6~63个字节 |
| biz_mail_alias | 否 | obj | 企业邮箱别名 { item: string[] }，最多5个，覆盖式更新 |
| telephone | 否 | string | 座机。由1-32位的纯数字、"-"、"+"或","组成 |
| is_leader_in_dept | 否 | int[] | 部门负责人字段，个数必须和department一致。0-否，1-是 |
| direct_leader | 否 | string[] | 直属上级UserID，最多设置1个 |
| avatar_mediaid | 否 | string | 成员头像的mediaid |
| enable | 否 | int | 启用/禁用成员。1表示启用，0表示禁用 |
| extattr | 否 | obj | 扩展属性 |
| external_profile | 否 | obj | 成员对外属性 |
| external_position | 否 | string | 对外职务。不超过12个汉字 |
| address | 否 | string | 地址。长度最大128个字符 |
| main_department | 否 | int | 主部门 |
| new_userid | 否 | string | 新的UserID，仅当userid由系统自动生成时允许修改一次 |

## 请求示例

```json
{
    "userid": "zhangsan",
    "name": "李四",
    "department": [1],
    "order": [10],
    "position": "后台工程师",
    "mobile": "13800000000",
    "gender": "1",
    "email": "zhangsan@qq.com",
    "biz_mail": "zhangsan@tencent.com",
    "is_leader_in_dept": [1],
    "direct_leader": ["lisi"],
    "enable": 1,
    "telephone": "020-123456",
    "alias": "jackzhang",
    "address": "广州市海珠区新港中路",
    "main_department": 1
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
