# Overview and Core Concepts

The Atomemo plugin system uses a **declarative** approach to define tool parameters.
You write JSON/TypeScript configuration objects, and the platform automatically renders
the corresponding form UI.

```plain
Tool Definition
└── parameters: Property[]
    └── Property
        ├── name
        ├── type
        ├── display_name
        ├── required
        ├── display
        ├── ui
        └── type-specific fields
```

## Core Relationships

| Concept | Responsibility | Analogy |
| ------- | -------------- | ------- |
| `Property` | Defines the data model: type, defaults, constraints | JSON Schema |
| `PropertyUI` | Defines rendering details: component and visual hints | UI hint |
| `DisplayCondition` | Defines visibility rules | Conditional expression |

A `Property` determines the data shape through `type` and the UI through `ui`.
Different types support different UI components.
