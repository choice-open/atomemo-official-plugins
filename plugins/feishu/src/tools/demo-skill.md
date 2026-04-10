# Demo Tool Documentation

## Tool

- **Name**: `demo-tool`
- **Module**: `demo`
- **Method**: `LOCAL`
- **Path**: `local://demo-tool`
- **Purpose**: 返回本地测试消息。

## Query Parameters

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

## Request Body

| 字段 | 类型 | 必填 | 约束/定义 |
| --- | --- | --- | --- |
| (none) | - | - | 无 |

## Tool Input 示例

### 示例1（成功）

```json
{
  "parameters": {
    "location": "Singapore"
  }
}
```

### 示例2（错误）

```json
{
  "parameters": {
    "location": 123
  }
}
```

## Tool Output 示例

### 成功

```json
{
  "message": "Testing the plugin with location: Singapore"
}
```

### 失败（示意）

```json
{
  "code": 400,
  "msg": "invalid parameter: location",
  "data": {}
}
```
