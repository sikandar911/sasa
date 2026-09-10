import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EmployeeRedirectPage({ params }: PageProps) {
  const { id } = params;
  if (!id) notFound();

  const cleanId = decodeURIComponent(id || "").trim();
  const numericId = cleanId.replace(/\D/g, "");

  // Find Ajeer profile by permitNumber, token, or id
  const profile = await prisma.ajeerProfile.findFirst({
    where: {
      OR: [
        { permitNumber: cleanId },
        { permitNumber: cleanId.toUpperCase() },
        { permitNumber: `TW0${numericId}` },
        { permitNumber: `TW${numericId}` },
        { permitNumber: `TQ${numericId}` },
        { iqamaNumber: cleanId },
        { token: cleanId },
        { id: cleanId },
      ],
    },
  });

  if (profile && profile.token) {
    // 301 Permanent Redirect to official Ajeer notice-verification URL
    redirect(`/notice-verification/${profile.token}`);
  }

  notFound();
}