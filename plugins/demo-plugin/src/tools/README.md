# tools

工具定义模块，用于定义插件提供的可执行工具。

## 文件

- `demo.ts` - 演示工具定义，包含工具参数和执行逻辑

## 功能

定义 `demo-tool` 工具，包含：
- 参数定义（location 字符串）
- 执行逻辑（invoke 函数，返回测试消息）

## 关系

- 被 `src/index.ts` 导入并注册到插件
- 使用 `src/i18n/i18n-node.ts` 获取国际化文本
