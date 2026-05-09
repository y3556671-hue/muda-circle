import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { toggleLike } from "@/lib/services/post-service";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "请先登录后点赞" }, { status: 401 });
  }

  if (session.user.needsProfileCompletion) {
    return NextResponse.json({ message: "请先设置昵称" }, { status: 403 });
  }

  try {
    const result = await toggleLike(params.id, session.user.id, false);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "点赞失败" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "请先登录后取消点赞" }, { status: 401 });
  }

  try {
    const result = await toggleLike(params.id, session.user.id, true);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "取消点赞失败" },
      { status: 400 },
    );
  }
}
