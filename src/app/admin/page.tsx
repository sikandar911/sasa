"use client";

import { useEffect, useState } from "react";
import AjeerProfileForm from "@/components/AjeerProfileForm";
import ProfileTable, { ProfileItem } from "@/components/ProfileTable";
import { PlusCircle, List, FileCheck2, Users, Building2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"create" | "list">("list");
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<any>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data);
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا التصريح نهائياً؟")) {
      return;
    }

    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchProfiles();
      } else {
        alert(data.message || "فشل حذف التصريح");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleEdit = (profile: ProfileItem) => {
    setEditingProfile(profile);
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = () => {
    fetchProfiles();
    if (editingProfile) {
      setEditingProfile(null);
      setActiveTab("list");
    }
  };

  return (
    <div>
      {/* Dashboard Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div
          className="admin-card"
          style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              backgroundColor: "#e0f2fe",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileCheck2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>إجمالي التصاريح المسجلة</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
              {profiles.length}
            </div>
          </div>
        </div>

        <div
          className="admin-card"
          style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              backgroundColor: "#ecfdf5",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>تصاريح سارية وفعالة</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
              {profiles.filter((p) => p.status.includes("ساري") || p.status.includes("فعال")).length}
            </div>
          </div>
        </div>

        <div
          className="admin-card"
          style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              backgroundColor: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>المنشآت المعتمدة</div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
              {new Set(profiles.map((p) => p.establishmentNumber)).size}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "list" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("list");
            setEditingProfile(null);
          }}
        >
          <List size={18} />
          <span>قائمة التصاريح المسجلة (Online Profiles)</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "create" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("create");
            setEditingProfile(null);
          }}
        >
          <PlusCircle size={18} />
          <span>{editingProfile ? "تعديل التصريح الحالي" : "إنشاء تصريح أجير جديد (Create Profile)"}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "create" ? (
        <AjeerProfileForm
          initialData={editingProfile}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setEditingProfile(null);
            setActiveTab("list");
          }}
        />
      ) : (
        <ProfileTable
          profiles={profiles}
          loading={loading}
          onRefresh={fetchProfiles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
