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
    token: string;
  };
}

// Static metadata - no DB calls at build time
export const metadata: Metadata = {
  title: "التحقق من تصريح أجير",
  description: "التحقق من صحة تصريح إعارة العمالة - منصة أجير",
};

export default async function NoticeVerificationPage({ params }: PageProps) {
  const { token } = params;

  // 1. Try finding by exact token
  let profile = await prisma.ajeerProfile.findUnique({
    where: { token },
  });

  // 2. If not found by token, try decoding JWT to find by permit number
  if (!profile) {
    const decoded = decodeAjeerToken(token);
    if (decoded && decoded.id) {
      profile = await prisma.ajeerProfile.findFirst({
        where: {
          OR: [
            { permitNumber: decoded.id },
            { permitNumber: `TW0${decoded.id}` },
            { permitNumber: `TW${decoded.id}` },
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
              <div className="verification-document" style={{ padding: "48px 24px", textAlign: "center" }}>
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
}
