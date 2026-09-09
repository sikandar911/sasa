import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || "";
    const excludeId = searchParams.get("excludeId") || "";

    if (!code) {
      return NextResponse.json({ success: true, exists: false });
    }

    const existing = await prisma.ajeerProfile.findUnique({
      where: { permitNumber: code.trim() },
    });

    const isDuplicate = existing && existing.id !== excludeId;

    return NextResponse.json({
      success: true,
      exists: Boolean(isDuplicate),
      permitNumber: code,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}