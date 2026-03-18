import "dotenv/config"
import { describe, expect, it } from "vitest"

import { createDraftTool } from "../src/tools/create-draft"
import { deleteDraftTool } from "../src/tools/delete-draft"
import { getProfileTool } from "../src/tools/get-profile"
import { listLabelsTool } from "../src/tools/list-labels"
import { listDraftsTool } from "../src/tools/list-drafts"
import { listMessagesTool } from "../src/tools/list-messages"
import { updateDraftTool } from "../src/tools/update-draft"

const GMAIL_ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN
const hasGmailCredential = !!GMAIL_ACCESS_TOKEN
const shouldRunE2E = process.env.GMAIL_E2E === "1"
const maybeIt = hasGmailCredential && shouldRunE2E ? it : it.skip

function makeCredentials() {
  return {
    "gmail-e2e": {
      access_token: GMAIL_ACCESS_TOKEN!,
    },
  }
}

const e2eContext = {
  files: {
    attachRemoteUrl: async () => ({}),
    download: async () => ({}),
  },
} as any

describe("gmail e2e (real Gmail API)", () => {
  maybeIt("gets user profile", async () => {
    const credentials = makeCredentials()

    const result = await getProfileTool.invoke({
      args: {
        parameters: { gmail_credential: "gmail-e2e" },
        credentials,
      },
      context: e2eContext,
    })

    expect(result).toMatchObject({
      profile: expect.objectContaining({
        emailAddress: expect.any(String),
        messagesTotal: expect.any(Number),
      }),
    })
  })

  maybeIt("lists labels", async () => {
    const credentials = makeCredentials()

    const result = await listLabelsTool.invoke({
      args: {
        parameters: { gmail_credential: "gmail-e2e" },
        credentials,
      },
      context: e2eContext,
    })

    expect(result).toMatchObject({
      labels: expect.any(Array),
    })
    if (Array.isArray((result as { labels?: unknown[] }).labels)) {
      expect((result as { labels: unknown[] }).labels.length).toBeGreaterThan(0)
    }
  })

  maybeIt("lists messages with default params", async () => {
    const credentials = makeCredentials()

    const result = await listMessagesTool.invoke({
      args: {
        parameters: {
          gmail_credential: "gmail-e2e",
          max_results: 5,
        },
        credentials,
      },
      context: e2eContext,
    })

    expect(result).toMatchObject({
      messages: expect.any(Array),
    })
  })

  maybeIt("lists drafts", async () => {
    const credentials = makeCredentials()

    const result = await listDraftsTool.invoke({
      args: {
        parameters: {
          gmail_credential: "gmail-e2e",
          max_results: 10,
        },
        credentials,
      },
      context: e2eContext,
    })

    expect(result).toMatchObject({
      drafts: expect.any(Array),
    })
  })

  maybeIt("create draft → update draft → delete draft", async () => {
    const credentials = makeCredentials()

    const createRes = await createDraftTool.invoke({
      args: {
        parameters: {
          gmail_credential: "gmail-e2e",
          to: "e2e@example.com",
          subject: "E2E create",
          body: "Original body",
        },
        credentials,
      },
      context: e2eContext,
    })

    expect(createRes).toMatchObject({ id: expect.any(String) })
    const draftId = (createRes as { id: string }).id

    const updateRes = await updateDraftTool.invoke({
      args: {
        parameters: {
          gmail_credential: "gmail-e2e",
          draft_id: draftId,
          to: "e2e@example.com",
          subject: "E2E updated",
          body: "Updated body",
        },
        credentials,
      },
      context: e2eContext,
    })

    expect(updateRes).toMatchObject({ id: draftId })

    await deleteDraftTool.invoke({
      args: {
        parameters: {
          gmail_credential: "gmail-e2e",
          draft_id: draftId,
        },
        credentials,
      },
      context: e2eContext,
    })
  })
})
