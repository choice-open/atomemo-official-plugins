import { beforeEach, describe, expect, it, type Mock, vi } from "vitest"

// Mock package.json before any import
vi.mock("../package.json", () => ({
  default: { name: "gmail", version: "0.1.0" },
}))

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
  loadAllLocalesAsync: vi.fn().mockResolvedValue(undefined),
}))

// Mock googleapis - create chain of mocks for Gmail API
const mockGmailUsers = {
  getProfile: vi.fn(),
  watch: vi.fn(),
  stop: vi.fn(),
  messages: {
    list: vi.fn(),
    get: vi.fn(),
    send: vi.fn(),
    delete: vi.fn(),
    trash: vi.fn(),
    untrash: vi.fn(),
    modify: vi.fn(),
    batchDelete: vi.fn(),
    batchModify: vi.fn(),
    attachments: { get: vi.fn() },
  },
  drafts: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    send: vi.fn(),
    delete: vi.fn(),
  },
  labels: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  threads: {
    list: vi.fn(),
    get: vi.fn(),
    modify: vi.fn(),
    trash: vi.fn(),
    untrash: vi.fn(),
    delete: vi.fn(),
  },
  history: { list: vi.fn() },
  settings: {
    getVacation: vi.fn(),
    updateVacation: vi.fn(),
    delegates: { list: vi.fn() },
    filters: { list: vi.fn() },
    sendAs: { list: vi.fn() },
    forwardingAddresses: { list: vi.fn() },
  },
}

const mockGmail = () => ({
  users: mockGmailUsers,
})

vi.mock("googleapis", () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation(function (this: unknown) {
        return {
          setCredentials: vi.fn(),
          on: vi.fn(),
        }
      }),
    },
    gmail: vi.fn(() => mockGmail()),
  },
}))

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js"
import { gmailOAuthCredential } from "../src/credentials/gmail-oauth"
import { getProfileTool } from "../src/tools/get-profile"
import { listMessagesTool } from "../src/tools/list-messages"
import { listLabelsTool } from "../src/tools/list-labels"
import { sendMessageTool } from "../src/tools/send-message"

const GMAIL_TOOL_COUNT = 36

describe("gmail plugin", () => {
  describe("plugin initialization", () => {
    it("should create plugin with correct properties", async () => {
      const plugin = await createPlugin({
        name: "gmail",
        display_name: { en_US: "Gmail" },
        description: { en_US: "Gmail API plugin" },
        icon: "📧",
        lang: "typescript",
        version: "0.1.0",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/gmail",
        locales: ["en-US"],
        transporterOptions: {},
      })

      expect(plugin).toBeDefined()
      expect(plugin.addTool).toBeDefined()
      expect(plugin.addCredential).toBeDefined()
      expect(plugin.run).toBeDefined()
    })

    it("should register credential and all tools when imported", async () => {
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

      expect(createPluginMock).toHaveBeenCalled()
      expect(addCredential).toHaveBeenCalledWith(gmailOAuthCredential)
      expect(addTool).toHaveBeenCalledTimes(GMAIL_TOOL_COUNT)
      expect(addTool).toHaveBeenCalledWith(getProfileTool)
      expect(addTool).toHaveBeenCalledWith(listMessagesTool)
      expect(addTool).toHaveBeenCalledWith(listLabelsTool)
      expect(run).toHaveBeenCalled()
    })
  })

  describe("gmail credential", () => {
    it("should have required access_token parameter", () => {
      expect(gmailOAuthCredential).toMatchObject({
        name: "gmail-oauth",
        parameters: expect.arrayContaining([
          expect.objectContaining({
            name: "access_token",
            type: "encrypted_string",
            required: true,
          }),
        ]),
      })
    })
  })

  describe("gmail tools – credential validation", () => {
    it("get-profile throws when credential missing", async () => {
      await expect(
        getProfileTool.invoke({
          args: {
            parameters: { gmail_credential: "missing" },
            credentials: {},
          },
        }),
      ).rejects.toThrow("Missing Gmail credential")
    })

    it("list-messages throws when credential missing", async () => {
      await expect(
        listMessagesTool.invoke({
          args: {
            parameters: { gmail_credential: "missing" },
            credentials: {},
          },
        }),
      ).rejects.toThrow("Missing Gmail credential")
    })

    it("send-message throws when credential missing", async () => {
      await expect(
        sendMessageTool.invoke({
          args: {
            parameters: {
              gmail_credential: "missing",
              to: "test@example.com",
              subject: "Test",
              body: "Body",
            },
            credentials: {},
          },
        }),
      ).rejects.toThrow("Missing Gmail credential")
    })
  })

  describe("gmail tools – invoke with mocked API", () => {
    const CRED_KEY = "gmail_cred"
    const credentials = {
      [CRED_KEY]: {
        access_token: "ya29.test-token",
      },
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockGmailUsers.getProfile.mockResolvedValue({
        data: { emailAddress: "user@gmail.com", messagesTotal: 100 },
      })
      mockGmailUsers.messages.list.mockResolvedValue({
        data: {
          messages: [{ id: "msg1", threadId: "t1" }],
          nextPageToken: null,
          resultSizeEstimate: 1,
        },
      })
      mockGmailUsers.labels.list.mockResolvedValue({
        data: {
          labels: [{ id: "INBOX", name: "INBOX" }],
        },
      })
    })

    it("get-profile returns profile when credential provided", async () => {
      const result = await getProfileTool.invoke({
        args: {
          parameters: { gmail_credential: CRED_KEY },
          credentials,
        },
      })

      expect(mockGmailUsers.getProfile).toHaveBeenCalledWith({
        userId: "me",
      })
      expect(result).toMatchObject({
        profile: expect.objectContaining({
          emailAddress: "user@gmail.com",
          messagesTotal: 100,
        }),
      })
    })

    it("list-messages returns messages when credential provided", async () => {
      const result = await listMessagesTool.invoke({
        args: {
          parameters: {
            gmail_credential: CRED_KEY,
            q: "is:unread",
            max_results: 10,
          },
          credentials,
        },
      })

      expect(mockGmailUsers.messages.list).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "me",
          q: "is:unread",
          maxResults: 10,
        }),
      )
      expect(result).toMatchObject({
        messages: [{ id: "msg1", threadId: "t1" }],
      })
    })

    it("list-labels returns labels when credential provided", async () => {
      const result = await listLabelsTool.invoke({
        args: {
          parameters: { gmail_credential: CRED_KEY },
          credentials,
        },
      })

      expect(mockGmailUsers.labels.list).toHaveBeenCalledWith({
        userId: "me",
      })
      expect(result).toMatchObject({
        labels: [{ id: "INBOX", name: "INBOX" }],
      })
    })

    it("get-profile uses custom user_id when provided", async () => {
      await getProfileTool.invoke({
        args: {
          parameters: {
            gmail_credential: CRED_KEY,
            user_id: "user@domain.com",
          },
          credentials,
        },
      })

      expect(mockGmailUsers.getProfile).toHaveBeenCalledWith({
        userId: "user@domain.com",
      })
    })
  })

  describe("tool definitions", () => {
    it("get-profile has required credential parameter", () => {
      const credParam = getProfileTool.parameters.find(
        (p: { name: string }) => p.name === "gmail_credential",
      )
      expect(credParam).toEqual(
        expect.objectContaining({
          type: "credential_id",
          required: true,
          credential_name: "gmail-oauth",
        }),
      )
    })

    it("list-messages has query and label_ids parameters", () => {
      const paramNames = listMessagesTool.parameters.map(
        (p: { name: string }) => p.name,
      )
      expect(paramNames).toContain("q")
      expect(paramNames).toContain("label_ids")
      expect(paramNames).toContain("max_results")
    })

    it("send-message has to, subject, body parameters", () => {
      const paramNames = sendMessageTool.parameters.map(
        (p: { name: string }) => p.name,
      )
      expect(paramNames).toContain("to")
      expect(paramNames).toContain("subject")
      expect(paramNames).toContain("body")
    })
  })
})
