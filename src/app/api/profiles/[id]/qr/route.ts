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
        { success: false, message: "لم يتم العثور على الملف" },
        { status: 404 }
      );
    }

    const host = req.headers.get("host") || "";
    const origin = host.includes("qiwa-sa.info")
      ? `https://${host}`
      : (process.env.NEXT_PUBLIC_BASE_URL || "https://ajeer.qiwa-sa.info");

    const verificationUrl = `${origin}/notice-verification/${profile.token}`;

    const qrBuffer = await QRCode.toBuffer(verificationUrl, {
      type: "png",
      width: 600,
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
      { success: false, message: "حدث خطأ أثناء إنشاء رمز QR", error: error.message },
      { status: 500 }
    );
  }
}