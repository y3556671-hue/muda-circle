import { prisma } from "@/lib/prisma";

export async function createComment(userId: string, postId: string, body: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    throw new Error("帖子不存在");
  }

  return prisma.comment.create({
    data: {
      body,
      postId,
      authorId: userId,
    },
  });
}
