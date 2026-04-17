# 删除部门 (`wechat-work-delete-department`)

调用 `GET /cgi-bin/department/delete` 从企业微信组织架构中删除部门。

## 参数

- **wechat_work_credential**（必填）：`credential_id`，选择 `wechat-work` 凭证。
- **id**（必填，integer）：部门id。（注：不能删除根部门；不能删除含有子部门、成员的部门）

## 请求参数说明

| 参数 | 必须 | 说明 |
| --- | --- | --- |
| access_token | 是 | 调用接口凭证 |
| id | 是 | 部门id。（注：不能删除根部门；不能删除含有子部门、成员的部门） |

## 返回说明

| 参数 | 说明 |
| --- | --- |
| errcode | 返回码 |
| errmsg | 对返回码的文本描述内容 |

## 返回示例

```json
{
    "errcode": 0,
    "errmsg": "deleted"
}
```
