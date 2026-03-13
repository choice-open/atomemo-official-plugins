# i18n

国际化模块，基于 typesafe-i18n 实现类型安全的国际化支持。

## 目录结构

- `en-US/` - 英文翻译
- `zh-Hans/` - 简体中文翻译

## 核心文件

- `i18n-node.ts` - 国际化入口，提供 `t()` 函数用于获取翻译文本
- `i18n-util.ts` - 国际化工具函数和类型定义（基础配置）
- `i18n-util.sync.ts` - 同步加载所有语言包
- `i18n-util.async.ts` - 异步加载语言包（用于动态导入）
- `i18n-types.ts` - 自动生成的类型定义（包含所有翻译键的类型）
- `formatters.ts` - 格式化函数配置（当前为空）

## 功能

- 支持英文（en-US）和简体中文（zh-Hans）两种语言
- 类型安全的翻译键，编译时检查
- 同步和异步两种加载方式
- 自动生成类型定义

## 关系

- 被所有需要国际化的模块导入（tools、index）
- 在 `src/index.ts` 中通过 `loadAllLocalesAsync()` 异步加载所有语言包
