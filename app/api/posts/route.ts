import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/services/post-service";
import { createPostSchema } from "@/lib/validators/post";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") ?? undefined;
  const sortParam = searchParams.get("sort");
  const sort = sortParam === "hot" ? "hot" : "latest";

  const posts = await listPosts({ categorySlug, sort });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "请先登录后发帖" }, { status: 401 });
    }

    if (session.user.needsProfileCompletion) {
      return NextResponse.json({ message: "请先设置昵称" }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = createPostSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "帖子内容无效" }, { status: 400 });
    }

    const post = await createPost(
      session.user.id,
      parsed.data.categorySlug,
      parsed.data.title,
      parsed.data.body,
    );

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "发帖失败" },
      { status: 400 },
    );
  }
}
