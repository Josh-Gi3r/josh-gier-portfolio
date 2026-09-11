import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: { default: "Home Meals", template: "%s · Home Meals" },
  description: "Josh & G's private freezer-first household food operating system.",
  applicationName: "Home Meals",
  appleWebApp: { capable: true, title: "Home Meals", statusBarStyle: "black-translucent" }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#f7f4ee" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppShell>{children}</AppShell></body></html>;
}
