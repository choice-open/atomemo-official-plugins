export default `# jwt-toolkit / jwt-verifier

Verify a JWT token's signature and check its validity (expiration, not-before, etc.).

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`jwt_credential\` | \`credential_id\` | yes | — | Links to credential \`jwt-secret\`. |
| \`token\` | \`string\` | yes | — | The JWT token string to verify. |
| \`algorithms\` | \`string\` | no | — | Restrict accepted algorithm. If empty, uses the algorithm from the token header. Enum: HS256, HS384, HS512, RS256, RS384, RS512, PS256, PS384, PS512, ES256, ES384, ES512, EdDSA. |
| \`issuer\` | \`string\` | no | — | Expected \`iss\` claim. Verification fails if the token's issuer does not match. |
| \`audience\` | \`string\` | no | — | Expected \`aud\` claim. Verification fails if the token's audience does not match. |

### Cross-field Rules
- When \`algorithms\` is set, the token's header algorithm must match — otherwise verification fails.
- For HMAC tokens the credential's \`secret_key\` should be the shared secret; for RSA/EC/EdDSA tokens it should be the PEM-encoded **public** key (imported via SPKI).

### Example Input
\\\`\\\`\\\`json
{
  "jwt_credential": "my-jwt-secret",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTQyIiwiaWF0IjoxNzExMDAwMDAwfQ.signature",
  "algorithms": "HS256",
  "issuer": "auth-service",
  "audience": "https://api.example.com"
}
\\\`\\\`\\\`

## Credential

- Credential name: \`jwt-secret\`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`secret_key\` | \`encrypted_string\` | yes | For HMAC algorithms: the shared secret. For RSA/EC/EdDSA: the PEM-encoded public key (SPKI format). |

## Success Output

\\\`\\\`\\\`json
{
  "valid": true,
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-42",
    "role": "admin",
    "iat": 1711000000,
    "exp": 1711003600,
    "iss": "auth-service",
    "aud": "https://api.example.com"
  }
}
\\\`\\\`\\\`

### Output Notes
- \`valid\` is always \`true\` on success — verification failure throws an error instead of returning \`valid: false\`.
- \`header\` and \`payload\` are the decoded JWT sections.
`
