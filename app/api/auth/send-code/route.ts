import { NextResponse } from "next/server";
import { createEmailVerificationCode } from "@/lib/services/auth-service";
import { RESEND_FROM, resend } from "@/lib/resend";
import { generateVerificationCode } from "@/lib/utils";
import { sendCodeSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = sendCodeSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "邮箱格式错误" }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ message: "邮件服务尚未配置，请补充 RESEND_API_KEY" }, { status: 500 });
    }

    const code = generateVerificationCode();

    await createEmailVerificationCode(parsed.data.email, code);

    await resend.emails.send({
      from: RESEND_FROM,
      to: parsed.data.email,
      subject: "墨大圈子登录验证码",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;color:#0f172a;">
          <h1 style="color:#002147;font-size:24px;">墨大圈子</h1>
          <p>你的登录验证码为：</p>
          <p style="font-size:32px;font-weight:700;color:#CC8800;letter-spacing:6px;">${code}</p>
          <p>验证码 10 分钟内有效，请勿泄露给他人。</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "验证码已发送，请查收邮箱" });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "发送验证码失败" },
      { status: 400 },
    );
  }
}
