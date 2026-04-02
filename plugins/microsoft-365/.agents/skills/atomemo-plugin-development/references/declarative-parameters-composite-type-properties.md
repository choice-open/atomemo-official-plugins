# Composite Type Property Details

## PropertyObject

```typescript
interface PropertyObject extends PropertyBase {
  type: "object"
  properties: Property[]
  additional_properties?: Property | PropertyDiscriminatedUnion
  ui?: PropertyUIObject
}
```

### Object UI Components

| `component` | Description |
| ----------- | ----------- |
| _(not set)_ | Flat render |
| `"collapsible-panel"` | Collapsible container |
| `"section"` | Section-style grouped layout |
| `"code-editor"` | JSON/code editor |
| `"json-schema-editor"` | Visual schema editor |
| `"conditions-editor"` | Rule editor |

## PropertyArray

```typescript
interface PropertyArray extends PropertyBase {
  type: "array"
  items: Property | PropertyDiscriminatedUnion
  max_items?: number
  min_items?: number
  ui?: PropertyUIArray
}
```

### Array UI Components

| `component` | Description |
| ----------- | ----------- |
| `"array-section"` or unset | Generic array editing |
| `"multi-select"` | Multi-select over enum values |
| `"tag-input"` | Free-text tags |
| `"slider"` | Numeric range selection |
| `"key-value-editor"` | Key/value object list |

## PropertyDiscriminatedUnion

```typescript
interface PropertyDiscriminatedUnion extends PropertyBase {
  type: "discriminated_union"
  discriminator: string
  any_of: PropertyObject[]
  discriminator_ui?: {
    component: "select" | "switch" | "radio-group"
  }
}
```

Each variant in `any_of` must include a field matching the `discriminator` name and
that field must use a unique `constant` value.
