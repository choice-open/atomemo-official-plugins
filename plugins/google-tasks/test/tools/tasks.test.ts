import { describe, expect, it, vi } from "vitest"

vi.mock("../../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../../src/utils/api", () => ({
  createTasksClient: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue("mock-token"),
  toJSON: (data: unknown) => JSON.parse(JSON.stringify(data)),
}))

import { clearCompletedTasksTool } from "../../src/tools/tasks/clear-completed-tasks"
import { createTaskTool } from "../../src/tools/tasks/create-task"
import { deleteTaskTool } from "../../src/tools/tasks/delete-task"
import { getTaskTool } from "../../src/tools/tasks/get-task"
import { listTasksTool } from "../../src/tools/tasks/list-tasks"
import { moveTaskTool } from "../../src/tools/tasks/move-task"
import { updateTaskTool } from "../../src/tools/tasks/update-task"
import { createTasksClient } from "../../src/utils/api"

const mockCreateTasksClient = vi.mocked(createTasksClient)

function makeArgs(params: Record<string, any>) {
  return {
    args: {
      parameters: { credential_id: "cred-1", ...params },
      credentials: { "cred-1": { access_token: "mock-token" } },
    },
  }
}

// ─── listTasks ──────────────────────────────────────────────────────

describe("listTasksTool", () => {
  it("should have correct metadata", () => {
    expect(listTasksTool.name).toBe("list-tasks")
    expect(listTasksTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "task_list_id", required: true }),
        expect.objectContaining({ name: "show_completed", type: "boolean" }),
      ]),
    )
  })

  it("should call tasks.list with all filters", async () => {
    const mockData = { items: [{ id: "t1", title: "Buy milk" }] }
    const mockList = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({ tasks: { list: mockList } } as any)

    const result = await listTasksTool.invoke(
      makeArgs({
        task_list_id: "list-1",
        max_results: 5,
        show_completed: true,
        show_deleted: false,
        show_hidden: false,
      }) as any,
    )

    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({
        tasklist: "list-1",
        maxResults: 5,
        showCompleted: true,
        showDeleted: false,
        showHidden: false,
      }),
    )
    expect(result).toEqual(mockData)
  })
})

// ─── getTask ────────────────────────────────────────────────────────

describe("getTaskTool", () => {
  it("should have correct metadata", () => {
    expect(getTaskTool.name).toBe("get-task")
    expect(getTaskTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "task_list_id", required: true }),
        expect.objectContaining({ name: "task_id", required: true }),
      ]),
    )
  })

  it("should call tasks.get and return task data", async () => {
    const mockData = { id: "t1", title: "Buy milk", status: "needsAction" }
    const mockGet = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({ tasks: { get: mockGet } } as any)

    const result = await getTaskTool.invoke(
      makeArgs({ task_list_id: "list-1", task_id: "t1" }) as any,
    )

    expect(mockGet).toHaveBeenCalledWith({ tasklist: "list-1", task: "t1" })
    expect(result).toEqual(mockData)
  })
})

// ─── createTask ─────────────────────────────────────────────────────

describe("createTaskTool", () => {
  it("should have correct metadata", () => {
    expect(createTaskTool.name).toBe("create-task")
    expect(createTaskTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "title", required: true }),
        expect.objectContaining({ name: "notes", required: false }),
        expect.objectContaining({ name: "due", required: false }),
        expect.objectContaining({ name: "status", required: false }),
        expect.objectContaining({ name: "parent", required: false }),
        expect.objectContaining({ name: "previous", required: false }),
      ]),
    )
  })

  it("should call tasks.insert with title only", async () => {
    const mockData = { id: "t-new", title: "New Task" }
    const mockInsert = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({
      tasks: { insert: mockInsert },
    } as any)

    const result = await createTaskTool.invoke(
      makeArgs({ task_list_id: "list-1", title: "New Task" }) as any,
    )

    expect(mockInsert).toHaveBeenCalledWith({
      tasklist: "list-1",
      parent: undefined,
      previous: undefined,
      requestBody: { title: "New Task" },
    })
    expect(result).toEqual(mockData)
  })

  it("should include optional fields when provided", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: {} })
    mockCreateTasksClient.mockReturnValue({
      tasks: { insert: mockInsert },
    } as any)

    await createTaskTool.invoke(
      makeArgs({
        task_list_id: "list-1",
        title: "Task",
        notes: "Some notes",
        due: "2026-04-01T00:00:00.000Z",
        status: "needsAction",
        parent: "parent-id",
        previous: "prev-id",
      }) as any,
    )

    expect(mockInsert).toHaveBeenCalledWith({
      tasklist: "list-1",
      parent: "parent-id",
      previous: "prev-id",
      requestBody: {
        title: "Task",
        notes: "Some notes",
        due: "2026-04-01T00:00:00.000Z",
        status: "needsAction",
      },
    })
  })
})

// ─── updateTask ─────────────────────────────────────────────────────

describe("updateTaskTool", () => {
  it("should have correct metadata", () => {
    expect(updateTaskTool.name).toBe("update-task")
  })

  it("should call tasks.patch with provided fields only", async () => {
    const mockData = { id: "t1", title: "Updated" }
    const mockPatch = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({
      tasks: { patch: mockPatch },
    } as any)

    const result = await updateTaskTool.invoke(
      makeArgs({
        task_list_id: "list-1",
        task_id: "t1",
        title: "Updated",
      }) as any,
    )

    expect(mockPatch).toHaveBeenCalledWith({
      tasklist: "list-1",
      task: "t1",
      requestBody: { title: "Updated" },
    })
    expect(result).toEqual(mockData)
  })

  it("should include all optional fields when present", async () => {
    const mockPatch = vi.fn().mockResolvedValue({ data: {} })
    mockCreateTasksClient.mockReturnValue({
      tasks: { patch: mockPatch },
    } as any)

    await updateTaskTool.invoke(
      makeArgs({
        task_list_id: "list-1",
        task_id: "t1",
        title: "T",
        notes: "N",
        status: "completed",
        due: "2026-12-31T00:00:00.000Z",
      }) as any,
    )

    expect(mockPatch).toHaveBeenCalledWith({
      tasklist: "list-1",
      task: "t1",
      requestBody: {
        title: "T",
        notes: "N",
        status: "completed",
        due: "2026-12-31T00:00:00.000Z",
      },
    })
  })
})

// ─── deleteTask ─────────────────────────────────────────────────────

describe("deleteTaskTool", () => {
  it("should have correct metadata", () => {
    expect(deleteTaskTool.name).toBe("delete-task")
  })

  it("should return success on 204", async () => {
    const mockDelete = vi.fn().mockResolvedValue({ status: 204 })
    mockCreateTasksClient.mockReturnValue({
      tasks: { delete: mockDelete },
    } as any)

    const result = await deleteTaskTool.invoke(
      makeArgs({ task_list_id: "list-1", task_id: "t1" }) as any,
    )

    expect(mockDelete).toHaveBeenCalledWith({ tasklist: "list-1", task: "t1" })
    expect(result).toEqual({
      success: true,
      deletedTask: "t1",
      fromTaskList: "list-1",
    })
  })

  it("should throw on unexpected status", async () => {
    const mockDelete = vi
      .fn()
      .mockResolvedValue({ status: 500, statusText: "Server Error" })
    mockCreateTasksClient.mockReturnValue({
      tasks: { delete: mockDelete },
    } as any)

    await expect(
      deleteTaskTool.invoke(
        makeArgs({ task_list_id: "list-1", task_id: "t1" }) as any,
      ),
    ).rejects.toThrow('Failed to delete task "t1" from list "list-1"')
  })

  it("should throw with API error details", async () => {
    const mockDelete = vi.fn().mockRejectedValue({
      message: "Not Found",
      errors: [{ message: "Task not found" }],
    })
    mockCreateTasksClient.mockReturnValue({
      tasks: { delete: mockDelete },
    } as any)

    await expect(
      deleteTaskTool.invoke(
        makeArgs({ task_list_id: "list-1", task_id: "bad-id" }) as any,
      ),
    ).rejects.toThrow(
      'Failed to delete task "bad-id" from list "list-1": Task not found',
    )
  })
})

// ─── moveTask ───────────────────────────────────────────────────────

describe("moveTaskTool", () => {
  it("should have correct metadata", () => {
    expect(moveTaskTool.name).toBe("move-task")
    expect(moveTaskTool.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "parent", required: false }),
        expect.objectContaining({ name: "previous", required: false }),
        expect.objectContaining({
          name: "destination_tasklist",
          required: false,
        }),
      ]),
    )
  })

  it("should call tasks.move with correct params", async () => {
    const mockData = { id: "t1", position: "00000000000000000001" }
    const mockMove = vi.fn().mockResolvedValue({ data: mockData })
    mockCreateTasksClient.mockReturnValue({ tasks: { move: mockMove } } as any)

    const result = await moveTaskTool.invoke(
      makeArgs({
        task_list_id: "list-1",
        task_id: "t1",
        parent: "parent-id",
        previous: "prev-id",
        destination_tasklist: "list-2",
      }) as any,
    )

    expect(mockMove).toHaveBeenCalledWith({
      tasklist: "list-1",
      task: "t1",
      parent: "parent-id",
      previous: "prev-id",
      destinationTasklist: "list-2",
    })
    expect(result).toEqual(mockData)
  })
})

// ─── clearCompletedTasks ────────────────────────────────────────────

describe("clearCompletedTasksTool", () => {
  it("should have correct metadata", () => {
    expect(clearCompletedTasksTool.name).toBe("clear-completed-tasks")
  })

  it("should return success on 204", async () => {
    const mockClear = vi.fn().mockResolvedValue({ status: 204 })
    mockCreateTasksClient.mockReturnValue({
      tasks: { clear: mockClear },
    } as any)

    const result = await clearCompletedTasksTool.invoke(
      makeArgs({ task_list_id: "list-1" }) as any,
    )

    expect(mockClear).toHaveBeenCalledWith({ tasklist: "list-1" })
    expect(result).toEqual({ success: true, clearedTaskList: "list-1" })
  })

  it("should throw on unexpected status", async () => {
    const mockClear = vi
      .fn()
      .mockResolvedValue({ status: 403, statusText: "Forbidden" })
    mockCreateTasksClient.mockReturnValue({
      tasks: { clear: mockClear },
    } as any)

    await expect(
      clearCompletedTasksTool.invoke(
        makeArgs({ task_list_id: "list-1" }) as any,
      ),
    ).rejects.toThrow('Failed to clear completed tasks from list "list-1"')
  })

  it("should throw with API error message", async () => {
    const mockClear = vi.fn().mockRejectedValue({ message: "Quota exceeded" })
    mockCreateTasksClient.mockReturnValue({
      tasks: { clear: mockClear },
    } as any)

    await expect(
      clearCompletedTasksTool.invoke(
        makeArgs({ task_list_id: "list-1" }) as any,
      ),
    ).rejects.toThrow("Quota exceeded")
  })
})
