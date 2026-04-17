# Nano Banana Atomemo Plugin

Nano Banana is the Gemini image-generation workflow in Atomemo, backed by Google's Gemini image-capable models. This plugin lets Atomemo generate brand-new images from prompts or edit an existing image with text instructions using Gemini-native image generation.

The plugin supports the current model lineup exposed in code, including `gemini-2.5-flash-image`, `gemini-3.1-flash-image-preview`, and `gemini-3-pro-image-preview`. It is well suited to creative generation, product mockups, visual ideation, and one-shot image edits.

## Tools

### Image Generation

| Tool | Description | API Reference |
| --- | --- | --- |
| **Generate Image** (`generate-image`) | Generate a new image from a text prompt, with configurable model, aspect ratio, resolution, reasoning level, search grounding, and storage behavior. | [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation) |

### Image Editing

| Tool | Description | API Reference |
| --- | --- | --- |
| **Edit Image** (`edit-image`) | Edit an existing image with a text prompt. Supports adding, removing, restyling, recoloring, and semantically changing elements in a single turn. | [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation) |

## Credential

Configure one `gemini-api-key` credential with:

- `api_key` required Gemini API key
- `base_url` optional custom Gemini-compatible base URL or proxy

Use `base_url` only when you intentionally route requests through a gateway or proxy that is compatible with the Google GenAI SDK request shape used by this plugin.

## Authentication Setup

### 1. Get a Gemini API Key

1. Open [Google AI Studio](https://aistudio.google.com/)
2. Create or copy a Gemini API key
3. Keep the key available for Atomemo credential setup

### 2. Configure the Atomemo Credential

Create a `gemini-api-key` credential in Atomemo:

- **Gemini API Key**: your Gemini API key
- **Base URL**: optional, only if you are using a proxy or gateway

### 3. Choose the Right Model

The plugin currently exposes these model IDs:

| Model | ID | Typical Use |
| --- | --- | --- |
| **Nano Banana** | `gemini-2.5-flash-image` | Fast image generation and editing |
| **Nano Banana 2** | `gemini-3.1-flash-image-preview` | Newer preview model with extra aspect-ratio and `512` support |
| **Nano Banana Pro** | `gemini-3-pro-image-preview` | Higher-end preview model for more complex compositions |

For current Gemini image-generation guidance, see [Image generation with Gemini](https://ai.google.dev/gemini-api/docs/image-generation).

## Notes and Limitations

- The plugin currently generates or edits one image per request.
- Editing is semantic rather than mask-based.
- Multi-turn iterative editing is not implemented as a special workflow in this plugin; use repeated tool calls if you want staged refinement.
- Some aspect ratios and `512` output are model-specific and only work with `gemini-3.1-flash-image-preview`.

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```
