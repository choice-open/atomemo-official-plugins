/**
 * End-to-end tests against the real Google Tasks API.
 *
 * Required env vars (create a .env file or export manually):
 *   GOOGLE_TASKS_ACCESS_TOKEN  – a valid OAuth2 access token
 *   GOOGLE_TASKS_REFRESH_TOKEN – a valid refresh token
 *   GOOGLE_TASKS_CLIENT_ID     – OAuth2 client ID
 *   GOOGLE_TASKS_CLIENT_SECRET – OAuth2 client secret
 *
 * Run:  GOOGLE_TASKS_ACCESS_TOKEN=... bun run test -- test/e2e
 */
import "dotenv/config"
import type { tasks_v1 } from "@googleapis/tasks"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createTasksClient, toJSON } from "../../src/utils/api"

const ACCESS_TOKEN = process.env.GOOGLE_TASKS_ACCESS_TOKEN

const describeE2E = ACCESS_TOKEN ? describe : describe.skip

describeE2E("Google Tasks API – E2E", () => {
  let client: tasks_v1.Tasks
  let taskListId: string
  let taskId: string

  beforeAll(() => {
    client = createTasksClient(ACCESS_TOKEN!)
  })

  // ─── TaskLists CRUD ─────────────────────────────────────────────

  it("should create a task list", async () => {
    const res = await client.tasklists.insert({
      requestBody: { title: "[E2E Test] Temp List" },
    })
    expect(res.data.id).toBeDefined()
    expect(res.data.title).toBe("[E2E Test] Temp List")
    taskListId = res.data.id!
  })

  it("should list task lists including the new one", async () => {
    const res = await client.tasklists.list({ maxResults: 100 })
    const ids = (res.data.items ?? []).map((i) => i.id)
    expect(ids).toContain(taskListId)
  })

  it("should update the task list title", async () => {
    const res = await client.tasklists.patch({
      tasklist: taskListId,
      requestBody: { title: "[E2E Test] Renamed" },
    })
    expect(res.data.title).toBe("[E2E Test] Renamed")
  })

  // ─── Tasks CRUD ─────────────────────────────────────────────────

  it("should create a task", async () => {
    const res = await client.tasks.insert({
      tasklist: taskListId,
      requestBody: {
        title: "E2E Task",
        notes: "Created by automated test",
      },
    })
    expect(res.data.id).toBeDefined()
    expect(res.data.title).toBe("E2E Task")
    taskId = res.data.id!
  })

  it("should get the task", async () => {
    const res = await client.tasks.get({
      tasklist: taskListId,
      task: taskId,
    })
    expect(res.data.id).toBe(taskId)
    expect(res.data.notes).toBe("Created by automated test")
  })

  it("should update the task", async () => {
    const res = await client.tasks.patch({
      tasklist: taskListId,
      task: taskId,
      requestBody: { title: "E2E Task (updated)", status: "completed" },
    })
    expect(res.data.title).toBe("E2E Task (updated)")
    expect(res.data.status).toBe("completed")
  })

  it("should list tasks in the list", async () => {
    const res = await client.tasks.list({
      tasklist: taskListId,
      showCompleted: true,
    })
    const ids = (res.data.items ?? []).map((i) => i.id)
    expect(ids).toContain(taskId)
  })

  it("should clear completed tasks", async () => {
    const res = await client.tasks.clear({ tasklist: taskListId })
    expect(res.status).toBe(204)
  })

  it("should create and delete a task", async () => {
    const created = await client.tasks.insert({
      tasklist: taskListId,
      requestBody: { title: "E2E Delete Me" },
    })
    const deleteRes = await client.tasks.delete({
      tasklist: taskListId,
      task: created.data.id!,
    })
    expect(deleteRes.status).toBe(204)
  })

  // ─── toJSON helper works with real data ─────────────────────────

  it("should serialize real API response via toJSON", async () => {
    const res = await client.tasklists.get({ tasklist: taskListId })
    const json = toJSON(res.data)
    expect(json.id).toBe(taskListId)
    expect(typeof json.title).toBe("string")
  })

  // ─── Cleanup ────────────────────────────────────────────────────

  afterAll(async () => {
    if (taskListId) {
      try {
        await client.tasklists.delete({ tasklist: taskListId })
      } catch {
        // best-effort cleanup
      }
    }
  })
})
