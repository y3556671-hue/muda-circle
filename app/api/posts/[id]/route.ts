import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getPostDetail } from "@/lib/services/post-service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const post = await getPostDetail(params.id, session?.user?.id);

  if (!post) {
    return NextResponse.json({ message: "帖子不存在" }, { status: 404 });
  }

  return NextResponse.json(post);
}
