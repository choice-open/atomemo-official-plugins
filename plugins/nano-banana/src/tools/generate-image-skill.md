# Generate Image Tool

## Tool

- **Name**: `generate-image`
- **Purpose**: Generate an image from a text prompt using Google Gemini's native image generation (Nano Banana).

## Parameters

| Name                      | Type            | Required | UI Component        | Description                                                                                                                                               | Example                                    |
| ------------------------- | --------------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `credentialId`            | `credential_id` | `true`   | `credential-select` | Gemini API key credential.                                                                                                                                | —                                          |
| `model`                   | `string`        | `true`   | `select`            | Nano Banana model to use. Default: `gemini-3.1-flash-image-preview`.                                                                                      | `"gemini-3.1-flash-image-preview"`         |
| `aspect_ratio`            | `string`        | `false`  | `select`            | Aspect ratio of the generated image. Default: `1:1`.                                                                                                      | `"16:9"`                                   |
| `resolution`              | `string`        | `false`  | `select`            | Output resolution. Options: `512`, `1K`, `2K`, `4K`. Default: `1K`.                                                                                       | `"2K"`                                     |
| `thinking_level`          | `string`        | `false`  | `select`            | Thinking level: `minimal` (faster) or `high` (better quality). Default: `minimal`.                                                                        | `"high"`                                   |
| `include_thoughts`        | `boolean`       | `false`  | `switch`            | Return the model's thought summary in the response. This only affects visibility; thinking tokens may still be billed even when hidden. Default: `false`. | `true`                                     |
| `enable_search_grounding` | `boolean`       | `false`  | `switch`            | Enable Google Search for real-time data in images. Default: `false`.                                                                                      | `true`                                     |
| `upload_to_storage`       | `boolean`       | `false`  | `switch`            | Upload result to persistent storage. Default: `true`.                                                                                                     | `false`                                    |
| `prompt`                  | `string`        | `true`   | `textarea`          | Text description of the image to generate.                                                                                                                | `"A photorealistic sunset over the ocean"` |

## Supported Models

| Model           | ID                               | Best For                                                           |
| --------------- | -------------------------------- | ------------------------------------------------------------------ |
| Nano Banana 2   | `gemini-3.1-flash-image-preview` | Fast, high-volume, supports 512 resolution and extra aspect ratios |
| Nano Banana Pro | `gemini-3-pro-image-preview`     | Professional quality, complex compositions, advanced reasoning     |
| Nano Banana     | `gemini-2.5-flash-image`         | Speed and efficiency, basic image generation                       |

## Tool Input Example

```json
{
  "aspect_ratio": "1:1",
  "credentialId": "019d512c-54ea-7579-a7c8-6ec05b8257ef",
  "enable_search_grounding": true,
  "include_thoughts": true,
  "model": "gemini-2.5-flash-image",
  "prompt": "On a rainy day, two tabby cats are playing under the eaves—a fresh, rustic scene.",
  "resolution": "1K",
  "thinking_level": "minimal",
  "upload_to_storage": true
}
```

## Tool Output Example

```json
{
  "text": "Okay, here's the image you requested.",
  "thoughts": null,
  "image": {
    "__type__": "file_ref",
    "source": "oss",
    "filename": "nano-banana-1775184733116.png",
    "extension": ".png",
    "mime_type": "image/png",
    "size": 1809919,
    "res_key": "plugin-uploads/nano-banana/a5c9409c-f149-4b32-8de8-66a6e2cb135c/.png",
    "remote_url": null,
    "content": null
  },
  "model": "gemini-2.5-flash-image",
  "grounding_sources": null
}
```

## Limitations

- Only generates one image per request.
- No negative prompt support (that requires the Imagen API which is Vertex AI only).
- No streaming — the full image is returned after generation completes.
- Multi-turn iterative editing is not supported (use the `edit-image` tool instead for single-turn edits).
- The `512` resolution and `1:4`, `4:1`, `1:8`, `8:1` aspect ratios only work with Nano Banana 2.
- `include_thoughts` only controls whether thought summaries are returned. It does not disable thinking token usage or billing.

## Prompting Tips

- **Be descriptive**: Write narrative prompts, not keyword lists. Describe the scene, lighting, mood, and composition.
- **Specify style**: Mention photography terms (lens type, camera angle) for photorealism, or art styles (watercolor, pixel art) for illustrations.
- **Text in images**: Gemini excels at rendering text — explicitly describe the text content, font style, and placement.
- **Google Search grounding**: Enable for images requiring real-time data (weather charts, news graphics, sports scores).
