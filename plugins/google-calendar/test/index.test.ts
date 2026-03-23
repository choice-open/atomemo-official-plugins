/**
 * Google Calendar 插件测试
 *
 * 根据 [Google Calendar API 文档](https://developers.google.com/workspace/calendar) 实现的功能对应：
 *
 * Calendars API: get, create, update, delete, clear ✓
 * CalendarList API: list, get, insert, update, delete ✓
 * Events API: list, create, get, update, delete, instances, move, quickAdd ✓
 * Settings API: get, list ✓
 * Colors API: get ✓
 * FreeBusy API: query ✓
 * ACL API: 未实现（access control rules）
 */

import { describe, expect, it, type Mock, vi } from "vitest"

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    addCredential: vi.fn(),
    run: vi.fn(),
  }),
}))

// Mock i18n
vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key, zh_Hans: key })),
}))

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US", "zh-Hans"],
}))

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {}, zh_Hans: {} }),
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { clearCalendarTool } from "../src/tools/calendar/clear-calendar"
import { createCalendarTool } from "../src/tools/calendar/create-calendar"
import { deleteCalendarTool } from "../src/tools/calendar/delete-calendar"
import { getCalendarTool } from "../src/tools/calendar/get-calendar"
import { updateCalendarTool } from "../src/tools/calendar/update-calendar"
import { getColorsTool } from "../src/tools/colors/get-colors"
import { createEventTool } from "../src/tools/event/create-event"
import { deleteEventTool } from "../src/tools/event/delete-event"
import { getEventTool } from "../src/tools/event/get-event"
import { listEventInstancesTool } from "../src/tools/event/list-event-instances"
import { listEventsTool } from "../src/tools/event/list-events"
import { moveEventTool } from "../src/tools/event/move-event"
import { quickAddEventTool } from "../src/tools/event/quick-add-event"
import { updateEventTool } from "../src/tools/event/update-event"
import { queryFreebusyTool } from "../src/tools/freebusy/query-freebusy"
import { getSettingTool } from "../src/tools/settings/get-setting"
import { listSettingsTool } from "../src/tools/settings/list-settings"

describe("google-calendar plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "google-calendar",
        display_name: { en_US: "Google Calendar" },
        description: { en_US: "Google Calendar API client" },
        icon: "📅",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/google-calendar",
        locales: ["en-US", "zh-Hans"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(plugin.addCredential).toBeDefined()
      expect(typeof plugin.addTool).toBe("function")
      expect(typeof plugin.addCredential).toBe("function")
      expect(plugin.run).toBeDefined()
      expect(typeof plugin.run).toBe("function")
    })

    it("should register all tools when imported", async () => {
      const addTool = vi.fn()
      const addCredential = vi.fn()
      const run = vi.fn()

      const createPluginMock = createPlugin as Mock
      createPluginMock.mockResolvedValueOnce({
        addTool,
        addCredential,
        run,
      })

      await import("../src/index")

      // 1 credential
      expect(addCredential).toHaveBeenCalledTimes(1)

      // Calendars: 5, CalendarList: 5, Events: 8, Settings: 2, Colors: 1, FreeBusy: 1 = 22 tools
      expect(addTool).toHaveBeenCalledTimes(22)
      expect(addTool).toHaveBeenCalledWith(getCalendarTool)
      expect(addTool).toHaveBeenCalledWith(createCalendarTool)
      expect(addTool).toHaveBeenCalledWith(createEventTool)
      expect(addTool).toHaveBeenCalledWith(listEventsTool)
      expect(addTool).toHaveBeenCalledWith(getEventTool)
      expect(addTool).toHaveBeenCalledWith(updateEventTool)
      expect(addTool).toHaveBeenCalledWith(deleteEventTool)
      expect(addTool).toHaveBeenCalledWith(listEventInstancesTool)
      expect(addTool).toHaveBeenCalledWith(moveEventTool)
      expect(addTool).toHaveBeenCalledWith(quickAddEventTool)
      expect(addTool).toHaveBeenCalledWith(getColorsTool)
      expect(addTool).toHaveBeenCalledWith(queryFreebusyTool)
      expect(addTool).toHaveBeenCalledWith(getSettingTool)
      expect(addTool).toHaveBeenCalledWith(listSettingsTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("tool definitions", () => {
    const calendarTools = [
      getCalendarTool,
      createCalendarTool,
      updateCalendarTool,
      deleteCalendarTool,
      clearCalendarTool,
    ]
    const eventTools = [
      listEventsTool,
      createEventTool,
      getEventTool,
      updateEventTool,
      deleteEventTool,
      listEventInstancesTool,
      moveEventTool,
      quickAddEventTool,
    ]

    it.each(
      calendarTools.map((t) => [t]),
    )("calendar tool has required properties", (tool) => {
      expect(tool).toHaveProperty("name")
      expect(tool).toHaveProperty("display_name")
      expect(tool).toHaveProperty("description")
      expect(tool).toHaveProperty("icon")
      expect(tool).toHaveProperty("parameters")
      expect(tool).toHaveProperty("invoke")
      expect(tool.parameters).toContainEqual(
        expect.objectContaining({
          name: "credential_id",
          type: "credential_id",
          credential_name: "google-calendar-oauth2",
        }),
      )
    })

    it.each(
      eventTools.map((t) => [t]),
    )("event tool has required properties", (tool) => {
      expect(tool).toHaveProperty("name")
      expect(tool).toHaveProperty("invoke")
      expect(tool.parameters).toContainEqual(
        expect.objectContaining({
          name: "credential_id",
          credential_name: "google-calendar-oauth2",
        }),
      )
    })
  })
})
