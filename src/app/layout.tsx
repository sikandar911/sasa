import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "أجير | التحقق من تصريح أجير",
  description:
    "بوابة تهدف إلى تنظيم العمل المؤقت و تيسير الوصول إلى القوى العاملة المتواجدة في المملكة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/images/header top right logo.png" />
        <style>{`
          @font-face {
            font-family: 'Cairo';
            font-style: normal;
            font-weight: 400 800;
            font-display: swap;
            src: url('https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1ToLQ-HmkGRhA.woff2') format('woff2');
            unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC;
          }
          * { box-sizing: border-box; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
