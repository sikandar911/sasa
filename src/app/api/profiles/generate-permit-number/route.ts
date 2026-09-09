import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Fetch all existing permit numbers from the database
    const existingProfiles = await prisma.ajeerProfile.findMany({
      select: { permitNumber: true },
    });
    const existingSet = new Set(
      existingProfiles.map((p) => p.permitNumber.trim().toUpperCase())
    );

    let isUnique = false;
    let code = "";
    let attempts = 0;

    // 2. Generate random 6-digit number prefixed with TW0 (e.g. TW0827326) and check collision
    while (!isUnique && attempts < 100) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      code = `TW0${rand}`;
      if (!existingSet.has(code.toUpperCase())) {
        // Double check against database directly
        const dbCheck = await prisma.ajeerProfile.findUnique({
          where: { permitNumber: code },
        });
        if (!dbCheck) {
          isUnique = true;
          break;
        }
      }
      attempts++;
    }

    if (!isUnique) {
      const ts = Date.now().toString().slice(-6);
      code = `TW0${ts}`;
    }

    return NextResponse.json({
      success: true,
      permitNumber: code,
    });
  } catch (error: any) {
    console.error("Error generating unique permit number:", error);
    const fallback = `TW0${Math.floor(100000 + Math.random() * 900000)}`;
    return NextResponse.json({
      success: true,
      permitNumber: fallback,
    });
  }
}