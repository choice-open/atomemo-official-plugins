import "dotenv/config"
import { describe, expect, it } from "vitest"

import { getProfileTool } from "../src/tools/get-profile"
import { listLabelsTool } from "../src/tools/list-labels"
import { listMessagesTool } from "../src/tools/list-messages"

const GMAIL_ACCESS_TOKEN = process.env.GMAIL_ACCESS_TOKEN
const hasGmailCredential = !!GMAIL_ACCESS_TOKEN
const maybeIt = hasGmailCredential ? it : it.skip

function makeCredentials() {
  return {
    "gmail-e2e": {
      access_token: GMAIL_ACCESS_TOKEN!,
    },
  }
}

describe("gmail e2e (real Gmail API)", () => {
  maybeIt("gets user profile", async () => {
    const credentials = makeCredentials()

    const result = await getProfileTool.invoke({
      args: {
        parameters: { gmail_credential: "gmail-e2e" },
        credentials,
      },
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
    })

    expect(result).toMatchObject({
      messages: expect.any(Array),
    })
  })
})
