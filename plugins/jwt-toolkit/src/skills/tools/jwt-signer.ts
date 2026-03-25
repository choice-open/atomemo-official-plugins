export default `# jwt-toolkit / jwt-signer

Generate a signed JWT token with the specified algorithm and claims.

## Input Parameters

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| \`jwt_credential\` | \`credential_id\` | yes | — | Links to credential \`jwt-secret\`. |
| \`algorithm\` | \`string\` | yes | \`HS256\` | Signing algorithm. HMAC (HS256/384/512) uses a shared secret; RSA (RS/PS256/384/512), EC (ES256/384/512), and EdDSA use a PEM-encoded private key. Enum: HS256, HS384, HS512, RS256, RS384, RS512, PS256, PS384, PS512, ES256, ES384, ES512, EdDSA. |
| \`issuer\` | \`string\` | no | — | The \`iss\` claim. Identifies the principal that issued the JWT. |
| \`subject\` | \`string\` | no | — | The \`sub\` claim. Identifies the principal that is the subject of the JWT. |
| \`audience\` | \`string\` | no | — | The \`aud\` claim. Identifies the recipients the JWT is intended for. |
| \`expires_in\` | \`number\` | no | \`1800\` | Token validity duration in seconds from now. Defaults to 1800 (30 minutes). |
| \`additional_claims\` | \`string\` | no | \`{}\` | Extra claims as a JSON object string merged into the JWT payload. |

### Cross-field Rules
- \`algorithm\` determines which key type is expected in the credential: HMAC algorithms (HS*) require a shared secret string; RSA/EC/EdDSA algorithms require a PEM-encoded private key.

### Example Input
\\\`\\\`\\\`json
{
  "jwt_credential": "my-jwt-secret",
  "algorithm": "HS256",
  "issuer": "auth-service",
  "subject": "user-42",
  "audience": "https://api.example.com",
  "expires_in": 3600,
  "additional_claims": "{\\"role\\": \\"admin\\", \\"org_id\\": \\"org-7\\"}"
}
\\\`\\\`\\\`

## Credential

- Credential name: \`jwt-secret\`
- Fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`secret_key\` | \`encrypted_string\` | yes | For HMAC algorithms: the shared secret string. For RSA/EC/EdDSA: the PEM-encoded private key. |

## Success Output

\\\`\\\`\\\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJvcmdfaWQiOiJvcmctNyIsImlhdCI6MTcxMTAwMDAwMCwibmJmIjoxNzEwOTk5OTk1LCJleHAiOjE3MTEwMDM2MDAsImlzcyI6ImF1dGgtc2VydmljZSIsInN1YiI6InVzZXItNDIiLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSJ9.signature",
  "algorithm": "HS256",
  "issued_at": "2024-03-21T12:00:00.000Z",
  "expires_at": "2024-03-21T13:00:00.000Z"
}
\\\`\\\`\\\`

### Output Notes
- \`token\` is the compact JWS string (header.payload.signature).
- The tool automatically sets \`iat\` (issued at), \`nbf\` (not before, 5 seconds before now), and \`exp\` (expiration) claims.
`
