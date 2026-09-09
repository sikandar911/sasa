"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import "@/styles/admin.css";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "كلمة المرور غير صحيحة");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-logos">
          <Image
            src="/images/header top right logo.png"
            alt="أجير"
            width={70}
            height={36}
            style={{ objectFit: "contain" }}
          />
          <Image
            src="/images/header top left logo.png"
            alt="وزارة الموارد البشرية والتنمية الاجتماعية"
            width={120}
            height={42}
            style={{ objectFit: "contain" }}
          />
        </div>

        <h1 className="login-title">لوحة تحكم منصة أجير</h1>
        <p className="login-subtitle">
          تسجيل الدخول الإداري لإدارة وتوليد تصاريح أجير
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label className="form-label" style={{ justifyContent: "center" }}>
              <Lock size={16} />
              كلمة المرور الموحدة (Admin Password)
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="أدخل كلمة المرور..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                style={{ textAlign: "center", paddingRight: "40px", paddingLeft: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  left: "12px",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "14px" }}
            disabled={loading}
          >
            {loading ? (
              <span>جاري التحقق...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          <ShieldCheck size={14} color="#059669" />
          <span>منظومة موثقة ومحمية - Ajeer Verification Platform 2026</span>
        </div>
      </div>
    </div>
  );
}
