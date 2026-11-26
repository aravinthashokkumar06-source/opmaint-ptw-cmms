import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/frontend/context/AuthContext";
import { Sidebar } from "@/frontend/components/Sidebar";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Opmaint CMMS - Industrial Permit to Work (PTW)",
  description: "Enterprise Safety Permit to Work module for industrial plants and CMMS workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} h-full overflow-hidden`}>
      <body className={`${outfit.className} h-screen bg-slate-50/70 text-slate-900 antialiased font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden flex`}>
        <AuthProvider>
          {/* Opmaint Industrial Sidebar Navigation - 100% Fixed, never scrolls with page */}
          <Sidebar />

          {/* Main Content Area - Independently scrollable */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
