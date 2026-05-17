"use client";

import { FormEvent, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Hash, User, ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";

type AuthStep = "email" | "code" | "profile";

const stepLabels: Record<AuthStep, string> = {
  email: "输入学邮",
  code: "验证身份",
  profile: "设置昵称",
};

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

      if (!response.ok) throw new Error(data.message);

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

      if (!result || result.error) throw new Error(result?.error ?? "验证码登录失败");

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

      if (!response.ok) throw new Error(data.message);

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
      <div className="w-full max-w-md animate-scale-in">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="btn-ghost text-sm !px-3 !py-2 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </button>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            {(["email", "code", "profile"] as AuthStep[]).map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    s === step
                      ? "bg-[#002147] text-white shadow-sm"
                      : step === "code" && s === "email"
                        ? "bg-emerald-100 text-emerald-700"
                        : step === "profile" && s !== "profile"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step === "code" && s === "email" ? "✓" : step === "profile" && s !== "profile" ? "✓" : i + 1}
                </span>
                <span className="hidden sm:inline">{stepLabels[s]}</span>
                {i < 2 && <span className="mx-0.5 text-slate-300">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="card-elevation !rounded-[28px] overflow-hidden">
          {/* Header */}
          <div className="relative bg-[#002147] px-8 pb-10 pt-10 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(204,136,0,0.2),transparent)]" />
            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
                <GraduationCap className="h-7 w-7 text-[#CC8800]" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">墨大圈子</h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {step === "email" && "输入 @student.unimelb.edu.au 邮箱获取验证码"}
                {step === "code" && "输入发送到邮箱的 6 位验证码"}
                {step === "profile" && "最后一步，为自己取一个独特的昵称"}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-8 pb-8 pt-6">
            {message ? (
              <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {message}
              </div>
            ) : null}
            {error ? (
              <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            {/* Step 1: Email */}
            {step === "email" ? (
              <form className="space-y-4" onSubmit={handleSendCode}>
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    学生邮箱
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@student.unimelb.edu.au"
                    className="input-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400"
                    autoFocus
                    required
                  />
                  <p className="mt-2 text-xs leading-5">
                    {email.trim().length === 0 ? (
                      <span className="text-slate-400">请输入墨大学生邮箱地址</span>
                    ) : isStudentMailbox ? (
                      <span className="text-emerald-600">✓ 合法的学邮，将发送 6 位验证码</span>
                    ) : (
                      <span className="text-rose-500">仅支持 @student.unimelb.edu.au 学生邮箱</span>
                    )}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || email.trim().length === 0}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 !py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      发送中...
                    </>
                  ) : (
                    <>
                      发送验证码
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : null}

            {/* Step 2: Code */}
            {step === "code" ? (
              <form className="space-y-4" onSubmit={handleVerifyCode}>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="btn-ghost text-sm !px-2 !py-1 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  返回修改邮箱
                </button>
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                    验证码
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="input-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300"
                    autoFocus
                    required
                  />
                  <p className="mt-2 text-center text-xs text-slate-400">
                    已发送至 <span className="font-medium text-slate-600">{email}</span>
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 !py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      验证中...
                    </>
                  ) : (
                    "验证并登录"
                  )}
                </button>
              </form>
            ) : null}

            {/* Step 3: Profile */}
            {step === "profile" ? (
              <form className="space-y-4" onSubmit={handleCompleteProfile}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#002147] text-2xl font-bold text-white shadow-lg">
                  {(username || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    设置昵称
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="例如：法学院熬夜人"
                    className="input-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400"
                    autoFocus
                    required
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    2-20 个字符，支持中文、英文、数字和下划线
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || username.trim().length < 2}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 !py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    "完成注册"
                  )}
                </button>
              </form>
            ) : null}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          登录即表示同意遵守社区规范 · 仅限墨尔本大学学生使用
        </p>
      </div>
    </main>
  );
}
