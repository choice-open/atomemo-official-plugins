import { describe, expect, it, type Mock, vi } from "vitest"

vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
    run: vi.fn(),
  }),
}))

vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue(undefined),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"

describe("plugin initialization", () => {
  it("should register 1 credential and 11 tools, then run", async () => {
    const addTool = vi.fn()
    const addCredential = vi.fn()
    const run = vi.fn()

    const createPluginMock = createPlugin as Mock
    createPluginMock.mockResolvedValueOnce({ addTool, addCredential, run })

    await import("../src/index")

    expect(createPluginMock).toHaveBeenCalled()
    expect(addCredential).toHaveBeenCalledTimes(1)
    expect(addTool).toHaveBeenCalledTimes(11)
    expect(run).toHaveBeenCalledTimes(1)

    const toolNames = addTool.mock.calls.map((call: any[]) => call[0].name)
    expect(toolNames).toEqual([
      "list-task-lists",
      "create-task-list",
      "update-task-list",
      "delete-task-list",
      "list-tasks",
      "get-task",
      "create-task",
      "update-task",
      "delete-task",
      "move-task",
      "clear-completed-tasks",
    ])
  })
})
