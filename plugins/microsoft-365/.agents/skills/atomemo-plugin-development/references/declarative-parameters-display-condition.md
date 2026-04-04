# DisplayCondition — Conditional Show/Hide

`DisplayCondition` uses MongoDB-like query syntax to control visibility based on sibling values.

## Basic Syntax

```typescript
interface PropertyBase {
  display?: {
    show?: DisplayCondition
    hide?: DisplayCondition
  }
}
```

- `show` is evaluated before `hide`
- parameters are visible by default

## Operators

Supported operators include:

- `$eq`
- `$ne`
- `$gt`
- `$gte`
- `$lt`
- `$lte`
- `$in`
- `$nin`
- `$exists`
- `$regex`
- `$options`
- `$mod`
- `$size`

Logical operators:

- `$and`
- `$or`
- `$nor`

## Examples

```typescript
{
  display: { show: { format: { $eq: "json" } } }
}
```

```typescript
{
  display: { hide: { mode: "deterministic" } }
}
```

```typescript
{
  display: {
    show: {
      $and: [{ provider: "openai" }, { stream: true }],
    },
  },
}
```
