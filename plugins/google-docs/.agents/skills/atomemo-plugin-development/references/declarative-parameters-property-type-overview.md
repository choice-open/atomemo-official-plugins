# Property Type Overview

| `type` Value | TypeScript Type | Description | Default UI |
| ------------ | --------------- | ----------- | ---------- |
| `"string"` | `PropertyString` | String | `input` |
| `"number"` | `PropertyNumber` | Number (decimal) | `number-input` |
| `"integer"` | `PropertyNumber` | Integer | `number-input` |
| `"boolean"` | `PropertyBoolean` | Boolean | `switch` |
| `"object"` | `PropertyObject` | Nested object | Flat child fields |
| `"array"` | `PropertyArray` | Array | `array-section` |
| `"credential_id"` | `PropertyCredentialId` | Credential reference | `credential-select` |
| `"encrypted_string"` | `PropertyEncryptedString` | Encrypted string | `encrypted-input` |
| `"file_ref"` | `PropertyFileReference` | File reference | `input` (expression-only) |
| `"discriminated_union"` | `PropertyDiscriminatedUnion` | Discriminated union | Selector + variant panel |
| `"resource_locator"` | `PropertyResourceLocator` | Remote resource selector | Mode selector + adaptive input |
| `"resource_mapper"` | `PropertyResourceMapper` | Remote field mapper | Manual field rows / auto JSON editor |

## Support by plugin type

- **Tool**: most property types, including `file_ref`, `resource_locator`, and `resource_mapper`
- **Credential**: scalar types plus `encrypted_string`
- **Model**: declarative parameters are not defined inside model definitions
