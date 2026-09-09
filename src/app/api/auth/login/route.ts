import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, getAuthCookieValue, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { success: false, message: "كلمة المرور غير صحيحة (Invalid Password)" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });

    response.cookies.set(AUTH_COOKIE_NAME, getAuthCookieValue(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
