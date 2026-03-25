import jwtSigner from "./tools/jwt-signer"
import jwtVerifier from "./tools/jwt-verifier"
import jwtDecoder from "./tools/jwt-decoder"

const skills: Record<string, string> = {
  "jwt-signer": jwtSigner,
  "jwt-verifier": jwtVerifier,
  "jwt-decoder": jwtDecoder,
}

export function getSkill(toolName: string): string | undefined {
  return skills[toolName]
}
