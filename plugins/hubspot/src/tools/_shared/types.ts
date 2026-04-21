import type {
  InputArgsCredential,
} from "@choiceopen/atomemo-plugin-sdk-js/types"

export type ToolArgs = {
  parameters: Record<string, unknown>
  credentials?: Record<string, InputArgsCredential>
}
