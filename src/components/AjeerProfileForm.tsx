"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Save, ExternalLink, QrCode, RefreshCw } from "lucide-react";

interface ProfileFormData {
  id?: string;
  workerName: string;
  iqamaNumber: string;
  nationality: string;
  occupation: string;
  startDate: string;
  endDate: string;
  establishmentNumber: string;
  establishmentName: string;
  permitNumber: string;
  permitType: string;
  gender: string;
  birthDate: string;
  status: string;
  token?: string;
}

interface AjeerProfileFormProps {
  initialData?: ProfileFormData | null;
  onSuccess?: (profile: any) => void;
  onCancel?: () => void;
}

export default function AjeerProfileForm({
  initialData,
  onSuccess,
  onCancel,
}: AjeerProfileFormProps) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState<ProfileFormData>({
    workerName: initialData?.workerName || "",
    iqamaNumber: initialData?.iqamaNumber || "",
    nationality: initialData?.nationality || "باكستاني",
    occupation: initialData?.occupation || "سائق شاحنة ثقيلة",
    startDate: initialData?.startDate || "2026-09-03",
    endDate: initialData?.endDate || "2026-12-03",
    establishmentNumber: initialData?.establishmentNumber || "1-4564178",
    establishmentName: initialData?.establishmentName || "شركة ديفباور للمقاولات العامة",
    permitNumber: initialData?.permitNumber || "",
    permitType: initialData?.permitType || "تصريح إعارة مؤقت",
    gender: initialData?.gender || "ذكر",
    birthDate: initialData?.birthDate || "-",
    status: initialData?.status || "ساري / فعال",
  });

  const [loading, setLoading] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdProfile, setCreatedProfile] = useState<any>(null);

  // Function to fetch guaranteed unique permit number from database
  const generateUniqueCode = async () => {
    try {
      setGeneratingCode(true);
      setCodeError(null);
      const res = await fetch("/api/profiles/generate-permit-number");
      const data = await res.json();
      if (data.success && data.permitNumber) {
        setFormData((prev) => ({ ...prev, permitNumber: data.permitNumber }));
      } else {
        setCodeError("فشل في توليد كود فريد من قاعدة البيانات");
      }
    } catch (err) {
      setCodeError("خطأ في الاتصال أثناء التوليد");
    } finally {
      setGeneratingCode(false);
    }
  };

  // Automatically generate unique code on mount for NEW profiles if empty
  useEffect(() => {
    if (!isEditing && !formData.permitNumber) {
      generateUniqueCode();
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Real-time validation for manually typed permit number
  const handlePermitNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, permitNumber: val }));

    if (val.trim().length >= 4) {
      try {
        const res = await fetch(
          `/api/profiles/check-permit-number?code=${encodeURIComponent(val.trim())}&excludeId=${initialData?.id || ""}`
        );
        const data = await res.json();
        if (data.exists) {
          setCodeError("⚠️ رقم التصريح هذا مستخدم مسبقاً، يرجى اختيار رقم آخر");
        } else {
          setCodeError(null);
        }
      } catch (_) {}
    } else {
      setCodeError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreatedProfile(null);

    // Ensure permit number is not duplicate before submitting
    if (codeError) {
      setError("يرجى حل تعارض رقم التصريح أولاً");
      setLoading(false);
      return;
    }

    try {
      const url = isEditing ? `/api/profiles/${initialData?.id}` : "/api/profiles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const detailMsg = data.error
          ? `${data.message || "حدث خطأ أثناء حفظ التصريح"}: ${data.error}`
          : (data.message || "فشلت العملية، يرجى التحقق من البيانات");
        setError(detailMsg);
        setLoading(false);
        return;
      }

      setCreatedProfile(data.data);
      if (onSuccess) onSuccess(data.data);
    } catch (err: any) {
      setError(`حدث خطأ أثناء الاتصال بالخادم: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="form-header">
        <h3>{isEditing ? "تعديل ملف أجير" : "الوحدة الأولى: إنشاء ملف أجير (Create Ajeer Profile)"}</h3>
        <p>
          يرجى إدخال البيانات حسب التسلسل المحدد (4، 5، 6، 7، 2، 3، 8، 9، 1). سيتم ربط جميع البيانات بالرمز الموحد.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {createdProfile && (
        <div className="alert alert-success" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <strong style={{ color: "#16a34a" }}>
              {isEditing ? "تم تحديث تصريح أجير بنجاح!" : "تم إنشاء وحفظ تصريح أجير بنجاح!"}
            </strong>
          </div>
          <div style={{ fontSize: "14px", color: "#1e293b" }}>
            رقم التصريح: <strong>{createdProfile.permitNumber}</strong> | اسم العامل:{" "}
            <strong>{createdProfile.workerName}</strong>
          </div>
          <div style={{ width: "100%", marginTop: "6px" }}>
            <div style={{ fontSize: "12px", color: "#475569", marginBottom: "4px", fontWeight: "600" }}>
              رابط التحقق الرسمي المباشر (Public Verification URL):
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "8px 12px",
                width: "100%",
                direction: "ltr",
              }}
            >
              <code
                style={{
                  fontSize: "12px",
                  color: "#007367",
                  wordBreak: "break-all",
                  flex: 1,
                  fontFamily: "monospace",
                  userSelect: "all",
                }}
              >
                {`${typeof window !== "undefined" ? window.location.origin : "https://ajeer.qiwa-sa.info"}/notice-verification/${createdProfile.token}`}
              </code>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" }}>
            <a
              href={`/notice-verification/${createdProfile.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "13px", padding: "6px 14px" }}
            >
              <span>معاينة صفحة التحقق الرسمية</span>
              <ExternalLink size={14} />
            </a>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "6px 14px" }}
              onClick={() => {
                const fullUrl = `${window.location.origin}/notice-verification/${createdProfile.token}`;
                navigator.clipboard.writeText(fullUrl);
                alert("تم نسخ رابط التحقق بنجاح!");
              }}
            >
              <span>نسخ رابط التحقق</span>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* SEQUENCE 4: اسم العامل */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">4</span>
              اسم العامل (Worker Name) *
            </label>
            <input
              type="text"
              name="workerName"
              className="form-input"
              value={formData.workerName}
              onChange={handleChange}
              placeholder="مثال: IMRAN SHAH KHAN"
              required
            />
          </div>

          {/* SEQUENCE 5: رقم الهوية / الإقامة */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">5</span>
              رقم الهوية / الإقامة (ID / Iqama Number) *
            </label>
            <input
              type="text"
              name="iqamaNumber"
              className="form-input"
              value={formData.iqamaNumber}
              onChange={handleChange}
              placeholder="مثال: 2579465812"
              required
            />
          </div>

          {/* SEQUENCE 6: الجنسية */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">6</span>
              الجنسية (Nationality) *
            </label>
            <input
              type="text"
              name="nationality"
              className="form-input"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="مثال: باكستاني"
              required
            />
          </div>

          {/* SEQUENCE 7: المهنة */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">7</span>
              المهنة (Career / Occupation) *
            </label>
            <input
              type="text"
              name="occupation"
              className="form-input"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="مثال: سائق شاحنة ثقيلة"
              required
            />
          </div>

          {/* SEQUENCE 2: تاريخ بداية التصريح */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">2</span>
              تاريخ بداية التصريح (Permit Start Date) *
            </label>
            <input
              type="date"
              name="startDate"
              className="form-input"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* SEQUENCE 3: تاريخ نهاية التصريح */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">3</span>
              تاريخ نهاية التصريح (Permit End Date) *
            </label>
            <input
              type="date"
              name="endDate"
              className="form-input"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* SEQUENCE 8: رقم المنشأة */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">8</span>
              رقم المنشأة من وزارة الموارد البشرية *
            </label>
            <input
              type="text"
              name="establishmentNumber"
              className="form-input"
              value={formData.establishmentNumber}
              onChange={handleChange}
              placeholder="مثال: 1-4564178"
              required
            />
          </div>

          {/* SEQUENCE 9: اسم المنشأة */}
          <div className="form-group">
            <label className="form-label">
              <span className="seq-num">9</span>
              اسم المنشأة المصرح إليها *
            </label>
            <input
              type="text"
              name="establishmentName"
              className="form-input"
              value={formData.establishmentName}
              onChange={handleChange}
              placeholder="مثال: شركة ديفباور للمقاولات العامة"
              required
            />
          </div>

          {/* SEQUENCE 1: رقم التصريح / رمز الاستجابة */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="seq-num">1</span>
              Permit Number / QR Code *
            </label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                name="permitNumber"
                className="form-input"
                value={formData.permitNumber}
                onChange={handlePermitNumberChange}
                placeholder="مثال: TW0827326"
                required
                style={codeError ? { borderColor: "#ef4444" } : {}}
              />
              <button
                type="button"
                className="btn-secondary"
                disabled={generatingCode}
                onClick={generateUniqueCode}
                style={{
                  minWidth: "210px",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontWeight: 600,
                }}
              >
                {generatingCode ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Checking Database...</span>
                  </>
                ) : (
                  "Automatic Code Generation"
                )}
              </button>
            </div>
            {codeError ? (
              <span style={{ fontSize: "13px", color: "#ef4444", marginTop: "4px", display: "block", fontWeight: 600 }}>
                {codeError}
              </span>
            ) : (
              <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
                * This code will be included in the QR code and the general verification link
              </span>
            )}
          </div>

          {/* Additional Options */}
          <div className="form-group">
            <label className="form-label">نوع التصريح (Permit Type)</label>
            <select
              name="permitType"
              className="form-select"
              value={formData.permitType}
              onChange={handleChange}
            >
              <option value="تصريح إعارة مؤقت">تصريح إعارة مؤقت</option>
              <option value="تصريح عمل مؤقت">تصريح عمل مؤقت</option>
              <option value="تصريح تعاقد مباشر">تصريح تعاقد مباشر</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">حالة التصريح (Status)</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ساري / فعال">ساري / فعال</option>
              <option value="ساري / مؤكد">ساري / مؤكد</option>
              <option value="منتهي">منتهي</option>
              <option value="ملغي">ملغي</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">الجنس (Gender)</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">تاريخ الميلاد (Date of Birth)</label>
            <input
              type="text"
              name="birthDate"
              className="form-input"
              value={formData.birthDate}
              onChange={handleChange}
              placeholder="-"
            />
          </div>
        </div>

        <div style={{ marginTop: "28px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              إلغاء
            </button>
          )}

          <button type="submit" className="btn-primary" disabled={loading || Boolean(codeError)}>
            <Save size={18} />
            <span>{loading ? "جارٍ الحفظ..." : isEditing ? "حفظ التعديلات" : "إصدار التصريح"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}