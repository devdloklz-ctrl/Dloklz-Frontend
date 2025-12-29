import type { ReactNode } from "react";
import "@/styles/global.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/common/ui/Toast";

export const metadata = {
  title: "Dloklz Admin",
  description: "Admin panel for Dloklz",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider><AuthProvider>{children}</AuthProvider></ToastProvider>
      </body>
    </html>
  );
}
