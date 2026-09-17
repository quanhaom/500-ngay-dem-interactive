import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const montserrat = Montserrat({
  subsets: [
    "latin",
    "vietnamese",
  ],

  display: "swap",

  variable:
    "--font-montserrat",

  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
});

export const metadata: Metadata = {
  title:
    "500 ngày đêm | Interactive",

  description:
    "Hành trình tìm kiếm, quy tập và xác định danh tính hài cốt liệt sĩ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={
        montserrat.variable
      }
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}