import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzZXJ2aWNlIjoidGVtcHdvcmsiLCJpZCI6IjU4MzE2MiIsImlhdCI6MTc4ODQ1MTc0Niwic3RhdHVzIjoidmFsaWQiLCJzdGFydF9hdCI6IjIwMjYtMDktMDMiLCJlbmRfYXQiOiIyMDI2LTEyLTAzIn0.ISpGJB1x_O7yPv1855IhmQU3s22aPEsgj2ZXJu8T0UU";

  const profile = await prisma.ajeerProfile.upsert({
    where: { permitNumber: "TW0583162" },
    update: {
      workerName: "IMRAN SHAH KHAN",
      iqamaNumber: "2579465812",
      nationality: "باكستاني",
      occupation: "سائق شاحنة ثقيلة",
      startDate: "2026-09-03",
      endDate: "2026-12-03",
      establishmentNumber: "1-4564178",
      establishmentName: "شركة ديفباور للمقاولات العامة",
      permitType: "تصريح إعارة أجير",
      gender: "ذكر",
      birthDate: "-",
      status: "ساري / فعال",
      token,
    },
    create: {
      permitNumber: "TW0583162",
      workerName: "IMRAN SHAH KHAN",
      iqamaNumber: "2579465812",
      nationality: "باكستاني",
      occupation: "سائق شاحنة ثقيلة",
      startDate: "2026-09-03",
      endDate: "2026-12-03",
      establishmentNumber: "1-4564178",
      establishmentName: "شركة ديفباور للمقاولات العامة",
      permitType: "تصريح إعارة أجير",
      gender: "ذكر",
      birthDate: "-",
      status: "ساري / فعال",
      token,
    },
  });

  console.log("Seeded profile successfully:", profile);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
