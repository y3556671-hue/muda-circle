import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createComment } from "@/lib/services/comment-service";
import { createCommentSchema } from "@/lib/validators/comment";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "请先登录后评论" }, { status: 401 });
    }

    if (session.user.needsProfileCompletion) {
      return NextResponse.json({ message: "请先设置昵称" }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = createCommentSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "评论内容无效" }, { status: 400 });
    }

    const comment = await createComment(session.user.id, parsed.data.postId, parsed.data.body);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "发表评论失败" },
      { status: 400 },
    );
  }
}
