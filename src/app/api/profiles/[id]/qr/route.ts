import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.ajeerProfile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على التصريح" },
        { status: 404 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.headers.get("origin") ||
      `http://${req.headers.get("host") || "localhost:3000"}`;

    const verificationUrl = `${origin}/notice-verification/${profile.token}`;

    const qrBuffer = await QRCode.toBuffer(verificationUrl, {
      type: "png",
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return new NextResponse(new Uint8Array(qrBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="Ajeer_QR_${profile.permitNumber}.png"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { success: false, message: "فشل إنشاء رمز الاستجابة السريعة", error: error.message },
      { status: 500 }
    );
  }
}
