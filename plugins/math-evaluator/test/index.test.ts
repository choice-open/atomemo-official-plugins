import { describe, expect, it, type Mock, vi } from "vitest";

// Mock the SDK before importing anything that uses it
vi.mock("@choiceopen/atomemo-plugin-sdk-js", () => ({
  createPlugin: vi.fn().mockResolvedValue({
    addTool: vi.fn(),
    run: vi.fn(),
  }),
}));

// Mock i18n
vi.mock("../src/i18n/i18n-node", () => ({
  t: vi.fn((key: string) => ({ en_US: key })),
}));

vi.mock("../src/i18n/i18n-util", () => ({
  locales: ["en-US", "zh-Hans"],
}));

vi.mock("../src/i18n/i18n-util.async", () => ({
  loadAllLocalesAsync: vi.fn().mockResolvedValue({ en_US: {}, zh_Hans: {} }),
}));

import { createPlugin } from "@choiceopen/atomemo-plugin-sdk-js";
import { mathEvaluatorTool } from "../src/tools/math-evaluator";

describe("math-evaluator plugin", () => {
  describe("plugin initialization", () => {
    it("should create a plugin instance with correct properties", async () => {
      const plugin = await createPlugin({
        name: "math-evaluator",
        display_name: { en_US: "Math Evaluator" },
        description: { en_US: "A plugin for evaluating math expressions" },
        icon: "🔢",
        lang: "typescript",
        version: "0.0.1",
        repo: "https://github.com/choice-open/atomemo-official-plugins/plugins/math-evaluator",
        locales: ["en-US", "zh-Hans"],
        transporterOptions: {},
      });

      expect(plugin).toBeDefined();
      expect(plugin.addTool).toBeDefined();
      expect(typeof plugin.addTool).toBe("function");
      expect(plugin.run).toBeDefined();
      expect(typeof plugin.run).toBe("function");
    });

    it("should call all initialization methods when imported", async () => {
      // Create mock plugin methods
      const addTool = vi.fn();
      const run = vi.fn();

      // Replace the mock implementation
      const createPluginMock = createPlugin as Mock;
      createPluginMock.mockResolvedValueOnce({
        addTool,
        run,
      });

      // Dynamically import the plugin to trigger initialization
      await import("../src/index");

      // Verify all methods were called
      expect(createPluginMock).toHaveBeenCalled();
      expect(addTool).toHaveBeenCalledWith(mathEvaluatorTool);
      expect(run).toHaveBeenCalled();
    });
  });

  describe("math-evaluator tool", () => {
    it("should have correct properties", () => {
      expect(mathEvaluatorTool).toEqual(
        expect.objectContaining({
          name: "math-evaluator",
          icon: "🔢",
          parameters: expect.arrayContaining([
            expect.objectContaining({
              name: "expression",
              type: "string",
              required: true,
            }),
          ]),
        }),
      );
    });

    it("should return correct result when expression is valid", async () => {
      const expression = "2 + 3 * 4";
      const result = await mathEvaluatorTool.invoke({
        args: { parameters: { expression } },
      });

      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          result: 14,
          expression,
          error: null,
        }),
      );
    });

    it("should return error when expression is invalid", async () => {
      const expression = "invalid ++ expr";
      const result = await mathEvaluatorTool.invoke({
        args: { parameters: { expression } },
      });

      expect(result).toEqual(
        expect.objectContaining({
          success: false,
          result: null,
          expression,
        }),
      );
      expect(result.error).toBeTruthy();
    });

    it("should return error when expression is empty", async () => {
      const result = await mathEvaluatorTool.invoke({
        args: { parameters: { expression: "" } },
      });

      expect(result).toEqual({
        success: false,
        error: "Expression is required",
        result: null,
        expression: "",
      });
    });
  });
});
