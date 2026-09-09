import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, getAuthCookieValue, AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body?.password;

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { success: false, message: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });

    // Check if request is over HTTPS
    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      req.url.startsWith("https://");

    response.cookies.set(AUTH_COOKIE_NAME, getAuthCookieValue(), {
      httpOnly: true,
      secure: isHttps, // Only set secure over HTTPS so HTTP access (direct IP/port) works seamlessly
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء تسجيل الدخول", error: error.message },
      { status: 500 }
    );
  }
}