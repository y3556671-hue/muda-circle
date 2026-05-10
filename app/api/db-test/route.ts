import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL ?? "(missing)";
  const maskedUrl = rawUrl.replace(/(postgresql:\/\/)[^:]+:[^@]+(@.*)/, "$1***:***$2");

  try {
    const result = await prisma.$queryRaw`SELECT 1 AS ok`;
    return NextResponse.json({ status: "ok", result, rawDbUrl: maskedUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json({ status: "error", message, rawDbUrl: maskedUrl }, { status: 500 });
  }
}
