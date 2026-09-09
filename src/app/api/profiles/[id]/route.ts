import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAjeerToken } from "@/lib/token";
import { isAuthenticated } from "@/lib/auth";

// GET single profile by id
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

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء جلب البيانات", error: error.message },
      { status: 500 }
    );
  }
}

// PUT update profile
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      permitType,
      gender,
      birthDate,
      status,
    } = body;

    const existing = await prisma.ajeerProfile.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على التصريح" },
        { status: 404 }
      );
    }

    // Check permit number uniqueness if changed
    if (permitNumber && permitNumber.trim() !== existing.permitNumber) {
      const duplicate = await prisma.ajeerProfile.findUnique({
        where: { permitNumber: permitNumber.trim() },
      });
      if (duplicate && duplicate.id !== params.id) {
        return NextResponse.json(
          { success: false, message: "رقم التصريح مسجل مسبقاً" },
          { status: 409 }
        );
      }
    }

    const updatedPermitNumber = permitNumber ? permitNumber.trim() : existing.permitNumber;
    const updatedStartDate = startDate ? startDate.trim() : existing.startDate;
    const updatedEndDate = endDate ? endDate.trim() : existing.endDate;
    const updatedStatus = status ? status.trim() : existing.status;

    // Regenerate token if permit number or dates changed
    const token = generateAjeerToken({
      permitNumber: updatedPermitNumber,
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      status: updatedStatus,
    });

    const updated = await prisma.ajeerProfile.update({
      where: { id: params.id },
      data: {
        ...(workerName && { workerName: workerName.trim() }),
        ...(iqamaNumber && { iqamaNumber: iqamaNumber.trim() }),
        ...(nationality && { nationality: nationality.trim() }),
        ...(occupation && { occupation: occupation.trim() }),
        ...(startDate && { startDate: updatedStartDate }),
        ...(endDate && { endDate: updatedEndDate }),
        ...(establishmentNumber && { establishmentNumber: establishmentNumber.trim() }),
        ...(establishmentName && { establishmentName: establishmentName.trim() }),
        ...(permitNumber && { permitNumber: updatedPermitNumber }),
        ...(permitType && { permitType: permitType.trim() }),
        ...(gender && { gender: gender.trim() }),
        ...(birthDate && { birthDate: birthDate.trim() }),
        ...(status && { status: updatedStatus }),
        token,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث التصريح بنجاح",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء التحديث", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json(
        { success: false, message: "غير مصرح (Unauthorized)" },
        { status: 401 }
      );
    }

    await prisma.ajeerProfile.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف التصريح بنجاح",
    });
  } catch (error: any) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء الحذف", error: error.message },
      { status: 500 }
    );
  }
}
