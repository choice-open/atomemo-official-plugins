/**
 * 端到端测试：需要有效的 Google Calendar OAuth 凭证
 *
 * 运行方式：
 * 1. 在 .env 或环境中设置凭证（或使用 .env.test）
 * 2. GOOGLE_CALENDAR_E2E=1 bun run test
 *
 * 若未设置 E2E 或凭证，测试将被跳过。
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

const runE2E = process.env.GOOGLE_CALENDAR_E2E === "1"
const hasCredential =
  !!process.env.GOOGLE_CALENDAR_ACCESS_TOKEN &&
  !!process.env.GOOGLE_CALENDAR_REFRESH_TOKEN &&
  !!process.env.GOOGLE_CALENDAR_CLIENT_ID &&
  !!process.env.GOOGLE_CALENDAR_CLIENT_SECRET

const skipE2E = !runE2E || !hasCredential

function createE2ECredentials() {
  const access_token = process.env.GOOGLE_CALENDAR_ACCESS_TOKEN
  const refresh_token = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
  const client_id = process.env.GOOGLE_CALENDAR_CLIENT_ID
  const client_secret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET
  if (!access_token || !refresh_token || !client_id || !client_secret) {
    throw new Error("Missing E2E credentials in environment")
  }
  return {
    e2e_cred: {
      access_token,
      refresh_token,
      client_id,
      client_secret,
    },
  }
}

describe.skipIf(skipE2E)("Google Calendar E2E", () => {
  beforeEach(async () => {
    // E2E 测试使用真实 API，无需 mock
  })

  afterEach(async () => {
    // 清理：删除测试创建的资源
  })

  it("list-calendars: 应能列出用户的日历", async () => {
    const { listCalendarsTool } = await import(
      "../../src/tools/calendar-list/list-calendars"
    )
    const creds = createE2ECredentials()

    const result = await listCalendarsTool.invoke({
      args: {
        credentials: creds,
        parameters: { credential_id: "e2e_cred" },
      },
    })

    expect(result).toBeDefined()
    expect(result).toHaveProperty("items")
    expect(Array.isArray((result as { items?: unknown[] }).items)).toBe(true)
  })

  it("create-event + get-event + delete-event: 创建、获取、删除流程", async () => {
    const { createEventTool } = await import(
      "../../src/tools/event/create-event"
    )
    const { getEventTool } = await import("../../src/tools/event/get-event")
    const { deleteEventTool } = await import(
      "../../src/tools/event/delete-event"
    )
    const creds = createE2ECredentials()

    // 1. 创建事件
    const createResult = await createEventTool.invoke({
      args: {
        credentials: creds,
        parameters: {
          credential_id: "e2e_cred",
          calendar_id: "primary",
          summary: `E2E Test Event ${Date.now()}`,
          is_all_day_event: false,
          start_datetime: "2025-12-01T10:00:00Z",
          end_datetime: "2025-12-01T11:00:00Z",
        },
      },
    })

    expect(createResult).toBeDefined()
    expect(createResult).toHaveProperty("id")
    const eventId = (createResult as { id: string }).id

    // 2. 获取事件
    const getResult = await getEventTool.invoke({
      args: {
        credentials: creds,
        parameters: {
          credential_id: "e2e_cred",
          calendar_id: "primary",
          event_id: eventId,
        },
      },
    })

    expect(getResult).toBeDefined()
    expect(getResult).toHaveProperty("summary")

    // 3. 删除事件
    const deleteResult = await deleteEventTool.invoke({
      args: {
        credentials: creds,
        parameters: {
          credential_id: "e2e_cred",
          calendar_id: "primary",
          event_id: eventId,
        },
      },
    })

    expect(deleteResult).toMatchObject({
      success: true,
      deleted_event_id: eventId,
    })
  })

  it("get-colors: 应能获取日历颜色定义", async () => {
    const { getColorsTool } = await import("../../src/tools/colors/get-colors")
    const creds = createE2ECredentials()

    const result = await getColorsTool.invoke({
      args: {
        credentials: creds,
        parameters: { credential_id: "e2e_cred" },
      },
    })

    expect(result).toBeDefined()
    expect(result).toHaveProperty("calendar")
    expect(result).toHaveProperty("event")
  })
})
