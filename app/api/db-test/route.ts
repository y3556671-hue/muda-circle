import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 AS ok`;
    return NextResponse.json({ status: "ok", result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const stack = error instanceof Error ? error.stack : "";
    return NextResponse.json({ status: "error", message, stack }, { status: 500 });
  }
}
