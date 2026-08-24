// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
      <body className="font-sans">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}