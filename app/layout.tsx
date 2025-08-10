import type { Metadata } from "next";
import { Geist, Germania_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Germania_One({
  variable: "--font-germania-one",
  weight: "400",
});

export const metadata: Metadata = {
  title: "HagoVusqueda",
  description: "Buscador del registro hagovero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
