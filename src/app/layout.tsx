import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/frontend/context/AuthContext";
import { Navbar } from "@/frontend/components/Navbar";

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
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} min-h-screen bg-slate-50/70 text-slate-900 antialiased flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950`}>
        <AuthProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
