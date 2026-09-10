export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { decodeAjeerToken } from "@/lib/token";
import VerificationHeader from "@/components/VerificationHeader";
import VerificationCard from "@/components/VerificationCard";
import VerificationFooter from "@/components/VerificationFooter";
import "@/styles/verification.css";

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "التحقق من تصريح أجير",
  description: "التحقق من صحة تصريح إعارة العمالة - منصة أجير",
};

export default async function EmployeeVerificationPage({ params }: PageProps) {
  try {
    const { id } = params;
    const cleanId = decodeURIComponent(id || "").trim();

    // 1. Try finding by permitNumber, token, or id
    let profile = await prisma.ajeerProfile.findFirst({
      where: {
        OR: [
          { permitNumber: cleanId },
          { permitNumber: cleanId.toUpperCase() },
          { id: cleanId },
          { token: cleanId },
        ],
      },
    });

    // 2. Try numeric variations (e.g. TW08414793 or TQ8414793 or digits)
    if (!profile) {
      const digitsOnly = cleanId.replace(/\D/g, "");
      if (digitsOnly) {
        profile = await prisma.ajeerProfile.findFirst({
          where: {
            OR: [
              { permitNumber: digitsOnly },
              { permitNumber: `TW0${digitsOnly}` },
              { permitNumber: `TW${digitsOnly}` },
              { permitNumber: `TQ${digitsOnly}` },
            ],
          },
        });
      }
    }

    // 3. Fallback to JWT decode if token was passed
    if (!profile) {
      const decoded = decodeAjeerToken(cleanId);
      if (decoded && decoded.id) {
        profile = await prisma.ajeerProfile.findFirst({
          where: {
            OR: [
              { permitNumber: decoded.id },
              { permitNumber: `TW0${decoded.id}` },
              { permitNumber: `TW${decoded.id}` },
              { permitNumber: `TQ${decoded.id}` },
              { id: decoded.id },
            ],
          },
        });
      }
    }

    if (!profile) {
      return (
        <div className="qiwa-ajeer-app">
          <VerificationHeader />
          <div className="appBody">
            <div className="content" id="content">
              <main className="verification-page">
                <div
                  className="verification-document"
                  style={{ padding: "48px 24px", textAlign: "center" }}
                >
                  <h2 style={{ color: "#dc2626", marginBottom: "16px" }}>
                    لم يتم العثور على التصريح
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "16px" }}>
                    رابط التحقق غير صالح أو أن التصريح غير مسجل في النظام.
                  </p>
                </div>
              </main>
            </div>
          </div>
          <VerificationFooter />
        </div>
      );
    }

    return (
      <div className="qiwa-ajeer-app">
        <VerificationHeader />
        <div className="appBody">
          <div className="content" id="content">
            <main className="verification-page">
              <VerificationCard
                profile={{
                  permitNumber: profile.permitNumber,
                  permitType: profile.permitType,
                  startDate: profile.startDate,
                  endDate: profile.endDate,
                  workerName: profile.workerName,
                  iqamaNumber: profile.iqamaNumber,
                  nationality: profile.nationality,
                  occupation: profile.occupation,
                  gender: profile.gender,
                  birthDate: profile.birthDate,
                  establishmentNumber: profile.establishmentNumber,
                  establishmentName: profile.establishmentName,
                  status: profile.status,
                }}
              />
            </main>
          </div>
        </div>
        <VerificationFooter />
      </div>
    );
  } catch (error: any) {
    console.error("Error in EmployeeVerificationPage:", error);
    return (
      <div className="qiwa-ajeer-app">
        <VerificationHeader />
        <div className="appBody">
          <div className="content" id="content">
            <main className="verification-page">
              <div
                className="verification-document"
                style={{ padding: "48px 24px", textAlign: "center" }}
              >
                <h2 style={{ color: "#dc2626", marginBottom: "16px" }}>
                  حدث خطأ أثناء تحميل التصريح
                </h2>
                <p style={{ color: "#64748b", fontSize: "16px" }}>
                  يرجى المحاولة مرة أخرى لاحقاً.
                </p>
              </div>
            </main>
          </div>
        </div>
        <VerificationFooter />
      </div>
    );
  }
}
