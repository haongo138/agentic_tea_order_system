import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { SocketProvider } from "@/contexts/socket-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { AdminShell } from "@/components/AdminShell";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lam Trà Admin",
    template: "%s | Lam Trà Admin",
  },
  description: "Lam Trà Administration & Management Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${sora.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-admin-bg antialiased">
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <AdminShell>{children}</AdminShell>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
