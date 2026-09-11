import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { HouseholdStateProvider } from "@/components/HouseholdState";

export const metadata: Metadata = {
  title: { default: "Home Meals", template: "%s · Home Meals" },
  description: "Josh & G's private home cooking, prep, grocery and meal-planning app.",
  applicationName: "Home Meals",
  appleWebApp: { capable: true, title: "Home Meals", statusBarStyle: "default" }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#fbf8f1" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><HouseholdStateProvider><AppShell>{children}</AppShell></HouseholdStateProvider></body></html>;
}
