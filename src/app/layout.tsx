// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindMe - Kesehatan Mental",
  description: "Temani harimu dengan AI, catat mood, baca artikel psikologi, dan lakukan tes screening - semua dalam satu platform.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}