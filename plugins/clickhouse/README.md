# Atomemo Plugin - clickhouse

ClickHouse 插件，为 Atomemo 工作流提供连接、查询、执行 DDL 和批量插入等能力。

## 使用说明

在 Atomemo 中安装本插件后，可：

1. **配置连接凭据**：创建 ClickHouse 连接（URL、用户名、密码、默认数据库）
2. **使用工具**：连通性检查、SELECT 查询、DDL/命令执行、批量插入行数据

详细步骤、参数说明与典型场景示例见 [docs/ts-clickhouse.md](./docs/ts-clickhouse.md)。

## Development

- Install dependencies:
```bash
bun install
```

- Run the unit tests:
```bash
bun run test
```

- Build the library:
```bash
bun run build
```

## Docs

- **插件使用说明与 API 参考**：`docs/ts-clickhouse.md`