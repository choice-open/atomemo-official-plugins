import { z } from "zod"

/** 可 JSON 序列化的值（用于非 GET 请求体等嵌套结构校验） */
export type FeishuJsonValue =
  | string
  | number
  | boolean
  | null
  | FeishuJsonValue[]
  | { [key: string]: FeishuJsonValue }

export const feishuJsonValueSchema: z.ZodType<FeishuJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(feishuJsonValueSchema),
    z.record(z.string(), feishuJsonValueSchema),
  ]),
)
