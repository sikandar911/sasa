import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Image from "next/image";
import { LogOut } from "lucide-react";
import "@/styles/admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "لوحة تحكم منصة أجير",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = isAuthenticated();

  if (!authed) {
    redirect("/login2026ajeer");
  }

  return (
    <div className="admin-layout">
      {/* Top Admin Navbar */}
      <header className="admin-navbar">
        <div className="admin-brand">
          <Image
            src="/images/header top right logo.png"
            alt="أجير"
            width={55}
            height={30}
            style={{ objectFit: "contain" }}
          />
          <h2>منصة أجير - لوحة التحكم الإدارية</h2>
          <span className="admin-badge">الإصدار المعتمد 2026</span>
        </div>

        <div className="admin-nav-actions">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px" }}
            >
              <LogOut size={15} />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">{children}</main>
    </div>
  );
}
