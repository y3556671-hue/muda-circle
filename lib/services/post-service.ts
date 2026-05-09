import { prisma } from "@/lib/prisma";
import { formatRelativePopularity } from "@/lib/utils";

type ListPostsParams = {
  categorySlug?: string;
  sort?: "latest" | "hot";
};

const postSummaryInclude = {
  author: {
    select: {
      id: true,
      username: true,
      avatarColor: true,
    },
  },
  category: true,
  _count: {
    select: {
      comments: true,
      likes: true,
    },
  },
} as const;

export async function listPosts({ categorySlug, sort = "latest" }: ListPostsParams) {
  const posts = await prisma.post.findMany({
    where: categorySlug
      ? {
          category: {
            slug: categorySlug,
          },
        }
      : undefined,
    include: postSummaryInclude,
    orderBy: sort === "latest" ? { createdAt: "desc" } : [{ viewCount: "desc" }, { createdAt: "desc" }],
  });

  if (sort === "latest") {
    return posts;
  }

  return posts.sort(
    (left, right) =>
      formatRelativePopularity(right.viewCount, right._count.likes, right._count.comments) -
      formatRelativePopularity(left.viewCount, left._count.likes, left._count.comments),
  );
}

export async function getPostDetail(postId: string, viewerId?: string) {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!existingPost) {
    return null;
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarColor: true,
        },
      },
      category: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarColor: true,
            },
          },
        },
      },
      likes: viewerId
        ? {
            where: { userId: viewerId },
            select: { id: true },
          }
        : false,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  return {
    ...post,
    likedByViewer: Array.isArray(post.likes) ? post.likes.length > 0 : false,
  };
}

export async function createPost(userId: string, categorySlug: string, title: string, body: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    throw new Error("版块不存在");
  }

  return prisma.post.create({
    data: {
      title,
      body,
      authorId: userId,
      categoryId: category.id,
    },
  });
}

export async function toggleLike(postId: string, userId: string, liked: boolean) {
  if (liked) {
    await prisma.like.deleteMany({
      where: { postId, userId },
    });
    return { liked: false };
  }

  await prisma.like.create({
    data: { postId, userId },
  });
  return { liked: true };
}
