"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuthStep = "email" | "code" | "profile";

export default function LoginPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudentMailbox = useMemo(
    () => email.trim().toLowerCase().endsWith("@student.unimelb.edu.au"),
    [email],
  );

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送验证码失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await signIn("email-code", {
        email,
        code,
        redirect: false,
      });

      if (!result || result.error) {
        throw new Error(result?.error ?? "验证码登录失败");
      }

      const session = await update();

      if (session?.user?.needsProfileCompletion) {
        setMessage("验证成功，请设置昵称完成注册");
        setStep("profile");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证码验证失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await update();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "设置昵称失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 card-shadow">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-[#CC8800]">仅限墨尔本大学学生邮箱</p>
          <h1 className="mt-2 text-3xl font-bold text-[#002147]">登录 / 注册 墨大圈子</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            输入 `@student.unimelb.edu.au` 邮箱获取 6 位验证码，通过验证后设置昵称即可加入讨论。
          </p>
        </div>

        {message ? <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        {step === "email" ? (
          <form className="space-y-4" onSubmit={handleSendCode}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">学生邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="你的学邮，例如 name@student.unimelb.edu.au"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#002147]"
                required
              />
              <p className="mt-2 text-xs text-slate-500">
                {email.trim().length === 0
                  ? "请输入 @student.unimelb.edu.au 学生邮箱"
                  : isStudentMailbox
                    ? "将向该邮箱发送 6 位验证码"
                    : "仅支持 @student.unimelb.edu.au 邮箱"}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || email.trim().length === 0}
              className="w-full rounded-2xl bg-[#002147] px-4 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "发送中..." : "发送验证码"}
            </button>
          </form>
        ) : null}

        {step === "code" ? (
          <form className="space-y-4" onSubmit={handleVerifyCode}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">验证码</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                placeholder="请输入 6 位数字验证码"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 tracking-[0.4em] outline-none transition focus:border-[#002147]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-2xl bg-[#002147] px-4 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "验证中..." : "验证并登录"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              返回重新发送
            </button>
          </form>
        ) : null}

        {step === "profile" ? (
          <form className="space-y-4" onSubmit={handleCompleteProfile}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">设置昵称</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="例如：法学院熬夜人"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#002147]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || username.trim().length < 2}
              className="w-full rounded-2xl bg-[#002147] px-4 py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "提交中..." : "完成注册"}
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
