"use client";

import { useState } from "react";
import QRCode from "qrcode";
import {
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  RefreshCw,
  QrCode as QrIcon
} from "lucide-react";

export interface ProfileItem {
  id: string;
  permitNumber: string;
  permitType: string;
  startDate: string;
  endDate: string;
  workerName: string;
  iqamaNumber: string;
  nationality: string;
  occupation: string;
  establishmentNumber: string;
  establishmentName: string;
  status: string;
  token: string;
  createdAt: string;
}

interface ProfileTableProps {
  profiles: ProfileItem[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (profile: ProfileItem) => void;
  onDelete: (id: string) => void;
}

export default function ProfileTable({
  profiles,
  loading,
  onRefresh,
  onEdit,
  onDelete,
}: ProfileTableProps) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.workerName.toLowerCase().includes(q) ||
      p.permitNumber.toLowerCase().includes(q) ||
      p.iqamaNumber.includes(q) ||
      p.establishmentName.toLowerCase().includes(q)
    );
  });

  const handleCopy = (permitNumber: string, id: string) => {
    const url = `${window.location.origin}/employee/${encodeURIComponent(permitNumber)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download clean, low-density 29x29 PNG QR Code matching authentic Ajeer structure
  const handleDownloadQr = async (profile: ProfileItem) => {
    try {
      setDownloadingId(profile.id);
      const publicUrl = `${window.location.origin}/employee/${encodeURIComponent(profile.permitNumber)}`;

      // Generate authentic 29x29 module QR code (Error Correction Level L)
      const dataUrl = await QRCode.toDataURL(publicUrl, {
        width: 600,
        margin: 2,
        errorCorrectionLevel: "L",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // Create download link
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `QR_${profile.permitNumber}_${profile.workerName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading QR:", error);
      alert("فشل تحميل رمز الاستجابة السريعة (QR)");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="admin-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
            الوحدة الثانية: التصاريح المسجلة (Online Profiles)
          </h3>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
            إجمالي التصاريح: {profiles.length} | يمكنك المعاينة والتعديل وتحميل رمز الاستجابة السريعة (QR Code)
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{ position: "absolute", right: "12px", top: "12px", color: "#94a3b8" }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="بحث بالاسم، الهوية، رقم التصريح..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "260px", paddingRight: "36px" }}
            />
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onRefresh}
            title="تحديث القائمة"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {loading && profiles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          جاري تحميل التصاريح...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          لا توجد تصاريح مطابقة للبحث أو لم يتم إضافة تصاريح بعد.
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم التصريح</th>
                <th>اسم العامل</th>
                <th>رقم الهوية / الإقامة</th>
                <th>المهنة والجنسية</th>
                <th>تاريخ التصريح</th>
                <th>اسم المنشأة</th>
                <th>الحالة</th>
                <th style={{ textAlign: "center" }}>الإجراءات (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile) => {
                const publicUrl = `/employee/${encodeURIComponent(profile.permitNumber)}`;
                return (
                  <tr key={profile.id}>
                    <td>
                      <strong style={{ color: "#007367" }}>{profile.permitNumber}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600" }}>{profile.workerName}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {profile.permitType}
                      </div>
                    </td>
                    <td>{profile.iqamaNumber}</td>
                    <td>
                      <div>{profile.occupation}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {profile.nationality}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "13px" }}>من: {profile.startDate}</div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        إلى: {profile.endDate}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {profile.establishmentName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {profile.establishmentNumber}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "700",
                          backgroundColor: "#ecfdf5",
                          color: "#059669",
                        }}
                      >
                        {profile.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: "center" }}>
                        {/* 1. Preview Button: Opens public URL in new tab */}
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                          title="معاينة الصفحة العامة (Preview)"
                        >
                          <ExternalLink size={14} color="#007367" />
                          <span>معاينة</span>
                        </a>

                        {/* 2. Download PNG QR Code Button */}
                        <button
                          type="button"
                          onClick={() => handleDownloadQr(profile)}
                          className="btn-secondary"
                          style={{
                            padding: "6px 10px",
                            fontSize: "12px",
                            backgroundColor: "#f0fdf4",
                            borderColor: "#bbf7d0",
                            color: "#166534",
                          }}
                          disabled={downloadingId === profile.id}
                          title="تحميل رمز الاستجابة السريعة (PNG QR Code)"
                        >
                          <Download size={14} />
                          <span>{downloadingId === profile.id ? "جاري التحميل..." : "تحميل QR"}</span>
                        </button>

                        {/* 3. Copy Public Link Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(profile.permitNumber, profile.id)}
                          className="btn-secondary"
                          style={{ padding: "6px 8px" }}
                          title="نسخ الرابط العام"
                        >
                          {copiedId === profile.id ? (
                            <Check size={14} color="#059669" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>

                        {/* 4. Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEdit(profile)}
                          className="btn-secondary"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                          title="تعديل التصريح (Edit)"
                        >
                          <Edit2 size={14} color="#0284c7" />
                          <span>تعديل</span>
                        </button>

                        {/* 5. Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(profile.id)}
                          className="btn-danger"
                          title="حذف التصريح"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
