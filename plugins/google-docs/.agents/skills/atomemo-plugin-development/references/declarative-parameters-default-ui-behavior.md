# Default UI Behavior

When `ui` is not specified, Atomemo uses these defaults:

| Property Type | Default UI Component |
| ------------- | -------------------- |
| `string` | `input` |
| `number` / `integer` | `number-input` |
| `boolean` | `switch` |
| `object` | flat child fields |
| `array` | `array-section` |
| `credential_id` | `credential-select` |
| `encrypted_string` | `encrypted-input` |
| `file_ref` | `input` |
| `discriminated_union` | `select` (discriminator) |
| `resource_locator` | mode selector + adaptive input |
| `resource_mapper` | manual mapping rows |

## Array Section Auto Mode Selection

When `array-section` is used:

- primitive `items` become a simple row-based list
- object `items` become structured compound rows
