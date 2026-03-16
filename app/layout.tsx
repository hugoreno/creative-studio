import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Studio | Bordo Games",
  description: "Ad creative generator for Lucky Line",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1A1A2E] text-white antialiased">{children}</body>
    </html>
  );
}
