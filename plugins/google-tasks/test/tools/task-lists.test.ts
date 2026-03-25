import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../../src/utils/api", () => ({
  createTasksClient: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue("mock-token"),
  toJSON: (data: unknown) => JSON.parse(JSON.stringify(data)),
}))

import { createTasksClient } from "../../src/utils/api"
import { createTaskListTool } from "../../src/tools/task-lists/create-task-list"
import { deleteTaskListTool } from "../../src/tools/task-lists/delete-task-list"
import { listTaskListsTool } from "../../src/tools/task-lists/list-task-lists"
import { updateTaskListTool } from "../../src/tools/task-lists/update-task-list"

const mockCreateTasksClient = vi.mocked(createTasksClient)

function makeArgs(params: Record<string, any>) {
  return {
    args: {
      parameters: { credential_id: "cred-1", ...params },
      credentials: { "cred-1": { access_token: "mock-token" } },
    },
  }
}

describe("listTaskListsTool", () => {
  it("should have correct metadata", () => {
    expect(listTaskListsTool.name).toBe("list-task-lists")
    expect(listTaskListsTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "credential_id", type: "credential_id" }),
        expect.objectContaining({ name: "max_results", required: false }),
        expect.objectContaining({ name: "page_token", required: false }),
      ]),
    )
  })

  it("should call tasklists.list and return data", async () => {
    const mockData = { kind: "tasks#taskLists", items: [{ id: "list-1", title: "My List" }] }
    const mockList = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({ tasklists: { list: mockList } } as any)

    const result = await listTaskListsTool.invoke(makeArgs({ max_results: 10 }) as any)

    expect(mockList).toHaveBeenCalledWith({
      maxResults: 10,
      pageToken: undefined,
    })
    expect(result).toEqual(mockData)
  })

  it("should pass pageToken when provided", async () => {
    const mockList = vi.fn().mockResolvedValue({ data: { items: [] } })
    mockCreateTasksClient.mockReturnValue({ tasklists: { list: mockList } } as any)

    await listTaskListsTool.invoke(makeArgs({ page_token: "next-page" }) as any)

    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({ pageToken: "next-page" }),
    )
  })
})

describe("createTaskListTool", () => {
  it("should have correct metadata", () => {
    expect(createTaskListTool.name).toBe("create-task-list")
    expect(createTaskListTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "title", required: true }),
      ]),
    )
  })

  it("should call tasklists.insert with title", async () => {
    const mockData = { id: "new-list", title: "Work" }
    const mockInsert = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({ tasklists: { insert: mockInsert } } as any)

    const result = await createTaskListTool.invoke(makeArgs({ title: "Work" }) as any)

    expect(mockInsert).toHaveBeenCalledWith({
      requestBody: { title: "Work" },
    })
    expect(result).toEqual(mockData)
  })
})

describe("updateTaskListTool", () => {
  it("should have correct metadata", () => {
    expect(updateTaskListTool.name).toBe("update-task-list")
    expect(updateTaskListTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "task_list_id", required: true }),
        expect.objectContaining({ name: "title", required: true }),
      ]),
    )
  })

  it("should call tasklists.patch with id and new title", async () => {
    const mockData = { id: "list-1", title: "Renamed" }
    const mockPatch = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({ tasklists: { patch: mockPatch } } as any)

    const result = await updateTaskListTool.invoke(
      makeArgs({ task_list_id: "list-1", title: "Renamed" }) as any,
    )

    expect(mockPatch).toHaveBeenCalledWith({
      tasklist: "list-1",
      requestBody: { title: "Renamed" },
    })
    expect(result).toEqual(mockData)
  })
})

describe("deleteTaskListTool", () => {
  it("should have correct metadata", () => {
    expect(deleteTaskListTool.name).toBe("delete-task-list")
  })

  it("should return success on 204 response", async () => {
    const mockDelete = vi.fn().mockResolvedValue({ status: 204 })
    mockCreateTasksClient.mockReturnValue({ tasklists: { delete: mockDelete } } as any)

    const result = await deleteTaskListTool.invoke(
      makeArgs({ task_list_id: "list-1" }) as any,
    )

    expect(mockDelete).toHaveBeenCalledWith({ tasklist: "list-1" })
    expect(result).toEqual({ success: true, deletedTaskList: "list-1" })
  })

  it("should throw on unexpected status", async () => {
    const mockDelete = vi.fn().mockResolvedValue({ status: 500, statusText: "Internal Server Error" })
    mockCreateTasksClient.mockReturnValue({ tasklists: { delete: mockDelete } } as any)

    await expect(
      deleteTaskListTool.invoke(makeArgs({ task_list_id: "list-1" }) as any),
    ).rejects.toThrow('Failed to delete task list "list-1"')
  })

  it("should throw with API error message on rejection", async () => {
    const mockDelete = vi.fn().mockRejectedValue({
      message: "Not Found",
      errors: [{ message: "Task list not found" }],
    })
    mockCreateTasksClient.mockReturnValue({ tasklists: { delete: mockDelete } } as any)

    await expect(
      deleteTaskListTool.invoke(makeArgs({ task_list_id: "bad-id" }) as any),
    ).rejects.toThrow('Failed to delete task list "bad-id": Task list not found')
  })
})
