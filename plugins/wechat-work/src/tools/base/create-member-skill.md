# 创建成员 (`wechat-work-create-member`)

调用 `POST /cgi-bin/user/create` 在企业微信中创建新成员。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **body**（必填）：请求包体 JSON 字符串，包含以下字段：

## body JSON 字段说明

| 参数 | 必须 | 类型 | 说明 |
| --- | --- | --- | --- |
| userid | 是 | string | 成员UserID。企业内必须唯一。长度为1~64个字节。只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是数字或字母 |
| name | 是 | string | 成员名称。长度为1~64个utf8字符 |
| alias | 否 | string | 成员别名。长度1~64个utf8字符 |
| mobile | 否 | string | 手机号码。企业内必须唯一，mobile/email二者不能同时为空 |
| department | 否 | int[] | 成员所属部门id列表，不超过100个 |
| order | 否 | int[] | 部门内的排序值，默认为0。个数必须和参数department的个数一致，数值越大排序越前面。有效的值范围是[0, 2^32) |
| position | 否 | string | 职务信息。长度为0~128个字符 |
| gender | 否 | string | 性别。1表示男性，2表示女性 |
| email | 否 | string | 邮箱。长度6~64个字节，且为有效的email格式。企业内必须唯一，mobile/email二者不能同时为空 |
| biz_mail | 否 | string | 企业邮箱。长度6~64个字节 |
| telephone | 否 | string | 座机。32字节以内，由纯数字、"-"、"+"或","组成 |
| is_leader_in_dept | 否 | int[] | 个数必须和参数department的个数一致，1表示为部门负责人，0表示非部门负责人 |
| direct_leader | 否 | string[] | 直属上级UserID，最多设置1个上级 |
| avatar_mediaid | 否 | string | 成员头像的mediaid |
| enable | 否 | int | 启用/禁用成员。1表示启用成员，0表示禁用成员 |
| extattr | 否 | obj | 扩展属性 |
| to_invite | 否 | bool | 是否邀请该成员使用企业微信，默认值为true |
| external_position | 否 | string | 对外职务。长度12个汉字内 |
| external_profile | 否 | obj | 成员对外属性 |
| address | 否 | string | 地址。长度最大128个字符 |
| main_department | 否 | int | 主部门 |

## 请求示例

```json
{
    "userid": "zhangsan",
    "name": "张三",
    "alias": "jackzhang",
    "mobile": "+86 13800000000",
    "department": [1, 2],
    "order": [10, 40],
    "position": "产品经理",
    "gender": "1",
    "email": "zhangsan@qq.com",
    "biz_mail": "zhangsan@tencent.com",
    "is_leader_in_dept": [1, 0],
    "direct_leader": ["lisi"],
    "enable": 1,
    "telephone": "020-123456",
    "address": "广州市海珠区新港中路",
    "main_department": 1,
    "to_invite": true,
    "external_position": "高级产品经理"
}
```

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |
| created_department_list | 因填写不存在的部门，新增的部门列表 |
| created_department_list.department_info[].name | 新增的部门名称 |
| created_department_list.department_info[].id | 新增的部门id |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "created",
    "created_department_list": {
        "department_info": [{
            "name": "xxxx",
            "id": 123
        }]
    }
}
```
