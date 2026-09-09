"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Save, ExternalLink, QrCode } from "lucide-react";

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
    permitNumber: initialData?.permitNumber || "TW0583162",
    permitType: initialData?.permitType || "تصريح إعارة أجير",
    gender: initialData?.gender || "ذكر",
    birthDate: initialData?.birthDate || "-",
    status: initialData?.status || "ساري / فعال",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProfile, setCreatedProfile] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreatedProfile(null);

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
        setError(data.message || "فشلت العملية، يرجى التأكد من صحة البيانات");
        setLoading(false);
        return;
      }

      setCreatedProfile(data.data);
      if (onSuccess) onSuccess(data.data);
    } catch (err: any) {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="form-header">
        <h3>{isEditing ? "تعديل تصريح أجير" : "الوحدة الأولى: إنشاء تصريح أجير (Create Ajeer Profile)"}</h3>
        <p>
          يرجى إدخال البيانات حسب التسلسل المحدد (4، 5، 6، 7، 2، 3، 8، 9، 1). يتم حفظ وإرسال البيانات باللغة العربية.
        </p>
      </div>

      {error && (
        <div className="alert-error" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {createdProfile && (
        <div className="alert-success" style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontWeight: "700" }}>
            <CheckCircle2 size={20} />
            <span>تم {isEditing ? "تحديث" : "إنشاء"} تصريح أجير بنجاح!</span>
          </div>
          <div style={{ fontSize: "14px", wordBreak: "break-all" }}>
            <strong>الرابط العام المباشر: </strong>
            <a
              href={`/notice-verification/${createdProfile.token}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007367", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>{typeof window !== "undefined" ? window.location.origin : ""}/notice-verification/{createdProfile.token}</span>
              <ExternalLink size={14} />
            </a>
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
              رقم المنشأة في وزارة الموارد البشرية *
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
              اسم المنشأة المقدمة للخدمة *
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
              رقم التصريح / كود التحقق (Permit Number / QR Code) *
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                name="permitNumber"
                className="form-input"
                value={formData.permitNumber}
                onChange={handleChange}
                placeholder="مثال: TW0583162"
                required
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  const rand = Math.floor(100000 + Math.random() * 900000);
                  setFormData((prev) => ({ ...prev, permitNumber: `TW0${rand}` }));
                }}
              >
                توليد كود تلقائي
              </button>
            </div>
            <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
              * هذا الرمز سيتم تضمينه في رمز الاستجابة السريعة (QR Code) ورابط التحقق العام
            </span>
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
              <option value="تصريح إعارة أجير">تصريح إعارة أجير</option>
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
              <option value="منتهي">منتهي</option>
              <option value="ملغى">ملغى</option>
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

          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={18} />
            <span>{loading ? "جاري الحفظ..." : isEditing ? "حفظ التعديلات" : "إنشاء التصريح"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
