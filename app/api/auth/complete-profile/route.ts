import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { completeUserProfile } from "@/lib/services/auth-service";
import { completeProfileSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "请先登录" }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = completeProfileSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "昵称无效" }, { status: 400 });
    }

    const user = await completeUserProfile(session.user.id, parsed.data.username);

    return NextResponse.json({
      message: "昵称设置成功",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "设置昵称失败" },
      { status: 400 },
    );
  }
}
