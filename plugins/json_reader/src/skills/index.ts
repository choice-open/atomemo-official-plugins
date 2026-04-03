import readJson from "./tools/read-json"

const skills: Record<string, string> = {
  "read-json": readJson,
}

export function getSkill(toolName: string): string | undefined {
  return skills[toolName]
}
