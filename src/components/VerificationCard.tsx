import Image from "next/image";

export interface AjeerProfileData {
  permitNumber: string;
  permitType: string;
  startDate: string;
  endDate: string;
  workerName: string;
  iqamaNumber: string;
  nationality: string;
  occupation: string;
  gender: string;
  birthDate: string;
  establishmentNumber: string;
  establishmentName: string;
  status: string;
}

interface VerificationCardProps {
  profile: AjeerProfileData;
}

export default function VerificationCard({ profile }: VerificationCardProps) {
  return (
    <div className="verification-document" id="verification-content">
      {/* Verification Header Table */}
      <table className="verification-header" dir="rtl">
        <tbody>
          <tr>
            <td className="verification-header__logos">
              <Image
                className="verification-logo verification-logo--ajeer"
                src="/images/header top right logo.png"
                alt="أجير"
                width={74}
                height={38}
                style={{ objectFit: "contain", verticalAlign: "middle" }}
                priority
              />
              <Image
                className="verification-logo verification-logo--hrsd"
                src="/images/header top left logo.png"
                alt="وزارة الموارد البشرية والتنمية الاجتماعية"
                width={172}
                height={46}
                style={{ objectFit: "contain", verticalAlign: "middle" }}
                priority
              />
            </td>
            <td className="verification-header__title">
              <h1 className="verification-title">التحقق من تصريح أجير</h1>
            </td>
            <td className="verification-header__result">
              <strong className="verification-result verification-result--valid">
                {profile.status || "ساري / فعال"}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Verification Copy Message */}
      <div className="verification-copy">
        <p>تم التحقق من التصريح بنجاح</p>
      </div>

      {/* Table 1: بيانات التصريح */}
      <table className="verification-table" dir="rtl">
        <tbody>
          <tr className="verification-table__section">
            <th colSpan={4}>بيانات التصريح</th>
          </tr>
          <tr>
            <th className="verification-table__label">رقم التصريح</th>
            <td className="verification-table__value">{profile.permitNumber}</td>
            <th className="verification-table__label">نوع التصريح</th>
            <td className="verification-table__value">{profile.permitType}</td>
          </tr>
          <tr>
            <th className="verification-table__label">تاريخ بداية التصريح</th>
            <td className="verification-table__value">{profile.startDate}</td>
            <th className="verification-table__label">تاريخ نهاية التصريح</th>
            <td className="verification-table__value">{profile.endDate}</td>
          </tr>
        </tbody>
      </table>

      {/* Table 2: بيانات العامل */}
      <table className="verification-table" dir="rtl">
        <tbody>
          <tr className="verification-table__section">
            <th colSpan={4}>بيانات العامل</th>
          </tr>
          <tr>
            <th className="verification-table__label">اسم العامل</th>
            <td className="verification-table__value">{profile.workerName}</td>
            <th className="verification-table__label">رقم الهوية / الإقامة</th>
            <td className="verification-table__value">{profile.iqamaNumber}</td>
          </tr>
          <tr>
            <th className="verification-table__label">الجنسية</th>
            <td className="verification-table__value">{profile.nationality}</td>
            <th className="verification-table__label">المهنة</th>
            <td className="verification-table__value">{profile.occupation}</td>
          </tr>
          <tr>
            <th className="verification-table__label">الجنس</th>
            <td className="verification-table__value">{profile.gender}</td>
            <th className="verification-table__label">تاريخ الميلاد</th>
            <td className="verification-table__value">{profile.birthDate}</td>
          </tr>
        </tbody>
      </table>

      {/* Table 3: بيانات المنشأة */}
      <table className="verification-table" dir="rtl">
        <tbody>
          <tr className="verification-table__section">
            <th colSpan={4}>بيانات المنشأة</th>
          </tr>
          <tr>
            <th className="verification-table__label">رقم المنشأة</th>
            <td className="verification-table__value">{profile.establishmentNumber}</td>
            <th className="verification-table__label">اسم المنشأة</th>
            <td className="verification-table__value">{profile.establishmentName}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
