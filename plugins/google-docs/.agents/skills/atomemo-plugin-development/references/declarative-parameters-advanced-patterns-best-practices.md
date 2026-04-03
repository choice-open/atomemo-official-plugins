# Advanced Patterns and Best Practices

## Shared Parameter Pattern

Extract reusable parameters into shared constants:

```typescript
export const credentialParameter = (credentialName: string) => ({
  name: "credential_id",
  type: "credential_id" as const,
  credential_name: credentialName,
  required: true,
})
```

## Expression Support

Enable `support_expression` when users should be able to reference upstream data:

```typescript
{
  name: "message",
  type: "string",
  ui: {
    component: "textarea",
    support_expression: true,
  },
}
```

## Constant Fields

Use `constant` for read-only, fixed values, especially in discriminated unions.

## Nested Discriminated Unions

Nested discriminated unions are supported and work well for advanced mode switching.

## Array Elements as Discriminated Unions

Arrays can contain mixed object shapes when `items` is a discriminated union.
