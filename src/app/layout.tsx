import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { copy } from "@/config/messages";
import { siteUrl } from "@/config/site";
import { withName } from "@/lib/text";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "800"],
  variable: "--font-thai",
  display: "swap",
});

const shareTitle = withName(copy.shareTitle);
const shareDescription = withName(copy.shareDescription);

// ชื่อ คำอธิบาย และรูปพรีวิว (src/app/opengraph-image.tsx) ตอนส่งลิงก์ใน LINE / Facebook
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: shareTitle,
  description: shareDescription,
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    type: "website",
    locale: "th_TH",
    siteName: copy.brand,
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7A8C8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body>{children}</body>
    </html>
  );
}
