import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/app/Provider";

export const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opsignal - Manage Incidents, Tasks & Engineering Workflows",
  description:
    "Streamline your engineering operations with intelligent incident tracking, task management, and team collaboration. Real-time updates, audit logs, and powerful RBAC built for modern teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </ReduxProvider>
    </html>
  );
}
