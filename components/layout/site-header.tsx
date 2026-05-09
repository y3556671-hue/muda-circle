import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PenSquare, LogIn, LogOut } from "lucide-react";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-[#002147]">
          墨大圈子
        </Link>
        <nav className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/post/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#002147] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <PenSquare className="h-4 w-4" />
                发布新帖
              </Link>
              <span className="text-sm text-slate-600">
                {session.user.username ?? "用户"}
              </span>
              <a
                href="/api/auth/signout"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                退出
              </a>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#CC8800] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              <LogIn className="h-4 w-4" />
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
