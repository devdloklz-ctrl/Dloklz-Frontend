import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Dloklz Dashboard",
  description: "Owner & Vendor Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
