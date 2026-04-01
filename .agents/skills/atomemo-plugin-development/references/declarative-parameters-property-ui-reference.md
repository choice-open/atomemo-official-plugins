# PropertyUI Component Reference

## PropertyUICommonProps

```typescript
interface PropertyUICommonProps {
  disabled?: boolean
  hint?: I18nText
  placeholder?: I18nText
  readonly?: boolean
  sensitive?: boolean
  support_expression?: boolean
  width?: "small" | "medium" | "full"
  indentation?: number
  display_none?: boolean
}
```

## String UI Components

- `input`
- `textarea`
- `select`
- `radio-group`
- `code-editor`
- `emoji-picker`
- `color-picker`

## Number UI Components

- `number-input`
- `slider`

## Boolean UI Components

- `switch`

## Object UI Components

- flat render
- `collapsible-panel`
- `section`
- `code-editor`
- `json-schema-editor`
- `conditions-editor`

## Array UI Components

- `array-section`
- `multi-select`
- `tag-input`
- `key-value-editor`
- `slider`

## Special Cases

- `credential_id` uses `credential-select`
- `resource_locator` renders as a mode selector plus adaptive input
- `resource_mapper` renders as a mapping mode selector plus typed fields or JSON editor
