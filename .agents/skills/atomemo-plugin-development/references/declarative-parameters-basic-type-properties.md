# Basic Type Property Details

## PropertyString

```typescript
interface PropertyString extends PropertyBase {
  type: "string"
  constant?: string
  default?: string
  enum?: string[]
  max_length?: number
  min_length?: number
  ui?: PropertyUIString
}
```

### Available UI Components

| `component` | Description |
| ----------- | ----------- |
| `"input"` | Single-line input |
| `"textarea"` | Multi-line input |
| `"select"` | Dropdown selection |
| `"radio-group"` | Radio buttons |
| `"code-editor"` | Code editor |
| `"emoji-picker"` | Emoji picker |
| `"color-picker"` | Color picker |

## PropertyNumber / PropertyInteger

```typescript
interface PropertyNumber extends PropertyBase {
  type: "number" | "integer"
  constant?: number
  default?: number
  enum?: number[]
  maximum?: number
  minimum?: number
  ui?: PropertyUINumber
}
```

### Available UI Components

| `component` | Description |
| ----------- | ----------- |
| `"number-input"` | Standard number input |
| `"slider"` | Range slider |

## PropertyBoolean

```typescript
interface PropertyBoolean extends PropertyBase {
  type: "boolean"
  constant?: boolean
  default?: boolean
  ui?: PropertyUIBoolean
}
```

### Available UI Components

| `component` | Description |
| ----------- | ----------- |
| `"switch"` | Toggle switch |
