import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().min(4, "标题至少 4 个字符").max(80, "标题不能超过 80 个字符"),
  body: z.string().trim().min(10, "正文至少 10 个字符").max(5000, "正文不能超过 5000 个字符"),
  categorySlug: z.string().trim().min(1, "请选择版块"),
});
