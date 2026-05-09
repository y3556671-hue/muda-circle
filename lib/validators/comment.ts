import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().trim().min(1, "帖子不存在"),
  body: z.string().trim().min(2, "评论至少 2 个字符").max(1000, "评论不能超过 1000 个字符"),
});
