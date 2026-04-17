# Declarative Parameters

The declarative parameter reference is now split into focused pages so you can jump
directly to the piece you need:

## How to Choose the Right Page

Start here when you know you need parameters, but not yet which sub-page answers the
question.

| If you need to know... | Read this first |
| --- | --- |
| what parameter `type` values exist, their default UI, and which plugin types support them | [Property Type Overview](./declarative-parameters-property-type-overview.md) |
| the common schema keys shared by all properties such as `required`, `display`, `ai`, `ui`, `depends_on`, and `decoder` | [PropertyBase — Common Base Fields](./declarative-parameters-property-base.md) |
| the exact fields for scalar parameters like `string`, `number`, `integer`, or `boolean` | [Basic Type Property Details](./declarative-parameters-basic-type-properties.md) |
| the exact fields for `object`, `array`, or `discriminated_union` | [Composite Type Property Details](./declarative-parameters-composite-type-properties.md) |
| the exact fields for `credential_id`, `encrypted_string`, or `file_ref` | [Special Type Properties](./declarative-parameters-special-type-properties.md) |
| which `ui.component` names are valid and how each type renders by default | [PropertyUI Component Reference](./declarative-parameters-property-ui-reference.md) and [Default UI Behavior](./declarative-parameters-default-ui-behavior.md) |
| how to show or hide fields based on other values | [DisplayCondition — Conditional Show/Hide](./declarative-parameters-display-condition.md) |
| how to build Tool-only remote selection flows | [Resource Locator](./declarative-parameters-resource-locator.md) |
| how to build Tool-only schema mapping flows | [Resource Mapper](./declarative-parameters-resource-mapper.md) |
| ready-to-adapt examples | [Practical Examples](./declarative-parameters-examples.md) |
| polishing guidance, UX defaults, and best practices | [Advanced Patterns and Best Practices](./declarative-parameters-advanced-patterns-best-practices.md), [Default UI Behavior](./declarative-parameters-default-ui-behavior.md), and [I18nText — Internationalized Text](./declarative-parameters-i18n-text.md) |

## Common Reading Paths

- New to the system: overview -> property type overview -> practical examples
- Defining a parameter from scratch: property type overview -> property-base -> matching type page -> PropertyUI reference
- Building complex Tool parameters: resource locator and/or resource mapper -> display-condition -> practical examples
- Debugging a form mismatch: property-base -> PropertyUI reference -> default UI behavior

1. [Overview and Core Concepts](./declarative-parameters-overview-and-core-concepts.md)
2. [I18nText — Internationalized Text](./declarative-parameters-i18n-text.md)
3. [Property Type Overview](./declarative-parameters-property-type-overview.md)
4. [PropertyBase — Common Base Fields](./declarative-parameters-property-base.md)
5. [Basic Type Property Details](./declarative-parameters-basic-type-properties.md)
6. [Composite Type Property Details](./declarative-parameters-composite-type-properties.md)
7. [Special Type Properties](./declarative-parameters-special-type-properties.md)
8. [Resource Locator](./declarative-parameters-resource-locator.md)
9. [Resource Mapper](./declarative-parameters-resource-mapper.md)
10. [PropertyUI Component Reference](./declarative-parameters-property-ui-reference.md)
11. [DisplayCondition — Conditional Show/Hide](./declarative-parameters-display-condition.md)
12. [Practical Examples](./declarative-parameters-examples.md)
13. [Advanced Patterns and Best Practices](./declarative-parameters-advanced-patterns-best-practices.md)
14. [Default UI Behavior](./declarative-parameters-default-ui-behavior.md)

## Recommended Reading Order

- New to the system → start with overview, property type overview, and practical examples
- Building forms → read property-base, basic/composite/special type pages, and PropertyUI reference
- Building complex tools → read resource locator, resource mapper, and display-condition
- Polishing plugin UX → read advanced patterns, default UI behavior, and I18nText
