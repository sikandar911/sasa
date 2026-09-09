import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAjeerToken } from "@/lib/token";
import { isAuthenticated } from "@/lib/auth";

// GET all profiles
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const profiles = await prisma.ajeerProfile.findMany({
      where: query
        ? {
            OR: [
              { workerName: { contains: query, mode: "insensitive" } },
              { iqamaNumber: { contains: query } },
              { permitNumber: { contains: query, mode: "insensitive" } },
              { establishmentName: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: profiles });
  } catch (error: any) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { success: false, message: "فشل في جلب البيانات", error: error.message },
      { status: 500 }
    );
  }
}

// POST create profile
export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json(
        { success: false, message: "غير مصرح (Unauthorized)" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      workerName,
      iqamaNumber,
      nationality,
      occupation,
      startDate,
      endDate,
      establishmentNumber,
      establishmentName,
      permitNumber,
      permitType = "تصريح إعارة أجير",
      gender = "ذكر",
      birthDate = "-",
      status = "ساري / فعال",
    } = body;

    // Validation
    if (
      !workerName ||
      !iqamaNumber ||
      !nationality ||
      !occupation ||
      !startDate ||
      !endDate ||
      !establishmentNumber ||
      !establishmentName ||
      !permitNumber
    ) {
      return NextResponse.json(
        { success: false, message: "يرجى تعبئة جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    // Check if permit number already exists
    const existing = await prisma.ajeerProfile.findUnique({
      where: { permitNumber: permitNumber.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "رقم التصريح مسجل مسبقاً، يرجى استخدام رقم تصريح آخر" },
        { status: 409 }
      );
    }

    // Generate JWT verification token
    const token = generateAjeerToken({
      permitNumber: permitNumber.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      status: status.trim(),
    });

    // Save in database
    const profile = await prisma.ajeerProfile.create({
      data: {
        workerName: workerName.trim(),
        iqamaNumber: iqamaNumber.trim(),
        nationality: nationality.trim(),
        occupation: occupation.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        establishmentNumber: establishmentNumber.trim(),
        establishmentName: establishmentName.trim(),
        permitNumber: permitNumber.trim(),
        permitType: permitType.trim(),
        gender: gender.trim(),
        birthDate: birthDate.trim(),
        status: status.trim(),
        token,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء تصريح أجير بنجاح",
      data: profile,
    });
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء حفظ التصريح", error: error.message },
      { status: 500 }
    );
  }
}
