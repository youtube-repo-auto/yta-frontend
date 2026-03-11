import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YTA Review",
  description: "YouTube Automation – Script Review",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
