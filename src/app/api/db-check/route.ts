import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const rawUrl = process.env.DATABASE_URL || "";
  const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ":****@");

  try {
    // 1. Test raw database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // 2. Test AjeerProfile table query
    const count = await prisma.ajeerProfile.count();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: "connected",
      message: "Database connection successful",
      databaseUrl: maskedUrl,
      profileCount: count,
      queryDurationMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Database check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        databaseUrl: maskedUrl,
        errorMessage: error.message,
        errorCode: error.code,
        errorName: error.name,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}