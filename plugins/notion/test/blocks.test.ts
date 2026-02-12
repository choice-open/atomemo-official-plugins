import { PropertyObjectSchema } from "@choiceopen/atomemo-plugin-schema/schemas";
import { describe, expect, it } from "vitest";
import {
  audioBlock,
  bookmarkBlock,
  breadcrumbBlock,
  bulletedListItemBlock,
  calloutBlock,
  codeBlock,
  columnBlock,
  columnListBlock,
  dividerBlock,
  embedBlock,
  equationBlock,
  fileBlock,
  heading1Block,
  heading2Block,
  heading3Block,
  imageBlock,
  linkToPageBlock,
  numberedListItemBlock,
  paragraphBlock,
  pdfBlock,
  quoteBlock,
  syncedBlockBlock,
  tableBlock,
  tableOfContentsBlock,
  tableRowBlock,
  templateBlock,
  todoBlock,
  toggleBlock,
  videoBlock,
} from "../src/tools/_shared-parameters/blocks";

describe("blocks", () => {
  it("paragraphBlock should be valid", () => {
    console.log("paragraphBlock:", JSON.stringify(paragraphBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(paragraphBlock);
    if (!result.success) {
      console.log(
        "paragraphBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("heading1Block should be valid", () => {
    console.log("heading1Block:", JSON.stringify(heading1Block, null, 2));
    const result = PropertyObjectSchema.safeParse(heading1Block);
    if (!result.success) {
      console.log(
        "heading1Block validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("heading2Block should be valid", () => {
    console.log("heading2Block:", JSON.stringify(heading2Block, null, 2));
    const result = PropertyObjectSchema.safeParse(heading2Block);
    if (!result.success) {
      console.log(
        "heading2Block validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("heading3Block should be valid", () => {
    console.log("heading3Block:", JSON.stringify(heading3Block, null, 2));
    const result = PropertyObjectSchema.safeParse(heading3Block);
    if (!result.success) {
      console.log(
        "heading3Block validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("bulletedListItemBlock should be valid", () => {
    console.log(
      "bulletedListItemBlock:",
      JSON.stringify(bulletedListItemBlock, null, 2),
    );
    const result = PropertyObjectSchema.safeParse(bulletedListItemBlock);
    if (!result.success) {
      console.log(
        "bulletedListItemBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("numberedListItemBlock should be valid", () => {
    console.log(
      "numberedListItemBlock:",
      JSON.stringify(numberedListItemBlock, null, 2),
    );
    const result = PropertyObjectSchema.safeParse(numberedListItemBlock);
    if (!result.success) {
      console.log(
        "numberedListItemBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("quoteBlock should be valid", () => {
    console.log("quoteBlock:", JSON.stringify(quoteBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(quoteBlock);
    if (!result.success) {
      console.log(
        "quoteBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("todoBlock should be valid", () => {
    console.log("todoBlock:", JSON.stringify(todoBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(todoBlock);
    if (!result.success) {
      console.log(
        "todoBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("toggleBlock should be valid", () => {
    console.log("toggleBlock:", JSON.stringify(toggleBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(toggleBlock);
    if (!result.success) {
      console.log(
        "toggleBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("templateBlock should be valid", () => {
    console.log("templateBlock:", JSON.stringify(templateBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(templateBlock);
    if (!result.success) {
      console.log(
        "templateBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("calloutBlock should be valid", () => {
    console.log("calloutBlock:", JSON.stringify(calloutBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(calloutBlock);
    if (!result.success) {
      console.log(
        "calloutBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("syncedBlockBlock should be valid", () => {
    console.log("syncedBlockBlock:", JSON.stringify(syncedBlockBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(syncedBlockBlock);
    if (!result.success) {
      console.log(
        "syncedBlockBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("codeBlock should be valid", () => {
    console.log("codeBlock:", JSON.stringify(codeBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(codeBlock);
    if (!result.success) {
      console.log(
        "codeBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("equationBlock should be valid", () => {
    console.log("equationBlock:", JSON.stringify(equationBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(equationBlock);
    if (!result.success) {
      console.log(
        "equationBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("breadcrumbBlock should be valid", () => {
    console.log("breadcrumbBlock:", JSON.stringify(breadcrumbBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(breadcrumbBlock);
    if (!result.success) {
      console.log(
        "breadcrumbBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("dividerBlock should be valid", () => {
    console.log("dividerBlock:", JSON.stringify(dividerBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(dividerBlock);
    if (!result.success) {
      console.log(
        "dividerBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("tableOfContentsBlock should be valid", () => {
    console.log(
      "tableOfContentsBlock:",
      JSON.stringify(tableOfContentsBlock, null, 2),
    );
    const result = PropertyObjectSchema.safeParse(tableOfContentsBlock);
    if (!result.success) {
      console.log(
        "tableOfContentsBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("columnListBlock should be valid", () => {
    console.log("columnListBlock:", JSON.stringify(columnListBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(columnListBlock);
    if (!result.success) {
      console.log(
        "columnListBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("columnBlock should be valid", () => {
    console.log("columnBlock:", JSON.stringify(columnBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(columnBlock);
    if (!result.success) {
      console.log(
        "columnBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("tableBlock should be valid", () => {
    console.log("tableBlock:", JSON.stringify(tableBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(tableBlock);
    if (!result.success) {
      console.log(
        "tableBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("tableRowBlock should be valid", () => {
    console.log("tableRowBlock:", JSON.stringify(tableRowBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(tableRowBlock);
    if (!result.success) {
      console.log(
        "tableRowBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("embedBlock should be valid", () => {
    console.log("embedBlock:", JSON.stringify(embedBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(embedBlock);
    if (!result.success) {
      console.log(
        "embedBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("bookmarkBlock should be valid", () => {
    console.log("bookmarkBlock:", JSON.stringify(bookmarkBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(bookmarkBlock);
    if (!result.success) {
      console.log(
        "bookmarkBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("imageBlock should be valid", () => {
    console.log("imageBlock:", JSON.stringify(imageBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(imageBlock);
    if (!result.success) {
      console.log(
        "imageBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("videoBlock should be valid", () => {
    console.log("videoBlock:", JSON.stringify(videoBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(videoBlock);
    if (!result.success) {
      console.log(
        "videoBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("pdfBlock should be valid", () => {
    console.log("pdfBlock:", JSON.stringify(pdfBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(pdfBlock);
    if (!result.success) {
      console.log(
        "pdfBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("fileBlock should be valid", () => {
    console.log("fileBlock:", JSON.stringify(fileBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(fileBlock);
    if (!result.success) {
      console.log(
        "fileBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("audioBlock should be valid", () => {
    console.log("audioBlock:", JSON.stringify(audioBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(audioBlock);
    if (!result.success) {
      console.log(
        "audioBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });

  it("linkToPageBlock should be valid", () => {
    console.log("linkToPageBlock:", JSON.stringify(linkToPageBlock, null, 2));
    const result = PropertyObjectSchema.safeParse(linkToPageBlock);
    if (!result.success) {
      console.log(
        "linkToPageBlock validation errors:",
        JSON.stringify(result.error.issues.slice(0, 3), null, 2),
      );
    }
    expect(result.success).toBe(true);
  });
});
