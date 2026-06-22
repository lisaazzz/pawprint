import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawPrint - TCVM-Inspired Dog Food Quiz",
  description:
    "Discover your dog's TCVM-inspired element, Yin-Yang tendency, personality archetype, and ideal Holistic PawFood recipes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
