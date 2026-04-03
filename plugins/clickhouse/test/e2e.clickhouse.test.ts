import "dotenv/config"
import { describe, expect, it, vi } from "vitest"

vi.mock("../src/tools/clickhouse-ping-skill.md", () => ({
  default: "ClickHouse ping skill",
}))

vi.mock("../src/tools/clickhouse-query-json-skill.md", () => ({
  default: "ClickHouse query json skill",
}))

vi.mock("../src/tools/clickhouse-exec-skill.md", () => ({
  default: "ClickHouse exec skill",
}))

vi.mock("../src/tools/clickhouse-insert-rows-skill.md", () => ({
  default: "ClickHouse insert rows skill",
}))

import {
  clickhouseExecTool,
  clickhouseInsertTool,
  clickhousePingTool,
  clickhouseQueryJsonTool,
} from "../src/tools/clickhouse"

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER ?? "default"
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? ""
const CLICKHOUSE_DB = process.env.CLICKHOUSE_DB ?? "default"

const hasRealClickHouse = !!CLICKHOUSE_URL
const maybeIt = hasRealClickHouse ? it : it.skip

function makeCredentials() {
  return {
    "conn-1": {
      url: CLICKHOUSE_URL!,
      username: CLICKHOUSE_USER,
      password: CLICKHOUSE_PASSWORD,
      database: CLICKHOUSE_DB,
    },
  }
}

describe("clickhouse e2e (real environment)", () => {
  maybeIt("pings ClickHouse successfully", async () => {
    const credentials = makeCredentials()

    const pingResult = await clickhousePingTool.invoke({
      args: {
        parameters: { connection: "conn-1" },
        credentials,
      },
    })

    expect(pingResult).toMatchObject({ success: true })
  })

  maybeIt("creates e2e_events table", async () => {
    const credentials = makeCredentials()
    const createSql = `
      CREATE TABLE IF NOT EXISTS e2e_events
      (id UInt64, name String)
      ENGINE = MergeTree()
      ORDER BY (id)
    `

    const execResult = await clickhouseExecTool.invoke({
      args: {
        parameters: { connection: "conn-1", statement: createSql },
        credentials,
      },
    })

    expect(execResult).toMatchObject({ success: true })
  })

  maybeIt("inserts rows into e2e_events", async () => {
    const credentials = makeCredentials()
    const rows = [
      { id: 1, name: "foo" },
      { id: 2, name: "bar" },
    ]

    const insertResult = await clickhouseInsertTool.invoke({
      args: {
        parameters: {
          connection: "conn-1",
          table: "e2e_events",
          rows: JSON.stringify(rows),
        },
        credentials,
      },
    })

    expect(insertResult).toMatchObject({ success: true })
  })

  maybeIt("queries rows from e2e_events", async () => {
    const credentials = makeCredentials()

    const queryResult = await clickhouseQueryJsonTool.invoke({
      args: {
        parameters: {
          connection: "conn-1",
          query: "SELECT id, name FROM e2e_events ORDER BY id",
          max_rows: 10,
        },
        credentials,
      },
    })

    expect(queryResult).toMatchObject({
      success: true,
    })
  })
})
