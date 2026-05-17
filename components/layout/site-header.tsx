import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PenSquare, LogIn, LogOut, GraduationCap } from "lucide-react";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-slate-200/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#002147] to-[#003366] text-sm font-bold text-white shadow-sm transition group-hover:shadow-md group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[#002147]">墨大圈子</span>
        </Link>

        <nav className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/post/new" className="btn-primary text-sm !px-4 !py-2 inline-flex items-center gap-1.5">
                <PenSquare className="h-3.5 w-3.5" />
                发布新帖
              </Link>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#002147] to-[#003366] text-xs font-bold text-white">
                  {(session.user.username ?? "").charAt(0) || "U"}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {session.user.username ?? "用户"}
                </span>
              </div>
              <a
                href="/api/auth/signout"
                className="btn-ghost text-sm !px-3 !py-2 inline-flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">退出</span>
              </a>
            </>
          ) : (
            <Link href="/login" className="btn-accent text-sm !px-4 !py-2 inline-flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
