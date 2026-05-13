import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Background } from "@/components/ui/Background";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stanford Lean Club",
  description: "Advancing the formalization of mathematics in Lean.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900 selection:bg-stone-200 min-h-screen flex flex-col relative overflow-x-hidden">
        <Background />
        <Navbar />
        <main className="flex-grow pt-24 z-10 relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
